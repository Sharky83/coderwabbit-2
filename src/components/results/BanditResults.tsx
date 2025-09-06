import React from "react";
import styles from "./BanditResults.module.css";

export interface BanditResultsProps {
  bandit?: {
    status?: string;
    output?: string;
    error?: string;
    details?: unknown;
  } | null;
}

export function BanditResults({ bandit }: BanditResultsProps) {
  if (!bandit) return null;
  if (bandit.status === "error" || bandit.status === "skipped") {
    let detailsStr = "";
    if (bandit.details) {
      if (typeof bandit.details === "object") {
        detailsStr = JSON.stringify(bandit.details, null, 2);
      } else {
        detailsStr = String(bandit.details);
      }
    }
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Security Analysis (Bandit)</h3>
        <div className={styles.error}>
          <strong>Error running Bandit:</strong> {bandit.error || bandit.output || bandit.status}
          {detailsStr && (
            <pre style={{ marginTop: '0.5rem', color: '#b30000', background: '#fffbe6', padding: '0.5rem', borderRadius: '4px' }}>{detailsStr}</pre>
          )}
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
