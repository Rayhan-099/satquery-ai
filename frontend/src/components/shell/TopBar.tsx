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
      className="fade-in delay-100"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        height: "3.5rem",
        borderBottom: "1px solid var(--color-border-subtle)",
        background: "rgba(10, 15, 28, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        flexShrink: 0,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        position: "relative",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          SATQUERY AI
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.05em",
              fontWeight: 500,
              borderLeft: "1px solid var(--color-border-strong)",
              paddingLeft: "0.75rem",
            }}
          >
            Interactive Remote Sensing Intelligence
          </span>
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <span
          className="mono-data"
          style={{
            fontSize: "0.6875rem",
            color: "var(--color-text-secondary)",
            letterSpacing: "0.04em",
          }}
        >
          SIH26167
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.6875rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            color: isConnected ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            background: "rgba(0,0,0,0.2)",
            padding: "0.25rem 0.75rem",
            borderRadius: "12px",
            border: "1px solid var(--color-border-default)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
          }}
        >
          API
          <span
            className={isConnected ? "pulse-glow" : ""}
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
