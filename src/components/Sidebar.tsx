"use client";

import React from "react";
import styles from "./Sidebar.module.css";
import { useSession } from "next-auth/react";


type SidebarProps = {
  onNav?: (section: string) => void;
  showProjectsLink?: boolean;
};

export default function Sidebar({ onNav, showProjectsLink }: SidebarProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  return (
    <aside className={styles.sidebar}>
      <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{userName}</div>
      <hr style={{ margin: "0.5rem 0 1.5rem 0" }} />
      <nav>
        <ul style={{ marginBottom: "1.5rem" }}>
          {showProjectsLink && <li><a href="/projects">Projects</a></li>}
          <li><a href="/repositories">Repositories</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                if (onNav) onNav("integrations");
              }}
            >Integrations</a>
          </li>
          <li><a href="/reports">Reports</a></li>
          <li><a href="/learning">Learning</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><a href="/subscription">Subscription</a></li>
        </ul>
        <hr style={{ margin: "1.5rem 0" }} />
        <ul>
          <li><a href="/docs">Docs</a></li>
          <li><a href="/support">Support</a></li>
        </ul>
      </nav>
    </aside>
  );
}
