"use client";

import { useState, useRef } from "react";
import type { Scene, DiscoveryResult } from "@/lib/types";
import { uploadScene, searchDiscovery, ingestDiscovery } from "@/lib/api";
import SceneMetadata from "./SceneMetadata";
import ErrorState from "../system/ErrorState";

interface ScenePanelProps {
  scene: Scene | null;
  onSceneLoaded: (scene: Scene) => void;
}

export default function ScenePanel({ scene, onSceneLoaded }: ScenePanelProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "discovery">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Discovery state
  const [bbox, setBbox] = useState("12.45, 41.89, 12.55, 41.95");
  const [startDate, setStartDate] = useState("2023-08-01T00:00:00Z");
  const [endDate, setEndDate] = useState("2023-08-10T23:59:59Z");
  const [sensor, setSensor] = useState("sentinel-2");
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [ingestingId, setIngestingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const result = await uploadScene(file);
      onSceneLoaded(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setError("");
    setDiscoveryResults([]);
    try {
      const bboxArray = bbox.split(",").map((s) => parseFloat(s.trim()));
      const result = await searchDiscovery({
        bbox: bboxArray,
        start_date: startDate,
        end_date: endDate,
        sensor,
        max_cloud_cover: 20.0,
        max_results: 5,
      });
      setDiscoveryResults(result.results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleIngest = async (productId: string, sceneSensor: string) => {
    setIngestingId(productId);
    setError("");
    try {
      const result = await ingestDiscovery(productId, sceneSensor);
      onSceneLoaded(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ingestion failed");
    } finally {
      setIngestingId(null);
    }
  };

  return (
    <div className="surface" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Tab Header */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-default)", flexShrink: 0 }}>
        {(["upload", "discovery"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "0.625rem 0",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid var(--color-interactive)" : "2px solid transparent",
              color: activeTab === tab ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color var(--transition-fast)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {tab === "upload" ? "Local Upload" : "CDSE Discovery"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "0.75rem" }}>
        {error && (
          <div style={{ marginBottom: "0.75rem" }}>
            <ErrorState message={error} onDismiss={() => setError("")} />
          </div>
        )}

        {activeTab === "upload" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "1px dashed var(--color-border-strong)",
                padding: "1.5rem 1rem",
                textAlign: "center",
                cursor: "pointer",
                background: "var(--color-bg-primary)",
                borderRadius: "var(--radius-sm)",
                transition: "border-color var(--transition-fast)",
              }}
              role="button"
              tabIndex={0}
              aria-label="Select GeoTIFF file to upload"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".tif,.tiff"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", margin: 0, wordBreak: "break-all" }}>
                {file ? file.name : "Select GeoTIFF (.tif)"}
              </p>
            </div>

            <button className="btn-primary" onClick={handleUpload} disabled={!file || loading} style={{ width: "100%" }}>
              {loading ? "Processing…" : "Extract Metadata"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <div>
              <label className="label-xs" htmlFor="bbox-input" style={{ display: "block", marginBottom: 4 }}>Bounding Box</label>
              <input id="bbox-input" type="text" value={bbox} onChange={(e) => setBbox(e.target.value)} className="input-field" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label className="label-xs" htmlFor="start-date" style={{ display: "block", marginBottom: 4 }}>Start</label>
                <input id="start-date" type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label-xs" htmlFor="end-date" style={{ display: "block", marginBottom: 4 }}>End</label>
                <input id="end-date" type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label-xs" htmlFor="sensor-select" style={{ display: "block", marginBottom: 4 }}>Sensor</label>
              <select id="sensor-select" value={sensor} onChange={(e) => setSensor(e.target.value)} className="input-field">
                <option value="sentinel-2">Sentinel-2 (Optical)</option>
                <option value="sentinel-1">Sentinel-1 (SAR)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={searching} style={{ width: "100%" }}>
              {searching ? "Searching…" : "Search CDSE"}
            </button>

            {/* Discovery Results */}
            {discoveryResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                {discoveryResults.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      padding: "0.625rem",
                      background: "var(--color-bg-primary)",
                      border: "1px solid var(--color-border-default)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <div style={{ fontSize: "0.6875rem", color: "var(--color-text-primary)", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.4 }}>
                      {res.name}
                    </div>
                    <div style={{ fontSize: "0.625rem", color: "var(--color-text-tertiary)", marginTop: 2 }}>
                      {new Date(res.acquisition_time).toLocaleDateString()} · {res.sensor}
                    </div>
                    <button
                      onClick={() => handleIngest(res.id, res.sensor)}
                      disabled={ingestingId !== null}
                      className="btn-primary"
                      style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.625rem" }}
                    >
                      {ingestingId === res.id ? "Ingesting…" : "Ingest"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Scene Metadata (shown when scene is loaded) */}
      {scene && (
        <div style={{ borderTop: "1px solid var(--color-border-default)", overflow: "auto", flexShrink: 0, maxHeight: "50%" }}>
          <SceneMetadata scene={scene} />
        </div>
      )}
    </div>
  );
}
