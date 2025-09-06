import { runTool } from '../../utils/runTool';
import path from 'path';
import { VENV_FOLDER, PYTHON_BIN_SUBPATH, UV_VENV_CMD, ENSURE_PIP_CMD } from '../../config';

export async function setupPythonEnv(tempDir: string): Promise<{ pythonBin: string; installErrors: string[] }> {
  const venvPath = path.join(tempDir, VENV_FOLDER);
  const pythonBin = path.join(venvPath, PYTHON_BIN_SUBPATH);
  let installErrors: string[] = [];
  try {
    let result = await runTool(UV_VENV_CMD, [VENV_FOLDER], { cwd: tempDir });
    if (result.status === 'error') {
      installErrors.push(`uv venv error: ${result.error}`);
      throw result.error;
    }
    result = await runTool(pythonBin, [ENSURE_PIP_CMD], { cwd: tempDir });
    if (result.status === 'error') {
      installErrors.push(`ensure pip error: ${result.error}`);
      throw result.error;
    }
  } catch (err) {
    // errors already collected
  }
  return { pythonBin, installErrors };
}
