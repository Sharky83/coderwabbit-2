import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import styles from "./HypothesisResults.module.css";

export interface HypothesisResultsProps {
  repoName: string;
  accessToken: string;
}

export function HypothesisResults({ repoName, accessToken }: HypothesisResultsProps) {
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHypothesisResults() {
      try {
        const response = await fetchWithAuth(`/api/analyze/hypothesis?repo=${encodeURIComponent(repoName)}`, accessToken, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch results');
      }
    }
    if (repoName && accessToken) {
      fetchHypothesisResults();
    }
  }, [repoName, accessToken]);

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Hypothesis Test Results</h3>
      {error && <div className={styles.error}>{error}</div>}
      {results ? (
        <div className={styles.output}>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      ) : (
        <div className={styles.message}>No results available.</div>
      )}
    </section>
  );
}
