import React from "react";
import { ErrorMessage } from "./Message";

export interface SafetyResultsProps {
  safety: {
    error?: string | { message: string };
    details?: unknown;
    vulnerabilities?: Array<{
      package_name: string;
      installed_version: string;
      advisory: string;
      vulnerability_id: string;
      severity: string;
    }>;
  } | null;
}

export function SafetyResults({ safety }: SafetyResultsProps) {
  if (!safety) return null;
  return (
    <section className={"container"}>
      <h3>Dependency Security (Safety)</h3>
      {safety.error ? (
        <ErrorMessage>
          <strong>Error running safety:</strong> {typeof safety.error === 'string' ? safety.error : (safety.error as any)?.message}
          {(safety.details && (typeof safety.details === 'object' || typeof safety.details === 'string')) ? (
            <pre className={"details"}>{JSON.stringify(safety.details, null, 2)}</pre>
          ) : null}
        </ErrorMessage>
      ) : null}
      {safety.vulnerabilities && safety.vulnerabilities.length > 0 ? (
        <ul>
          {safety.vulnerabilities.map((vuln, idx) => (
            <li key={idx} className={"error"}>
              <strong>{vuln.package_name} {vuln.installed_version}</strong>: {vuln.advisory}
              <br />
              <em>Vulnerability ID:</em> {vuln.vulnerability_id}
              <br />
              <em>Severity:</em> {vuln.severity}
            </li>
          ))}
        </ul>
      ) : (!safety.error ? (
        <div style={{ color: 'green', marginTop: '1rem' }}>
          No known vulnerabilities found by Safety.
        </div>
      ) : null)}
    </section>
  );
}
