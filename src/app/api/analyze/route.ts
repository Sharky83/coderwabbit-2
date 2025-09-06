import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authOptions';
import { handleValidationError } from './validationHelpers';
import { cloneRepo, createTempDir, cleanupTempDir } from './repoHelpers';
import { detectLanguagesAndDependencies } from './dependencyHelpers';
import { runRadonComplexity } from './pythonHelpers';
import { analyzeJsTsComplexity, analyzeDuplication } from './jsHelpers';
import type { Results, ComplexitySummary, DuplicationSummary } from '../../../types/analyze';
import { ResultsSchema } from '../../../types/analyze.schema';
import { logError } from './errorHelpers';
import { z } from 'zod';
import { runJsAnalysis } from './jsOrchestration';
import { runPythonAnalysis } from './pythonOrchestration';
import type { RadonComplexityResult } from './helpers/python/complexity';


// Centralised feature definitions for account tiers
export type AccountType = 'free' | 'standard' | 'premium';
export type LanguageType = 'javascript' | 'python';
export type FeatureType = string;

export function hasFeature(accountType: AccountType, language: LanguageType, feature: FeatureType): boolean {
	const features = FEATURE_TIERS[accountType]?.[language];
	return Array.isArray(features) && features.includes(feature);
}

export function featureErrorResponse(accountType: AccountType, feature: string, requiredTier: AccountType): NextResponse {
	return NextResponse.json({
		error: `This feature is only available for ${requiredTier} accounts.`,
		feature,
		accountType
	}, { status: 403 });
}

export function serialiseError(err: unknown): string | { message?: string; stack?: string; name?: string; details?: unknown } | null {
	if (err == null) return null;
	if (typeof err === 'string') {
		if (err !== null && err !== undefined && err.length > 0) return err;
		return null;
	}
	const e = err as { message?: string; stack?: string; name?: string; details?: unknown };
	return {
		message: typeof e.message === 'string' && e.message.length > 0 ? e.message : undefined,
		stack: typeof e.stack === 'string' && e.stack.length > 0 ? e.stack : undefined,
		name: typeof e.name === 'string' && e.name.length > 0 ? e.name : undefined,
		details: typeof e.details !== 'undefined' && e.details !== null ? e.details : undefined,
	};
}

interface FeatureTierConfig {
	free: Record<LanguageType, FeatureType[]>;
	standard: Record<LanguageType, FeatureType[]>;
	premium: Record<LanguageType, FeatureType[]>;
}

const FEATURE_TIERS: FeatureTierConfig = {
	free: {
		javascript: ['lint'],
		python: ['vulture', 'mypy', 'pylint']
	},
	standard: {
		javascript: ['lint', 'complexity', 'duplication'],
		python: ['vulture', 'mypy', 'pylint', 'pipAudit', 'pytest', 'bandit']
	},
	premium: {
		javascript: ['lint', 'complexity', 'duplication', 'premiumChecks'],
		python: ['vulture', 'mypy', 'pylint', 'pipAudit', 'pytest', 'bandit', 'premiumChecks']
	}
};


export async function POST(req: NextRequest): Promise<NextResponse> {
	// Check authentication
	const session = await getServerSession(authOptions);
	if (session == null || typeof session.accessToken !== 'string' || session.accessToken.length === 0) {
		logError('Unauthenticated access attempt');
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	const body = await req.json();
	const InputSchema = z.object({
		owner: z.string().min(1),
		repo: z.string().min(1),
		accessToken: z.string().min(1),
		mode: z.enum(['clone', 'analyse']).optional(),
		tempDir: z.string().optional(),
		accountType: z.enum(['free', 'standard', 'premium']).optional().default('free')
	});
	const parseResult = InputSchema.safeParse(body);
	if (parseResult.success !== true) {
		logError(parseResult.error);
		return NextResponse.json(handleValidationError(parseResult.error), { status: 400 });
	}
	// Use .env ACCOUNT_TYPE as default if not provided
	const envAccountType = typeof process.env.ACCOUNT_TYPE === 'string' && process.env.ACCOUNT_TYPE.length > 0 ? process.env.ACCOUNT_TYPE : 'free';
	const { owner, repo, mode = 'clone', tempDir: clientTempDir } = parseResult.data;
	let accountType = parseResult.data.accountType || envAccountType;
	const accessToken = session.accessToken;

	// Directory to clone into
	let tempDir = clientTempDir;
	if (typeof tempDir !== 'string' || tempDir === null || tempDir === undefined || tempDir.length === 0) {
		tempDir = createTempDir(owner, repo);
	}
	if (mode === 'clone') {
		const cloneResult = await cloneRepo({ owner, repo, accessToken, tempDir });
		if ('error' in cloneResult) {
			logError(cloneResult);
			return NextResponse.json(handleValidationError(cloneResult), { status: 500 });
		}
		const detectResult = detectLanguagesAndDependencies(tempDir);
		return NextResponse.json({ tempDir, ...detectResult });
	}

	// If mode is 'analyse', detect language and dependencies first
	let testResults: Results = {};
	let detectedLanguages: string[] = [];
	let language: string = 'unknown';
	if (mode === 'analyse') {
		const detectResult = detectLanguagesAndDependencies(tempDir);
		detectedLanguages = detectResult.detectedLanguages;
		language = detectResult.language;
		if (language === 'javascript') {
			const jsResult = await runJsAnalysis(accountType, tempDir, body);
			if ('error' in jsResult) {
				return NextResponse.json({ error: serialiseError(jsResult.error) }, { status: jsResult.status ?? 500 });
			}
			testResults = jsResult.testResults;
		} else if (language === 'python') {
			const pyResult = await runPythonAnalysis(accountType, tempDir, body);
			if ('error' in pyResult) {
				return NextResponse.json({ error: serialiseError(pyResult.error) }, { status: pyResult.status ?? 500 });
			}
			testResults = pyResult.testResults;
		}
	}

	// Code Complexity Analysis
	let complexitySummary: ComplexitySummary | RadonComplexityResult = {};
	if (mode === 'analyse') {
		if (language === 'javascript') {
			complexitySummary = analyzeJsTsComplexity(tempDir);
		} else if (language === 'python') {
			const pyFiles = require('fs').readdirSync(tempDir).filter((f: string) => f.endsWith('.py'));
			complexitySummary = await runRadonComplexity(tempDir, pyFiles);
		}
	}

	// Code Duplication Analysis
	let duplicationSummary: DuplicationSummary = {};
	if (mode === 'analyse' && (language === 'javascript' || language === 'python')) {
		duplicationSummary = await analyzeDuplication(tempDir);
	}

	// Clean up
	if (mode === 'analyse') {
		cleanupTempDir(tempDir);
	}

	// Parse package.json for JS suggestions

	// Generate actionable suggestions
	const suggestions: string[] = [];
	if (mode === 'analyse') {
		if (language === 'javascript') {
			const mostComplexFunctions = (typeof complexitySummary === 'object' && complexitySummary !== null && 'mostComplexFunctions' in complexitySummary)
				? (complexitySummary as ComplexitySummary).mostComplexFunctions
				: undefined;
			if (Array.isArray(mostComplexFunctions) && mostComplexFunctions.length > 0) {
				mostComplexFunctions.forEach((fn: { cyclomatic: number; name: string; file: string; line: number }) => {
					if (typeof fn.cyclomatic === 'number' && fn.cyclomatic > 10) {
						suggestions.push(`Refactor function '${fn.name}' in ${fn.file} (line ${fn.line}) to reduce cyclomatic complexity (${fn.cyclomatic}).`);
					}
				});
			}
			if (duplicationSummary.clones) {
				duplicationSummary.clones.forEach((clone: { lines: number; sources: { file: string; start: number; end: number }[] }) => {
					suggestions.push(`Remove duplicated code (${clone.lines} lines) in files: ${clone.sources.map((s) => s.file + ' [' + s.start + '-' + s.end + ']').join(', ')}.`);
				});
			}
			const skippedFiles = (typeof complexitySummary === 'object' && complexitySummary !== null && 'skippedFiles' in complexitySummary)
				? (complexitySummary as ComplexitySummary).skippedFiles
				: undefined;
			if (Array.isArray(skippedFiles) && skippedFiles.length > 0) {
				if (skippedFiles !== undefined && skippedFiles !== null) {
					if (typeof skippedFiles !== 'undefined' && skippedFiles !== null && skippedFiles.length > 0) {
						suggestions.push(`${skippedFiles.length} file(s) were skipped in complexity analysis due to unsupported syntax. Consider updating or simplifying these files.`);
					}
				}
			}
		} else if (language === 'python') {
			const info = (typeof complexitySummary === 'object' && complexitySummary !== null && 'info' in complexitySummary)
				? (complexitySummary as ComplexitySummary).info
				: undefined;
			if (typeof info === 'string' && info.length > 0) {
				suggestions.push(info);
			}
			if (typeof duplicationSummary.info === 'string' && duplicationSummary.info !== null && duplicationSummary.info !== undefined && duplicationSummary.info.length > 0) {
				suggestions.push(duplicationSummary.info);
			}
		}
	}

	if (mode === 'analyse') {
		// Before returning, serialise any errors in testResults
		if (
			typeof testResults === 'object' &&
			testResults !== null &&
			'error' in testResults &&
			testResults.error !== undefined &&
			testResults.error !== null &&
			(typeof testResults.error === 'string' ? testResults.error.length > 0 : true)
		) {
			testResults.error = serialiseError(testResults.error);
		}
		const response: Results = {
			complexitySummary: (typeof complexitySummary === 'object' && complexitySummary !== null && 'mostComplexFunctions' in complexitySummary)
				? (complexitySummary as ComplexitySummary)
				: {},
			duplicationSummary: typeof duplicationSummary === 'object' && duplicationSummary !== null ? duplicationSummary : {},
			suggestions: Array.isArray(suggestions) ? suggestions : [],
			detectedLanguages: Array.isArray(detectedLanguages) ? detectedLanguages : [],
			language: typeof language === 'string' && language.length > 0 ? language : 'unknown',
			testResults: (typeof testResults === 'object' && testResults !== null) ? testResults : {},
		};
		ResultsSchema.parse(response); // Throws if invalid
		return NextResponse.json(response);
	}
	// If none of the above conditions matched, return a default error response
	return NextResponse.json({ error: 'Invalid request or mode.' }, { status: 400 });
}
