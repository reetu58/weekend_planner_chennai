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
    <div className="sticky top-16 z-40 bg-white shadow-md border-b px-4 py-3">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
          {stops.map((s, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-400">→</span>}
              <span>{s.emoji} {s.name}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-[#1B4965]">
            Total: {formatDuration(totalDuration)}
          </span>
          <span className="text-gray-400">|</span>
          <span>
            Travel: {formatDuration(totalTravelTime)}{' '}
            <span className={totalTrafficOverhead > 10 ? 'text-red-500 font-semibold' : 'text-yellow-600'}>
              ({SEVERITY_EMOJI[overallSeverity]} +{totalTrafficOverhead} min)
            </span>
          </span>
          <span className="text-gray-400">|</span>
          <span>
            Cost: ₹{totalCost.min === 0 && totalCost.max === 0 ? 'Free' : `${totalCost.min}-${totalCost.max}`}
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-1 bg-[#1B4965] text-white rounded-full text-xs hover:bg-[#15384f] disabled:opacity-50"
            >
              {isRefreshing ? '⏳ Refreshing...' : '🔄 Refresh Traffic'}
            </button>
            <button
              onClick={onShare}
              className="px-3 py-1 bg-[#FFB703] text-[#1B4965] rounded-full text-xs font-semibold hover:bg-[#e5a503]"
            >
              📤 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
