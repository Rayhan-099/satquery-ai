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
    <div className="fade-in" style={{ 
      width: "100%", 
      height: "100%", 
      position: "relative",
      background: "var(--color-bg-deep)",
      overflow: "hidden",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-inset-deep)"
    }}>
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
            background: "radial-gradient(circle at center, var(--color-bg-surface) 0%, var(--color-bg-deep) 100%)",
            gap: "1rem",
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            border: "1px dashed var(--color-border-strong)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5
          }}>
            <div style={{ width: "4px", height: "4px", background: "var(--color-text-tertiary)", borderRadius: "50%" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <span
              className="label-sm"
              style={{
                display: "block",
                color: "var(--color-text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              NO ACTIVE SCENE
            </span>
            <span
              className="mono-data"
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-tertiary)",
              }}
            >
              WAITING FOR GEOSPATIAL INPUT
            </span>
          </div>
        </div>
      )}

      {/* Frame Inset Shadow to blend map seamlessly */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none",
        boxShadow: evidenceOverlay 
          ? "inset 0 0 50px rgba(45, 212, 191, 0.1), inset 0 0 0 1px var(--color-accent-muted)"
          : "inset 0 0 40px rgba(3, 5, 8, 0.9)",
        transition: "box-shadow var(--transition-slow)",
        zIndex: 400
      }} />

      {/* Active Evidence Focus Frame */}
      {evidenceOverlay && (
        <div style={{
          position: "absolute",
          top: "1rem", left: "1rem", right: "1rem", bottom: "1rem",
          pointerEvents: "none",
          border: "1px solid var(--color-accent-muted)",
          zIndex: 401
        }}>
          {/* Corner brackets */}
          <div style={{ position: "absolute", top: -1, left: -1, width: 16, height: 16, borderTop: "2px solid var(--color-accent)", borderLeft: "2px solid var(--color-accent)" }} />
          <div style={{ position: "absolute", top: -1, right: -1, width: 16, height: 16, borderTop: "2px solid var(--color-accent)", borderRight: "2px solid var(--color-accent)" }} />
          <div style={{ position: "absolute", bottom: -1, left: -1, width: 16, height: 16, borderBottom: "2px solid var(--color-accent)", borderLeft: "2px solid var(--color-accent)" }} />
          <div style={{ position: "absolute", bottom: -1, right: -1, width: 16, height: 16, borderBottom: "2px solid var(--color-accent)", borderRight: "2px solid var(--color-accent)" }} />
          
          <div className="badge badge-accent fade-in" style={{ position: "absolute", top: -8, left: 24, background: "var(--color-bg-deep)" }}>
            ACTIVE ANALYSIS
          </div>
        </div>
      )}

      {/* Coordinates indicator */}
      {bounds && (
        <div
          className="fade-in stagger-2"
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            zIndex: 1000,
            padding: "0.5rem 0.875rem",
            background: "rgba(3, 5, 8, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border-subtle)",
            borderTop: "1px solid var(--color-border-default)",
            boxShadow: "var(--shadow-surface)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-accent)", boxShadow: "var(--shadow-glow)" }} />
          <span className="mono-data" style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>
            {bounds.left.toFixed(4)}, {bounds.bottom.toFixed(4)} 
            <span style={{ color: "var(--color-text-tertiary)", margin: "0 0.5rem" }}>/</span> 
            {bounds.right.toFixed(4)}, {bounds.top.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
