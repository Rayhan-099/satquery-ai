"use client";

import { ReactNode } from "react";

interface TopBarProps {
  hasScene: boolean;
  apiStatus: "connected" | "disconnected" | "unknown";
}

export default function TopBar({ hasScene, apiStatus }: TopBarProps) {
  const isConnected = apiStatus === "connected";
  const statusColor = isConnected
    ? "var(--color-success)"
    : apiStatus === "disconnected"
    ? "var(--color-error)"
    : "var(--color-text-tertiary)";
    
  const statusText = isConnected ? "ONLINE" : apiStatus === "disconnected" ? "OFFLINE" : "UNKNOWN";

  return (
    <header
      className="fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        height: "3.5rem",
        borderBottom: "1px solid var(--color-border-subtle)",
        background: "rgba(3, 5, 8, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        flexShrink: 0,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        position: "relative",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Subtle application identity mark */}
        <div style={{ 
          width: "16px", height: "16px", 
          borderRadius: "2px", 
          background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-interactive) 100%)",
          boxShadow: "var(--shadow-glow)"
        }} />
        <h1
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: "var(--color-text-primary)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          SATQUERY
          <span
            className="label-xs"
            style={{
              borderLeft: "1px solid var(--color-border-strong)",
              paddingLeft: "0.75rem",
              color: "var(--color-text-secondary)"
            }}
          >
            Geospatial Intelligence
          </span>
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* Environment metadata */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span className="label-xs" style={{ color: "var(--color-text-tertiary)" }}>ENV</span>
          <span className="mono-data" style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>LOCAL / CDSE</span>
          <div style={{ width: "1px", height: "12px", background: "var(--color-border-strong)" }} />
          <span className="label-xs" style={{ color: "var(--color-text-tertiary)" }}>SCENE</span>
          <span className="mono-data" style={{ fontSize: "0.6875rem", color: hasScene ? "var(--color-accent)" : "var(--color-text-secondary)" }}>
            {hasScene ? "READY" : "AWAITING"}
          </span>
        </div>

        {/* API Status Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.6875rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            color: isConnected ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            background: "var(--color-bg-deep)",
            padding: "0.25rem 0.75rem",
            borderRadius: "4px",
            border: "1px solid var(--color-border-default)",
            boxShadow: "var(--shadow-inset-deep)",
          }}
        >
          API
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: statusColor,
              display: "inline-block",
              flexShrink: 0,
              boxShadow: isConnected ? `0 0 8px ${statusColor}` : "none",
            }}
            aria-label={`API ${apiStatus}`}
          />
          <span style={{ color: statusColor, letterSpacing: "0.05em" }}>{statusText}</span>
        </div>
      </div>
    </header>
  );
}
