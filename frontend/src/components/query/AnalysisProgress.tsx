"use client";

const STAGES = [
  "Interpreting natural language intent...",
  "Validating scene modality...",
  "Selecting analytical tool...",
  "Running scientific computation...",
  "Grounding spatial evidence...",
];

export default function AnalysisProgress() {
  return (
    <div className="surface slide-up" style={{ padding: "1.25rem", border: "1px solid var(--color-interactive)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div className="label-xs" style={{ color: "var(--color-interactive)", letterSpacing: "0.1em" }}>
          ANALYSIS IN PROGRESS
        </div>
        <div className="pulse-glow" style={{ width: 6, height: 6, background: "var(--color-interactive)", borderRadius: "50%" }} />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            className="fade-in"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              animationDelay: `${i * 400}ms`,
            }}
          >
            <div
              className="skeleton"
              style={{
                width: 4,
                height: 12,
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <span
              className="mono-data"
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
              }}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>
      <div
        className="skeleton"
        style={{ height: 2, marginTop: "1.25rem", borderRadius: 2, background: "linear-gradient(90deg, var(--color-interactive) 0%, transparent 100%)" }}
      />
    </div>
  );
}
