"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Subscription.module.css";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.subscriptionContainer}>
      <Sidebar />
  <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Subscription" />
        <main className={styles.main}>
          <h2 className={styles.title}>Subscription</h2>
          <div className={styles.subscriptionList}>
            {/* Example subscription item */}
            <div className={styles.subscriptionItem}>Pro Plan</div>
            {/* Add more subscription items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
