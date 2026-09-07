"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapContentProps {
  bounds: { left: number; bottom: number; right: number; top: number };
  evidenceOverlay: string | null;
}

export default function MapContent({ bounds, evidenceOverlay }: MapContentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.ImageOverlay | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      // Initialize map
      leafletMapRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20
      }).addTo(leafletMapRef.current);

      L.control.zoom({ position: "topright" }).addTo(leafletMapRef.current);
      L.control.attribution({ position: "bottomright", prefix: false }).addTo(leafletMapRef.current);
    }

    const map = leafletMapRef.current;
    
    // Convert bounds to Leaflet bounds (southWest, northEast)
    const southWest = L.latLng(bounds.bottom, bounds.left);
    const northEast = L.latLng(bounds.top, bounds.right);
    const leafletBounds = L.latLngBounds(southWest, northEast);

    // Fit map to bounds
    map.fitBounds(leafletBounds, { padding: [20, 20], maxZoom: 14 });

    // Handle overlay
    if (evidenceOverlay) {
      if (!overlayRef.current) {
        overlayRef.current = L.imageOverlay(evidenceOverlay, leafletBounds, {
          opacity: 0.85,
          interactive: true,
          crossOrigin: true
        }).addTo(map);
      } else {
        overlayRef.current.setUrl(evidenceOverlay);
        overlayRef.current.setBounds(leafletBounds);
      }
    } else if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
      overlayRef.current = null;
    }

    // Force resize event in case layout changed
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      // Cleanup happens when component unmounts entirely, but map survives re-renders
    };
  }, [bounds, evidenceOverlay]);

  // Clean up on complete unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 0 }} />;
}
