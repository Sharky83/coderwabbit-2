import { runTool } from '../../utils/runTool';

export interface BanditResult {
  status: string;
  output: string;
}
export async function runBandit(tempDir: string, pyFiles: string[]): Promise<BanditResult> {
  if (pyFiles.length === 0) {
    console.log('DEBUG Bandit: No Python files found for bandit.', { tempDir, pyFiles });
    return { status: 'success', output: 'No Python files found for bandit.' };
  }
  const banditPath = `${process.cwd()}/.venv/bin/bandit`;
  const args = ['-r', ...pyFiles, '-f', 'json'];
  console.log('DEBUG Bandit: Running bandit with args', { banditPath, args, tempDir });
  const result = await runTool(banditPath, args, { cwd: tempDir });
  console.log('DEBUG Bandit: Result', result);
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No security issues found.';
  }
  return result;
}
