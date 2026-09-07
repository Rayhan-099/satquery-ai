// SatQuery AI — Centralized API Client
// All frontend requests go through this module.
// Uses relative paths (/api/...) to route through the Next.js proxy.

import type {
  Scene,
  QueryResponse,
  DiscoverySearchParams,
  DiscoverySearchResponse,
  HealthResponse,
} from './types';

const API_BASE = '/api';

class ApiClientError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiClientError';
    this.status = status;
    this.detail = detail;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body.detail) detail = body.detail;
    } catch {
      // Response body is not JSON
    }
    throw new ApiClientError(response.status, detail);
  }
  return response.json() as Promise<T>;
}

/** Upload a GeoTIFF scene file. */
export async function uploadScene(file: File): Promise<Scene> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/images/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<Scene>(response);
}

/** Submit a natural-language query against a loaded scene. */
export async function queryScene(
  sceneId: string,
  query: string
): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scene_id: sceneId, query }),
  });

  return handleResponse<QueryResponse>(response);
}

/** Search Copernicus Data Space for scenes. */
export async function searchDiscovery(
  params: DiscoverySearchParams
): Promise<DiscoverySearchResponse> {
  const response = await fetch(`${API_BASE}/discovery/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  return handleResponse<DiscoverySearchResponse>(response);
}

/** Ingest a discovered Copernicus scene. */
export async function ingestDiscovery(
  productId: string,
  sensor: string
): Promise<Scene> {
  const response = await fetch(`${API_BASE}/discovery/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, sensor }),
  });

  return handleResponse<Scene>(response);
}

/** Check backend health via proxy. */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/health`);
  return handleResponse<HealthResponse>(response);
}

/** Get the proxied URL for a generated visualization asset. */
export function getAssetUrl(assetPath: string): string {
  // Asset paths from the backend are like "uploads/scene_xxx_ndvi_vis.png"
  return `${API_BASE}/${assetPath}`;
}

export { ApiClientError };
