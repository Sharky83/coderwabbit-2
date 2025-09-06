import { execFile } from 'child_process';

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { safeExec } from '../../../utils/safeExec';
// @ts-ignore
import escomplex from 'escomplex';
// @ts-ignore
import jscpd from 'jscpd';

// Helper: Create temp directory path
export function createTempDir(owner: string, repo: string): string {
  return path.join('/tmp', `${owner}-${repo}-${Date.now()}`);
}

// Helper: Cleanup temp directory after delay
export function cleanupTempDir(tempDir: string, delayMs: number = 5000): void {
  setTimeout(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }, delayMs);
}


// Helper: Scan TOML files for secrets using scan_toml_secrets.py
export async function scanTomlSecrets(tomlFilePath: string): Promise<{ status: string; secrets: Array<{ key: string; value: string }> }> {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'src/app/api/analyze/helpers/python/scan_toml_secrets.py');
    execFile('python', [scriptPath, tomlFilePath], (error, stdout, stderr) => {
      if (error) {
        resolve({ status: 'error', secrets: [{ key: 'error', value: error.message }] });
        return;
      }
      const lines = stdout.split('\n').filter(Boolean);
      const secrets = lines
        .filter(line => line.startsWith('Secret found:'))
        .map(line => {
          const match = line.match(/Secret found: (.+) = (.+)/);
          return match ? { key: match[1], value: match[2] } : null;
        })
        .filter(Boolean) as Array<{ key: string; value: string }>;
      resolve({ status: 'success', secrets });
    });
  });
}

// Helper: Analyze Python complexity with radon
export async function analyzeRadonComplexity(tempDir: string): Promise<ComplexitySummary> {
  const venvPath = path.join(tempDir, '.venv');
  const pythonBin = path.join(venvPath, 'bin', 'python');
  try {
    const radonOut = await new Promise<string>((resolve, reject) => {
      exec(`${pythonBin} -m radon cc . -s -j`, { cwd: tempDir }, (err, stdout, stderr) => {
        if (err && !stdout) {
          console.error('radon failed:', stderr);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
    return JSON.parse(radonOut);
  } catch (err) {
    console.error('Error running radon:', err);
    return { error: 'radon not found or failed to run. Please add radon to your requirements.txt.' };
  }
}

// Helper: Parse package.json
export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
export function parsePackageJson(tempDir: string): PackageJson {
  try {
    const pkgPath = path.join(tempDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    }
  } catch {}
  return {};
}

// Helper: Install npm dependencies
export async function installNpmDependencies(tempDir: string): Promise<{ error?: Error | string }> {
  try {
    const { error } = await safeExec('npm install --ignore-scripts', { cwd: tempDir });
    if (error) return { error };
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err : String(err) };
  }
}
// ...existing code...
// Helper: Scan for secrets using detect-secrets
export async function scanPythonSecrets(tempDir: string): Promise<{ status: string; output: string }> {
  try {
  const cmd = `${process.cwd()}/.venv/bin/detect-secrets scan --all-files --force-use-all-plugins --exclude-files .venv --exclude-files node_modules --exclude-files .next --exclude-files dist --exclude-files public --exclude-files repo-python-test --exclude-files .cache --exclude-files .mypy_cache --exclude-files .pytest_cache --exclude-files .poetry --exclude-files .tox --exclude-files .eggs --exclude-files __pycache__ --exclude-files .git`;
    const result = await safeExec(cmd, { cwd: tempDir });
    if (result.error) {
      if (String(result.error).includes('No such file or directory') || String(result.error).includes('cannot execute')) {
        return { status: 'error', output: 'detect-secrets is not installed or the Python environment is misconfigured. Please check your .venv setup.' };
      }
      return { status: 'error', output: String(result.error) };
    }
    if (!result.stdout || result.stdout.trim() === '' || result.stdout.trim() === '{}' || (JSON.parse(result.stdout).results && JSON.parse(result.stdout).results.length === 0)) {
      return { status: 'success', output: '' };
    }
    return { status: 'success', output: result.stdout };
  } catch (err) {
    return { status: 'error', output: String(err) };
  }
}

export type ErrorResponse = {
  error: string;
  details?: unknown;
};
export type PythonSetupResult = {
  pythonBin: string;
  installErrors: string[];
};
export type PytestResult = Record<string, unknown>;
export type ComplexitySummary = {
  totalFiles?: number;
  skippedFiles?: string[];
  mostComplexFiles?: Array<{
    file: string;
    cyclomatic: number;
    maintainability: number;
  }>;
  mostComplexFunctions?: Array<{
    file: string;
    name: string;
    cyclomatic: number;
    line: number;
  }>;
  error?: string;
};
export type DuplicationSummary = {
  totalClones?: number;
  clones?: Array<{
    format: string;
    lines: number;
    tokens: number;
    sources: Array<{ file: string; start: number; end: number }>;
  }>;
  error?: string;
};

export function formatErrorResponse(error: string, details?: unknown): ErrorResponse {
  return { error, details };
}

export async function cloneRepo({ owner, repo, accessToken, tempDir }: { owner: string, repo: string, accessToken: string, tempDir: string }) {
  fs.mkdirSync(tempDir, { recursive: true });
  const gitUrl = `https://${accessToken}:x-oauth-basic@github.com/${owner}/${repo}.git`;
  try {
    const { error } = await safeExec(`git clone ${gitUrl} .`, { cwd: tempDir });
    if (error) return { error: 'Failed to clone repo', details: error };
    return { success: true };
  } catch (err) {
    return { error: 'Failed to clone repo', details: err };
  }
}

export function detectLanguagesAndDependencies(tempDir: string) {
  const walkSync = (dir: string, filelist: string[] = []) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        filelist = walkSync(fullPath, filelist);
      } else {
        filelist.push(fullPath);
      }
    });
    return filelist;
  };
  const allFiles = walkSync(tempDir);
  const detectedLanguages: string[] = [];
  if (allFiles.some(f => f.endsWith('.py') || f.endsWith('requirements.txt') || f.endsWith('pyproject.toml'))) detectedLanguages.push('python');
  if (allFiles.some(f => f.endsWith('.js'))) detectedLanguages.push('javascript');
  if (allFiles.some(f => f.endsWith('.ts'))) detectedLanguages.push('typescript');
  if (allFiles.some(f => f.endsWith('.php'))) detectedLanguages.push('php');
  if (allFiles.some(f => f.endsWith('.html'))) detectedLanguages.push('html');
  if (allFiles.some(f => f.endsWith('.css'))) detectedLanguages.push('css');
  let language = detectedLanguages[0] || 'unknown';
  let dependencies: string[] = [];
  if (language === 'python') {
    if (allFiles.some(f => f.endsWith('requirements.txt'))) dependencies.push('requirements.txt');
    if (allFiles.some(f => f.endsWith('pyproject.toml'))) dependencies.push('pyproject.toml');
  } else if (language === 'javascript' || language === 'typescript') {
    if (allFiles.some(f => f.endsWith('package.json'))) dependencies.push('package.json');
  }
  return { detectedLanguages, language, dependencies };
}

export async function setupPythonEnv(tempDir: string): Promise<PythonSetupResult> {
  const venvPath = path.join(tempDir, '.venv');
  const pythonBin = path.join(venvPath, 'bin', 'python');
  let installErrors: string[] = [];
  try {
    let result = await safeExec('uv venv .venv', { cwd: tempDir });
    if (result.error) {
      installErrors.push(`uv venv error: ${result.error}`);
      throw result.error;
    }
    result = await safeExec(`${pythonBin} -m ensurepip`, { cwd: tempDir });
    if (result.error) {
      installErrors.push(`ensurepip error: ${result.error}`);
      throw result.error;
    }
    const reqPath = path.join(tempDir, 'requirements.txt');
    if (fs.existsSync(reqPath)) {
      result = await safeExec(`${pythonBin} -m pip install -r requirements.txt`, { cwd: tempDir });
      if (result.error) {
        installErrors.push(`requirements.txt install error: ${result.error}`);
      }
    }
    result = await safeExec(`${pythonBin} -m pip install radon pytest pytest-json-report`, { cwd: tempDir });
    if (result.error) {
      installErrors.push(`radon/pytest/pytest-json-report install error: ${result.error}`);
    }
    if (!fs.existsSync(pythonBin)) {
      installErrors.push(`Python binary not found at ${pythonBin}`);
    }
  } catch (err) {
    installErrors.push(`General setup error: ${String(err)}`);
    console.error('Error setting up Python venv and dependencies:', err);
  }
  return { pythonBin, installErrors };
}

export async function runPytest(pythonBin: string, tempDir: string): Promise<PytestResult> {
  let testResults: PytestResult = {};
  try {
    let pytestOut;
    let pytestReport = null;
    pytestOut = await new Promise<string>((resolve, reject) => {
      exec(`${pythonBin} -m pytest --maxfail=5 --disable-warnings --json-report --json-report-file=pytest-report.json`, { cwd: tempDir }, (err, stdout, stderr) => {
        if (err && !stdout) {
          exec(`${pythonBin} -m pytest --maxfail=5 --disable-warnings`, { cwd: tempDir }, (err2, stdout2, stderr2) => {
            if (err2 && !stdout2) {
              console.error('pytest failed:', stderr2);
              return reject(stderr2);
            }
            resolve(stdout2);
          });
        } else {
          resolve(stdout);
        }
      });
    });
    const reportPath = path.join(tempDir, 'pytest-report.json');
    if (fs.existsSync(reportPath)) {
      try {
        const raw = fs.readFileSync(reportPath, 'utf-8');
        pytestReport = JSON.parse(raw);
        Object.assign(testResults, pytestReport);
      } catch (err) {
        testResults.error = 'Failed to read or parse pytest report: ' + String(err);
      }
    } else {
      testResults.output = pytestOut;
    }
  } catch (err) {
    testResults.error = 'pytest not found or failed to run.';
  }
  return testResults;
}

export function analyzeJsTsComplexity(tempDir: string): ComplexitySummary {
  const walkSync = (dir: string, filelist: string[] = []) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        filelist = walkSync(fullPath, filelist);
      } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        filelist.push(fullPath);
      }
    });
    return filelist;
  };
  const codeFiles = walkSync(tempDir);
  const sources = codeFiles.map(f => ({ path: f, code: fs.readFileSync(f, 'utf-8') }));
  let reports: Array<{
    path: string;
    aggregate: { cyclomatic: number; maintainability: number };
    functions: Array<{ name: string; cyclomatic: number; line: number }>;
  }> = [];
  let skippedFiles: string[] = [];
  for (const src of sources) {
    try {
      const report = escomplex.analyse([src], {});
      if (report && report.reports && report.reports.length > 0) {
        reports.push(report.reports[0]);
      }
    } catch (err) {
      skippedFiles.push(src.path);
    }
  }
  return {
    totalFiles: reports.length,
    skippedFiles,
    mostComplexFiles: reports
  .sort((a, b) => b.aggregate.cyclomatic - a.aggregate.cyclomatic)
      .slice(0, 3)
  .map((r) => ({
        file: r.path,
        cyclomatic: r.aggregate.cyclomatic,
        maintainability: r.aggregate.maintainability,
      })),
    mostComplexFunctions: reports
  .flatMap((r) => r.functions.map((fn) => ({
        file: r.path,
        name: fn.name,
        cyclomatic: fn.cyclomatic,
        line: fn.line,
      })))
  .sort((a, b) => b.cyclomatic - a.cyclomatic)
      .slice(0, 3),
  };
}

export async function analyzeDuplication(tempDir: string): Promise<DuplicationSummary> {
  const outputPath = path.join(tempDir, 'jscpd-report.json');
  let duplicationSummary: DuplicationSummary = {};
  try {
    const { error } = await safeExec(`npx jscpd ${tempDir} --silent --reporters json --output ${outputPath}`, { cwd: tempDir, env: { ...process.env, FORCE_COLOR: '0' } });
    if (error) throw error;
    let jscpdReport: {
      clones?: Array<{
        format: string;
        lines: number;
        tokens: number;
        sources: Array<{ file: string; start: number; end: number }>;
      }>;
    } = {};
    try {
      const raw = fs.readFileSync(outputPath, 'utf-8');
      jscpdReport = JSON.parse(raw);
    } catch (err) {
      duplicationSummary = { error: 'Failed to read or parse jscpd report: ' + String(err) };
      jscpdReport = {};
    }
    duplicationSummary = {
      totalClones: jscpdReport.clones?.length || 0,
  clones: (jscpdReport.clones || []).slice(0, 3).map((clone) => ({
        format: clone.format,
        lines: clone.lines,
        tokens: clone.tokens,
  sources: clone.sources.map((s) => ({ file: s.file, start: s.start, end: s.end })),
      })),
    };
  } catch (err) {
    duplicationSummary = { error: String(err) };
  }
  return duplicationSummary;
}
