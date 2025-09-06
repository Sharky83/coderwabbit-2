
import React from "react";
import { ErrorMessage, SuccessMessage } from "./Message";
import styles from "./PylintResults.module.css";

export interface PylintResultsProps {
  pylint: {
    error?: string | { message: string };
    details?: unknown;
    output?: string;
    message?: string;
  } | null;
}

export function PylintResults({ pylint }: PylintResultsProps) {
  if (!pylint) return null;
  const improvedMsg = 'pylint is not installed or the Python environment is misconfigured. Please check your .venv setup.';
  const showImprovedError = pylint.output && typeof pylint.output === 'string' && pylint.output.includes('pylint is not installed');
  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Linting (Pylint)</h3>
      {(pylint.error || showImprovedError) ? (
        <ErrorMessage>
          <strong>Error running Pylint:</strong> {showImprovedError ? pylint.output : (typeof pylint.error === 'string' ? pylint.error : (pylint.error as any)?.message)}
          {(pylint.details && (typeof pylint.details === 'object' || typeof pylint.details === 'string')) ? (
            <pre className={styles.details}>{JSON.stringify(pylint.details, null, 2)}</pre>
          ) : null}
        </ErrorMessage>
      ) : null}
      {pylint.output && !showImprovedError ? (
        <pre className={styles.output}>{pylint.output}</pre>
      ) : (!pylint.error && pylint.message ? (
        <SuccessMessage>{pylint.message}</SuccessMessage>
      ) : null)}
    </section>
  );
}
