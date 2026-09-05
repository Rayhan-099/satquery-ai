---
name: geospatial-correctness
description: Use whenever code handles coordinates, CRS, EPSG codes, raster alignment, reprojection, geometry, AOIs, pixel sizes, distances, areas, nodata, or map visualization. Prevents scientifically incorrect geospatial results.
---

# Geospatial Correctness

Geospatial correctness is mandatory.

## CRS

Always know the CRS of:

- input raster
- output raster
- vector geometry
- AOI
- map layer

Never assume CRS.

## Reprojection

When comparing rasters:

- verify CRS
- verify transform
- verify dimensions
- verify pixel size
- verify bounds
- verify grid alignment

Reproject explicitly when necessary.

## Coordinates

Be careful about:

- longitude/latitude ordering
- x/y ordering
- raster row/column ordering
- geographic vs projected coordinates

## Pixel size

Do not calculate physical distances or areas from degree-based coordinates as if they were meters.

Use an appropriate projected CRS when required.

## Nodata

Always preserve and handle nodata correctly.

Never interpret nodata as a real measurement.

## Geometry

Validate:

- geometry validity
- bounds
- intersection
- empty geometries
- CRS compatibility

## Raster alignment

Before pixel-wise comparison, verify:

- CRS
- transform
- dimensions
- resolution
- bounds
- grid alignment

Misaligned rasters must not be silently compared.

## Maps

Any displayed spatial evidence must correspond to the actual analyzed geometry/raster.

Never fabricate spatial locations.
