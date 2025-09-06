import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import styles from "./HypothesisResults.module.css";

export interface HypothesisResultsProps {
  tempDir: string;
  accessToken: string;
}

export function HypothesisResults({ tempDir, accessToken }: HypothesisResultsProps) {
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHypothesisResults() {
      try {
        console.log('[HypothesisResults] Fetching:', `/api/analyze/hypothesis?tempDir=${encodeURIComponent(tempDir)}`);
        const response = await fetchWithAuth(`/api/analyze/hypothesis?tempDir=${encodeURIComponent(tempDir)}`, accessToken, { method: 'GET' });
        if (!response.ok) {
          console.error('[HypothesisResults] Response not OK:', response.status);
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('[HypothesisResults] Data:', data);
        setResults(data);
      } catch (err: any) {
        console.error('[HypothesisResults] Fetch error:', err);
        setError(err.message || 'Failed to fetch results');
      }
    }
    if (tempDir && accessToken) {
      fetchHypothesisResults();
    }
  }, [tempDir, accessToken]);

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
