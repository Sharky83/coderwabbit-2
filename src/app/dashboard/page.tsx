"use client";
import React, { useState } from "react";
import RepoSelector from "../../components/RepoSelector";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Dashboard.module.css";

// Reusable Dashboard Table Component
type DashboardTableRow = {
  project: string;
  issues: (number | string)[];
};

interface DashboardTableProps {
  title: string;
  tooltip: string;
  rows: DashboardTableRow[];
  footer?: string;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ title, tooltip, rows, footer }) => (
  <section className={styles.tasksSection}>
    <div className={styles.tasksTitleRow}>
      <span className={styles.tasksBadge}>{title}</span>
      <span className={styles.tooltipIcon} title={tooltip}>?</span>
    </div>
    <div className={styles.tasksTableWrapper}>
      <table className={styles.tasksTable}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Fixable Issues</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.project}>
              <td>{row.project}</td>
              <td>
                <div className={styles.issuesSquares}>
                  {row.issues.map((issue, idx) =>
                    typeof issue === "number" ? (
                      <div key={idx} className={styles.issuesSquareShaded}>{issue}</div>
                    ) : (
                      <div key={idx} className={styles.issuesSquareSolid}>{issue}</div>
                    )
                  )}
                </div>
              </td>
              <td>
                <button className={styles.fixBtn}>Fix vulnerabilities</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {footer && <div className={styles.tasksFooter}>{footer}</div>}
    </div>
  </section>
);

const pendingTasksRows: DashboardTableRow[] = [
  { project: "project-alpha", issues: [3, "A", 2, "B", 1, "C"] },
  { project: "project-beta", issues: [4, "A", 2, "B", 0, "C"] },
];

const vulnerableProjectsRows: DashboardTableRow[] = [
  { project: "project-gamma", issues: [5, "A", 1, "B", 2, "C"] },
  { project: "project-delta", issues: [2, "A", 3, "B", 1, "C"] },
];

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <AppNavbar userEmail={userEmail} page="Dashboard" />
        <main className={styles.main}>
          <span className={styles.tasksBadge}>Dashboard</span>
          {/* Banner Section */}
          <div className={styles.bannerCard}>
            <div className={styles.bannerBadge}>Security is a team sport</div>
            <p className={styles.bannerDesc}>
              Invite your team members to view and fix the vulnerabilities across your projects
            </p>
          </div>

          {/* Top Pending Tasks Table */}
          <DashboardTable
            title="Top pending tasks"
            tooltip="This is a dummy tooltip for Top pending tasks."
            rows={pendingTasksRows}
            footer="showing 2 of 2"
          />
          {/* Top Vulnerable Projects Table */}
          <DashboardTable
            title="Top vulnerable projects"
            tooltip="This is a dummy tooltip for Top vulnerable projects."
            rows={vulnerableProjectsRows}
            footer="showing 2 of 2"
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
