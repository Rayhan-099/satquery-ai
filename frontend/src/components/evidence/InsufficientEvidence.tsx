"use client";

export default function InsufficientEvidence({
  limitations,
}: {
  limitations: string[];
}) {
  return (
    <div
      className="surface slide-up delay-200"
      style={{
        padding: "1.25rem",
        borderColor: "rgba(245, 158, 11, 0.4)",
        boxShadow: "0 0 20px rgba(245, 158, 11, 0.1), inset 0 0 0 1px rgba(245, 158, 11, 0.1)",
      }}
    >
      <div className="label-sm" style={{ color: "var(--color-warning)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: 6, height: 6, background: "var(--color-warning)", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px var(--color-warning)" }} />
        <span>Insufficient Evidence</span>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-primary)",
          margin: "0 0 1rem 0",
          lineHeight: 1.65,
        }}
      >
        SatQuery does not currently have an analysis tool that can reliably
        answer this question from the available scene data.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <div className="label-xs" style={{ marginBottom: "0.5rem", color: "var(--color-text-secondary)" }}>
          Available capabilities
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {["Vegetation analysis (NDVI)", "Water detection (NDWI)", "SAR backscatter (VV/VH)"].map(
            (cap, i) => (
              <span
                key={cap}
                className="fade-in"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary)",
                  paddingLeft: "1rem",
                  position: "relative",
                  animationDelay: `${300 + i * 100}ms`
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--color-warning)",
                  }}
                >
                  ›
                </span>
                {cap}
              </span>
            )
          )}
        </div>
      </div>

      <div className="divider" style={{ marginBottom: "0.75rem" }} />

      <div className="label-xs" style={{ marginBottom: "0.5rem", color: "var(--color-text-tertiary)" }}>
        System trace
      </div>
      <code
        className="mono-data fade-in delay-500"
        style={{
          fontSize: "0.6875rem",
          color: "var(--color-warning)",
          wordBreak: "break-all",
          display: "block",
          background: "rgba(0,0,0,0.2)",
          padding: "0.5rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(245, 158, 11, 0.2)"
        }}
      >
        {limitations[0]}
      </code>
    </div>
  );
}
