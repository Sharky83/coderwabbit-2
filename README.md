
# coderwabbit

coderwabbit is a web app that automatically reviews and analyses GitHub repositories. It focuses on code quality, security, and maintainability, providing actionable feedback and insights in a simple dashboard after you log in with GitHub.

## Features

- Language detection (JavaScript/TypeScript or Python; more coming soon)
- Dependency installation
- Code quality, complexity, and duplication analysis
- Security checks and recommendations
- Simple dashboard for results


## Workflow

1. Log in with GitHub (token is securely stored in sessionStorage for API authentication)
2. Select a repository to analyse
3. Click **Check** to prepare the repository for analysis
4. Once ready, click **Analyse** to run code review and security checks
	- The Analyse button is disabled until the repo is checked and results are cleared
5. View results and suggestions in the dashboard
6. Robust error handling and secure API requests using your GitHub token

## Focus

- Automated code review (not style linting)
- Security analysis (flagging unsafe code, secrets, and dependency issues)
- Maintainability and best practices

> Note: IDEs handle style linting and formatting. coderwabbit focuses on deeper code review and security.

