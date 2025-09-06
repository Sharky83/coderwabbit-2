import React from "react";
import { ErrorMessage } from "./Message";
import styles from "./DetectSecretsResults.module.css";

export interface DetectSecretsResultsProps {
  detectSecrets?: {
    status?: string;
    output?: string;
    error?: string;
  } | null;
}

export function DetectSecretsResults({ detectSecrets }: DetectSecretsResultsProps) {
  if (!detectSecrets) return null;
  if (detectSecrets.status === "error") {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Secrets Detection (detect-secrets)</h3>
        <ErrorMessage>
          <strong>Error running detect-secrets:</strong> {detectSecrets.error}
        </ErrorMessage>
      </section>
    );
  }
  if (detectSecrets.output) {
    return (
      <section className={styles.container}>
        <h3 className={styles.title}>Secrets Detection (detect-secrets)</h3>
        <pre className={styles.output}>{detectSecrets.output}</pre>
      </section>
    );
  }
  return null;
}
