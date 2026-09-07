"use client";

import type { Scene, BandMetadata } from "@/lib/types";

interface SceneMetadataProps {
  scene: Scene;
}

export default function SceneMetadata({ scene }: SceneMetadataProps) {
  let bounds = null;
  let bands: BandMetadata[] = [];

  try {
    if (scene.bounds) bounds = JSON.parse(scene.bounds);
  } catch {}

  try {
    if (scene.bands_metadata) {
      bands = typeof scene.bands_metadata === "string" 
        ? JSON.parse(scene.bands_metadata as unknown as string) 
        : scene.bands_metadata;
    }
  } catch {}

  let provenance: Record<string, any> | null = null;
  try {
    if (scene.provenance) {
      provenance = typeof scene.provenance === "string"
        ? JSON.parse(scene.provenance as unknown as string)
        : scene.provenance;
    }
  } catch {}

  return (
    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div className="fade-in stagger-1" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <span className="label-xs">ACTIVE SCENE</span>
        <span className="mono-data stat-value highlight" style={{ fontSize: "1.25rem" }}>
          {scene.id.replace("scene_", "SCN-")}
        </span>
      </div>

      <div className="divider fade-in stagger-1" />

      {/* Grid Data */}
      <div className="fade-in stagger-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div>
          <span className="label-xs" style={{ display: "block", marginBottom: "0.25rem" }}>SENSOR</span>
          <span className="mono-data">{!scene.sensor || scene.sensor === "unknown" ? "MULTISPECTRAL" : scene.sensor.toUpperCase()}</span>
        </div>
        <div>
          <span className="label-xs" style={{ display: "block", marginBottom: "0.25rem" }}>CRS</span>
          <span className="mono-data">{scene.crs}</span>
        </div>
        <div>
          <span className="label-xs" style={{ display: "block", marginBottom: "0.25rem" }}>DIMENSIONS</span>
          <span className="mono-data">{scene.width} × {scene.height} px</span>
        </div>
        <div>
          <span className="label-xs" style={{ display: "block", marginBottom: "0.25rem" }}>BANDS</span>
          <span className="mono-data">{bands.length}</span>
        </div>
      </div>

      {/* Bands */}
      {bands.length > 0 && (
        <div className="fade-in stagger-3">
          <span className="label-xs" style={{ display: "block", marginBottom: "0.5rem" }}>BAND SEMANTICS</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {bands.map((b) => (
              <span key={b.index} className="badge badge-info" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
                B{b.index} {b.description}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Spatial Extent */}
      {bounds && (
        <div className="fade-in stagger-4">
          <span className="label-xs" style={{ display: "block", marginBottom: "0.5rem" }}>SPATIAL EXTENT</span>
          <div className="surface-inset" style={{ padding: "0.75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <div>
              <div style={{ fontSize: "0.625rem", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>SW</div>
              <div className="mono-data" style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                {bounds.left.toFixed(4)}, {bounds.bottom.toFixed(4)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.625rem", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>NE</div>
              <div className="mono-data" style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                {bounds.right.toFixed(4)}, {bounds.top.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provenance */}
      <div className="fade-in stagger-5">
        <span className="label-xs" style={{ display: "block", marginBottom: "0.5rem" }}>PROVENANCE</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-success">{scene.source_type}</span>
        </div>
        {provenance?.description && (
          <p className="mono-data" style={{ fontSize: "0.6875rem", color: "var(--color-text-tertiary)", marginTop: "0.5rem", marginBottom: 0 }}>
            {provenance.description}
          </p>
        )}
      </div>
    </div>
  );
}
