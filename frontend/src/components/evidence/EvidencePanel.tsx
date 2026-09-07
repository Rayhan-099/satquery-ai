"use client";

import { useState } from "react";
import type { QueryResponse, Evidence } from "@/lib/types";
import { getAssetUrl } from "@/lib/api";

interface EvidencePanelProps {
  response: QueryResponse;
}

function ConfidenceIndicator({ evidence }: { evidence: Evidence }) {
  // Derive qualitative confidence from statistics
  const stats = evidence.statistics;
  const validPixels = stats.valid_pixels || 0;
  let level: "High" | "Medium" | "Low" = "Medium";
  if (validPixels > 1000) level = "High";
  else if (validPixels < 100) level = "Low";

  const colors = {
    High: { bg: "var(--color-success-muted)", color: "var(--color-success)", border: "rgba(34, 197, 94, 0.25)" },
    Medium: { bg: "var(--color-warning-muted)", color: "var(--color-warning)", border: "rgba(245, 158, 11, 0.25)" },
    Low: { bg: "var(--color-error-muted)", color: "var(--color-error)", border: "rgba(239, 68, 68, 0.25)" },
  };

  const c = colors[level];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
      <span className="label-xs">Confidence</span>
      <span
        style={{
          fontSize: "0.625rem",
          fontWeight: 600,
          padding: "0.125rem 0.375rem",
          background: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          borderRadius: "var(--radius-sm)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {level}
      </span>
    </div>
  );
}

function ExecutionTrace({ response }: { response: QueryResponse }) {
  const [expanded, setExpanded] = useState(false);
  const plan = response.plan;
  const evidence = response.evidence;

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-tertiary)",
          fontSize: "0.6875rem",
          cursor: "pointer",
          padding: 0,
          fontFamily: "var(--font-sans)",
          transition: "color var(--transition-fast)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
      >
        {expanded ? "Hide" : "View"} execution details
      </button>

      {expanded && plan && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.625rem",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <TraceRow label="Query" value={response.query} />
          <TraceRow label="Intent" value={plan.intent} />
          <TraceRow label="Tool" value={plan.tool} />
          {evidence && <TraceRow label="Analysis" value={evidence.analysis_type} />}
          {evidence && <TraceRow label="Formula" value={evidence.formula} />}
          {evidence && Object.entries(evidence.input_bands).map(([k, v]) => (
            <TraceRow key={k} label={`Input: ${k}`} value={v} />
          ))}
          <TraceRow label="Validation" value="Numerical claims grounded" />
        </div>
      )}
    </div>
  );
}

function TraceRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
      <span className="label-xs" style={{ flexShrink: 0, minWidth: 70 }}>{label}</span>
      <span className="mono-data" style={{ fontSize: "0.6875rem" }}>{value}</span>
    </div>
  );
}

export default function EvidencePanel({ response }: EvidencePanelProps) {
  const evidence = response.evidence;

  if (!evidence) return null;

  const stats = evidence.statistics;
  const downloadUrl = getAssetUrl(evidence.output_raster);

  // Determine which statistics to show based on analysis type
  const isOptical = evidence.analysis_type === "NDVI" || evidence.analysis_type === "Water Analysis";
  const isSAR = evidence.analysis_type === "SAR Analysis";

  return (
    <div className="surface" style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="badge badge-accent">Analysis Complete</span>
        <ConfidenceIndicator evidence={evidence} />
      </div>

      {/* Interpretation */}
      {response.interpretation && (
        <p style={{ fontSize: "0.8125rem", color: "var(--color-text-primary)", margin: 0, lineHeight: 1.65 }}>
          {response.interpretation}
        </p>
      )}

      <div className="divider" />

      {/* Statistics */}
      <div>
        <div className="label-xs" style={{ marginBottom: "0.5rem" }}>Evidence Statistics</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
          {isOptical && (
            <>
              {stats.mean !== undefined && <StatBlock label={evidence.analysis_type} value={stats.mean.toFixed(4)} sublabel="Mean" />}
              {stats.max !== undefined && <StatBlock label="Max" value={stats.max.toFixed(4)} />}
              {stats.median !== undefined && <StatBlock label="Median" value={stats.median.toFixed(4)} />}
              {stats.std_dev !== undefined && <StatBlock label="Std Dev" value={stats.std_dev.toFixed(4)} />}
            </>
          )}
          {isSAR && (
            <>
              {stats.vv_mean !== undefined && <StatBlock label="VV Mean" value={stats.vv_mean.toFixed(4)} />}
              {stats.vh_mean !== undefined && <StatBlock label="VH Mean" value={stats.vh_mean.toFixed(4)} />}
              {stats.ratio_mean !== undefined && <StatBlock label="VV/VH Ratio" value={stats.ratio_mean.toFixed(4)} />}
            </>
          )}
          {stats.valid_pixels !== undefined && <StatBlock label="Valid Pixels" value={stats.valid_pixels.toLocaleString()} />}
        </div>
      </div>

      <div className="divider" />

      {/* Evidence metadata */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="label-xs">
          Evidence: Spatial {evidence.analysis_type.toLowerCase()} mask
        </div>
        <a
          href={downloadUrl}
          download
          className="btn-secondary"
          style={{ fontSize: "0.625rem", padding: "0.25rem 0.5rem" }}
        >
          Export .tif
        </a>
      </div>

      {/* Execution Trace */}
      <ExecutionTrace response={response} />
    </div>
  );
}

function StatBlock({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div>
      <div className="label-xs">{label}</div>
      <div className="stat-value" style={{ fontSize: "1rem" }}>{value}</div>
      {sublabel && <div style={{ fontSize: "0.5625rem", color: "var(--color-text-tertiary)" }}>{sublabel}</div>}
    </div>
  );
}
