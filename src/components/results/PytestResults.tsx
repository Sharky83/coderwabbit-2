import React from "react";

export interface PytestResultsProps {
  pytest: {
    error?: string | { message: string };
    details?: unknown;
    output?: string;
    message?: string;
    status?: string;
  } | null;
}

export function PytestResults({ pytest }: PytestResultsProps) {
  if (!pytest) return null;
  return (
    <section className={"container"}>
  <h3 className={"title"}>Test Results (Pytest)</h3>
      {pytest.error ? (
        <div className={"error"}>
          <strong>Error running Pytest:</strong> {typeof pytest.error === 'string' ? pytest.error : (pytest.error as any)?.message}
          {(pytest.details && (typeof pytest.details === 'object' || typeof pytest.details === 'string')) ? (
            <pre className={"details"}>{JSON.stringify(pytest.details, null, 2)}</pre>
          ) : null}
        </div>
      ) : null}
      {pytest.output ? (
        <pre className={"output"}>{pytest.output}</pre>
      ) : (!pytest.error && pytest.message ? (
        <div className={"message"}>{pytest.message}</div>
      ) : null)}
    </section>
  );
}
