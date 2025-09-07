"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSession } from "next-auth/react";
import styles from "./Integrations.module.css";

export default function IntegrationsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";
  return (
  <div className={styles.integrationsContainer}>
      <Sidebar />
  <div className={styles.contentContainer}>
        <AppNavbar userEmail={userEmail} page="Integrations" />
        <main className={styles.main}>
          <h2 className={styles.title}>Integrations</h2>
          <div className={styles.integrationRow}>
            {/* Integration Squares */}
            <div className={styles.integrationSquare}>
              <div className={styles.logoCircle}>
                <img src="/globe.svg" alt="CoderWabbit Logo" className={styles.logoIcon} />
              </div>
              <img src="/github.svg" alt="GitHub" className={styles.integrationIcon} />
              <div className={styles.integrationName}>GitHub</div>
              <div className={styles.integrationStatus}>Configured</div>
            </div>
            <div className={styles.integrationSquare}>
              <div className={styles.logoCircle}>
                <img src="/globe.svg" alt="CoderWabbit Logo" className={styles.logoIcon} />
              </div>
              <img src="/gitlab.svg" alt="GitLab" className={styles.integrationIcon} />
              <div className={styles.integrationName}>GitLab</div>
              <div className={styles.integrationStatus}>Upgrade plan to use</div>
            </div>
            <div className={styles.integrationSquare}>
              <div className={styles.logoCircle}>
                <img src="/globe.svg" alt="CoderWabbit Logo" className={styles.logoIcon} />
              </div>
              <img src="/bitbucket.svg" alt="Bitbucket" className={styles.integrationIcon} />
              <div className={styles.integrationName}>Bitbucket</div>
              <div className={styles.integrationStatus}>Upgrade plan to use</div>
            </div>
            <div className={styles.integrationSquare}>
              <div className={styles.logoCircle}>
                <img src="/globe.svg" alt="CoderWabbit Logo" className={styles.logoIcon} />
              </div>
              <img src="/azure.svg" alt="Azure Repos" className={styles.integrationIcon} />
              <div className={styles.integrationName}>Azure Repos</div>
              <div className={styles.integrationStatus}>Upgrade plan to use</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
