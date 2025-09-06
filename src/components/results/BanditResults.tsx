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
  // Try to parse Bandit output as JSON
  let findings: any[] = [];
  let outputError = "";
  if (bandit.output) {
    try {
      const parsed = JSON.parse(bandit.output);
      findings = Array.isArray(parsed.results) ? parsed.results : [];
    } catch (e) {
      outputError = bandit.output;
    }
  }
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
          <strong>Error running Bandit:</strong> {bandit.error || outputError || bandit.status}
          {detailsStr && (
            <pre style={{ marginTop: '0.5rem', color: '#b30000', background: '#fffbe6', padding: '0.5rem', borderRadius: '4px' }}>{detailsStr}</pre>
          )}
        </div>
        {findings.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <strong>Findings:</strong>
            <ul>
              {findings.map((finding, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  <div><strong>File:</strong> {finding.filename}</div>
                  <div><strong>Line:</strong> {finding.line_number}</div>
                  <div><strong>Issue:</strong> {finding.issue_text}</div>
                  <div><strong>Severity:</strong> {finding.issue_severity}</div>
                  <div><strong>Confidence:</strong> {finding.issue_confidence}</div>
                  <div><a href={finding.more_info} target="_blank" rel="noopener noreferrer">More info</a></div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }
  if (findings.length > 0) {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Security Analysis (Bandit)</h3>
        <ul>
          {findings.map((finding, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <div><strong>File:</strong> {finding.filename}</div>
              <div><strong>Line:</strong> {finding.line_number}</div>
              <div><strong>Issue:</strong> {finding.issue_text}</div>
              <div><strong>Severity:</strong> {finding.issue_severity}</div>
              <div><strong>Confidence:</strong> {finding.issue_confidence}</div>
              <div><a href={finding.more_info} target="_blank" rel="noopener noreferrer">More info</a></div>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  if (outputError) {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Security Analysis (Bandit)</h3>
        <pre className={styles.output}>{outputError}</pre>
      </section>
    );
  }
  return null;
}
