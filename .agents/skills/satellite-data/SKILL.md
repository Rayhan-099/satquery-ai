---
name: satellite-data
description: Use when selecting, downloading, interpreting, validating, or processing Sentinel-1, Sentinel-2, STAC, COG, satellite metadata, acquisitions, AOIs, bands, cloud information, or spatial resolution.
---

# Satellite Data

## Sentinel-2

Treat Sentinel-2 as multispectral optical imagery.

Track:

- band identity
- wavelength
- spatial resolution
- acquisition time
- product level
- cloud information
- scaling
- CRS
- footprint
- metadata

Never reduce multispectral data to RGB unless the task explicitly requires visualization.

## Sentinel-1

Treat Sentinel-1 as SAR data.

Track:

- polarization
- acquisition mode
- orbit information
- acquisition time
- backscatter characteristics
- preprocessing
- resolution
- CRS

Do not treat SAR as ordinary RGB imagery.

## STAC

When possible, use STAC metadata to identify:

- collections
- scenes/items
- acquisition times
- assets
- bands
- footprints
- cloud metadata
- links to raster assets

## COG

Cloud Optimized GeoTIFFs may be used for efficient raster access.

## AOI

Always explicitly represent the area of interest.

Validate:

- geometry
- CRS
- bounds
- intersection with scene footprint

Never assume that a scene covers the requested AOI.

## Temporal analysis

For comparisons, verify:

- both scenes
- acquisition dates
- spatial alignment
- comparable preprocessing
- comparable resolution
