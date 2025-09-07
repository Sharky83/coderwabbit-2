
"use client";
import React, { useState } from "react";
import RepoSelector from "../../components/RepoSelector";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Dashboard.module.css";

const DashboardPage: React.FC = () => {
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]); // Simulate selected repos
  // Handler for sidebar link click
  const handleSidebarNav = (section: string) => {
    if (section === "integrations") {
      setShowRepoSelector(true);
    } else {
      setShowRepoSelector(false);
    }
  };

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
          <div>
            {/* Banner Section */}
            <div className={styles.bannerCard}>
              <div className={styles.bannerBadge}>Security is a team sport</div>
              <p className={styles.bannerDesc}>
                Invite your team members to view and fix the vulnerabilities across your projects
              </p>
            </div>
            {/* Top Pending Tasks Table */}
            <section className={styles.tasksSection}>
              <div className={styles.tasksTitleRow}>
                <span style={{ color: '#222', fontWeight: 700, fontSize: '1.08rem', marginRight: '0.7rem', marginBottom: '0.5rem', letterSpacing: '0.01em' }}>Top pending tasks</span>
                <span className={styles.tooltipIcon} title="This is a dummy tooltip for Top pending tasks.">?</span>
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
                    <tr>
                      <td>project-alpha</td>
                      <td>
                        <div className={styles.issuesSquares} style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
                          <div className={styles.issuesSquareShaded}>3</div>
                          <div className={styles.issuesSquareSolid}>A</div>
                          <div className={styles.issuesSquareShaded}>2</div>
                          <div className={styles.issuesSquareSolid}>B</div>
                          <div className={styles.issuesSquareShaded}>1</div>
                          <div className={styles.issuesSquareSolid}>C</div>
                        </div>
                      </td>
                      <td>
                        <button className={styles.fixBtn}>Fix vulnerabilities</button>
                      </td>
                    </tr>
                    <tr>
                      <td>project-beta</td>
                      <td>
                        <div className={styles.issuesSquares} style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
                          <div className={styles.issuesSquareShaded}>4</div>
                          <div className={styles.issuesSquareSolid}>A</div>
                          <div className={styles.issuesSquareShaded}>2</div>
                          <div className={styles.issuesSquareSolid}>B</div>
                          <div className={styles.issuesSquareShaded}>0</div>
                          <div className={styles.issuesSquareSolid}>C</div>
                        </div>
                      </td>
                      <td>
                        <button className={styles.fixBtn}>Fix vulnerabilities</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.tasksFooter}>showing 2 of 2</div>
              </div>
            </section>
            {/* Top Vulnerable Projects Table */}
            <section className={styles.tasksSection}>
              <div className={styles.tasksTitleRow}>
                <span className={styles.tasksBadge}>Top vulnerable projects</span>
                <span className={styles.tooltipIcon} title="This is a dummy tooltip for Top vulnerable projects.">?</span>
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
                    <tr>
                      <td>project-gamma</td>
                      <td>
                        <div className={styles.issuesSquares} style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
                          <div className={styles.issuesSquareShaded}>5</div>
                          <div className={styles.issuesSquareSolid}>A</div>
                          <div className={styles.issuesSquareShaded}>1</div>
                          <div className={styles.issuesSquareSolid}>B</div>
                          <div className={styles.issuesSquareShaded}>2</div>
                          <div className={styles.issuesSquareSolid}>C</div>
                        </div>
                      </td>
                      <td>
                        <button className={styles.fixBtn}>Fix vulnerabilities</button>
                      </td>
                    </tr>
                    <tr>
                      <td>project-delta</td>
                      <td>
                        <div className={styles.issuesSquares} style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
                          <div className={styles.issuesSquareShaded}>2</div>
                          <div className={styles.issuesSquareSolid}>A</div>
                          <div className={styles.issuesSquareShaded}>3</div>
                          <div className={styles.issuesSquareSolid}>B</div>
                          <div className={styles.issuesSquareShaded}>1</div>
                          <div className={styles.issuesSquareSolid}>C</div>
                        </div>
                      </td>
                      <td>
                        <button className={styles.fixBtn}>Fix vulnerabilities</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.tasksFooter}>showing 2 of 2</div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
