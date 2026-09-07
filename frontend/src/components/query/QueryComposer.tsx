"use client";

import { useState } from "react";
import { queryScene } from "@/lib/api";
import type { QueryResponse } from "@/lib/types";

const SUGGESTIONS = [
  "Where is vegetation strongest?",
  "Where is water detected?",
  "Compare VV and VH backscatter.",
];

interface QueryComposerProps {
  sceneId: string;
  onResult: (response: QueryResponse) => void;
  onAnalyzing: (analyzing: boolean) => void;
  onError: (error: string) => void;
}

export default function QueryComposer({
  sceneId,
  onResult,
  onAnalyzing,
  onError,
}: QueryComposerProps) {
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzingLocal] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || analyzing) return;

    setAnalyzingLocal(true);
    onAnalyzing(true);
    onError("");

    try {
      const response = await queryScene(sceneId, query);
      onResult(response);
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setAnalyzingLocal(false);
      onAnalyzing(false);
    }
  };

  const handleSuggestion = (text: string) => {
    setQuery(text);
  };

  return (
    <div
      className="surface slide-up stagger-1"
      style={{ padding: "1.25rem", position: "relative" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <label className="label-xs" htmlFor="query-input" style={{ color: focused ? "var(--color-accent)" : "var(--color-text-secondary)", transition: "color var(--transition-fast)" }}>
          ANALYTICAL COMMAND
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="badge badge-info" style={{ background: "transparent", border: "1px solid var(--color-border-strong)" }}>MODE: EO ANALYSIS</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <textarea
            id="query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter natural language geospatial query..."
            disabled={analyzing}
            rows={2}
            className="input-field"
            style={{
              resize: "vertical",
              minHeight: "4.5rem",
              fontSize: "0.875rem",
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        {!query && !analyzing && (
          <div className="fade-in" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                type="button"
                className="btn-secondary fade-in"
                onClick={() => handleSuggestion(s)}
                style={{
                  padding: "0.25rem 0.625rem",
                  fontSize: "0.6875rem",
                  animationDelay: `${i * 100}ms`
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={analyzing || !query.trim()}
          style={{ width: "100%", marginTop: "0.25rem" }}
        >
          {analyzing ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              EXECUTING
            </span>
          ) : (
            "RUN ANALYSIS"
          )}
        </button>
      </form>
    </div>
  );
}
