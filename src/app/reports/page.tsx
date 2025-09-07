"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Reports.module.css";

export default function ReportsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.reportsContainer}>
      <Sidebar />
  <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Reports" />
        <main className={styles.main}>
          <h2 className={styles.title}>Reports</h2>
          <div className={styles.reportsList}>
            {/* Example reports item */}
            <div className={styles.reportsItem}>Weekly Security Report</div>
            {/* Add more reports items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
