import React from "react";

export interface VultureResultsProps {
  vulture: {
    error?: string | { message: string };
    details?: unknown;
    output?: string;
    message?: string;
  } | null;
}

export function VultureResults({ vulture }: VultureResultsProps) {
  if (!vulture) return null;
  const improvedMsg = 'vulture is not installed or the Python environment is misconfigured. Please check your .venv setup.';
  const showImprovedError = vulture.output && typeof vulture.output === 'string' && vulture.output.includes('vulture is not installed');
  return (
    <section className={"container"}>
      <h3>Unused Code (Vulture)</h3>
      {(vulture.error || showImprovedError) ? (
        <div className={"error"}>
          <strong>Error running Vulture:</strong> {showImprovedError ? vulture.output : (typeof vulture.error === 'string' ? vulture.error : (vulture.error as any)?.message)}
          {(vulture.details && (typeof vulture.details === 'object' || typeof vulture.details === 'string')) ? (
            <pre className={"details"}>{JSON.stringify(vulture.details, null, 2)}</pre>
          ) : null}
        </div>
      ) : null}
      {vulture.output && !showImprovedError ? (
        <pre className={"output"}>{vulture.output}</pre>
      ) : (!vulture.error && vulture.message ? (
        <div className={"message"}>{vulture.message}</div>
      ) : null)}
    </section>
  );
}
