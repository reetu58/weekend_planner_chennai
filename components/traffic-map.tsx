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
  startLocation?: { lat: number; lng: number; name: string };
}

export default function TrafficMap({ stops, center, startLocation }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current || stops.length === 0) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

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

      if (startLocation) {
        const startIcon = L.divIcon({
          html: `<div style="background:linear-gradient(135deg,#22c55e,#16a34a);color:white;width:34px;height:34px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2)">📍</div>`,
          className: '',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        L.marker([startLocation.lat, startLocation.lng], { icon: startIcon })
          .addTo(map)
          .bindPopup(`<b>Start: ${startLocation.name}</b>`);

        points.push([startLocation.lat, startLocation.lng]);
      }

      stops.forEach((stop) => {
        const icon = L.divIcon({
          html: `<div style="background:linear-gradient(135deg,#1B4965,#2d7da8);color:white;width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2)">${stop.order}</div>`,
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${stop.order}. ${stop.name}</b>`);

        points.push([stop.lat, stop.lng]);
      });

      if (points.length > 1) {
        L.polyline(points, { color: '#1B4965', weight: 3, opacity: 0.6, dashArray: '10, 8' }).addTo(map);
      }

      if (points.length > 0) {
        map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
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
  }, [mounted, stops, center, startLocation]);

  if (!mounted) {
    return <div className="w-full h-[400px] bg-gray-50 rounded-xl shimmer-bg" />;
  }

  return <div ref={mapRef} className="w-full h-[400px] rounded-xl overflow-hidden" />;
}
