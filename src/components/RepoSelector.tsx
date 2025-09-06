"use client";
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

import { MultiPipAuditResults } from "./results/MultiPipAuditResults";
import { BanditResults } from "./results/BanditResults";
import { DetectSecretsResults } from "./results/DetectSecretsResults";
import { CoverageResults } from "./results/CoverageResults";
import { HypothesisResults } from "./results/HypothesisResults";
import { PoetryResults } from "./results/PoetryResults";
import { SafetyResults } from "./results/SafetyResults";
import { SecretsResults } from "./results/SecretsResults";
import { MypyResults } from "./results/MypyResults";
import { VultureResults } from "./results/VultureResults";
import {
  ComplexitySummaryProps,
  SecretsResultsProps,
  MypyResultsProps,
  VultureResultsProps
} from "./results/resultsTypes";
import { ComplexitySummarySection } from "./results/ComplexitySummarySection";
import { PylintResults } from "./results/PylintResults";
import { PytestResults } from "./results/PytestResults";
import { RepoSearch } from "./RepoSearch";
import { RepoStatus } from "./RepoStatus";
import { AnalysisResults } from "./AnalysisResults";
import { useSession } from "next-auth/react";
import { useRepoSelection } from "../hooks/useRepoSelection";
import styles from "./RepoSelector.module.css";

type Repo = {
  id: number;
  name: string;
  full_name: string;
};



export default function RepoSelector() {
  // Add Complexity summary results display
  const { data: session } = useSession();
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { selected, setSelected, filteredRepos, setFilteredRepos } = useRepoSelection([]);
  // Fetch repos on mount or when session changes
  useEffect(() => {
    async function fetchRepos() {
      setLoading(true);
      setError("");
      try {
        if (!session?.accessToken) throw new Error("No access token available");
        const response = await fetchWithAuth("/api/github/repos", session.accessToken, { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch repos");
        const data = await response.json();
        setFilteredRepos(data.repos || []);
      } catch (err) {
        setError("Failed to load repositories due to a network or server error.");
        setFilteredRepos([]);
      }
      setLoading(false);
    }
    if (session?.accessToken) {
      fetchRepos();
    }
  }, [session]);

  // Filter repos by search
  useEffect(() => {
    setFilteredRepos(prevRepos => {
      if (!search) return prevRepos;
      return prevRepos.filter(repo =>
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, setFilteredRepos]);
  const [checking, setChecking] = useState<boolean>(false);
  const [analysing, setAnalysing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [detected, setDetected] = useState<any>(null);
  const [tempDir, setTempDir] = useState<string>("");



  return (
    <div className={styles.container}>
      <RepoSearch
        search={search}
        setSearch={setSearch}
        selected={selected}
        setSelected={setSelected}
        filteredRepos={filteredRepos}
      />
      <RepoStatus loading={loading} error={error} status={status} />
      {!(loading || error) && (
        <>
          <button
            disabled={!selected || checking || analysing}
            className={`${styles.button} ${(!selected || checking || analysing) ? styles.buttonDisabled : styles.buttonPrimary}`}
            onClick={async () => {
              setChecking(true);
              setStatus("Cloning and checking repo...");
              setResult(null);
              setDetected(null);
              setTempDir("");
              setError("");
              try {
                const [owner, repo] = selected.split("/");
                const accessToken = session?.accessToken;
                const res = await fetch("/api/analyze", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ owner, repo, accessToken, mode: "clone" }),
                });
                const data = await res.json();
                if (!res.ok || data.error) {
                  setError(data.error || "Check failed. Please try again.");
                  setStatus("");
                } else {
                  setDetected(data);
                  setTempDir(data.tempDir);
                  setStatus("Check complete! Ready to analyse.");
                }
              } catch (err) {
                setError("Check failed due to a network or server error. Please try again.");
                setStatus("");
              }
              setChecking(false);
            }}
          >
            Check
          </button>
          <button
            disabled={!tempDir || analysing || checking || !!result}
            className={`${styles.button} ${(!tempDir || analysing || checking || !!result) ? styles.buttonDisabled : styles.buttonPrimary}`}
            onClick={async () => {
              setAnalysing(true);
              setStatus("Running analysis...");
              setResult(null);
              setError("");
              try {
                const [owner, repo] = selected.split("/");
                const accessToken = session?.accessToken;
                const res = await fetch("/api/analyze", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ owner, repo, accessToken, mode: "analyse", tempDir }),
                });
                const data = await res.json();
                if (!res.ok || data.error) {
                  setError(data.error || "Analysis failed. Please try again.");
                  setStatus("");
                } else {
                  setResult(data);
                  setStatus("Analysis complete!");
                }
              } catch (err) {
                setError("Analysis failed due to a network or server error. Please try again.");
                setStatus("");
              }
              setAnalysing(false);
            }}
          >
            Analyse
          </button>
          <div className={styles.status}>
            {status}
          </div>
          {error && (
            <div style={{ color: "red", margin: "1rem 0", fontWeight: 500 }}>
              {error}
            </div>
          )}
          {detected?.detectedLanguages && (
            <div className={styles.detected}>
              Detected languages: {Array.isArray(detected.detectedLanguages) ? detected.detectedLanguages.join(", ") : ""}
            </div>
          )}
          {detected && (
            <pre className={styles.pre}>
              {JSON.stringify(detected, null, 2)}
            </pre>
          )}
          {/* AnalysisResults: Pass repoName and accessToken first for clarity */}
          <AnalysisResults repoName={selected} accessToken={session?.accessToken || ""} result={result} />
          {/* InstallErrors component removed: file does not exist */}
          {result && (
            <section style={{ marginTop: "2rem", width: "100%", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
              <h3 style={{ marginBottom: "1rem" }}>Full Analysis Summary</h3>
              <div style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "6px", fontSize: "1rem", lineHeight: 1.7 }}>
                {result?.testResults ? (
                  <>
                    {Object.entries(result.testResults).map(([tool, res]) => {
                      if (!res) return null;
                      // Parameterized/Property-Based Testing Recommendation
                      const paramTestDetected = false; // No usage found in codebase
                      const propertyTestDetected = false; // No usage found in codebase
                      // Special handling for pipAudit multi-file results
                      if (tool === 'pipAudit' && typeof res === 'object' && !Array.isArray(res)) {
                        return (
                          <div key={tool} style={{ marginBottom: '1.2rem' }}>
                            <strong>Dependency Security (pip-audit):</strong>
                            {Object.entries(res).map(([file, audit]) => {
                              if (!audit) return null;
                              const status = (audit as any)?.status;
                              const error = (audit as any)?.error;
                              const output = (audit as any)?.output;
                              // Try to parse output for vulnerabilities
                              let issues: any[] = [];
                              {/* Automated review recommendation for parameterized/property-based testing */ }
                              {
                                (!paramTestDetected && !propertyTestDetected) && (
                                  <div style={{ background: '#fffbe6', color: '#8a6d3b', padding: '0.75rem', borderRadius: '6px', marginTop: '1rem', fontWeight: 500 }}>
                                    <strong>Recommendation:</strong> No parameterized or property-based tests detected.<br />
                                    Consider using <code>pytest.mark.parametrize</code> and <code>hypothesis</code> to improve test coverage and catch edge cases. This is a best practice for robust Python testing.
                                  </div>
                                )
                              }
                              try {
                                if (output && typeof output === 'string') {
                                  const parsed = JSON.parse(output);
                                  if (Array.isArray(parsed) && parsed.length > 0) {
                                    issues = parsed;
                                  }
                                }
                              } catch { }
                              return (
                                <div key={file} style={{ margin: '0.5rem 0 1rem 1rem' }}>
                                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.3rem' }}>{file}</div>
                                  {error ? (
                                    <div style={{ color: 'orange', marginBottom: '0.3rem' }}>Error: {typeof error === 'string' ? error : error.message}</div>
                                  ) : null}
                                  {status === 'skipped' ? (
                                    <div style={{ color: 'gray', marginBottom: '0.3rem' }}>Skipped: {error}</div>
                                  ) : null}
                                  {issues.length > 0 ? (
                                    <ul style={{ color: '#b30000', margin: '0.5rem 0 0 1rem' }}>
                                      {issues.map((issue, idx) => (
                                        <li key={idx}>
                                          <strong>{issue.dependency || issue.name}</strong>: {issue.vulnerability_id || issue.id} - {issue.description || issue.summary}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (status === 'success' && !error ? (
                                    <div style={{ color: 'green', marginBottom: '0.3rem' }}>No vulnerabilities found.</div>
                                  ) : null)}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                      // Default for other tools
                      const status = (res as any)?.status || (res as any)?.output || (res as any)?.error || (res as any)?.message || '';
                      const error = (res as any)?.error || '';
                      const output = (res as any)?.output || '';
                      return (
                        <div key={tool} style={{ marginBottom: '1.2rem' }}>
                          <strong style={{ textTransform: 'capitalize' }}>{tool.replace(/([A-Z])/g, ' $1')}</strong>:
                          {error ? (
                            <div style={{ color: 'orange', marginTop: '0.3rem' }}>Error: {typeof error === 'string' ? error : error.message}</div>
                          ) : null}
                          {output && !error ? (
                            <div style={{ color: '#222', marginTop: '0.3rem' }}>{output}</div>
                          ) : null}
                          {status && !output && !error ? (
                            <div style={{ color: '#222', marginTop: '0.3rem' }}>{status}</div>
                          ) : null}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div>No analysis results found.</div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
