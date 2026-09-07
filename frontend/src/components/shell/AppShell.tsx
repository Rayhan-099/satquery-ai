"use client";

import { ReactNode } from "react";
import TopBar from "./TopBar";

interface AppShellProps {
  children: ReactNode;
  hasScene: boolean;
  apiStatus: "connected" | "disconnected" | "unknown";
}

export default function AppShell({ children, hasScene, apiStatus }: AppShellProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--color-bg-primary)" }}>
      <TopBar hasScene={hasScene} apiStatus={apiStatus} />
      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
