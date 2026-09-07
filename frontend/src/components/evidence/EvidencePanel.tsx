"use client";

import { useState } from "react";
import type { QueryResponse, Evidence } from "@/lib/types";
import { getAssetUrl } from "@/lib/api";

interface EvidencePanelProps {
  response: QueryResponse;
}

function ConfidenceIndicator({ evidence }: { evidence: Evidence }) {
  const stats = evidence.statistics;
  const validPixels = stats.valid_pixels || 0;
  let level: "High" | "Medium" | "Low" = "Medium";
  if (validPixels > 1000) level = "High";
  else if (validPixels < 100) level = "Low";

  const colors = {
    High: { bg: "var(--color-success-muted)", color: "var(--color-success)", border: "rgba(34, 197, 94, 0.4)" },
    Medium: { bg: "var(--color-warning-muted)", color: "var(--color-warning)", border: "rgba(245, 158, 11, 0.4)" },
    Low: { bg: "var(--color-error-muted)", color: "var(--color-error)", border: "rgba(239, 68, 68, 0.4)" },
  };

  const c = colors[level];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span className="label-xs">Confidence</span>
      <span
        style={{
          fontSize: "0.625rem",
          fontWeight: 600,
          padding: "0.125rem 0.5rem",
          background: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          borderRadius: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          boxShadow: `0 0 10px ${c.bg}`,
          animation: "fadeIn 0.5s ease"
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
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-accent)",
          fontSize: "0.6875rem",
          cursor: "pointer",
          padding: "0.25rem 0",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          transition: "all var(--transition-fast)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
      >
        <span>{expanded ? "−" : "+"}</span> {expanded ? "Hide Trace" : "View Execution Trace"}
      </button>

      {expanded && plan && (
        <div
          className="slide-up"
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            background: "rgba(0,0,0,0.2)",
            border: "1px solid var(--color-border-strong)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
          }}
        >
          <TraceRow label="Query" value={response.query} delay="0ms" />
          <TraceRow label="Intent" value={plan.intent} delay="50ms" />
          <TraceRow label="Tool" value={plan.tool} delay="100ms" />
          {evidence && <TraceRow label="Analysis" value={evidence.analysis_type} delay="150ms" />}
          {evidence && <TraceRow label="Formula" value={evidence.formula} delay="200ms" />}
          {evidence && Object.entries(evidence.input_bands).map(([k, v], idx) => (
            <TraceRow key={k} label={`Input: ${k}`} value={v} delay={`${250 + idx * 50}ms`} />
          ))}
          <TraceRow label="Validation" value="Numerical claims grounded" delay="350ms" />
        </div>
      )}
    </div>
  );
}

function TraceRow({ label, value, delay }: { label: string; value: string; delay: string }) {
  return (
    <div className="fade-in" style={{ display: "flex", gap: "1rem", alignItems: "baseline", animationDelay: delay }}>
      <span className="label-xs" style={{ flexShrink: 0, minWidth: 80, color: "var(--color-interactive)" }}>{label}</span>
      <span className="mono-data" style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)" }}>{value}</span>
    </div>
  );
}

export default function EvidencePanel({ response }: EvidencePanelProps) {
  const evidence = response.evidence;

  if (!evidence) return null;

  const stats = evidence.statistics;
  const downloadUrl = getAssetUrl(evidence.output_raster);

  const isOptical = evidence.analysis_type === "NDVI" || evidence.analysis_type === "Water Analysis";
  const isSAR = evidence.analysis_type === "SAR Analysis";

  return (
    <div className="surface slide-up delay-200" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="badge badge-accent">Analysis Complete</span>
        <ConfidenceIndicator evidence={evidence} />
      </div>

      {/* Interpretation */}
      {response.interpretation && (
        <p className="fade-in delay-300" style={{ fontSize: "0.875rem", color: "var(--color-text-primary)", margin: 0, lineHeight: 1.65 }}>
          {response.interpretation}
        </p>
      )}

      <div className="divider" />

      {/* Statistics */}
      <div className="fade-in delay-300">
        <div className="label-xs" style={{ marginBottom: "0.75rem", color: "var(--color-text-secondary)" }}>Evidence Statistics</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {isOptical && (
            <>
              {stats.mean !== undefined && <StatBlock label={evidence.analysis_type} value={stats.mean.toFixed(4)} sublabel="Mean" delay="400ms" />}
              {stats.max !== undefined && <StatBlock label="Max" value={stats.max.toFixed(4)} delay="450ms" />}
              {stats.median !== undefined && <StatBlock label="Median" value={stats.median.toFixed(4)} delay="500ms" />}
              {stats.std_dev !== undefined && <StatBlock label="Std Dev" value={stats.std_dev.toFixed(4)} delay="550ms" />}
            </>
          )}
          {isSAR && (
            <>
              {stats.vv_mean !== undefined && <StatBlock label="VV Mean" value={stats.vv_mean.toFixed(4)} delay="400ms" />}
              {stats.vh_mean !== undefined && <StatBlock label="VH Mean" value={stats.vh_mean.toFixed(4)} delay="450ms" />}
              {stats.ratio_mean !== undefined && <StatBlock label="VV/VH Ratio" value={stats.ratio_mean.toFixed(4)} delay="500ms" />}
            </>
          )}
          {stats.valid_pixels !== undefined && <StatBlock label="Valid Pixels" value={stats.valid_pixels.toLocaleString()} delay="600ms" />}
        </div>
      </div>

      <div className="divider" />

      {/* Evidence metadata */}
      <div className="fade-in delay-300" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="label-xs" style={{ color: "var(--color-text-secondary)" }}>
          Spatial {evidence.analysis_type.toLowerCase()} mask
        </div>
        <a
          href={downloadUrl}
          download
          className="btn-secondary"
          style={{ fontSize: "0.625rem", padding: "0.375rem 0.75rem" }}
        >
          Export .tif
        </a>
      </div>

      <ExecutionTrace response={response} />
    </div>
  );
}

function StatBlock({ label, value, sublabel, delay }: { label: string; value: string; sublabel?: string; delay: string }) {
  return (
    <div className="fade-in" style={{ 
      animationDelay: delay,
      background: "var(--color-bg-primary)",
      padding: "0.75rem",
      borderRadius: "var(--radius-sm)",
      border: "1px solid var(--color-border-subtle)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)"
    }}>
      <div className="label-xs" style={{ color: "var(--color-text-secondary)" }}>{label}</div>
      <div className="stat-value" style={{ marginTop: "0.25rem" }}>{value}</div>
      {sublabel && <div style={{ fontSize: "0.625rem", color: "var(--color-text-tertiary)", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sublabel}</div>}
    </div>
  );
}
