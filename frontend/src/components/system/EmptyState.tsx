"use client";

export default function EmptyState({
  onOpenWorkspace,
}: {
  onOpenWorkspace: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            margin: "0 0 0.5rem 0",
            lineHeight: 1.2,
          }}
        >
          Remote sensing,
          <br />
          queried naturally.
        </h2>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.65,
            margin: "0 0 2rem 0",
          }}
        >
          Analyze optical, SAR and geospatial imagery through
          evidence-grounded language. Upload a scene or discover
          Copernicus data to begin analysis.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
            alignItems: "center",
          }}
        >
          <button className="btn-primary" onClick={onOpenWorkspace} style={{ width: 200 }}>
            Open Workspace
          </button>
        </div>

        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Modalities", value: "Optical · SAR" },
            { label: "Analyses", value: "NDVI · NDWI · SAR" },
            { label: "Evidence", value: "Spatial · Statistical" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div className="label-xs" style={{ marginBottom: 4 }}>
                {item.label}
              </div>
              <div
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
