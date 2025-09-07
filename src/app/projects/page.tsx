"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Projects.module.css";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
    <div className={styles.projectsContainer}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Projects" />
        <main className={styles.main}>
          <h2 className={styles.title}>Projects</h2>
          <div className={styles.projectsList}>
            {/* Example projects item */}
            <div className={styles.projectsItem}>Results Page</div>
            {/* Add more projects items here */}
          </div>
        </main>
      </div>
    </div>
  );
}
