import { runTool } from '../../utils/runTool';

export interface PipAuditResult {
  status: string;
  output?: string;
  error?: string;
}
export async function runPipAudit(tempDir: string, depFile: string): Promise<PipAuditResult> {
  const pipAuditPath = `${process.cwd()}/.venv/bin/pip-audit`;
  let args: string[];
  if (depFile.endsWith('requirements.txt')) {
    args = ['-r', depFile, '-f', 'json'];
  } else if (depFile.endsWith('pyproject.toml')) {
    args = ['-f', 'toml', '-r', depFile, '-f', 'json'];
  } else {
    return { status: 'error', error: 'Unsupported dependency file.' };
  }
  const result = await runTool(pipAuditPath, args, { cwd: tempDir });
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No vulnerabilities found.';
  }
  return result;
}
