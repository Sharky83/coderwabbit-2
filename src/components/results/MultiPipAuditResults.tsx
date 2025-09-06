import React from "react";
import styles from "./MultiPipAuditResults.module.css";

export interface MultiPipAuditResultsProps {
  pipAudit?: Record<string, { status?: string; output?: string; error?: string }> | { status?: string; error?: string } | null;
}

export function MultiPipAuditResults({ pipAudit }: MultiPipAuditResultsProps) {
  if (!pipAudit) return null;
  // Single error case
  if ('status' in pipAudit && pipAudit.status === 'error') {
    let errorMsg = typeof pipAudit.error === 'string' ? pipAudit.error : '';
    let userHint = null;
    if (errorMsg.includes("invalid OutputFormatChoice value")) {
      userHint = (
        <div className={styles.error}>
          <strong>Explanation:</strong> Pip-audit does not support the requested output format (e.g., 'toml').<br />
          Please use a supported format such as 'json', 'cyclonedx', or 'table'.<br />
          <span style={{ color: '#555' }}>See <a href="https://github.com/pypa/pip-audit#output-formats" target="_blank" rel="noopener noreferrer">pip-audit documentation</a> for details.</span>
        </div>
      );
    }
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Dependency Security (PipAudit)</h3>
        <div className={styles.error}>
          <strong>Error running pip-audit:</strong> {errorMsg}
          {userHint}
        </div>
      </section>
    );
  }
  // ...existing code for multi-file results...
  return null;
}
