import React from "react";
import styles from "./Message.module.css";

export interface ErrorMessageProps {
  children: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => (
  <div className={styles.error}>{children}</div>
);

export interface SuccessMessageProps {
  children: React.ReactNode;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ children }) => (
  <div className={styles.success}>{children}</div>
);
