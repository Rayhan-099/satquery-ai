# Deterministic Earth Observation Pipeline

## Architecture Overview
SatQuery AI treats Earth Observation analysis as rigorous scientific computation, distinct from language model inferences. The deterministic EO pipeline handles band alignment, metadata extraction, index calculation, and spatial evidence generation.

## Band Semantics
- When an image is uploaded, we analyze its metadata to extract detailed descriptions and color interpretations for each band.
- We **never** blindly assume Band 4 is NIR. For analytical endpoints like NDVI, if the backend cannot confidently infer the RED and NIR bands from internal GeoTIFF metadata, it explicitly halts and requests user input to map the bands.

## Preprocessing & Computation (e.g. NDVI)
- **Nodata & Invalid Pixels**: We dynamically read the `nodata` value from the raster properties. If absent, we use standard Numpy `np.isnan` and `np.isinf` checking.
- **Masking**: All invalid pixels are masked before mathematical operations.
- **Zero-Division Protection**: Before dividing `(NIR - RED) / (NIR + RED)`, we check if the denominator is zero. Zero-denominators are safely masked out to avoid crashing the pipeline and to prevent corrupt artifacts.
- **Statistics Output**: Along with visual data, the pipeline guarantees the output of minimum, maximum, mean, median, valid pixel count, and standard deviation to form a structured evidence payload.

## Visualization Strategy
Rendering raw multidimensional GeoTIFFs dynamically in standard web maps (Leaflet) is error-prone and performance-heavy.
- Our engine computes the index, saves the primary scientific `.tif` output, and simultaneously generates a colorized (`RdYlGn`), transparent background PNG perfectly cropped to the geospatial boundaries.
- The React Leaflet frontend overlays this PNG image instantly onto the web map, allowing fluid geospatial exploration while maintaining scientific integrity in the backend exports.
