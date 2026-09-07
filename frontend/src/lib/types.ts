// SatQuery AI — TypeScript interfaces matching backend schemas

export interface Scene {
  id: string;
  sensor: string | null;
  acquisition_time: string | null;
  crs: string | null;
  bounds: string | null;
  width: number | null;
  height: number | null;
  status: string | null;
  source_type: string | null;
  provenance: Record<string, unknown> | null;
  bands_metadata: BandMetadata[] | null;
}

export interface BandMetadata {
  index: number;
  description: string | null;
  color_interpretation: string | null;
}

export interface Statistics {
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std_dev?: number;
  valid_pixels?: number;
  vv_mean?: number;
  vh_mean?: number;
  ratio_mean?: number;
}

export interface Evidence {
  analysis_type: string;
  scene_id: string;
  formula: string;
  input_bands: Record<string, string>;
  output_raster: string;
  visualization_asset: string;
  statistics: Statistics;
  warnings: string[];
}

export interface AnalysisPlan {
  intent: string;
  tool: string;
  scene_id: string;
  inputs: Record<string, unknown>;
  requested_output: string;
  requires_confirmation: boolean;
}

export interface QueryResponse {
  query: string;
  status: 'completed' | 'unsupported' | 'clarification_required';
  plan: AnalysisPlan | null;
  evidence: Evidence | null;
  interpretation: string | null;
  limitations: string[];
}

export interface DiscoverySearchParams {
  bbox: number[];
  start_date: string;
  end_date: string;
  sensor: string;
  max_cloud_cover: number;
  max_results: number;
}

export interface DiscoveryResult {
  id: string;
  name: string;
  sensor: string;
  acquisition_time: string;
  provider: string;
  preview_url: string;
  metadata: {
    size_bytes: number | null;
    online: boolean;
  };
}

export interface DiscoverySearchResponse {
  status: string;
  results: DiscoveryResult[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface ApiError {
  detail: string;
}
