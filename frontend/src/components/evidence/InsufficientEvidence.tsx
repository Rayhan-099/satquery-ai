"use client";

export default function InsufficientEvidence({
  limitations,
}: {
  limitations: string[];
}) {
  return (
    <div
      className="surface"
      style={{
        padding: "0.75rem",
        borderColor: "rgba(245, 158, 11, 0.2)",
      }}
    >
      <div className="label-sm" style={{ color: "var(--color-warning)", marginBottom: "0.5rem" }}>
        Insufficient Evidence
      </div>

      <p
        style={{
          fontSize: "0.8125rem",
          color: "var(--color-text-secondary)",
          margin: "0 0 0.75rem 0",
          lineHeight: 1.65,
        }}
      >
        SatQuery does not currently have an analysis tool that can reliably
        answer this question from the available scene data.
      </p>

      <div style={{ marginBottom: "0.75rem" }}>
        <div className="label-xs" style={{ marginBottom: "0.375rem" }}>
          Available capabilities
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {["Vegetation analysis (NDVI)", "Water detection (NDWI)", "SAR backscatter (VV/VH)"].map(
            (cap) => (
              <span
                key={cap}
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--color-text-secondary)",
                  paddingLeft: "0.75rem",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  –
                </span>
                {cap}
              </span>
            )
          )}
        </div>
      </div>

      <div className="divider" style={{ marginBottom: "0.5rem" }} />

      <div className="label-xs" style={{ marginBottom: "0.25rem" }}>
        System trace
      </div>
      <code
        className="mono-data"
        style={{
          fontSize: "0.625rem",
          color: "var(--color-text-tertiary)",
          wordBreak: "break-all",
          display: "block",
        }}
      >
        {limitations[0]}
      </code>
    </div>
  );
}
