import React from "react";
import styles from "./ComplexitySummarySection.module.css";

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

export function ComplexitySummarySection({ complexitySummary }: ComplexitySummaryProps) {
  if (!complexitySummary) return null;
  const hasSummary = !!(
    complexitySummary.error ||
    complexitySummary.info ||
    typeof complexitySummary.totalFiles === 'number' ||
    (Array.isArray(complexitySummary.mostComplexFiles) && complexitySummary.mostComplexFiles.length > 0) ||
    (Array.isArray(complexitySummary.mostComplexFunctions) && complexitySummary.mostComplexFunctions.length > 0) ||
    (Array.isArray(complexitySummary.skippedFiles) && complexitySummary.skippedFiles.length > 0) ||
    complexitySummary.output
  );
  return (
    <section className={styles.container}>
  <h3 className={styles.title}>Code Complexity Summary</h3>
      {!hasSummary && (
        <div className={styles.noData}>
          No complexity data available for this repository.
        </div>
      )}
      {/* Summary content follows title */}
      {complexitySummary.error ? (
        <div className={styles.error}>
          <strong>Error in complexity analysis:</strong> {typeof complexitySummary.error === 'string' ? complexitySummary.error : (complexitySummary.error as any)?.message}
        </div>
      ) : null}
      {complexitySummary.info && (
        <div className={styles.info}>{complexitySummary.info}</div>
      )}
      {typeof complexitySummary.totalFiles === 'number' && (
        <div>Total files analyzed: {complexitySummary.totalFiles}</div>
      )}
      {Array.isArray(complexitySummary.mostComplexFiles) && complexitySummary.mostComplexFiles.length > 0 && (
        <div className={styles.complexList}>
          <strong>Most Complex Files:</strong>
          <ul>
            {complexitySummary.mostComplexFiles.map((file, idx) => (
              <li key={idx}>
                {file.file}: Cyclomatic {file.cyclomatic}, Maintainability {file.maintainability}
              </li>
            ))}
          </ul>
        </div>
      )}
      {Array.isArray(complexitySummary.mostComplexFunctions) && complexitySummary.mostComplexFunctions.length > 0 && (
        <div className={styles.complexList}>
          <strong>Most Complex Functions:</strong>
          <ul>
            {complexitySummary.mostComplexFunctions.map((fn, idx) => (
              <li key={idx}>
                {fn.name} ({fn.file}, line {fn.line}): Cyclomatic {fn.cyclomatic}
              </li>
            ))}
          </ul>
        </div>
      )}
      {Array.isArray(complexitySummary.skippedFiles) && complexitySummary.skippedFiles.length > 0 && (
        <div className={styles.skipped}>
          <strong>Skipped Files:</strong> {complexitySummary.skippedFiles.join(', ')}
        </div>
      )}
      {complexitySummary.output && (
        <pre className={styles.output}>{complexitySummary.output}</pre>
      )}
    </section>
  );
}
