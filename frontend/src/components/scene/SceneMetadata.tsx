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

  return <span className={badgeClass}>{type}</span>;
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
    <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="label-sm" style={{ color: "var(--color-text-primary)" }}>
          {scene.id}
        </span>
        <ProvenanceBadge sourceType={scene.source_type} />
      </div>

      <div className="divider" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <MetaItem label="Sensor" value={scene.sensor || "unknown"} />
        <MetaItem label="CRS" value={scene.crs || "unknown"} />
        <MetaItem label="Dimensions" value={scene.width && scene.height ? `${scene.width} × ${scene.height}` : "—"} />
        <MetaItem label="Bands" value={scene.bands_metadata ? String(scene.bands_metadata.length) : "—"} />
      </div>

      {scene.bands_metadata && scene.bands_metadata.length > 0 && (
        <>
          <div className="divider" />
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>Band Semantics</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
              {scene.bands_metadata.map((b) => (
                <span
                  key={b.index}
                  style={{
                    fontSize: "0.625rem",
                    fontFamily: "var(--font-mono)",
                    padding: "0.125rem 0.375rem",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-default)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  B{b.index}: {b.description || b.color_interpretation || "unknown"}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {parsedBounds && (
        <>
          <div className="divider" />
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>Spatial Bounds</div>
            <code
              className="mono-data"
              style={{
                display: "block",
                fontSize: "0.6875rem",
                padding: "0.375rem 0.5rem",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border-default)",
                borderRadius: "var(--radius-sm)",
                wordBreak: "break-all",
                lineHeight: 1.6,
              }}
            >
              {parsedBounds.left.toFixed(4)}, {parsedBounds.bottom.toFixed(4)}
              {" → "}
              {parsedBounds.right.toFixed(4)}, {parsedBounds.top.toFixed(4)}
            </code>
          </div>
        </>
      )}

      {scene.provenance && typeof scene.provenance === "object" && !!(scene.provenance as Record<string, unknown>).description && (
        <>
          <div className="divider" />
          <p style={{ fontSize: "0.6875rem", color: "var(--color-text-tertiary)", margin: 0, lineHeight: 1.5 }}>
            {String((scene.provenance as Record<string, string>).description)}
          </p>
        </>
      )}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label-xs">{label}</div>
      <div className="mono-data" style={{ fontSize: "0.75rem" }}>{value}</div>
    </div>
  );
}
