"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Integrations.module.css";

export default function IntegrationsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.integrationsContainer}>
      <Sidebar />
  <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Integrations" />
        <main className={styles.main}>
          <h2 className={styles.title}>Integrations</h2>
          <div className={styles.integrationList}>
            {/* Example integration item */}
            <div className={styles.integrationItem}>GitHub Integration</div>
            {/* Add more integration items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
