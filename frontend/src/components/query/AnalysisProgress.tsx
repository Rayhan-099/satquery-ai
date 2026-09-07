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
    <div className="surface-inset fade-in stagger-2" style={{ padding: "1.25rem", border: "1px solid var(--color-border-subtle)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div className="label-xs" style={{ color: "var(--color-accent)", letterSpacing: "0.1em" }}>
          SYSTEM ACTIVE: ANALYZING
        </div>
        <div className="pulse-glow" style={{ width: 6, height: 6, background: "var(--color-accent)", borderRadius: "50%" }} />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            className="fade-in slide-right"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              animationDelay: `${i * 300}ms`,
            }}
          >
            <div
              className="skeleton"
              style={{
                width: 4,
                height: 12,
                borderRadius: 1,
                flexShrink: 0,
                background: "var(--color-accent-muted)"
              }}
            />
            <span
              className="mono-data"
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase"
              }}
            >
              {`0${i + 1} `} {stage}
            </span>
          </div>
        ))}
      </div>
      <div
        className="skeleton"
        style={{ height: 1, marginTop: "1.25rem", background: "linear-gradient(90deg, var(--color-accent) 0%, transparent 100%)" }}
      />
    </div>
  );
}
