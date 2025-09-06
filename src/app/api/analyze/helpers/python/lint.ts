import { runTool } from '../../utils/runTool';

export interface PylintResult {
  status: string;
  output: string;
}
export async function runPylint(tempDir: string, pyFiles: string[]): Promise<PylintResult> {
  if (pyFiles.length === 0) {
    return { status: 'success', output: 'No Python files found for pylint.' };
  }
  const pylintPath = `${process.cwd()}/.venv/bin/pylint`;
  const args = [...pyFiles, '--output-format=json'];
  const result = await runTool(pylintPath, args, { cwd: tempDir });
  if (result.status === 'error' && result.error) {
    const errMsg = String(result.error);
    if (errMsg.includes('No such file or directory') || errMsg.includes('cannot execute')) {
      result.output = 'pylint is not installed or the Python environment is misconfigured. Please check your .venv setup.';
    }
  }
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No lint errors found.';
  }
  return result;
}
