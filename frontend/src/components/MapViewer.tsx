"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function BoundsUpdater({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);
  return null;
}

interface MapViewerProps {
  boundsJson?: string;
  overlayUrl?: string;
}

export default function MapViewer({ boundsJson, overlayUrl }: MapViewerProps) {
  const [bounds, setBounds] = useState<L.LatLngBoundsExpression | null>(null);

  useEffect(() => {
    if (boundsJson) {
      try {
        const b = JSON.parse(boundsJson);
        // Leaflet expects [lat, lng] -> [bottom, left], [top, right]
        setBounds([
          [b.bottom, b.left],
          [b.top, b.right]
        ]);
      } catch (e) {
        console.error("Invalid bounds:", e);
      }
    }
  }, [boundsJson]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[0, 0]} 
        zoom={2} 
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {bounds && <BoundsUpdater bounds={bounds} />}
        {bounds && overlayUrl && (
          <ImageOverlay
            url={overlayUrl}
            bounds={bounds}
            opacity={0.8}
            zIndex={10}
          />
        )}
      </MapContainer>
    </div>
  );
}
