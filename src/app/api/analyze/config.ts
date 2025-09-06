// Centralised configuration for analysis backend

export const TEMP_DIR_ROOT = '/tmp';
export const VENV_FOLDER = '.venv';
export const PYTHON_BIN_SUBPATH = 'bin/python';
export const REQUIREMENTS_FILE = 'requirements.txt';
export const PYPROJECT_FILE = 'pyproject.toml';
export const PACKAGE_JSON = 'package.json';
export const UV_VENV_CMD = 'uv venv';
export const ENSURE_PIP_CMD = '-m ensurepip';
export const RADON_CMD = '-m radon cc . -s -j';
export const PYTEST_CMD = '-m pytest --maxfail=5 --disable-warnings';
export const PYTEST_JSON_REPORT_CMD = '--json-report --json-report-file=pytest-report.json';
export const PYTEST_REPORT_FILE = 'pytest-report.json';
export const JSCOD_CMD = 'npx jscpd';
export const JSCOD_REPORT_FILE = 'jscpd-report.json';
export const FORCE_COLOR_ENV = { FORCE_COLOR: '0' };
