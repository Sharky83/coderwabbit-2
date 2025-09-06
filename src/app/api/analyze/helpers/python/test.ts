import { runTool } from '../../utils/runTool';

export interface PytestResult {
  status: string;
  output: string;
}
export async function runPytest(tempDir: string, pythonBin: string): Promise<PytestResult> {
  const args = ['-m', 'pytest', '--maxfail=5', '--disable-warnings'];
  const result = await runTool(pythonBin, args, { cwd: tempDir });
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'All tests passed.';
  }
  return result;
}
