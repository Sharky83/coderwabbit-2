
"use client";
import React, { useState } from "react";
import RepoSelector from "../../components/RepoSelector";
import Sidebar from "../../components/Sidebar";
import { useSession } from "next-auth/react";
import styles from "./Dashboard.module.css";

const DashboardPage: React.FC = () => {
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]); // Simulate selected repos
  // Handler for sidebar link click
  const handleSidebarNav = (section: string) => {
    if (section === "integrations") {
      setShowRepoSelector(true);
    } else {
      setShowRepoSelector(false);
    }
  };

  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
    <div className={styles.container}>
      <Sidebar onNav={handleSidebarNav} showProjectsLink />
      <div className={styles.contentWrapper}>
        <nav className={styles.topNav}>
          <div className={styles.breadcrumbs}>
            <nav aria-label="breadcrumb">
              <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ color: "#0070f3", fontWeight: 500 }}>{userEmail}</li>
                <li>&gt;</li>
                <li style={{ color: "#222", fontWeight: 500 }}>Projects</li>
              </ol>
            </nav>
          </div>
          <div className={styles.navActions}>
            <button
              className={styles.importLogBtn}
              onClick={() => alert('Show import log (implement logic here)')}
            >
              View Import Log
            </button>
            <button
              className={styles.addRepoNavBtn}
              onClick={() => window.open("https://github.com/apps/codewabbit", "_blank")}
            >
              Add Repo
            </button>
          </div>
        </nav>
        <main className={styles.main}>
          <h1 className={styles.title}>Repositories</h1>
          <p className={styles.description}>List of repositories accessible to codewabbit.</p>
          <input
            type="text"
            placeholder="Search repositories..."
            className={styles.searchBar}
          />
          <div className={styles.mainGap}>
            {selectedRepos.length === 0 ? (
              <section className={styles.emptyState}>
                <h2 className={styles.emptyTitle}>
                  codewabbit currently doesn't have access to repositories for this account.
                </h2>
                <p className={styles.emptyDesc}>
                  Install codewabbit on your GitHub account and grant access to the repositories you want to work with.
                </p>
                <button
                  className={styles.addRepoBtn}
                  onClick={() => window.open("https://github.com/apps/codewabbit", "_blank")}
                >
                  Add Repositories
                </button>
                <p className={styles.switchOrg}>
                  Not seeing the right organization or account? You can switch by selecting a different one from the dropdown in the top-right corner.
                </p>
              </section>
            ) : (
              showRepoSelector && <RepoSelector />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
