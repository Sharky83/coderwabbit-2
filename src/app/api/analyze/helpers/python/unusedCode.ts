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
  if (result.status === 'success' && result.output.trim().length === 0) {
    result.output = 'No unused code detected.';
  }
  return result;
}
