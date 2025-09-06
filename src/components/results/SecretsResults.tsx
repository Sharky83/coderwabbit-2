import React from "react";
import { ErrorMessage, SuccessMessage } from "./Message";
import styles from "./SecretsResults.module.css";

export interface SecretsResultsProps {
  detectSecrets?: {
    status?: string;
    output?: string;
    error?: string;
  } | null;
}

export function SecretsResults({ detectSecrets }: SecretsResultsProps) {
  if (!detectSecrets) return null;
  let secrets: Array<{ filename: string; type: string; line_number: number; hashed_secret: string }> = [];
  if (detectSecrets.output) {
    try {
      const parsed = JSON.parse(detectSecrets.output);
      if (parsed && parsed.results) {
        Object.entries(parsed.results).forEach(([filename, items]) => {
          if (Array.isArray(items)) {
            items.forEach((item: any) => {
              secrets.push({
                filename,
                type: item.type,
                line_number: item.line_number,
                hashed_secret: item.hashed_secret
              });
            });
          }
        });
      }
    } catch {}
  }
  return (
  <section className={styles.container}>
      <h3>Secrets Detection (detect-secrets)</h3>
      {detectSecrets.error ? (
        <ErrorMessage>
          <strong>Error running detect-secrets:</strong> {detectSecrets.error}
        </ErrorMessage>
      ) : null}
      {secrets.length > 0 ? (
        <ul style={{ color: '#b30000', margin: '1rem 0 0 1rem' }}>
          {secrets.map((secret, idx) => (
            <li key={idx} className={styles.output}>
              <div><strong>File:</strong> {secret.filename}</div>
              <div><strong>Type:</strong> {secret.type}</div>
              <div><strong>Line Number:</strong> {secret.line_number}</div>
              <div><strong>Secret Hash:</strong> {secret.hashed_secret}</div>
            </li>
          ))}
        </ul>
      ) : (!detectSecrets.error ? (
        <SuccessMessage>
          No secrets found by detect-secrets.
        </SuccessMessage>
      ) : null)}
    </section>
  );
}
