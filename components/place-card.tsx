'use client';
import { ItineraryStop, CATEGORY_ICONS, TrafficSeverity } from '../types';

const SEVERITY: Record<TrafficSeverity, { dot: string; text: string; label: string }> = {
  clear:      { dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'Clear' },
  light:      { dot: 'bg-yellow-500',  text: 'text-yellow-700',  label: 'Light' },
  moderate:   { dot: 'bg-orange-500',  text: 'text-orange-600',  label: 'Moderate' },
  heavy:      { dot: 'bg-red-500',     text: 'text-red-600',     label: 'Heavy' },
  standstill: { dot: 'bg-red-700',     text: 'text-red-700',     label: 'Standstill' },
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
  const severity = trafficAlert?.severity ?? 'clear';
  const sev = SEVERITY[severity];
  const placeUrl = place.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Chennai')}`;
  const stayLabel = place.avgTimeMinutes >= 60
    ? `${Math.round(place.avgTimeMinutes / 60 * 10) / 10}h stay`
    : `${place.avgTimeMinutes}m stay`;

  return (
    <div className="relative">
      {/* Traffic leg between stops — quiet, on-rail */}
      {!isFirst && trafficAlert && (
        <div className="relative pl-12 py-3">
          <span className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />
          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
            <span className="font-medium text-slate-600">{Math.round(trafficAlert.currentTravelTime)} min</span>
            <span className="text-slate-300">·</span>
            <span className={sev.text}>{sev.label} on the way</span>
            {trafficAlert.delayMinutes > 0 && (
              <span className="text-slate-400">+{Math.round(trafficAlert.delayMinutes)}m</span>
            )}
            {trafficAlert.isLive && (
              <>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  Live
                </span>
              </>
            )}
          </span>
        </div>
      )}

      {/* Stop card on the rail */}
      <div className="relative pl-12">
        {/* Rail */}
        <span className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" aria-hidden />
        {/* Stop pin */}
        <span className="absolute left-3 top-3 w-[18px] h-[18px] rounded-full bg-[#F43F5E] ring-4 ring-white shadow-[0_0_0_1px_rgba(244,63,94,0.25)] flex items-center justify-center">
          <span className="text-[10px] font-bold text-white leading-none">{stop.order}</span>
        </span>

        <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-card-hover transition-shadow">
          {/* Photo */}
          <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
            {place.photoUrl ? (
              <img
                src={place.photoUrl}
                alt={place.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  const fb = `https://placehold.co/800x400/0F172A/F43F5E?text=${encodeURIComponent(place.name)}`;
                  if (t.src !== fb) t.src = fb;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-slate-300">
                {CATEGORY_ICONS[place.category]}
              </div>
            )}

            {/* Single overlay: time of arrival */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#0F172A] text-xs font-bold shadow-sm">
              <svg className="w-3 h-3 text-[#F43F5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stop.arrivalTime}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F43F5E] mb-2">
              {place.area}
            </p>
            <a
              href={placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-playfair text-2xl md:text-3xl font-black tracking-tight text-[#0F172A] hover:text-[#F43F5E] transition-colors leading-tight"
            >
              {place.name}
            </a>

            {/* Meta line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-[#0F172A]">
                <svg className="w-3.5 h-3.5 fill-[#F43F5E]" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {place.rating.toFixed(1)}
              </span>
              <span className="text-slate-300">·</span>
              <span>{BUDGET_LABELS[place.budget]}</span>
              <span className="text-slate-300">·</span>
              <span>{place.indoor && place.outdoor ? 'In / outdoor' : place.indoor ? 'Indoor' : 'Outdoor'}</span>
              <span className="text-slate-300">·</span>
              <span>{stayLabel}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mt-4">{place.description}</p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-5">
              <a
                href={place.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] transition-colors chip-press"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Navigate
              </a>
              <a
                href={placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:border-slate-300 hover:text-[#0F172A] transition-colors chip-press"
              >
                Details
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              {onSwap && (
                <button
                  onClick={() => onSwap(place.id)}
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors chip-press"
                  title="Swap this stop"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Swap
                </button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
