# Create a new virtual environment (if not already present)
uv venv .venv

# Activate the virtual environment
source .venv/bin/activate

# Install all analysis tools with uv
uv pip install detect-secrets pip-audit bandit vulture mypy pylint radon