import { exec } from 'child_process';

export function safeExec(command: string, options: Parameters<typeof exec>[1] = {}): Promise<{ stdout?: string; stderr?: string; error?: string }> {
  return new Promise((resolve) => {
    exec(command, options, (err, stdout, stderr) => {
      const outStr = typeof stdout === 'string' ? stdout : stdout?.toString();
      const errStr = typeof stderr === 'string' ? stderr : stderr?.toString();
      if (err) {
        resolve({ error: err.message, stderr: errStr, stdout: outStr });
      } else {
        resolve({ stdout: outStr, stderr: errStr });
      }
    });
  });
}
