"use client";

import { useState } from "react";
import { queryScene } from "@/lib/api";
import type { QueryResponse, Evidence } from "@/lib/types";

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
      className="surface"
      style={{ padding: "0.75rem" }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <div>
          <label className="label-xs" htmlFor="query-input" style={{ display: "block", marginBottom: 4 }}>
            Query
          </label>
          <textarea
            id="query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about this scene…"
            disabled={analyzing}
            rows={2}
            style={{
              width: "100%",
              padding: "0.5rem 0.625rem",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              border: "1px solid var(--color-border-default)",
              borderRadius: "var(--radius-sm)",
              resize: "vertical",
              minHeight: "3rem",
              transition: "border-color var(--transition-fast)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-interactive)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border-default)")}
          />
        </div>

        {!query && !analyzing && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestion(s)}
                style={{
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.625rem",
                  background: "var(--color-bg-tertiary)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-text-secondary)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-strong)";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-default)";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
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
          style={{
            width: "100%",
            background: analyzing ? "var(--color-bg-elevated)" : "var(--color-accent-strong)",
          }}
        >
          {analyzing ? "Analyzing…" : "Analyze"}
        </button>
      </form>
    </div>
  );
}
