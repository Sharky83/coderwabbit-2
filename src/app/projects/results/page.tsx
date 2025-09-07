"use client";
import React from "react";
import Sidebar from "../../../components/Sidebar";
import AppNavbar from "../../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "../Results.module.css";

export default function ResultsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
    <div className={styles.resultsContainer}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Project Results" />
        <main className={styles.main}>
          <h2 className={styles.title}>Project Results</h2>
          <div className={styles.resultsList}>
            {/* Example results item */}
            <div className={styles.resultsItem}>Results Item</div>
            {/* Add more results items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
