import React from "react";
import styles from "./PoetryResults.module.css";

export interface PoetryResultsProps {
  poetry?: {
    status?: string;
    output?: string;
    error?: string;
  } | null;
}

export function PoetryResults({ poetry }: PoetryResultsProps) {
  if (!poetry) return null;
  if (poetry.status === "error") {
    return (
      <section className={styles.container}>
        <h3>Dependency Management (Poetry)</h3>
        <div className={styles.error}>
          <strong>Error running Poetry:</strong> {poetry.error}
        </div>
      </section>
    );
  }
  if (poetry.output) {
    return (
      <section className={styles.container}>
        <h3>Dependency Management (Poetry)</h3>
        <pre className={styles.output}>{poetry.output}</pre>
      </section>
    );
  }
  return null;
}
