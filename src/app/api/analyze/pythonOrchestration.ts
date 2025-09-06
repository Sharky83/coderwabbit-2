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
    // Run coverage.py and collect report
    try {
        const { execSync } = require('child_process');
        const fs = require('fs');
        const files = fs.readdirSync(tempDir);
        console.log('DEBUG coverage tempDir contents:', files);
        const coverageCmd = `${process.cwd()}/.venv/bin/coverage run -m pytest`;
        console.log('DEBUG coverage command:', coverageCmd, 'cwd:', tempDir);
        execSync(coverageCmd, { cwd: tempDir });
        const coverageReport = execSync(`${process.cwd()}/.venv/bin/coverage report --show-missing`, { cwd: tempDir });
        testResults.coverage = { status: 'success', output: coverageReport.toString() };
        execSync(`${process.cwd()}/.venv/bin/coverage html`, { cwd: tempDir });
    } catch (e) {
        console.log('DEBUG coverage error:', e);
        testResults.coverage = { status: 'error', output: String(e) };
    }
    const { runVulture, analyzeMypy, runPylint, analyzePipAudit } = await import('./pythonHelpers');
    const { scanPythonSecrets, scanTomlSecrets } = await import('./analysisHelpers');
    // Debug: Log tempDir contents after clone
    try {
        const tempFiles = require('fs').readdirSync(tempDir);
        console.log('DEBUG tempDir contents:', tempFiles);
    } catch (e) {
        console.log('DEBUG tempDir read error:', e);
    }
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
        // Force pip-audit to run if requirements.txt is present
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
                if (depFile.endsWith('requirements.txt')) {
                    const auditResult = await analyzePipAudit(tempDir, fullPath);
                    if (auditResult.status === 'success' && auditResult.output && auditResult.output.trim() === 'No vulnerabilities found.') {
                        (auditResult as any).fileContents = fileContents;
                    }
                    try {
                        if (auditResult.output && auditResult.output.trim() && auditResult.output.trim() !== 'No vulnerabilities found.') {
                            JSON.parse(auditResult.output);
                        }
                    } catch (e) {
                        auditResult.error = `pip-audit output not valid JSON: ${e}`;
                    }
                    (testResults.pipAudit as Record<string, unknown>)[depFile] = auditResult;
                } else if (depFile.endsWith('pyproject.toml')) {
                    // Poetry export to requirements.txt
                    const exportedReqPath = `${tempDir}/requirements_exported.txt`;
                    const { execSync } = require('child_process');
                    let poetryError = null;
                    try {
                        execSync(`/Users/lexi/.local/bin/poetry export -f requirements.txt --output ${exportedReqPath} --without-hashes`, { cwd: tempDir });
                    } catch (e) {
                        poetryError = typeof e === 'object' && e !== null && 'message' in e ? (e as any).message : String(e);
                    }
                    if (poetryError) {
                        (testResults.pipAudit as Record<string, unknown>)[depFile] = { status: 'error', error: `Poetry export failed: ${poetryError}` };
                    } else {
                        // Run pip-audit on exported requirements
                        const auditResult = await analyzePipAudit(tempDir, exportedReqPath);
                        if (auditResult.status === 'success' && auditResult.output && auditResult.output.trim() === 'No vulnerabilities found.') {
                            (auditResult as any).fileContents = fs.readFileSync(exportedReqPath, 'utf8');
                        }
                        try {
                            if (auditResult.output && auditResult.output.trim() && auditResult.output.trim() !== 'No vulnerabilities found.') {
                                JSON.parse(auditResult.output);
                            }
                        } catch (e) {
                            auditResult.error = `pip-audit output not valid JSON: ${e}`;
                        }
                        (testResults.pipAudit as Record<string, unknown>)[depFile] = auditResult;
                    }
                    // Also scan for secrets in pyproject.toml
                    testResults.tomlSecrets = await scanTomlSecrets(fullPath);
                } else {
                    (testResults.pipAudit as Record<string, unknown>)[depFile] = { status: 'skipped', error: 'File type not supported by pip-audit.' };
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
    console.log('DEBUG Bandit feature check:', { accountType, hasFeature: hasFeature(accountType, 'python', 'bandit') });
    if (hasFeature(accountType, 'python', 'bandit')) {
        console.log('DEBUG Bandit invocation:', { tempDir, pyFiles });
        const banditResult = await runBandit(tempDir, pyFiles);
        console.log('DEBUG Bandit result:', banditResult);
        testResults.bandit = banditResult;
    } else {
        console.log('DEBUG Bandit NOT RUN: Feature not enabled for accountType', accountType);
    }
    // Always scan for secrets
    testResults.detectSecrets = await scanPythonSecrets(tempDir);

    // Run Hypothesis property-based tests
    try {
        const { execSync } = require('child_process');
        const hypoResultRaw = execSync(`${process.cwd()}/.venv/bin/python src/app/api/analyze/helpers/python/hypothesis_runner.py`, { cwd: process.cwd() });
        let hypoResult;
        try {
            hypoResult = JSON.parse(hypoResultRaw.toString());
        } catch (e) {
            hypoResult = [{ status: 'error', output: 'Could not parse Hypothesis test results.' }];
        }
        testResults.hypothesis = hypoResult;
    } catch (e) {
        testResults.hypothesis = [{ status: 'error', output: String(e) }];
    }
    if (!hasFeature(accountType, 'python', 'pipAudit') && body.requestedStandardFeature) {
        return { error: featureErrorResponse(accountType, body.requestedStandardFeature, 'standard'), status: 403 };
    }
    if (!hasFeature(accountType, 'python', 'premiumChecks') && body.requestedPremiumFeature) {
        return { error: featureErrorResponse(accountType, body.requestedPremiumFeature, 'premium'), status: 403 };
    }
    // Debug: Log pipAudit results before returning
    if (testResults.pipAudit) {
        console.log('DEBUG pipAudit result:', JSON.stringify(testResults.pipAudit, null, 2));
    } else {
        console.log('DEBUG pipAudit result: MISSING');
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
