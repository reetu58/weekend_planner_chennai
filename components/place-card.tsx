'use client';
import { ItineraryStop, CATEGORY_ICONS, TrafficSeverity } from '../types';

const SEVERITY_CONFIG: Record<TrafficSeverity, { border: string; bg: string; text: string; emoji: string; label: string; accent: string }> = {
  clear: { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-700', emoji: '🟢', label: 'Smooth ride', accent: 'bg-emerald-100' },
  light: { border: 'border-yellow-300', bg: 'bg-yellow-50', text: 'text-yellow-700', emoji: '🟡', label: 'Slightly slow', accent: 'bg-yellow-100' },
  moderate: { border: 'border-orange-300', bg: 'bg-orange-50', text: 'text-orange-700', emoji: '🟠', label: 'Moderate traffic', accent: 'bg-orange-100' },
  heavy: { border: 'border-red-400', bg: 'bg-red-50', text: 'text-red-700', emoji: '🔴', label: 'Heavy traffic', accent: 'bg-red-100' },
  standstill: { border: 'border-red-600', bg: 'bg-red-100', text: 'text-red-800', emoji: '⛔', label: 'Standstill', accent: 'bg-red-200' },
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

export default function PlaceCard({ stop, isFirst, onSwap, onCheckTraffic, isCheckingTraffic }: Props) {
  const { place, trafficAlert } = stop;
  const severity = trafficAlert?.severity || 'clear';
  const config = SEVERITY_CONFIG[severity];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden card-hover animate-fade-in-up">
      {/* Traffic alert between stops */}
      {!isFirst && trafficAlert && (
        <div className={`px-5 py-3.5 ${config.bg} border-l-4 ${config.border}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{config.emoji}</span>
              <span className={`font-semibold text-sm ${config.text}`}>
                {config.label} — {Math.round(trafficAlert.currentTravelTime)} min
              </span>
              {trafficAlert.delayMinutes > 0 && (
                <span className={`text-xs ${config.accent} ${config.text} px-2 py-0.5 rounded-full font-medium`}>
                  +{Math.round(trafficAlert.delayMinutes)}m delay
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-wide">
                <span className={`w-1 h-1 rounded-full ${trafficAlert.isLive ? 'bg-green-400' : 'bg-gray-300'}`} />
                {trafficAlert.isLive ? 'Live' : 'Estimated'}
              </span>
              <button
                onClick={() => onCheckTraffic?.(place.id)}
                disabled={isCheckingTraffic}
                className="text-xs px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all chip-press"
              >
                {isCheckingTraffic ? (
                  <span className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin inline-block" />
                ) : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo area */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden group">
        {place.photoUrl ? (
          <img
            src={place.photoUrl}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = `https://placehold.co/800x400/0F172A/F43F5E?text=${encodeURIComponent(place.name)}`;
              if (target.src !== fallback) target.src = fallback;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0F172A] to-[#334155] flex items-center justify-center">
            <span className="text-5xl drop-shadow-lg">{CATEGORY_ICONS[place.category]}</span>
          </div>
        )}

        {/* Order badge */}
        <div className="absolute top-3 left-3">
          <span className="w-10 h-10 bg-[#0F172A] text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-elevated border-2 border-white/20">
            {stop.order}
          </span>
        </div>

        {/* Category pill */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 glass rounded-xl text-xs font-medium shadow-sm">
            {CATEGORY_ICONS[place.category]} {place.category.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Time overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-xl text-xs font-medium">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {stop.arrivalTime} – {stop.departureTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <a
            href={place.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Chennai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-[#0F172A] hover:text-[#334155] transition-colors inline-flex items-center gap-1.5 group"
          >
            {place.name}
            <svg className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <div className="flex items-center gap-3 mt-1.5 text-sm">
            <span className="text-gray-400">{place.area}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-md text-yellow-600 font-semibold text-xs border border-yellow-100">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {place.rating}
            </span>
            <span className="text-gray-300 text-xs">({place.reviewCount.toLocaleString()} reviews)</span>
          </div>
        </div>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1.5 rounded-xl bg-gray-50 text-xs text-gray-500 font-medium border border-gray-100">
            {BUDGET_LABELS[place.budget]}
          </span>
          <span className="px-2.5 py-1.5 rounded-xl bg-gray-50 text-xs text-gray-500 font-medium border border-gray-100">
            {place.indoor && place.outdoor ? 'In/Outdoor' : place.indoor ? '🏠 Indoor' : '🌤️ Outdoor'}
          </span>
          <span className="px-2.5 py-1.5 rounded-xl bg-gray-50 text-xs text-gray-500 font-medium border border-gray-100">
            ~{place.avgTimeMinutes} min
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-2">{place.description}</p>

        {/* Insider tip with highlight */}
        <div className="flex items-start gap-2 mb-5 p-3 bg-amber-50/60 rounded-xl border border-amber-100/60">
          <span className="text-sm mt-0.5">💡</span>
          <p className="text-sm text-amber-700/80 italic">{place.insiderTip}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors btn-ripple chip-press"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Navigate
          </a>
          <a
            href={place.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Chennai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F43F5E] text-white rounded-xl text-sm font-bold hover:bg-accent-light transition-colors btn-shine chip-press"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Google It
          </a>
          {onSwap && (
            <button
              onClick={() => onSwap(place.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-all chip-press"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Swap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
