"use client";
import React from "react";
import { useSession } from "next-auth/react";
import AppNavbar from "../../components/AppNavbar";
import Sidebar from "../../components/Sidebar";
import styles from "./Projects.module.css";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
    <div className={styles.dashboardContainer}>
  <Sidebar />
      <div className={styles.contentContainer}>
  <AppNavbar userEmail={userEmail} page="Projects" />
        <div className={styles.filtersRow}>
          <div className={styles.filterDropdown}>
            <label htmlFor="filter">Filter:</label>
            <select id="filter" className={styles.dropdownSelect}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className={styles.groupDropdown}>
            <label htmlFor="group">Group by Target:</label>
            <select id="group" className={styles.dropdownSelect}>
              <option value="repo">Repository</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div className={styles.orderDropdown}>
            <label htmlFor="order">Order by:</label>
            <select id="order" className={styles.dropdownSelect}>
              <option value="severity-desc">Highest Severity</option>
              <option value="severity-asc">Lowest Severity</option>
            </select>
          </div>
        </div>
        {/* Projects table or content goes here */}
      </div>
    </div>
  );
}
