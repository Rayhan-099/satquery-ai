"use client";

export default function EmptyState({
  onOpenWorkspace,
}: {
  onOpenWorkspace: () => void;
}) {
  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "3rem 1.5rem",
        textAlign: "center",
        position: "relative",
        zIndex: 10
      }}
    >
      <div 
        className="surface-elevated slide-up delay-100" 
        style={{ 
          maxWidth: 480, 
          padding: "3rem 2.5rem", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          background: "rgba(10, 15, 28, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--color-border-strong)",
        }}
      >
        <div 
          className="pulse-glow delay-300"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--color-interactive-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            border: "1px solid rgba(14, 165, 233, 0.2)",
            boxShadow: "0 0 20px rgba(14, 165, 233, 0.15) inset"
          }}
        >
          <div style={{ width: 16, height: 16, background: "var(--color-interactive)", borderRadius: "50%" }} />
        </div>
        
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
            margin: "0 0 1rem 0",
            lineHeight: 1.1,
          }}
        >
          Remote sensing,
          <br />
          <span style={{ color: "var(--color-interactive)", background: "linear-gradient(90deg, #38bdf8, #2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>queried naturally.</span>
        </h2>

        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
            margin: "0 0 2.5rem 0",
          }}
        >
          Analyze optical, SAR and geospatial imagery through
          evidence-grounded language. Upload a scene or discover
          Copernicus data to begin analysis.
        </p>

        <button className="btn-primary fade-in delay-200" onClick={onOpenWorkspace} style={{ width: 220, padding: "0.75rem 1rem", fontSize: "0.8125rem" }}>
          Initialize Workspace
        </button>

        <div
          className="fade-in delay-300"
          style={{
            marginTop: "3.5rem",
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
            paddingTop: "2rem",
            borderTop: "1px solid var(--color-border-subtle)"
          }}
        >
          {[
            { label: "Modalities", value: "Optical · SAR" },
            { label: "Analyses", value: "NDVI · NDWI · SAR" },
            { label: "Evidence", value: "Spatial · Statistical" },
          ].map((item, i) => (
            <div key={item.label} style={{ textAlign: "center", animationDelay: `${300 + i * 100}ms` }} className="fade-in">
              <div className="label-xs" style={{ marginBottom: 6, color: "var(--color-text-tertiary)" }}>
                {item.label}
              </div>
              <div
                className="mono-data"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-primary)",
                  fontWeight: 500,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
