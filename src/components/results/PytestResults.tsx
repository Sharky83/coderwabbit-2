
import React from "react";
import { ErrorMessage, SuccessMessage } from "./Message";
import styles from "./PytestResults.module.css";

export interface PytestResultsProps {
  pytest: {
    error?: string | { message: string };
    details?: unknown;
    output?: string;
    message?: string;
    status?: string;
  } | null;
}

export function PytestResults({ pytest }: PytestResultsProps) {
  if (!pytest) {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Test Results (Pytest)</h3>
        <SuccessMessage>Pytest was not run for this analysis.</SuccessMessage>
      </section>
    );
  }
  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Test Results (Pytest)</h3>
      {pytest.error ? (
        <ErrorMessage>
          <strong>Error running Pytest:</strong> {typeof pytest.error === 'string' ? pytest.error : (pytest.error as any)?.message}
          {(pytest.details && (typeof pytest.details === 'object' || typeof pytest.details === 'string')) ? (
            <div>
              <pre className={styles.details}>{JSON.stringify(pytest.details, null, 2)}</pre>
            </div>
          ) : null}
        </ErrorMessage>
      ) : null}
      {pytest.output ? (
        <SuccessMessage>
          <div>
            <pre className={styles.output}>{pytest.output}</pre>
          </div>
        </SuccessMessage>
      ) : (!pytest.error && pytest.message ? (
        <SuccessMessage>{pytest.message}</SuccessMessage>
      ) : null)}
    </section>
  );
}
