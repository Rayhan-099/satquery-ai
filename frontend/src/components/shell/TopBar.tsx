"use client";

import { ReactNode } from "react";

interface TopBarProps {
  hasScene: boolean;
  apiStatus: "connected" | "disconnected" | "unknown";
}

export default function TopBar({ hasScene, apiStatus }: TopBarProps) {
  const statusColor =
    apiStatus === "connected"
      ? "var(--color-success)"
      : apiStatus === "disconnected"
      ? "var(--color-error)"
      : "var(--color-text-tertiary)";

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.25rem",
        height: "3rem",
        borderBottom: "1px solid var(--color-border-default)",
        background: "var(--color-bg-secondary)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <h1
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          SATQUERY AI
        </h1>
        <span
          style={{
            fontSize: "0.625rem",
            color: "var(--color-text-tertiary)",
            letterSpacing: "0.04em",
            fontWeight: 500,
          }}
        >
          SIH26167
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.6875rem",
            color: "var(--color-text-tertiary)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: statusColor,
              display: "inline-block",
              flexShrink: 0,
            }}
            aria-label={`API ${apiStatus}`}
          />
          API
        </div>
      </div>
    </header>
  );
}
