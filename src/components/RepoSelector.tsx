"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Repo = {
  id: number;
  name: string;
  full_name: string;
};

export default function RepoSelector() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const [checking, setChecking] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [status, setStatus] = useState<string>("");
  interface TestResults {
    safety?: SafetyResultsProps['safety'];
    mypy?: MypyResultsProps['mypy'];
    vulture?: VultureResultsProps['vulture'];
    bandit?: BanditResultsProps['bandit'];
    [key: string]: unknown;
  }
  interface ResultType {
    testResults?: TestResults;
    [key: string]: unknown;
  }
  const [result, setResult] = useState<ResultType | null>(null);
  const [tempDir, setTempDir] = useState<string>("");
  interface DetectedType {
    detectedLanguages?: string[];
    [key: string]: unknown;
  }
  const [detected, setDetected] = useState<DetectedType | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchAllRepos() {
      setLoading(true);
      let allRepos: Repo[] = [];
      let currentPage = 1;
      let keepGoing = true;
      while (keepGoing) {
        const res = await fetch(`/api/github/repos?page=${currentPage}&per_page=30`);
        const data = await res.json();
        if (Array.isArray(data)) {
          allRepos = [...allRepos, ...data];
          keepGoing = data.length === 30;
          currentPage++;
        } else {
          setError(data.error || "Failed to fetch repos");
          keepGoing = false;
        }
        if (cancelled) return;
      }
      setRepos(allRepos);
      setHasMore(false);
      setLoading(false);
    }
    fetchAllRepos();
    return () => { cancelled = true; };
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

    // Add Safety dependency security results display
  interface SafetyVulnerability {
    package_name: string;
    installed_version: string;
    advisory: string;
    vulnerability_id: string;
    severity: string;
  }
  interface SafetyResultsProps {
    safety: {
      error?: string | { message: string };
      details?: unknown;
      vulnerabilities?: SafetyVulnerability[];
    } | null;
  }
  function SafetyResults({ safety }: SafetyResultsProps) {
    if (!safety) return null;
    return (
      <section style={{ marginTop: '2rem' }}>
        <h3>Dependency Security (Safety)</h3>
        {safety.error ? (
          <div style={{ color: 'orange', marginBottom: '1rem' }}>
            <strong>Error running safety:</strong> {typeof safety.error === 'string' ? safety.error : safety.error.message}
            {(safety.details && (typeof safety.details === 'object' || typeof safety.details === 'string')) ? (
              <pre style={{ background: '#fff3cd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' }}>{JSON.stringify(safety.details, null, 2)}</pre>
            ) : null}
          </div>
        ) : null}
        {safety.vulnerabilities && safety.vulnerabilities.length > 0 ? (
          <ul>
            {safety.vulnerabilities.map((vuln, idx) => (
              <li key={idx} style={{ color: 'red' }}>
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

    // Add Mypy type checking results display
  interface MypyResultsProps {
    mypy: {
      error?: string | { message: string };
      details?: unknown;
      output?: string;
      message?: string;
    } | null;
  }
  function MypyResults({ mypy }: MypyResultsProps) {
    if (!mypy) return null;
    return (
      <section style={{ marginTop: '2rem' }}>
        <h3>Type Checking (mypy)</h3>
        {mypy.error ? (
          <div style={{ color: 'orange', marginBottom: '1rem' }}>
            <strong>Error running mypy:</strong> {typeof mypy.error === 'string' ? mypy.error : mypy.error.message}
            {(mypy.details && (typeof mypy.details === 'object' || typeof mypy.details === 'string')) ? (
              <pre style={{ background: '#fff3cd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' }}>{JSON.stringify(mypy.details, null, 2)}</pre>
            ) : null}
          </div>
        ) : null}
        {mypy.output ? (
          <pre style={{ background: '#e6f7ff', padding: '1rem', borderRadius: '6px', fontSize: '0.95rem', marginTop: '1rem', color: '#005580' }}>{mypy.output}</pre>
        ) : (!mypy.error ? (
          <div style={{ color: 'green', marginTop: '1rem' }}>
            No type errors found by mypy.
          </div>
        ) : null)}
      </section>
    );
  }

  // Add Vulture unused code results display
  interface VultureResultsProps {
    vulture: {
      error?: string | { message: string };
      details?: unknown;
      output?: string;
      message?: string;
    } | null;
  }
  function VultureResults({ vulture }: VultureResultsProps) {
    if (!vulture) return null;
    return (
      <section style={{ marginTop: '2rem' }}>
        <h3>Unused Code (Vulture)</h3>
        {vulture.error ? (
          <div style={{ color: 'orange', marginBottom: '1rem' }}>
            <strong>Error running Vulture:</strong> {typeof vulture.error === 'string' ? vulture.error : vulture.error.message}
            {(vulture.details && (typeof vulture.details === 'object' || typeof vulture.details === 'string')) ? (
              <pre style={{ background: '#fff3cd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' }}>{JSON.stringify(vulture.details, null, 2)}</pre>
            ) : null}
          </div>
        ) : null}
        {vulture.output ? (
          <pre style={{ background: '#ffecec', padding: '1rem', borderRadius: '6px', fontSize: '0.95rem', marginTop: '1rem', color: '#b30000' }}>{vulture.output}</pre>
        ) : (!vulture.error && vulture.message ? (
          <div style={{ color: 'green', marginTop: '1rem' }}>{vulture.message}</div>
        ) : null)}
      </section>
    );
  }


  // Add Bandit security results display
  interface BanditIssue {
    test_id: string;
    issue_text: string;
    filename: string;
    line_number: number;
  }
  interface BanditResultsProps {
    bandit: {
      error?: string | { message: string };
      details?: unknown;
      results?: BanditIssue[];
    } | null;
  }
  function BanditResults({ bandit }: BanditResultsProps) {
    if (!bandit) return null;
    return (
      <section style={{ marginTop: '2rem' }}>
        <h3>Python Security Issues (Bandit)</h3>
        {bandit.error ? (
          <div style={{ color: 'orange', marginBottom: '1rem' }}>
            <strong>Error running Bandit:</strong> {typeof bandit.error === 'string' ? bandit.error : bandit.error.message}
            {(bandit.details && (typeof bandit.details === 'object' || typeof bandit.details === 'string')) ? (
              <pre style={{ background: '#fff3cd', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' }}>{JSON.stringify(bandit.details, null, 2)}</pre>
            ) : null}
          </div>
        ) : null}
        {bandit.results && bandit.results.length > 0 ? (
          <ul>
            {bandit.results.map((issue, idx) => (
              <li key={idx} style={{ color: 'red' }}>
                <strong>{issue.test_id}</strong>: {issue.issue_text}<br />
                <em>File:</em> {issue.filename} <em>Line:</em> {issue.line_number}
              </li>
            ))}
          </ul>
        ) : (!bandit.error ? (
          <div style={{ color: 'green', marginTop: '1rem' }}>
            No security issues found by Bandit.
          </div>
        ) : null)}
      </section>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto 2rem auto", width: "100%" }}>
      <input
        type="text"
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "1rem",
        }}
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          <div style={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              size={Math.min(filteredRepos.length, 10)}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                maxHeight: "240px",
                overflowY: "auto",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                appearance: "none",
              }}
            >
              <option value="">Select a repository</option>
              {filteredRepos.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.name}
                </option>
              ))}
            </select>
            {/* All repos are loaded automatically, no Load more button needed */}
          </div>
          <button
            disabled={!selected || checking || analysing}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "none",
              background: checking ? "#eee" : "#4f8cff",
              color: checking ? "#888" : "#fff",
              cursor: !selected || checking ? "not-allowed" : "pointer",
              marginBottom: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "background 0.2s, color 0.2s",
            }}
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
            disabled={!tempDir || analysing || checking}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "none",
              background: analysing ? "#eee" : "#4f8cff",
              color: analysing ? "#888" : "#fff",
              cursor: !tempDir || analysing ? "not-allowed" : "pointer",
              marginBottom: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "background 0.2s, color 0.2s",
            }}
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
          <div style={{ minHeight: "2rem", fontSize: "0.95rem", color: "#222", whiteSpace: "pre-line" }}>
            {status}
          </div>
          {error && (
            <div style={{ color: "red", margin: "1rem 0", fontWeight: 500 }}>
              {error}
            </div>
          )}
          {detected?.detectedLanguages && (
            <div style={{ margin: "1rem 0", fontSize: "1rem", color: "#4f8cff", fontWeight: 500 }}>
              Detected languages: {Array.isArray(detected.detectedLanguages) ? detected.detectedLanguages.join(", ") : ""}
            </div>
          )}
          {detected && (
            <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "6px", marginTop: "1rem", fontSize: "0.9rem", overflowX: "auto" }}>
              {JSON.stringify(detected, null, 2)}
            </pre>
          )}
          {result && (
            <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "6px", marginTop: "1rem", fontSize: "0.9rem", overflowX: "auto" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          {result?.testResults?.safety && <SafetyResults safety={result.testResults.safety as SafetyResultsProps['safety']} />}
          {result?.testResults?.mypy && <MypyResults mypy={result.testResults.mypy as MypyResultsProps['mypy']} />}
          {result?.testResults?.bandit && <BanditResults bandit={result.testResults.bandit as BanditResultsProps['bandit']} />}
          {result?.testResults?.vulture && <VultureResults vulture={result.testResults.vulture as VultureResultsProps['vulture']} />}
        </>
      )}
    </div>
  );
}
