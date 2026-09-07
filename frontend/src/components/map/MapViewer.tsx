"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

interface MapViewerProps {
  bounds: { left: number; bottom: number; right: number; top: number } | null;
  evidenceOverlay: string | null;
}

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-primary)",
      }}
    >
      <div className="skeleton" style={{ width: 200, height: 12 }} />
    </div>
  ),
});

export default function MapViewer({ bounds, evidenceOverlay }: MapViewerProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {bounds ? (
        <MapContent bounds={bounds} evidenceOverlay={evidenceOverlay} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-bg-primary)",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.03em",
            }}
          >
            Awaiting scene data
          </span>
          <span
            style={{
              fontSize: "0.625rem",
              color: "var(--color-text-tertiary)",
              opacity: 0.5,
            }}
          >
            Upload or discover a scene to display the map
          </span>
        </div>
      )}

      {/* Coordinates indicator */}
      {bounds && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            zIndex: 1000,
            padding: "0.25rem 0.5rem",
            background: "rgba(10, 14, 23, 0.85)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border-default)",
          }}
        >
          <span className="mono-data" style={{ fontSize: "0.5625rem", color: "var(--color-text-tertiary)" }}>
            {bounds.left.toFixed(4)}, {bounds.bottom.toFixed(4)} → {bounds.right.toFixed(4)}, {bounds.top.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
