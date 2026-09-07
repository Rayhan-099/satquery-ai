"use client";

import { useState, useEffect } from "react";
import type { Scene, QueryResponse } from "@/lib/types";
import { checkHealth } from "@/lib/api";

import AppShell from "@/components/shell/AppShell";
import EmptyState from "@/components/system/EmptyState";
import ScenePanel from "@/components/scene/ScenePanel";
import MapViewer from "@/components/map/MapViewer";
import QueryComposer from "@/components/query/QueryComposer";
import AnalysisProgress from "@/components/query/AnalysisProgress";
import EvidencePanel from "@/components/evidence/EvidencePanel";
import InsufficientEvidence from "@/components/evidence/InsufficientEvidence";
import ErrorState from "@/components/system/ErrorState";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const [scene, setScene] = useState<Scene | null>(null);
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  useEffect(() => {
    // Health check on mount
    checkHealth()
      .then((res) => setApiStatus(res.status === "ok" ? "connected" : "disconnected"))
      .catch(() => setApiStatus("disconnected"));
  }, []);

  const handleSceneLoaded = (loadedScene: Scene) => {
    setScene(loadedScene);
    setQueryResponse(null);
    setAnalyzing(false);
    setError("");
  };

  const handleQueryResult = (response: QueryResponse) => {
    setQueryResponse(response);
    setAnalyzing(false);
  };

  const handleError = (errMsg: string) => {
    setError(errMsg);
    setAnalyzing(false);
  };

  // Compute map bounds and overlay
  let mapBounds = null;
  if (scene?.bounds) {
    try {
      mapBounds = JSON.parse(scene.bounds);
    } catch {}
  }
  
  let mapOverlay = null;
  if (queryResponse?.evidence?.visualization_asset) {
    mapOverlay = `/api/${queryResponse.evidence.visualization_asset}`;
  }

  // If workspace hasn't been explicitly opened and no scene is selected, show EmptyState
  if (!workspaceOpen && !scene) {
    return (
      <AppShell hasScene={false} apiStatus={apiStatus}>
        <EmptyState onOpenWorkspace={() => setWorkspaceOpen(true)} />
      </AppShell>
    );
  }

  return (
    <AppShell hasScene={!!scene} apiStatus={apiStatus}>
      {/* LEFT PANEL: Scene & Discovery */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid var(--color-border-default)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <ScenePanel scene={scene} onSceneLoaded={handleSceneLoaded} />
      </div>

      {/* CENTER PANEL: Map */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
        <MapViewer bounds={mapBounds} evidenceOverlay={mapOverlay} />
      </div>

      {/* RIGHT PANEL: Query & Analysis */}
      <div
        style={{
          width: "380px",
          borderLeft: "1px solid var(--color-border-default)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          background: "var(--color-bg-secondary)",
          overflow: "auto",
        }}
      >
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && <ErrorState message={error} onDismiss={() => setError("")} />}

          {scene ? (
            <QueryComposer
              sceneId={scene.id}
              onResult={handleQueryResult}
              onAnalyzing={setAnalyzing}
              onError={handleError}
            />
          ) : (
            <div className="surface" style={{ padding: "1rem", textAlign: "center" }}>
              <span className="label-sm">Select a scene to begin analysis</span>
            </div>
          )}

          {analyzing && <AnalysisProgress />}

          {!analyzing && queryResponse?.status === "completed" && queryResponse.evidence && (
            <EvidencePanel response={queryResponse} />
          )}

          {!analyzing && queryResponse?.limitations && queryResponse.limitations.length > 0 && (
            <InsufficientEvidence limitations={queryResponse.limitations} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
