// Example: reusable alert component
import React from "react";

export interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Alert: React.FC<AlertProps> = ({ type = "info", children, style }) => {
  const colors: Record<string, string> = {
    success: "#d4edda",
    error: "#f8d7da",
    warning: "#fff3cd",
    info: "#d1ecf1"
  };
  const textColors: Record<string, string> = {
    success: "#155724",
    error: "#721c24",
    warning: "#856404",
    info: "#0c5460"
  };
  return (
    <div style={{
      background: colors[type],
      color: textColors[type],
      padding: "0.75rem",
      borderRadius: "6px",
      marginBottom: "1rem",
      ...style
    }}>
      {children}
    </div>
  );
};
