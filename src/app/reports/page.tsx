"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "../dashboard/Dashboard.module.css";

export default function ReportsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <AppNavbar userEmail={userEmail} page="Reports" />
        <main className={styles.main}>
          <h2>Reports</h2>
          {/* Content goes here */}
        </main>
      </div>
    </div>
  );
}
