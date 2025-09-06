import { safeExec } from '../../../utils/safeExec';
import { analyzeJsTsComplexity, analyzeDuplication } from './jsHelpers';
import { logError } from './errorHelpers';
import { serialiseError, hasFeature, featureErrorResponse, AccountType } from './route';
import { handleValidationError } from './validationHelpers';

export interface JsAnalysisBody {
    requestedStandardFeature?: string;
    requestedPremiumFeature?: string;
    [key: string]: unknown;
}
export interface JsTestResults {
    lint?: unknown;
    complexity?: import('./jsHelpers').ComplexitySummary;
    duplication?: import('./jsHelpers').DuplicationSummary;
    [key: string]: unknown;
}
export async function runJsAnalysis(accountType: AccountType, tempDir: string, body: JsAnalysisBody): Promise<{ testResults: JsTestResults } | { error: unknown; status: number }> {
        let testResults: JsTestResults = {
            lint: { status: 'skipped', output: 'Lint not run.' },
            complexity: { status: 'skipped', output: 'Complexity not run.' },
            duplication: { status: 'skipped', output: 'Duplication not run.' }
        };
    try {
        const { error } = await safeExec('npm install --ignore-scripts', { cwd: tempDir });
        if (error) throw error;
    } catch (err) {
        logError(err);
        return { error: handleValidationError(err), status: 500 };
    }
    if (hasFeature(accountType, 'javascript', 'lint')) {
        testResults.lint = await safeExec('npx eslint .', { cwd: tempDir });
    }
    if (hasFeature(accountType, 'javascript', 'complexity')) {
        testResults.complexity = analyzeJsTsComplexity(tempDir);
    }
    if (hasFeature(accountType, 'javascript', 'duplication')) {
        testResults.duplication = await analyzeDuplication(tempDir);
    }
    if (!hasFeature(accountType, 'javascript', 'complexity') && body.requestedStandardFeature) {
        return { error: featureErrorResponse(accountType, body.requestedStandardFeature, 'standard'), status: 403 };
    }
    if (!hasFeature(accountType, 'javascript', 'premiumChecks') && body.requestedPremiumFeature) {
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
