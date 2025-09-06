import { runTool } from '../../utils/runTool';

export interface MypyResult {
  status: string;
  output: string;
}
export async function runMypy(tempDir: string, pyFiles: string[]): Promise<MypyResult> {
  if (pyFiles.length === 0) {
    return { status: 'success', output: 'No Python files found for mypy.' };
  }
  const mypyPath = `${process.cwd()}/.venv/bin/mypy`;
  const args = [...pyFiles, '--show-error-codes', '--pretty', '--no-error-summary'];
  const result = await runTool(mypyPath, args, { cwd: tempDir });
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No type errors found.';
  }
  return result;
}
