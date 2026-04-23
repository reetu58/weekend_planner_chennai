'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Itinerary, CATEGORY_ICONS, AREA_COORDINATES } from '../../../types';
import PlaceCard from '../../../components/place-card';
import ShareButtons from '../../../components/share-buttons';
import dynamic from 'next/dynamic';

const TrafficMap = dynamic(() => import('../../../components/traffic-map'), { ssr: false });

const SEVERITY_DOT: Record<string, { color: string; label: string }> = {
  clear:     { color: 'bg-emerald-400', label: 'Clear' },
  light:     { color: 'bg-yellow-400',  label: 'Light' },
  moderate:  { color: 'bg-orange-500',  label: 'Moderate' },
  heavy:     { color: 'bg-red-500',     label: 'Heavy' },
  standstill:{ color: 'bg-red-700',     label: 'Standstill' },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-5">
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin block" />
          </div>
          <p className="text-white font-medium text-lg">Building your plan</p>
          <p className="text-white/40 text-sm mt-1">Sorting stops around traffic</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl text-white/30">?</span>
          </div>
          <h2 className="text-xl font-medium text-white mb-2">Plan not found</h2>
          <p className="text-white/40 mb-6 text-sm">This plan may have expired or doesn&apos;t exist.</p>
          <Link href="/plan" className="inline-flex items-center gap-2 px-6 py-3 bg-[#F43F5E] text-white rounded-xl font-semibold hover:bg-[#E11D48] transition-colors">
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

  const dot = SEVERITY_DOT[overallSeverity];
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const dateLabel = new Date(itinerary.createdAt).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-20 -right-20 bg-[#F43F5E]/6 rounded-full blur-[100px]" />
        <div className="absolute w-[400px] h-[400px] bottom-0 -left-10 bg-blue-500/6 rounded-full blur-[100px]" />
      </div>

      {/* Sticky top bar */}
      <div className="sticky top-16 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center gap-4 flex-wrap">

          {/* Route breadcrumb */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
            {itinerary.stops.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
                {i > 0 && <svg className="w-3 h-3 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                <span className="text-xs text-white/50 font-medium">{s.place.name.split(' ').slice(0, 2).join(' ')}</span>
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs font-medium flex-shrink-0">
            <span className="flex items-center gap-1.5 text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              {formatDuration(itinerary.totalDuration)}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5 text-white/60">
              <span className={`w-1.5 h-1.5 rounded-full ${dot.color}`} />
              +{itinerary.totalTrafficOverhead}m traffic
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-white/60">
              {itinerary.totalCost.min === 0 && itinerary.totalCost.max === 0
                ? 'Free'
                : `₹${itinerary.totalCost.min}–${itinerary.totalCost.max}`}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowShare(!showShare)}
              className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors text-white flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share
            </button>
          </div>
        </div>

        {showShare && (
          <div className="max-w-6xl mx-auto px-4 pb-4 animate-fade-in-up">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Share your plan</p>
              <ShareButtons
                title="My Chennai Weekend Plan | Weekendaa"
                text={`Just planned my weekend with Weekendaa — ${itinerary.stops.length} stops, traffic-optimised!`}
                url={shareUrl}
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">

          {/* Timeline — left col */}
          <div className="lg:col-span-3">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-1">{dateLabel}</h1>
                <p className="text-sm text-white/40 flex items-center gap-2">
                  <span className="text-white/40">{itinerary.stops.length} stops</span>
                  <span className="text-white/15">·</span>
                  <span className="text-white/40">{formatDuration(itinerary.totalDuration)}</span>
                  <span className="text-white/15">·</span>
                  <span className={`font-semibold ${dot.color === 'bg-emerald-400' ? 'text-emerald-400' : dot.color === 'bg-yellow-400' ? 'text-yellow-400' : dot.color === 'bg-orange-500' ? 'text-orange-400' : 'text-red-400'}`}>
                    {dot.label} roads
                  </span>
                </p>
              </div>
              <Link
                href="/plan"
                className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Edit
              </Link>
            </div>

            <div className="space-y-0">
              {itinerary.stops.map((stop, i) => (
                <PlaceCard key={stop.place.id} stop={stop} isFirst={i === 0} />
              ))}
            </div>

            <div className="flex gap-3 pt-10">
              <Link
                href="/plan"
                className="flex-1 text-center py-3.5 bg-[#F43F5E] text-white rounded-xl font-semibold hover:bg-[#E11D48] transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                New Plan
              </Link>
              <Link
                href="/plan"
                className="flex-1 text-center py-3.5 border border-white/10 text-white/70 rounded-xl font-semibold hover:bg-white/5 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Adjust Plan
              </Link>
            </div>
          </div>

          {/* Map — right col */}
          <div className="lg:col-span-2 mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-36">
              {/* Mobile toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="lg:hidden w-full mb-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/70 font-semibold hover:bg-white/8 transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                {showMap ? 'Hide map' : 'Show route map'}
              </button>

              <div className={`${showMap ? 'block' : 'hidden'} lg:block`}>
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] p-1">
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

                {/* Summary below map */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Duration', value: formatDuration(itinerary.totalDuration) },
                    { label: 'Travel', value: formatDuration(itinerary.totalTravelTime) },
                    { label: 'Traffic add', value: `+${itinerary.totalTrafficOverhead}m` },
                    {
                      label: 'Budget',
                      value: itinerary.totalCost.min === 0 && itinerary.totalCost.max === 0
                        ? 'Free' : `₹${itinerary.totalCost.min}–${itinerary.totalCost.max}`
                    },
                  ].map(stat => (
                    <div key={stat.label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                      <p className="text-sm font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
