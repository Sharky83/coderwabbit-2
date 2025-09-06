
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import RepoSelector from "../components/RepoSelector";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <Navbar />
      <div style={{ width: "100%", boxSizing: "border-box", padding: "2rem 0 0 0" }}>
        {session ? <RepoSelector /> : null}
      </div>
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
        {/* Main content goes here */}
      </main>
    </>
  );
}