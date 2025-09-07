"use client";
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Repositories.module.css";


function RepositoryCard({ name }: { name: string }) {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={selected ? `${styles.repoItem} ${styles.selected}` : styles.repoItem}
      onClick={() => setSelected((s) => !s)}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      title={selected ? `Unselect ${name}` : `Select ${name}`}
    >
      {name}
    </div>
  );
}

export default function RepositoriesPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
    <div className={styles.repositoriesContainer}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Repositories" />
        <main className={styles.main}>
          <>
            <h2 className={styles.title}>Repositories</h2>
            <h3 className={styles.sectionTitle}>Personal repositories</h3>
            <div className={styles.repoList}>
              {["my-next-app", "legacy-repo", "demo-repo"].map((repo) => (
                <RepositoryCard key={repo} name={repo} />
              ))}
            </div>
            <h3 className={styles.sectionTitle}>Organisation repositories</h3>
            <div className={styles.repoList}>
              {["coderwabbit-2", "repo-python-test"].map((repo) => (
                <RepositoryCard key={repo} name={repo} />
              ))}
            </div>
            <h3 className={styles.sectionTitle}>Repositories with contributor access</h3>
            <div className={styles.repoList}>
              {["open-source-lib", "shared-repo", "team-collab"].map((repo) => (
                <RepositoryCard key={repo} name={repo} />
              ))}
            </div>
          </>
        </main>
      </div>
    </div>
  );
}

