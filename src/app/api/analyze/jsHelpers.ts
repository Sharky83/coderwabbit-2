
import path from 'path';
import fs from 'fs';
import { safeExec } from '../../../utils/safeExec';
// @ts-ignore
import escomplex from 'escomplex';
// @ts-ignore
import jscpd from 'jscpd';

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
  status?: string;
  output?: string;
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
  status?: string;
  output?: string;
};

export async function installNpmDependencies(tempDir: string): Promise<{ error?: Error | string }> {
  try {
    const { error } = await safeExec('npm install --ignore-scripts', { cwd: tempDir });
    if (error) return { error };
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err : String(err) };
  }
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
