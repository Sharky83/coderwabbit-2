import React from "react";
import { ErrorMessage } from "./Message";

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
      <section className={"container"}>
        <h3 className={"title"}>Secret Detection (detect-secrets)</h3>
        <ErrorMessage>
          <strong>Error running detect-secrets:</strong> {detectSecrets.error}
        </ErrorMessage>
      </section>
    );
  }
  if (detectSecrets.output) {
    return (
      <section className={"container"}>
        <h3 className={"title"}>Secret Detection (detect-secrets)</h3>
        <pre className={"output"}>{detectSecrets.output}</pre>
      </section>
    );
  }
  return null;
}
