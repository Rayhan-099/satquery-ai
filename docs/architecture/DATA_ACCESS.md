# Data Access Architecture

## Copernicus Data Space Ecosystem (CDSE)
SatQuery uses the official Copernicus Data Space Ecosystem (CDSE) for discovering and downloading real Sentinel-1 and Sentinel-2 data. We prioritize the CDSE to remain within free and open data access guidelines, ensuring SatQuery operates without expensive or proprietary satellite imagery dependencies.

### Discovery (OData API)
For discovering imagery, we utilize the CDSE **OData API**:
`https://catalogue.dataspace.copernicus.eu/odata/v1/Products`

This API does NOT require authentication. Our `CopernicusDataProvider` creates standard OData filters based on standard spatial bounding boxes, dates, and sensors. 
- For Sentinel-2, we filter `Collection/Name eq 'SENTINEL-2'` and search specifically for `MSIL2A` (Level-2A Bottom of Atmosphere).
- For Sentinel-1, we filter `Collection/Name eq 'SENTINEL-1'` and search specifically for `GRD` (Ground Range Detected) products.

### Download & Ingestion (Keycloak OAuth)
To download individual assets (such as B04/B08 for Sentinel-2, or VV/VH for Sentinel-1), CDSE requires an authenticated session.
- **Authentication**: Uses Keycloak to issue an OAuth token.
- **Credentials**: Handled server-side. `CDSE_USERNAME` and `CDSE_PASSWORD` must be provided in the backend `.env`.
- **MVP Safety Mechanism**: If no credentials are provided or if network ingestion of large ZIPs times out in a demonstration sandbox, the provider falls back to a spatial subset mocking technique (duplicating deterministic GeoTIFF fixtures into the uploads folder). This ensures that the remainder of the analysis pipeline (which is completely data-agnostic) continues to function perfectly for the presentation.

### Caching Strategy
Scene metadata is lightweight and downloaded synchronously. To avoid redundant multi-megabyte transfers, downloaded assets are saved in `backend/uploads/` with a UUID naming convention. If an analysis targets an already-ingested scene UUID, it avoids network re-downloading entirely.
