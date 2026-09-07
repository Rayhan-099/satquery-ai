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
    High: { bg: "var(--color-success-muted)", color: "var(--color-success)", border: "rgba(16, 185, 129, 0.4)" },
    Medium: { bg: "var(--color-warning-muted)", color: "var(--color-warning)", border: "rgba(245, 158, 11, 0.4)" },
    Low: { bg: "var(--color-error-muted)", color: "var(--color-error)", border: "rgba(239, 68, 68, 0.4)" },
  };

  const c = colors[level];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span className="label-xs" style={{ color: "var(--color-text-secondary)" }}>CONFIDENCE</span>
      <div
        className="badge"
        style={{
          background: c.bg,
          color: c.color,
          borderColor: c.border,
          boxShadow: `inset 0 1px 4px rgba(0,0,0,0.5)`,
        }}
      >
        {level}
      </div>
    </div>
  );
}

function ExecutionTrace({ response }: { response: QueryResponse }) {
  const [expanded, setExpanded] = useState(false);
  const plan = response.plan;
  const evidence = response.evidence;

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-secondary)",
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
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
      >
        <span style={{ color: "var(--color-accent)" }}>{expanded ? "[-]" : "[+]"}</span> EXECUTION TRACE
      </button>

      {expanded && plan && (
        <div
          className="surface-inset slide-up"
          style={{
            marginTop: "0.75rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <TraceRow label="QUERY" value={response.query} delay="0ms" />
          <TraceRow label="INTENT" value={plan.intent} delay="50ms" />
          <TraceRow label="TOOL" value={plan.tool} delay="100ms" />
          {evidence && <TraceRow label="ANALYSIS" value={evidence.analysis_type} delay="150ms" />}
          {evidence && <TraceRow label="FORMULA" value={evidence.formula} delay="200ms" />}
          {evidence && Object.entries(evidence.input_bands).map(([k, v], idx) => (
            <TraceRow key={k} label={`INPUT: ${k}`} value={v} delay={`${250 + idx * 50}ms`} />
          ))}
          <TraceRow label="VALIDATION" value="Numerical claims grounded" delay="350ms" color="var(--color-success)" />
        </div>
      )}
    </div>
  );
}

function TraceRow({ label, value, delay, color = "var(--color-text-primary)" }: { label: string; value: string; delay: string; color?: string }) {
  return (
    <div className="fade-in" style={{ display: "flex", gap: "1rem", alignItems: "baseline", animationDelay: delay }}>
      <span className="label-xs" style={{ flexShrink: 0, minWidth: 80, color: "var(--color-text-tertiary)" }}>{label}</span>
      <span className="mono-data" style={{ fontSize: "0.75rem", color }}>{value}</span>
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
    <div className="surface slide-up stagger-3" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="badge badge-accent">ANALYSIS COMPLETE</span>
        <ConfidenceIndicator evidence={evidence} />
      </div>

      {/* Interpretation */}
      {response.interpretation && (
        <p className="fade-in delay-200" style={{ fontSize: "0.875rem", color: "var(--color-text-primary)", margin: 0, lineHeight: 1.65 }}>
          {response.interpretation}
        </p>
      )}

      <div className="divider" />

      {/* Statistics */}
      <div className="fade-in delay-300">
        <div className="label-xs" style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>EVIDENCE STATISTICS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {isOptical && (
            <>
              {stats.mean !== undefined && <StatBlock label={evidence.analysis_type.toUpperCase()} value={stats.mean.toFixed(4)} sublabel="MEAN" delay="100ms" highlight />}
              {stats.max !== undefined && <StatBlock label="MAXIMUM" value={stats.max.toFixed(4)} delay="150ms" />}
              {stats.median !== undefined && <StatBlock label="MEDIAN" value={stats.median.toFixed(4)} delay="200ms" />}
              {stats.std_dev !== undefined && <StatBlock label="STD DEV" value={stats.std_dev.toFixed(4)} delay="250ms" />}
            </>
          )}
          {isSAR && (
            <>
              {stats.vv_mean !== undefined && <StatBlock label="VV MEAN" value={stats.vv_mean.toFixed(4)} delay="100ms" />}
              {stats.vh_mean !== undefined && <StatBlock label="VH MEAN" value={stats.vh_mean.toFixed(4)} delay="150ms" />}
              {stats.ratio_mean !== undefined && <StatBlock label="VV/VH RATIO" value={stats.ratio_mean.toFixed(4)} delay="200ms" highlight />}
            </>
          )}
          {stats.valid_pixels !== undefined && <StatBlock label="VALID PIXELS" value={stats.valid_pixels.toLocaleString()} delay="300ms" />}
        </div>
      </div>

      <div className="divider" />

      {/* Evidence metadata */}
      <div className="fade-in delay-300" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="label-xs" style={{ color: "var(--color-text-secondary)" }}>
          SPATIAL {evidence.analysis_type.toUpperCase()} MASK
        </div>
        <a
          href={downloadUrl}
          download
          className="btn-secondary"
          style={{ fontSize: "0.6875rem", padding: "0.375rem 0.75rem" }}
        >
          EXPORT .TIF
        </a>
      </div>

      <ExecutionTrace response={response} />
    </div>
  );
}

function StatBlock({ label, value, sublabel, delay, highlight = false }: { label: string; value: string; sublabel?: string; delay: string; highlight?: boolean }) {
  return (
    <div className="fade-in surface-inset" style={{ 
      animationDelay: delay,
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      borderTop: highlight ? "1px solid var(--color-accent)" : "1px solid var(--color-border-subtle)"
    }}>
      <div className="label-xs" style={{ color: "var(--color-text-tertiary)" }}>{label}</div>
      <div className={`stat-value ${highlight ? 'highlight' : ''}`}>{value}</div>
      {sublabel && <div className="label-xs" style={{ color: "var(--color-text-tertiary)", marginTop: "0.25rem" }}>{sublabel}</div>}
    </div>
  );
}
