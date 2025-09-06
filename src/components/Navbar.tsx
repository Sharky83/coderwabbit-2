import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import styles from "./Navbar.module.css";
// Simple GitHub SVG logo
const GitHubLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#fff" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.167 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.833.091-.646.35-1.088.636-1.339-2.221-.253-4.555-1.111-4.555-4.945 0-1.092.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.594 1.028 2.686 0 3.842-2.337 4.688-4.566 4.938.359.309.678.92.678 1.855 0 1.339-.012 2.421-.012 2.751 0 .268.18.579.688.481C19.135 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#222" />
  </svg>
);

export default function Navbar() {
  const { data: session } = useSession();
  const isSignedIn = !!session;
  const avatarUrl = session?.user?.image;

  // Store accessToken in sessionStorage when it changes
  useEffect(() => {
    if (session?.accessToken) {
      sessionStorage.setItem("accessToken", session.accessToken);
    } else {
      sessionStorage.removeItem("accessToken");
    }
  }, [session?.accessToken]);

  return (
    <nav className={styles.navbar}>
      <span className={styles.brand}>CoderWabbit</span>
      <div className={styles.actions}>
        {isSignedIn && session?.user?.name && (
          <span className={styles.user}>Signed in as {session.user.name}</span>
        )}
        <button
          className={`${styles.button} ${isSignedIn ? styles.buttonSignedIn : ''}`}
          onClick={() => (isSignedIn ? signOut() : signIn("github"))}
          aria-label={isSignedIn ? "Sign out" : "Sign in with GitHub"}
          title={isSignedIn ? "Sign out" : "Sign in with GitHub"}
        >
          {isSignedIn && avatarUrl ? (
            <img src={avatarUrl} alt="User avatar" className={styles.avatar} />
          ) : (
            <GitHubLogo />
          )}
        </button>
        <style jsx>{`
          @media (min-width: 600px) {
            .navbar-signin-text {
              display: inline;
            }
          }
        `}</style>
      </div>
    </nav>
  );
}
