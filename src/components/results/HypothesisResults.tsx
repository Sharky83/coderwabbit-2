import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

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
    <section>
  <h3 className={styles.title}>Hypothesis Test Results</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {results ? (
        <pre style={{ background: '#e6f7ff', padding: '1rem', borderRadius: '6px', fontSize: '0.95rem', marginTop: '1rem', color: '#005580' }}>{JSON.stringify(results, null, 2)}</pre>
      ) : (
        <div>No results available.</div>
      )}
    </section>
  );
}
