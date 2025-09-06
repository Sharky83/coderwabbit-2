import React from "react";

export interface CoverageResultsProps {
  coverage?: { status?: string; output?: string };
}

export function CoverageResults({ coverage }: CoverageResultsProps) {
  if (!coverage) return null;
  return (
    <div className={"container"}>
  <h3 className={"title"}>Test Coverage (coverage.py)</h3>
      <div className={coverage.status === 'success' ? "output" : "error"}>
        <pre>{coverage.output}</pre>
      </div>
    </div>
  );
}
