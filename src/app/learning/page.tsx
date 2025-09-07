"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Learning.module.css";

export default function LearningPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.learningContainer}>
      <Sidebar />
  <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Learning" />
        <main className={styles.main}>
          <h2 className={styles.title}>Learning</h2>
          <div className={styles.learningList}>
            {/* Example learning item */}
            <div className={styles.learningItem}>Security Fundamentals</div>
            {/* Add more learning items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
