'use client';
import { TrafficSeverity } from '../types';

const SEVERITY_EMOJI: Record<TrafficSeverity, string> = {
  clear: '🟢', light: '🟡', moderate: '🟠', heavy: '🔴', standstill: '⛔',
};

interface Props {
  stops: Array<{ emoji: string; name: string }>;
  totalDuration: number;
  totalTravelTime: number;
  totalTrafficOverhead: number;
  totalCost: { min: number; max: number };
  overallSeverity: TrafficSeverity;
  onRefresh: () => void;
  onShare: () => void;
  isRefreshing?: boolean;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TrafficSummaryBar({
  stops, totalDuration, totalTravelTime, totalTrafficOverhead,
  totalCost, overallSeverity, onRefresh, onShare, isRefreshing,
}: Props) {
  return (
    <div className="sticky top-16 z-40 glass shadow-card border-b border-gray-100/50">
      <div className="max-w-5xl mx-auto px-4 py-3.5">
        {/* Route visualization */}
        <div className="flex items-center gap-1 text-sm mb-3 overflow-x-auto hide-scrollbar">
          {stops.map((s, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 && (
                <svg className="w-4 h-4 text-gray-300 mx-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              )}
              <span className="px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-medium border border-gray-100/80 flex items-center gap-1">
                {s.emoji} {s.name}
              </span>
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1B4965]" />
              <span className="font-bold text-[#1B4965]">{formatDuration(totalDuration)}</span>
              <span className="text-gray-400 text-xs">total</span>
            </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="font-semibold">{formatDuration(totalTravelTime)}</span>
              <span className="text-gray-400 text-xs">travel</span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg ${
                totalTrafficOverhead > 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
              }`}>
                {SEVERITY_EMOJI[overallSeverity]} +{totalTrafficOverhead}m
              </span>
            </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-emerald-700">
                {totalCost.min === 0 && totalCost.max === 0 ? 'Free' : `₹${totalCost.min}–${totalCost.max}`}
              </span>
            </span>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1B4965] text-white rounded-xl text-xs font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors chip-press"
            >
              {isRefreshing ? (
                <>
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Refresh
                </>
              )}
            </button>
            <button
              onClick={onShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FFB703] text-[#1B4965] rounded-xl text-xs font-bold hover:bg-accent-light transition-colors chip-press"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
