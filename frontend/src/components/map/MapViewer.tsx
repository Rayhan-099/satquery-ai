"use client";

import dynamic from "next/dynamic";

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
      <div className="skeleton" style={{ width: 200, height: 12, borderRadius: "4px" }} />
    </div>
  ),
});

export default function MapViewer({ bounds, evidenceOverlay }: MapViewerProps) {
  return (
    <div className="fade-in" style={{ width: "100%", height: "100%", position: "relative" }}>
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
            gap: "0.75rem",
          }}
        >
          <span
            className="mono-data"
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.05em",
            }}
          >
            AWAITING SCENE DATA
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              opacity: 0.7,
            }}
          >
            Upload or discover a scene to initialize map
          </span>
        </div>
      )}

      {/* Frame Inset Shadow to blend map seamlessly */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none",
        boxShadow: "inset 0 0 30px rgba(5, 8, 15, 0.8)",
        zIndex: 400
      }} />

      {/* Coordinates indicator */}
      {bounds && (
        <div
          className="fade-in slide-up delay-200"
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            zIndex: 1000,
            padding: "0.375rem 0.75rem",
            background: "rgba(5, 8, 15, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border-subtle)",
            boxShadow: "var(--shadow-surface)"
          }}
        >
          <span className="mono-data" style={{ fontSize: "0.625rem", color: "var(--color-accent)" }}>
            {bounds.left.toFixed(4)}, {bounds.bottom.toFixed(4)} 
            <span style={{ color: "var(--color-text-tertiary)", margin: "0 4px" }}>→</span> 
            {bounds.right.toFixed(4)}, {bounds.top.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
