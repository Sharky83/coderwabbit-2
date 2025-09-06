import { runTool } from '../../utils/runTool';

export interface BanditResult {
  status: string;
  output: string;
}
export async function runBandit(tempDir: string, pyFiles: string[]): Promise<BanditResult> {
  if (pyFiles.length === 0) {
    return { status: 'success', output: 'No Python files found for bandit.' };
  }
  const banditPath = `${process.cwd()}/.venv/bin/bandit`;
  const args = ['-r', ...pyFiles, '-f', 'json'];
  const result = await runTool(banditPath, args, { cwd: tempDir });
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No security issues found.';
  }
  return result;
}
