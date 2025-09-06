import { runTool } from '../../utils/runTool';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export interface PipAuditResult {
  status: string;
  output?: string;
  error?: string;
}
export async function runPipAudit(tempDir: string, depFile: string): Promise<PipAuditResult & { rawError?: string; rawOutput?: string }> {
  const pipAuditPath = `${process.cwd()}/.venv/bin/pip-audit`;
  let args: string[];
  let reqFile = depFile;
  // Helper to deduplicate/conflict-resolve requirements
  function dedupeRequirements(lines: string[]): string[] {
    const pkgMap: Record<string, string> = {};
    for (const line of lines) {
      const match = line.match(/^([a-zA-Z0-9_.-]+)==([0-9a-zA-Z_.-]+)/);
      if (match) {
        const pkg = match[1];
        const ver = match[2];
        pkgMap[pkg] = `${pkg}==${ver}`;
      } else if (line.trim() && !line.startsWith('#')) {
        pkgMap[line.trim()] = line.trim();
      }
    }
    return Object.values(pkgMap);
  }
  if (depFile.endsWith('requirements.txt')) {
    const raw = fs.readFileSync(depFile, 'utf8');
    const deduped = dedupeRequirements(raw.split(/\r?\n/));
    const tempReqPath = path.join(tempDir, 'temp_requirements.txt');
    fs.writeFileSync(tempReqPath, deduped.join('\n'));
    reqFile = tempReqPath;
    args = ['-r', reqFile, '-f', 'json'];
  } else if (depFile.endsWith('pyproject.toml')) {
    args = ['-r', depFile, '-f', 'json'];
  } else if (depFile.endsWith('environment.yml') || depFile.endsWith('environment.yaml')) {
    // Parse conda environment file and extract pip dependencies
    const ymlContent = fs.readFileSync(depFile, 'utf8');
    const parsed = yaml.parse(ymlContent);
    if (!parsed.dependencies || !Array.isArray(parsed.dependencies)) {
      return { status: 'error', error: 'Conda env YAML missing dependencies array.' };
    }
    let pipDeps: string[] = [];
    for (const dep of parsed.dependencies) {
      if (typeof dep === 'string') {
        continue;
      }
      if (typeof dep === 'object' && dep.pip && Array.isArray(dep.pip)) {
        pipDeps = pipDeps.concat(dep.pip);
      }
    }
    if (pipDeps.length === 0) {
      return { status: 'error', error: 'No pip dependencies found in environment.yml.' };
    }
    const deduped = dedupeRequirements(pipDeps);
    const tempReqPath = path.join(tempDir, 'temp_requirements.txt');
    fs.writeFileSync(tempReqPath, deduped.join('\n'));
    reqFile = tempReqPath;
    args = ['-r', reqFile, '-f', 'json'];
  } else if (depFile.endsWith('.yml') || depFile.endsWith('.yaml')) {
    // Generic YAML: treat as requirements.yml
    const ymlContent = fs.readFileSync(depFile, 'utf8');
    const parsed = yaml.parse(ymlContent);
    if (!parsed.dependencies || !Array.isArray(parsed.dependencies)) {
      return { status: 'error', error: 'YAML file missing dependencies array.' };
    }
    const deduped = dedupeRequirements(parsed.dependencies);
    const tempReqPath = path.join(tempDir, 'temp_requirements.txt');
    fs.writeFileSync(tempReqPath, deduped.join('\n'));
    reqFile = tempReqPath;
    args = ['-r', reqFile, '-f', 'json'];
  } else {
    return { status: 'error', error: 'Unsupported dependency file.' };
  }
  let result: PipAuditResult = { status: 'error' };
  try {
    const toolResult = await runTool(pipAuditPath, args, { cwd: tempDir });
    result = { ...toolResult };
  } catch (err) {
    result = { status: 'error', error: `pip-audit failed: ${String(err)}` };
  }
  // Always log raw output and error
  if (result.status === 'success' && result.output && result.output.trim().length === 0) {
    result.output = 'No vulnerabilities found.';
  }
  if (result.error) {
    (result as any).rawError = result.error;
  }
  if (result.output) {
    (result as any).rawOutput = result.output;
  }
  return result;
}
