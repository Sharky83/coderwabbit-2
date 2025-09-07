
"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Home.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <main className={styles.homeContainer}>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : !session ? (
          <>
            <h1 className={styles.title}>Welcome to CoderWabbit</h1>
            <p className={styles.subtitle}>Please sign in to access your dashboard.</p>
            <button className={styles.signInBtn} onClick={() => signIn("github")}>Sign in with GitHub</button>
          </>
        ) : null}
      </main>
      <footer style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
        &copy; {new Date().getFullYear()} CoderWabbit. All rights reserved.<br />
        <span>Site by <a href="https://weworx.io" target="_blank" rel="noopener noreferrer">weworx.io</a></span>
      </footer>
    </>
  );
}