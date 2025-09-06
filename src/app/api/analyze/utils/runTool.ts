import { spawn } from 'child_process';

export interface RunToolResult {
  status: 'success' | 'error';
  output: string;
  error?: string;
  code?: number;
}

export function runTool(cmd: string, args: string[], opts: { cwd?: string } = {}): Promise<RunToolResult> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { cwd: opts.cwd });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
    proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });
    proc.on('close', (code: number) => {
      if (code === 0) {
        resolve({ status: 'success', output: stdout, code });
      } else {
        resolve({ status: 'error', output: stdout, error: stderr, code });
      }
    });
    proc.on('error', (err: Error) => {
      resolve({ status: 'error', output: stdout, error: String(err) });
    });
  });
}
