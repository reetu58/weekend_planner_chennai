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
    <div className="sticky top-16 z-40 glass shadow-md border-b border-gray-100/50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Route visualization */}
        <div className="flex items-center gap-1 text-sm mb-2 overflow-x-auto hide-scrollbar">
          {stops.map((s, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 && <span className="text-gray-300 mx-1">→</span>}
              <span className="px-2 py-0.5 bg-gray-50 rounded-md text-xs font-medium">{s.emoji} {s.name}</span>
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B4965]" />
              <span className="font-semibold text-[#1B4965]">{formatDuration(totalDuration)}</span>
              <span className="text-gray-400">total</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span className="font-medium">{formatDuration(totalTravelTime)}</span>
              <span className="text-gray-400">travel</span>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                totalTrafficOverhead > 10 ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                {SEVERITY_EMOJI[overallSeverity]} +{totalTrafficOverhead}m
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-medium">
                {totalCost.min === 0 && totalCost.max === 0 ? 'Free' : `₹${totalCost.min}–${totalCost.max}`}
              </span>
            </span>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 bg-[#1B4965] text-white rounded-lg text-xs font-medium hover:bg-[#15384f] disabled:opacity-50 transition-colors"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Traffic'}
            </button>
            <button
              onClick={onShare}
              className="px-3 py-1.5 bg-[#FFB703] text-[#1B4965] rounded-lg text-xs font-bold hover:bg-[#e5a503] transition-colors"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
