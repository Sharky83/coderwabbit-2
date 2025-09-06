# This file is intentionally insecure for Bandit testing
import os

def insecure_function():
    # Use of os.system is flagged by Bandit
    os.system('echo Hello World')

# Hardcoded password (Bandit will flag this)
password = "supersecret"

if __name__ == "__main__":
    insecure_function()
