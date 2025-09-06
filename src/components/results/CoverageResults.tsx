
import React from "react";
import { ErrorMessage, SuccessMessage } from "./Message";
import styles from "./CoverageResults.module.css";

export interface CoverageResultsProps {
  coverage?: { status?: string; output?: string };
}

export function CoverageResults({ coverage }: CoverageResultsProps) {
  if (!coverage) {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Test Coverage (coverage.py)</h3>
        <SuccessMessage>Coverage was not run for this analysis.</SuccessMessage>
      </section>
    );
  }
  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Test Coverage (coverage.py)</h3>
      {coverage.status === 'success' ? (
        <SuccessMessage>
          <div>
            <pre>{coverage.output}</pre>
          </div>
        </SuccessMessage>
      ) : (
        <ErrorMessage>
          <div>
            <pre>{coverage.output}</pre>
          </div>
        </ErrorMessage>
      )}
    </section>
  );
}
