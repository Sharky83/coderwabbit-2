// Shared result types for analysis components
export type Repo = {
  id: number;
  name: string;
  full_name: string;
};

export interface ComplexitySummaryProps {
  complexitySummary: {
    error?: string | { message: string };
    info?: string;
    totalFiles?: number;
    mostComplexFiles?: Array<{ file: string; cyclomatic: number; maintainability: number }>;
    mostComplexFunctions?: Array<{ file: string; name: string; cyclomatic: number; line: number }>;
    skippedFiles?: string[];
    status?: string;
    output?: string;
  } | null;
}

export interface SecretsResultsProps {
  detectSecrets?: {
    status?: string;
    output?: string;
    error?: string;
  } | null;
}

export interface MypyResultsProps {
  mypy: {
    error?: string | { message: string };
    details?: unknown;
    output?: string;
    message?: string;
  } | null;
}

export interface VultureResultsProps {
  vulture: {
    error?: string | { message: string };
    details?: unknown;
    output?: string;
    message?: string;
  } | null;
}

export interface BanditIssue {
  test_id: string;
  issue_text: string;
  filename: string;
  line_number: number;
}

export interface BanditResultsProps {
  bandit: {
    error?: string | { message: string };
    details?: unknown;
    results?: BanditIssue[];
  } | null;
}
