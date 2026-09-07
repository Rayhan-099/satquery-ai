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
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100vh", 
        overflow: "hidden",
        position: "relative"
      }}
    >
      <TopBar hasScene={hasScene} apiStatus={apiStatus} />
      <main 
        className="fade-in"
        style={{ 
          flex: 1, 
          display: "flex", 
          overflow: "hidden",
          position: "relative",
          zIndex: 10
        }}
      >
        {children}
      </main>
    </div>
  );
}
