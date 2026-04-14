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
        const res = await fetch(`/api/plan?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setItinerary(data);
          return;
        }
      } catch {}

      try {
        const decoded = JSON.parse(atob(id as string));
        if (decoded.stops) {
          setItinerary(decoded);
        } else {
          const res = await fetch('/api/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(decoded),
          });
          if (res.ok) {
            const data = await res.json();
            const iRes = await fetch(`/api/plan?id=${data.id}`);
            if (iRes.ok) setItinerary(await iRes.json());
          }
        }
      } catch {}
      setLoading(false);
    }
    load().finally(() => setLoading(false));
  }, [id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-[#0F172A]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="w-8 h-8 border-3 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin block" />
          </div>
          <p className="text-[#0F172A] font-semibold text-lg">Building your plan...</p>
          <p className="text-gray-400 text-sm mt-1">Checking traffic & optimizing route</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Plan not found</h2>
          <p className="text-gray-400 mb-6">This plan may have expired or doesn&apos;t exist.</p>
          <Link href="/plan" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F43F5E] text-white rounded-xl font-bold hover:bg-accent-light transition-colors chip-press">
            Create a new plan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    );
  }

  const overallSeverity = itinerary.totalTrafficOverhead > 20 ? 'heavy'
    : itinerary.totalTrafficOverhead > 10 ? 'moderate'
    : itinerary.totalTrafficOverhead > 5 ? 'light' : 'clear';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-sand">
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
        <div className="max-w-5xl mx-auto px-4 py-4 animate-scale-in">
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100/80">
            <p className="text-sm font-semibold text-gray-500 mb-3">Share your plan</p>
            <ShareButtons
              title="My Chennai Weekend Plan | Weekendaa"
              text={`Just planned my weekend with weekendaa — ${itinerary.stops.length} stops, traffic-optimized! 🚗💨`}
              url={shareUrl}
            />
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Itinerary Timeline */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">Your Weekend Plan</h1>
                <p className="text-sm text-gray-400 mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0F172A]/5 rounded-md text-[#0F172A] font-medium text-xs">
                    {itinerary.stops.length} stops
                  </span>
                  <span className="text-gray-300">•</span>
                  traffic-optimized
                </p>
              </div>
              <span className="text-sm text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-soft font-medium">
                📅 {new Date(itinerary.createdAt).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {itinerary.stops.map((stop, i) => (
              <PlaceCard
                key={stop.place.id}
                stop={stop}
                isFirst={i === 0}
              />
            ))}

            <div className="flex gap-3 pt-8">
              <Link
                href="/plan"
                className="flex-1 text-center py-4 bg-gradient-to-r from-[#0F172A] to-[#334155] text-white rounded-2xl font-semibold hover:shadow-elevated transition-all btn-shine chip-press"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Regenerate Plan
                </span>
              </Link>
              <Link
                href="/plan"
                className="flex-1 text-center py-4 border-2 border-[#0F172A] text-[#0F172A] rounded-2xl font-semibold hover:bg-[#0F172A] hover:text-white transition-all chip-press"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit Preferences
                </span>
              </Link>
            </div>
          </div>

          {/* Map (Desktop: sticky sidebar, Mobile: toggle) */}
          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-36">
              <button
                onClick={() => setShowMap(!showMap)}
                className="lg:hidden w-full mb-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0F172A] font-semibold shadow-soft hover:shadow-card transition-all chip-press flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                {showMap ? 'Hide Map' : 'Show Route Map'}
              </button>
              <div className={`${showMap ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white rounded-2xl border border-gray-100/80 shadow-card p-2 overflow-hidden">
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
    </div>
  );
}
