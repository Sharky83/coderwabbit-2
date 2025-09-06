import { setupPythonEnv, runPytest, runBandit } from './pythonHelpers';
import { safeExec } from '../../../utils/safeExec';
import { serialiseError, hasFeature, featureErrorResponse, AccountType } from './route';

export interface PythonAnalysisBody {
    requestedStandardFeature?: string;
    requestedPremiumFeature?: string;
    [key: string]: unknown;
}
export interface PythonTestResults {
    vulture?: unknown;
    mypy?: unknown;
    pylint?: unknown;
    pipAudit?: unknown;
    installErrors?: unknown;
    bandit?: unknown;
    [key: string]: unknown;
}
export async function runPythonAnalysis(accountType: AccountType, tempDir: string, body: PythonAnalysisBody): Promise<{ testResults: PythonTestResults } | { error: unknown; status: number }> {
        let testResults: PythonTestResults = {
            vulture: { status: 'skipped', output: 'Vulture not run.' },
            mypy: { status: 'skipped', output: 'Mypy not run.' },
            pylint: { status: 'skipped', output: 'Pylint not run.' },
            pipAudit: { status: 'skipped', output: 'PipAudit not run.' },
            installErrors: [],
            bandit: { status: 'skipped', output: 'Bandit not run.' },
            pytest: { status: 'skipped', output: 'Pytest not run.' }
        };
    const { runVulture, analyzeMypy, runPylint, analyzePipAudit } = await import('./pythonHelpers');
    const { scanPythonSecrets } = await import('./analysisHelpers');
    const pyFiles = require('fs').readdirSync(tempDir).filter((f: string) => f.endsWith('.py'));
    if (hasFeature(accountType, 'python', 'vulture')) {
        testResults.vulture = await runVulture(tempDir, pyFiles);
    }
    if (hasFeature(accountType, 'python', 'mypy')) {
        testResults.mypy = await analyzeMypy(tempDir, pyFiles);
    }
    if (hasFeature(accountType, 'python', 'pylint')) {
        testResults.pylint = await runPylint(tempDir, pyFiles);
    }
        if (hasFeature(accountType, 'python', 'pipAudit')) {
                const fs = require('fs');
                const depFiles = fs.readdirSync(tempDir).filter((f: string) => f.endsWith('requirements.txt') || f.endsWith('pyproject.toml') || f.endsWith('environment.yml'));
                if (depFiles.length === 0) {
                        testResults.pipAudit = { status: 'error', error: 'No dependency file found in repo.' };
                } else {
                        testResults.pipAudit = Object.create(null);
                        for (const depFile of depFiles) {
                                const fullPath = `${tempDir}/${depFile}`;
                                // Check file existence and log contents for debugging
                                let fileExists = false;
                                let fileContents = '';
                                try {
                                    fileExists = fs.existsSync(fullPath);
                                    if (fileExists) fileContents = fs.readFileSync(fullPath, 'utf8');
                                } catch (e) {
                                    (testResults.pipAudit as Record<string, unknown>)[depFile] = { status: 'error', error: `Could not read file: ${e}` };
                                    continue;
                                }
                                if (!fileExists) {
                                    (testResults.pipAudit as Record<string, unknown>)[depFile] = { status: 'error', error: 'Dependency file missing after repo download.' };
                                    continue;
                                }
                                // Only run pip-audit for supported file types
                                if (depFile.endsWith('requirements.txt') || depFile.endsWith('pyproject.toml')) {
                                        const auditResult = await analyzePipAudit(tempDir, fullPath);
                                        // Attach file contents for debugging if no vulnerabilities found
                                        if (auditResult.status === 'success' && auditResult.output && auditResult.output.trim() === 'No vulnerabilities found.') {
                                            (auditResult as any).fileContents = fileContents;
                                        }
                                        // If output is empty or not valid JSON, log for debugging
                                        try {
                                            if (auditResult.output && auditResult.output.trim() && auditResult.output.trim() !== 'No vulnerabilities found.') {
                                                JSON.parse(auditResult.output);
                                            }
                                        } catch (e) {
                                            auditResult.error = `pip-audit output not valid JSON: ${e}`;
                                        }
                                        (testResults.pipAudit as Record<string, unknown>)[depFile] = auditResult;
                                } else {
                                        (testResults.pipAudit as Record<string, unknown>)[depFile] = { status: 'skipped', error: 'File type not supported by pip-audit.' };
                                }
                        }
                }
        }
    if (hasFeature(accountType, 'python', 'pytest')) {
        const pythonSetup = await setupPythonEnv(tempDir);
        if (pythonSetup.installErrors.length > 0) {
            testResults.installErrors = pythonSetup.installErrors.map(serialiseError);
        }
        testResults.pytest = await runPytest(pythonSetup.pythonBin, tempDir);
    }
    if (hasFeature(accountType, 'python', 'bandit')) {
        testResults.bandit = await runBandit(tempDir, pyFiles);
    }
    // Always scan for secrets
    testResults.detectSecrets = await scanPythonSecrets(tempDir);
    if (!hasFeature(accountType, 'python', 'pipAudit') && body.requestedStandardFeature) {
        return { error: featureErrorResponse(accountType, body.requestedStandardFeature, 'standard'), status: 403 };
    }
    if (!hasFeature(accountType, 'python', 'premiumChecks') && body.requestedPremiumFeature) {
        return { error: featureErrorResponse(accountType, body.requestedPremiumFeature, 'premium'), status: 403 };
    }
    for (const key of Object.keys(testResults)) {
        const result = testResults[key] as { error?: unknown; details?: unknown };
        if (result && result.error) {
            result.details = serialiseError(result.details);
            testResults[key] = result;
        }
    }
    return { testResults };
}
