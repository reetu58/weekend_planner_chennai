'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Itinerary, CATEGORY_ICONS, AREA_COORDINATES } from '../../../types';
import PlaceCard from '../../../components/place-card';
import TrafficSummaryBar from '../../../components/traffic-summary-bar';
import ShareButtons from '../../../components/share-buttons';
import dynamic from 'next/dynamic';

const TrafficMap = dynamic(() => import('../../../components/traffic-map'), { ssr: false });

export default function ItineraryPage() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Try fetching from API first
        const res = await fetch(`/api/plan?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setItinerary(data);
          return;
        }
      } catch {}

      // Try decoding from URL param (base64 encoded prefs)
      try {
        const decoded = JSON.parse(atob(id as string));
        if (decoded.stops) {
          setItinerary(decoded);
        } else {
          // It's prefs, generate itinerary client-side
          const res = await fetch('/api/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(decoded),
          });
          if (res.ok) {
            const data = await res.json();
            // Fetch the generated itinerary
            const iRes = await fetch(`/api/plan?id=${data.id}`);
            if (iRes.ok) setItinerary(await iRes.json());
          }
        }
      } catch {
        // Failed to decode
      }
      setLoading(false);
    }
    load().finally(() => setLoading(false));
  }, [id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // In a real app, this would re-fetch traffic for all legs
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-[#1B4965] font-semibold">Building your traffic-smart plan...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">😕</p>
          <h2 className="text-xl font-bold text-[#1B4965] mb-2">Plan not found</h2>
          <Link href="/plan" className="text-[#FFB703] underline">Create a new plan</Link>
        </div>
      </div>
    );
  }

  const overallSeverity = itinerary.totalTrafficOverhead > 20 ? 'heavy'
    : itinerary.totalTrafficOverhead > 10 ? 'moderate'
    : itinerary.totalTrafficOverhead > 5 ? 'light' : 'clear';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <TrafficSummaryBar
        stops={itinerary.stops.map(s => ({
          emoji: CATEGORY_ICONS[s.place.category],
          name: s.place.name.split(' ').slice(0, 2).join(' '),
        }))}
        totalDuration={itinerary.totalDuration}
        totalTravelTime={itinerary.totalTravelTime}
        totalTrafficOverhead={itinerary.totalTrafficOverhead}
        totalCost={itinerary.totalCost}
        overallSeverity={overallSeverity as any}
        onRefresh={handleRefresh}
        onShare={() => setShowShare(!showShare)}
        isRefreshing={isRefreshing}
      />

      {showShare && (
        <div className="max-w-5xl mx-auto px-4 py-4">
          <ShareButtons
            title="My Chennai Weekend Plan | Weekendaa"
            text={`Just planned my weekend with weekendaa — ${itinerary.stops.length} stops, traffic-optimized! 🚗💨`}
            url={shareUrl}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Itinerary Timeline */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[#1B4965]">Your Weekend Plan</h1>
              <span className="text-sm text-gray-500">
                {new Date(itinerary.createdAt).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {itinerary.stops.map((stop, i) => (
              <PlaceCard
                key={stop.place.id}
                stop={stop}
                isFirst={i === 0}
              />
            ))}

            <div className="flex gap-3 pt-4">
              <Link
                href="/plan"
                className="flex-1 text-center py-3 bg-[#1B4965] text-white rounded-full font-semibold hover:bg-[#15384f]"
              >
                🔄 Regenerate Plan
              </Link>
              <Link
                href="/plan"
                className="flex-1 text-center py-3 border-2 border-[#1B4965] text-[#1B4965] rounded-full font-semibold hover:bg-[#FAF7F2]"
              >
                ✏️ Edit Preferences
              </Link>
            </div>
          </div>

          {/* Map (Desktop: sticky sidebar, Mobile: toggle) */}
          <div className="lg:col-span-2 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-36">
              <button
                onClick={() => setShowMap(!showMap)}
                className="lg:hidden w-full mb-4 py-3 bg-white border rounded-xl text-[#1B4965] font-semibold shadow-sm"
              >
                {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
              </button>
              <div className={`${showMap ? 'block' : 'hidden'} lg:block`}>
                <TrafficMap
                  stops={itinerary.stops.map(s => ({
                    lat: s.place.lat,
                    lng: s.place.lng,
                    name: s.place.name,
                    order: s.order,
                  }))}
                  startLocation={(() => {
                    const p = itinerary.preferences;
                    const coords = (p.startLat && p.startLng)
                      ? { lat: p.startLat, lng: p.startLng }
                      : AREA_COORDINATES[p.startArea];
                    return coords ? { lat: coords.lat, lng: coords.lng, name: p.startArea || 'Start' } : undefined;
                  })()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
