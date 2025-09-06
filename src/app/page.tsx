
"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
// ...existing code...

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
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          padding: "1rem",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {status === "loading" ? (
          <p>Loading...</p>
        ) : !session ? (
          <>
            <h1>Welcome to CoderWabbit</h1>
            <p>Please sign in to access your dashboard.</p>
            <button onClick={() => signIn("github")}>Sign in with GitHub</button>
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