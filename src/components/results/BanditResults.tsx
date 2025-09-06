import React from "react";
import styles from "./BanditResults.module.css";

export interface BanditResultsProps {
  bandit?: {
    status?: string;
    output?: string;
    error?: string;
  } | null;
}

export function BanditResults({ bandit }: BanditResultsProps) {
  if (!bandit) return null;
  if (bandit.status === "error") {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Security Analysis (Bandit)</h3>
        <div className={styles.error}>
          <strong>Error running Bandit:</strong> {bandit.error}
        </div>
      </section>
    );
  }
  if (bandit.output) {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Security Analysis (Bandit)</h3>
        <pre className={styles.output}>{bandit.output}</pre>
      </section>
    );
  }
  return null;
}
