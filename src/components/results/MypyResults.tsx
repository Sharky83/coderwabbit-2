
import React from "react";
import styles from "./MypyResults.module.css";

export interface MypyResultsProps {
  mypy: {
    error?: string | { message: string };
    details?: unknown;
    output?: string;
    message?: string;
  } | null;
}

export function MypyResults({ mypy }: MypyResultsProps) {
  if (!mypy) return null;
  const improvedMsg = 'mypy is not installed or the Python environment is misconfigured. Please check your .venv setup.';
  const showImprovedError = mypy.output && typeof mypy.output === 'string' && mypy.output.includes('mypy is not installed');
  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Type Checking (mypy)</h3>
      {(mypy.error || showImprovedError) ? (
        <div className={styles.error}>
          <strong>Error running mypy:</strong> {showImprovedError ? mypy.output : (typeof mypy.error === 'string' ? mypy.error : (mypy.error as any)?.message)}
          {(mypy.details && (typeof mypy.details === 'object' || typeof mypy.details === 'string')) ? (
            <pre className={styles.details}>{JSON.stringify(mypy.details, null, 2)}</pre>
          ) : null}
        </div>
      ) : null}
      {mypy.output && !showImprovedError ? (
        <pre className={styles.output}>{mypy.output}</pre>
      ) : (!mypy.error ? (
        <div className={styles.message}>
          No type errors found by mypy.
        </div>
      ) : null)}
    </section>
  );
}
