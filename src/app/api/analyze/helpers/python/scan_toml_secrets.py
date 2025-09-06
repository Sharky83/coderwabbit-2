import toml
import re
from typing import List, Tuple

def find_secrets_in_toml(file_path: str) -> List[Tuple[str, str]]:
    """
    Scan a TOML file for keys/values that look like secrets.
    Returns a list of (key, value) pairs that match secret patterns.
    """
    secret_patterns = re.compile(r"(key|token|secret|password|api|auth|access|private)", re.IGNORECASE)
    results = []
    try:
        data = toml.load(file_path)
        def scan_dict(d, prefix=""):
            for k, v in d.items():
                full_key = f"{prefix}.{k}" if prefix else k
                if secret_patterns.search(k):
                    results.append((full_key, str(v)))
                if isinstance(v, dict):
                    scan_dict(v, full_key)
        scan_dict(data)
    except Exception as e:
        results.append(("error", str(e)))
    return results

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python scan_toml_secrets.py <file.toml>")
        sys.exit(1)
    secrets = find_secrets_in_toml(sys.argv[1])
    if secrets:
        for k, v in secrets:
            print(f"Secret found: {k} = {v}")
    else:
        print("No secrets found.")
