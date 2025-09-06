export interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: {
  login: string;
  [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface LintError {
  filePath: string;
  line?: number;
  column?: number;
  message: string;
  ruleId?: string;
  severity?: number;
}

export interface CoverageSummary {
  statements?: string;
  branches?: string;
  functions?: string;
  lines?: string;
  [key: string]: unknown;
}

export interface TestResult {
  [key: string]: unknown;
}

export interface ComplexitySummary {
  totalFiles?: number;
  skippedFiles?: string[];
  mostComplexFiles?: Array<{
    file: string;
    cyclomatic: number;
    maintainability: number;
  }>;
  mostComplexFunctions?: Array<{
    file: string;
    name: string;
    cyclomatic: number;
    line: number;
  }>;
  error?: string;
  info?: string;
  status?: string;
  output?: string;
  [key: string]: unknown;
}

export interface DuplicationSummary {
  totalClones?: number;
  clones?: Array<{
    format: string;
    lines: number;
    tokens: number;
    sources: Array<{ file: string; start: number; end: number }>;
  }>;
  error?: string;
  info?: string;
  status?: string;
  output?: string;
  [key: string]: unknown;
}

export interface Results {
  lintErrors?: LintError[];
  lintWarnings?: LintError[];
  coverageSummary?: CoverageSummary;
  testResult?: TestResult | string;
  complexitySummary?: ComplexitySummary;
  duplicationSummary?: DuplicationSummary;
  suggestions?: string[];
  infoMessages?: string[];
  language?: string;
  [key: string]: unknown;
}
