'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Itinerary, AREA_COORDINATES } from '../../../types';
import PlaceCard from '../../../components/place-card';
import ShareButtons from '../../../components/share-buttons';
import dynamic from 'next/dynamic';

const TrafficMap = dynamic(() => import('../../../components/traffic-map'), { ssr: false });

const SEVERITY_LABEL: Record<string, { label: string; text: string; dot: string }> = {
  clear:    { label: 'Clear roads',    text: 'text-emerald-600', dot: 'bg-emerald-500' },
  light:    { label: 'Light traffic',  text: 'text-yellow-700',  dot: 'bg-yellow-500' },
  moderate: { label: 'Moderate jams',  text: 'text-orange-600',  dot: 'bg-orange-500' },
  heavy:    { label: 'Heavy traffic',  text: 'text-red-600',     dot: 'bg-red-500' },
};

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function ItineraryPage() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/plan?id=${id}`);
        if (res.ok) { setItinerary(await res.json()); return; }
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
            const { id: newId } = await res.json();
            const iRes = await fetch(`/api/plan?id=${newId}`);
            if (iRes.ok) setItinerary(await iRes.json());
          }
        }
      } catch {}
      setLoading(false);
    }
    load().finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!showShare) return;
    const onClick = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShowShare(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showShare]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-[#F43F5E] animate-spin mx-auto mb-5" />
          <p className="font-playfair text-2xl font-black text-[#0F172A] tracking-tight">Building your weekend</p>
          <p className="text-slate-500 text-sm mt-1">Sorting stops around live traffic</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-slate-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F43F5E] mb-3">Plan not found</p>
          <h2 className="font-playfair text-4xl font-black text-[#0F172A] tracking-tight mb-3">
            Nothing here yet.
          </h2>
          <p className="text-slate-500 mb-8">This plan may have expired or never finished generating.</p>
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F43F5E] text-white font-bold hover:bg-[#E11D48] transition-colors"
          >
            Plan a new weekend
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    );
  }

  const overall = itinerary.totalTrafficOverhead > 20 ? 'heavy'
    : itinerary.totalTrafficOverhead > 10 ? 'moderate'
    : itinerary.totalTrafficOverhead > 5 ? 'light' : 'clear';
  const sev = SEVERITY_LABEL[overall];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const dateLabel = new Date(itinerary.createdAt).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  const budgetLabel = itinerary.totalCost.min === 0 && itinerary.totalCost.max === 0
    ? 'Free' : `₹${itinerary.totalCost.min}–${itinerary.totalCost.max}`;

  // One Google Maps link with all stops as waypoints
  const allStopsMapsUrl = (() => {
    const start = itinerary.preferences.startArea ? encodeURIComponent(itinerary.preferences.startArea + ', Chennai') : '';
    const dests = itinerary.stops.map(s => `${s.place.lat},${s.place.lng}`);
    if (dests.length === 0) return '#';
    const destination = dests[dests.length - 1];
    const waypoints = dests.slice(0, -1).join('|');
    const base = 'https://www.google.com/maps/dir/?api=1&travelmode=driving';
    return `${base}${start ? `&origin=${start}` : ''}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}`;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-slate-50">
      {/* Slim contextual app-bar */}
      <div className="sticky top-16 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <div className="flex items-baseline gap-2 min-w-0 flex-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F43F5E] hidden sm:inline">Plan</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="text-sm font-semibold text-[#0F172A] truncate">{dateLabel}</span>
            <span className="text-slate-300 hidden md:inline">·</span>
            <span className="text-sm text-slate-500 hidden md:inline">{itinerary.stops.length} stops · {formatDuration(itinerary.totalDuration)}</span>
          </div>

          <div ref={shareRef} className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-[#0F172A] text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors chip-press"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share
            </button>
            {showShare && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-card p-4 animate-fade-in-up">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Share your plan</p>
                <ShareButtons
                  title="My Chennai Weekend Plan | Weekendaa"
                  text={`Just planned my weekend with Weekendaa — ${itinerary.stops.length} stops, traffic-optimised!`}
                  url={shareUrl}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-20">
        {/* Page header — single source of truth for stats */}
        <header className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F43F5E] mb-3">Chennai · Weekend Plan</p>
          <h1 className="font-playfair text-5xl md:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.05] mb-6">
            {dateLabel.split(',')[0]}.<br />
            <span className="text-[#F43F5E]">{itinerary.stops.length} stops, sequenced.</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mb-8">
            Ordered around live Chennai traffic. Tap Navigate on any stop to open turn-by-turn directions.
          </p>

          {/* Stat strip — same DNA as Hero stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {[
              { label: 'Total time', value: formatDuration(itinerary.totalDuration) },
              { label: 'On the road', value: formatDuration(itinerary.totalTravelTime) },
              { label: 'Roads now', value: sev.label, valueClass: sev.text, dot: sev.dot },
              { label: 'Budget', value: budgetLabel },
            ].map((stat, i) => (
              <div key={i} className="px-4 py-5 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1.5">{stat.label}</span>
                <span className={`text-xl md:text-2xl font-black tracking-tight inline-flex items-center gap-2 ${stat.valueClass ?? 'text-[#0F172A]'}`}>
                  {stat.dot && <span className={`w-2 h-2 rounded-full ${stat.dot}`} />}
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Timeline */}
          <div className="lg:col-span-7">
            <div className="space-y-1">
              {itinerary.stops.map((stop, i) => (
                <PlaceCard key={stop.place.id} stop={stop} isFirst={i === 0} />
              ))}
            </div>

            {/* Single primary CTA */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex-1 text-center sm:text-left">
                <p className="font-playfair text-xl font-black text-[#0F172A] leading-tight">Want a different vibe?</p>
                <p className="text-sm text-slate-500 mt-0.5">Adjust your inputs and we&apos;ll resequence the route.</p>
              </div>
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F43F5E] text-white text-sm font-bold hover:bg-[#E11D48] transition-colors btn-shine chip-press"
              >
                Plan another weekend
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>

          {/* Map sidebar — quiet */}
          <aside className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-32">
              {/* Mobile toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="lg:hidden w-full mb-4 py-3 rounded-2xl border border-slate-200 bg-white text-[#0F172A] text-sm font-bold flex items-center justify-center gap-2 chip-press"
              >
                <svg className="w-4 h-4 text-[#F43F5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {showMap ? 'Hide route map' : 'Show route map'}
              </button>

              <div className={`${showMap ? 'block' : 'hidden'} lg:block`}>
                <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F43F5E]">Route</p>
                      <p className="font-playfair text-lg font-black text-[#0F172A] tracking-tight">Your weekend, on the map</p>
                    </div>
                  </div>
                  <div className="px-1 pb-1">
                    <div className="rounded-2xl overflow-hidden">
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
                  <div className="px-5 py-4 border-t border-slate-100">
                    <a
                      href={allStopsMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F172A] hover:text-[#F43F5E] transition-colors"
                    >
                      Open all stops in Google Maps
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
