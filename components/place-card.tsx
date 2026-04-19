'use client';
import { ItineraryStop, CATEGORY_ICONS, TrafficSeverity } from '../types';

const SEVERITY_DOT: Record<TrafficSeverity, { color: string; glow: string; label: string }> = {
  clear:     { color: 'bg-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.7)]',  label: 'Smooth ride' },
  light:     { color: 'bg-yellow-400',  glow: 'shadow-[0_0_10px_rgba(250,204,21,0.7)]',  label: 'Slightly slow' },
  moderate:  { color: 'bg-orange-500',  glow: 'shadow-[0_0_10px_rgba(249,115,22,0.7)]',  label: 'Moderate traffic' },
  heavy:     { color: 'bg-red-500',     glow: 'shadow-[0_0_10px_rgba(239,68,68,0.7)]',   label: 'Heavy traffic' },
  standstill:{ color: 'bg-red-700',     glow: 'shadow-[0_0_10px_rgba(185,28,28,0.7)]',   label: 'Standstill' },
};

const BUDGET_LABELS: Record<string, string> = {
  free: 'Free', 'under-500': 'Under ₹500', 'under-2000': 'Under ₹2K', 'no-limit': '₹₹₹',
};

interface Props {
  stop: ItineraryStop;
  isFirst: boolean;
  onSwap?: (placeId: string) => void;
  onCheckTraffic?: (placeId: string) => void;
  isCheckingTraffic?: boolean;
}

export default function PlaceCard({ stop, isFirst, onSwap }: Props) {
  const { place, trafficAlert } = stop;
  const severity = trafficAlert?.severity || 'clear';
  const dot = SEVERITY_DOT[severity];

  return (
    <div className="animate-fade-in-up">
      {/* Traffic leg between stops */}
      {!isFirst && trafficAlert && (
        <div className="flex items-center py-5 px-2">
          <div className="h-8 w-px bg-white/10 mr-4 ml-1 flex-shrink-0" />
          <div className="flex items-center gap-3 bg-[#0F172A]/60 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot.color} ${dot.glow}`} />
            <span className="text-[11px] font-bold tracking-[0.1em] text-white/50 uppercase">
              {Math.round(trafficAlert.currentTravelTime)} min · {dot.label}
              {trafficAlert.delayMinutes > 0 && (
                <span className="text-white/30 font-normal"> (+{Math.round(trafficAlert.delayMinutes)}m)</span>
              )}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-white/20 border-l border-white/10 pl-3">
              <span className={`w-1 h-1 rounded-full ${trafficAlert.isLive ? 'bg-green-400' : 'bg-white/20'}`} />
              {trafficAlert.isLive ? 'Live' : 'Est.'}
            </span>
          </div>
        </div>
      )}

      {/* Place card */}
      <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl hover:border-white/20 transition-colors group">

        {/* Photo */}
        <div className="relative w-full h-64 overflow-hidden">
          {place.photoUrl ? (
            <img
              src={place.photoUrl}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallback = `https://placehold.co/800x400/1E293B/F43F5E?text=${encodeURIComponent(place.name)}`;
                if (target.src !== fallback) target.src = fallback;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center">
              <span className="text-5xl opacity-40">{CATEGORY_ICONS[place.category]}</span>
            </div>
          )}

          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />

          {/* Time badge */}
          <div className="absolute top-4 left-4 bg-[#0F172A]/80 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-medium text-xs flex items-center gap-2">
            <svg className="w-3 h-3 text-[#F43F5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {stop.arrivalTime} — {Math.round(place.avgTimeMinutes / 60 * 10) / 10 >= 1 ? `${Math.round(place.avgTimeMinutes / 60 * 10) / 10}h` : `${place.avgTimeMinutes}m`}
          </div>

          {/* Rating badge */}
          <div className="absolute top-4 right-4 bg-yellow-400 px-2.5 py-1.5 rounded-lg text-black font-bold text-xs flex items-center gap-1">
            {place.rating}
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>

          {/* Stop number */}
          <div className="absolute bottom-4 left-4">
            <span className="w-8 h-8 bg-[#F43F5E] text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
              {stop.order}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <a
            href={place.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Chennai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-medium tracking-tight text-white/95 hover:text-white transition-colors inline-flex items-center gap-2 group/link mb-1"
          >
            {place.name}
            <svg className="w-4 h-4 opacity-20 group-hover/link:opacity-50 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <p className="text-[11px] font-bold tracking-[0.15em] text-white/40 uppercase mb-4">{place.area}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/50 font-medium">
              {BUDGET_LABELS[place.budget]}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/50 font-medium">
              {place.indoor && place.outdoor ? 'In / Outdoor' : place.indoor ? 'Indoor' : 'Outdoor'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/50 font-medium">
              ~{place.avgTimeMinutes} min
            </span>
          </div>

          <p className="text-sm text-white/50 leading-relaxed mb-6">{place.description}</p>

          {/* Actions */}
          <div className="flex gap-2">
            <a
              href={place.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-white text-sm font-medium transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Navigate
            </a>
            {onSwap && (
              <button
                onClick={() => onSwap(place.id)}
                className="px-4 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-white/50 hover:text-white text-sm transition-all"
                title="Swap this stop"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
