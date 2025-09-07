import React from "react";
import styles from "./AppNavbar.module.css";

interface AppNavbarProps {
  userEmail: string;
  page: string;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ userEmail, page }) => (
  <nav className={styles.topNav}>
    <div className={styles.breadcrumbs}>
      <nav aria-label="breadcrumb">
        <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ color: "#0070f3", fontWeight: 500 }}>{userEmail}</li>
          <li>&gt;</li>
          <li style={{ color: "#222", fontWeight: 500 }}>{page}</li>
        </ol>
      </nav>
    </div>
    <div className={styles.navActions}>
      <button
        className={styles.importLogBtn}
        onClick={() => alert('Show import log (implement logic here)')}
      >
        View Import Log
      </button>
      <button
        className={styles.addRepoNavBtn}
        onClick={() => window.open("https://github.com/apps/codewabbit", "_blank")}
      >
        Add Repo
      </button>
    </div>
  </nav>
);

export default AppNavbar;
