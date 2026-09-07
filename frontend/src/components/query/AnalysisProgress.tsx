"use client";

const STAGES = [
  "Interpreting query",
  "Validating scene",
  "Selecting analysis",
  "Running tool",
  "Grounding result",
];

export default function AnalysisProgress() {
  return (
    <div className="surface" style={{ padding: "0.75rem" }}>
      <div className="label-xs" style={{ marginBottom: "0.625rem" }}>
        Analysis in progress
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              className="skeleton"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                animationDelay: `${i * 300}ms`,
              }}
            />
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--color-text-tertiary)",
              }}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>
      <div
        className="skeleton"
        style={{ height: 3, marginTop: "0.75rem", borderRadius: 2 }}
      />
    </div>
  );
}
