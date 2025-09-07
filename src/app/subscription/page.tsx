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
          <h2 className={styles.title}>Subscription Plans</h2>
          <div className={styles.subscriptionRow}>
            <div className={styles.subscriptionCard}>
              <div className={styles.subscriptionName}>Free</div>
              <div className={styles.subscriptionPrice}>£0/mo</div>
              <div className={styles.subscriptionDetails}>Basic access to core features. Limited integrations and support.</div>
            </div>
            <div className={styles.subscriptionCard}>
              <div className={styles.subscriptionName}>Standard</div>
              <div className={styles.subscriptionPrice}>£19/mo</div>
              <div className={styles.subscriptionDetails}>Access to all integrations, standard support, and analytics.</div>
            </div>
            <div className={styles.subscriptionCard}>
              <div className={styles.subscriptionName}>Premium</div>
              <div className={styles.subscriptionPrice}>£49/mo</div>
              <div className={styles.subscriptionDetails}>All features, priority support, advanced analytics, and bespoke integrations.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
