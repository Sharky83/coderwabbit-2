import React from "react";
import { Alert } from "./common/Alert";
import styles from "./RepoStatus.module.css";

export interface RepoStatusProps {
  loading: boolean;
  error: string;
  status: string;
}

export const RepoStatus: React.FC<RepoStatusProps> = ({ loading, error, status }) => (
  <>
    {loading && <div>Loading...</div>}
    {error && <Alert type="error">{error}</Alert>}
    {status && !error && (
      <div className={styles.status}>{status}</div>
    )}
  </>
);
