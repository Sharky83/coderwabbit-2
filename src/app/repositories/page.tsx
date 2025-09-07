"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Repositories.module.css";

export default function RepositoriesPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.repositoriesContainer}>
      <Sidebar />
  <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Repositories" />
        <main className={styles.main}>
          <h2 className={styles.title}>Repositories</h2>
          <div className={styles.repoList}>
            {/* Example repository item */}
            <div className={styles.repoItem}>coderwabbit-2</div>
            {/* Add more repository items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
