'use client';
import { useEffect, useRef, useState } from 'react';

interface Stop {
  lat: number;
  lng: number;
  name: string;
  order: number;
}

interface Props {
  stops: Stop[];
  center?: { lat: number; lng: number };
}

export default function TrafficMap({ stops, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current || stops.length === 0) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Cleanup previous
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const defaultCenter = center || { lat: 13.0827, lng: 80.2707 };
      const map = L.map(mapRef.current!, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const points: [number, number][] = [];

      stops.forEach((stop) => {
        const icon = L.divIcon({
          html: `<div style="background:#1B4965;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">${stop.order}</div>`,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${stop.order}. ${stop.name}</b>`);

        points.push([stop.lat, stop.lng]);
      });

      if (points.length > 1) {
        L.polyline(points, { color: '#1B4965', weight: 3, opacity: 0.7, dashArray: '8, 8' }).addTo(map);
      }

      if (points.length > 0) {
        map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
      }

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted, stops, center]);

  if (!mounted) {
    return <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-xl" />;
  }

  return <div ref={mapRef} className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg" />;
}
