
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
          <div className={styles.banner}>
            <h2 className={styles.bannerTitle}>Security is a team sport</h2>
            <p className={styles.bannerDesc}>
              Invite your team members to view and fix the vulnerabilities across your projects
            </p>
          </div>
          <div className={styles.mainGap}>
            {selectedRepos.length === 0 ? (
              <>
                <section className={styles.tasksSection}>
                  <div className={styles.tasksTitleRow}>
                    <h2 className={styles.tasksTitle} style={{ marginRight: '0.5rem' }}>Top pending tasks</h2>
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
                <section className={styles.tasksSection}>
                  <div className={styles.tasksTitleRow}>
                    <h2 className={styles.tasksTitle} style={{ marginRight: '0.5rem' }}>Top vulnerable projects</h2>
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
              </>
            ) : (
              showRepoSelector && <RepoSelector />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
