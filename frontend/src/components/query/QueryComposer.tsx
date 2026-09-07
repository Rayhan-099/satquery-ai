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
      className="surface slide-up delay-100"
      style={{ padding: "1.25rem", position: "relative" }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label className="label-xs" htmlFor="query-input" style={{ display: "block", marginBottom: 8, color: focused ? "var(--color-accent)" : "var(--color-text-tertiary)", transition: "color var(--transition-fast)" }}>
            Command Interface
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              id="query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter natural language query..."
              disabled={analyzing}
              rows={2}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                border: "1px solid",
                borderColor: focused ? "var(--color-accent)" : "var(--color-border-strong)",
                borderRadius: "var(--radius-sm)",
                resize: "vertical",
                minHeight: "4rem",
                transition: "all var(--transition-default)",
                boxShadow: focused ? "0 0 15px rgba(45, 212, 191, 0.15), inset 0 2px 5px rgba(0,0,0,0.3)" : "inset 0 2px 5px rgba(0,0,0,0.2)",
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
          {analyzing ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </div>
  );
}
