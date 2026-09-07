"use client";

import type { Scene } from "@/lib/types";

interface ProvenanceBadgeProps {
  sourceType: string | null;
}

export function ProvenanceBadge({ sourceType }: ProvenanceBadgeProps) {
  const type = sourceType || "UNKNOWN";
  let badgeClass = "badge badge-info";

  if (type === "SYNTHETIC_FIXTURE") badgeClass = "badge badge-warning";
  else if (type === "REAL_COPERNICUS") badgeClass = "badge badge-success";
  else if (type === "LOCAL_UPLOAD") badgeClass = "badge badge-info";

  return <span className={badgeClass} style={{ boxShadow: "0 0 10px currentColor inset", animation: "fadeIn 0.5s ease" }}>{type}</span>;
}

interface SceneMetadataProps {
  scene: Scene;
}

export default function SceneMetadata({ scene }: SceneMetadataProps) {
  let parsedBounds: { left: number; bottom: number; right: number; top: number } | null = null;
  try {
    if (scene.bounds) parsedBounds = JSON.parse(scene.bounds);
  } catch {}

  return (
    <div className="fade-in" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="mono-data" style={{ color: "var(--color-text-primary)", fontWeight: 600, fontSize: "0.875rem" }}>
          {scene.id}
        </span>
        <ProvenanceBadge sourceType={scene.source_type} />
      </div>

      <div className="divider" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <MetaItem label="Sensor" value={scene.sensor || "unknown"} delay="100ms" />
        <MetaItem label="CRS" value={scene.crs || "unknown"} delay="150ms" />
        <MetaItem label="Dimensions" value={scene.width && scene.height ? `${scene.width} × ${scene.height}` : "—"} delay="200ms" />
        <MetaItem label="Bands" value={scene.bands_metadata ? String(scene.bands_metadata.length) : "—"} delay="250ms" />
      </div>

      {scene.bands_metadata && scene.bands_metadata.length > 0 && (
        <>
          <div className="divider" />
          <div className="fade-in delay-200">
            <div className="label-xs" style={{ marginBottom: 6 }}>Band Semantics</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {scene.bands_metadata.map((b) => (
                <span
                  key={b.index}
                  className="surface"
                  style={{
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-mono)",
                    padding: "0.125rem 0.5rem",
                    color: "var(--color-accent)",
                    border: "1px solid var(--color-border-strong)",
                  }}
                >
                  B{b.index}: <span style={{ color: "var(--color-text-secondary)" }}>{b.description || b.color_interpretation || "unknown"}</span>
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {parsedBounds && (
        <>
          <div className="divider" />
          <div className="fade-in delay-300">
            <div className="label-xs" style={{ marginBottom: 6 }}>Spatial Bounds</div>
            <code
              className="mono-data surface"
              style={{
                display: "block",
                fontSize: "0.75rem",
                padding: "0.5rem 0.75rem",
                color: "var(--color-text-primary)",
                wordBreak: "break-all",
                lineHeight: 1.6,
                border: "1px solid var(--color-border-strong)",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}>SW</span> {parsedBounds.left.toFixed(4)}, {parsedBounds.bottom.toFixed(4)}
              <br/>
              <span style={{ color: "var(--color-accent)" }}>NE</span> {parsedBounds.right.toFixed(4)}, {parsedBounds.top.toFixed(4)}
            </code>
          </div>
        </>
      )}

      {scene.provenance && typeof scene.provenance === "object" && !!(scene.provenance as Record<string, unknown>).description && (
        <>
          <div className="divider" />
          <p className="fade-in delay-300" style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
            {String((scene.provenance as Record<string, string>).description)}
          </p>
        </>
      )}
    </div>
  );
}

function MetaItem({ label, value, delay }: { label: string; value: string; delay: string }) {
  return (
    <div className="fade-in" style={{ animationDelay: delay }}>
      <div className="label-xs">{label}</div>
      <div className="mono-data" style={{ fontSize: "0.8125rem", marginTop: "2px", color: "var(--color-text-primary)" }}>{value}</div>
    </div>
  );
}
