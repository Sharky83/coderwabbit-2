import { runTool } from '../../utils/runTool';

export interface VultureResult {
  status: string;
  output: string;
}
export async function runVulture(tempDir: string, pyFiles: string[]): Promise<VultureResult> {
  if (pyFiles.length === 0) {
    return { status: 'success', output: 'No Python files found for vulture.' };
  }
  const vulturePath = `${process.cwd()}/.venv/bin/vulture`;
  const args = [...pyFiles, '--min-confidence', '60'];
  const result = await runTool(vulturePath, args, { cwd: tempDir });
  if (result.status === 'error' && result.error) {
    const errMsg = String(result.error);
    if (errMsg.includes('No such file or directory') || errMsg.includes('cannot execute')) {
      result.output = 'vulture is not installed or the Python environment is misconfigured. Please check your .venv setup.';
    }
  }
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No unused code detected.';
  }
  return result;
}
