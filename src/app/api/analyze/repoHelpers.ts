
import path from 'path';
import fs from 'fs';
import { safeExec } from '../../../utils/safeExec';
import { TEMP_DIR_ROOT } from './config';

export function createTempDir(owner: string, repo: string): string {
  return path.join(TEMP_DIR_ROOT, `${owner}-${repo}-${Date.now()}`);
}

export function cleanupTempDir(tempDir: string, delayMs: number = 5000): void {
  setTimeout(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }, delayMs);
}

export async function cloneRepo({ owner, repo, accessToken, tempDir }: { owner: string, repo: string, accessToken: string, tempDir: string }) {
  fs.mkdirSync(tempDir, { recursive: true });
  const gitUrl = `https://${accessToken}:x-oauth-basic@github.com/${owner}/${repo}.git`;
  try {
    const { error } = await safeExec(`git clone ${gitUrl} .`, { cwd: tempDir });
    if (error) return { error: 'Failed to clone repo', details: error };
    return { success: true };
  } catch (err) {
    return { error: 'Failed to clone repo', details: err };
  }
}
