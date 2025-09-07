"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "../dashboard/Dashboard.module.css";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <AppNavbar userEmail={userEmail} page="Subscription" />
        <main className={styles.main}>
          <h2>Subscription</h2>
          {/* Content goes here */}
        </main>
      </div>
    </div>
  );
}
