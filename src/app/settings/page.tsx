"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Settings.module.css";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.settingsContainer}>
      <Sidebar />
  <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Settings" />
        <main className={styles.main}>
          <h2 className={styles.title}>Settings</h2>
          <div className={styles.settingsList}>
            {/* Example settings item */}
            <div className={styles.settingsItem}>Profile Settings</div>
            {/* Add more settings items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
