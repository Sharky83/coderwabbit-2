import { runTool } from '../../utils/runTool';

export interface RadonComplexityResult {
  status: string;
  output: string;
}
export async function runRadonComplexity(tempDir: string, pyFiles: string[]): Promise<RadonComplexityResult> {
  if (pyFiles.length === 0) {
    return { status: 'success', output: 'No Python files found for complexity analysis.' };
  }
  const radonPath = `${process.cwd()}/.venv/bin/radon`;
  const args = ['cc', ...pyFiles, '-s', '-j'];
  const result = await runTool(radonPath, args, { cwd: tempDir });
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No complexity issues found.';
  }
  return result;
}
