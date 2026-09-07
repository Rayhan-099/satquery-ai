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
        background: "transparent", /* Background now controlled by body in globals.css */
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
      
      {/* Subtle ambient lighting layer */}
      <div 
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(20, 27, 45, 0) 0%, rgba(5, 8, 15, 0.5) 100%)",
          zIndex: 1
        }}
      />
    </div>
  );
}
