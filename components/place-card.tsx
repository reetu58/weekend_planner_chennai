'use client';
import { ItineraryStop, CATEGORY_ICONS, TrafficSeverity } from '../types';

const SEVERITY_COLORS: Record<TrafficSeverity, { border: string; bg: string; text: string }> = {
  clear: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  light: { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  moderate: { border: 'border-orange-400', bg: 'bg-orange-50', text: 'text-orange-700' },
  heavy: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  standstill: { border: 'border-red-700', bg: 'bg-red-100', text: 'text-red-800' },
};

const SEVERITY_EMOJI: Record<TrafficSeverity, string> = {
  clear: '🟢', light: '🟡', moderate: '🟠', heavy: '🔴', standstill: '⛔',
};

const SEVERITY_LABEL: Record<TrafficSeverity, string> = {
  clear: 'Smooth ride', light: 'Slightly slow', moderate: 'Moderate traffic',
  heavy: 'Heavy traffic', standstill: 'Standstill',
};

const BUDGET_LABELS: Record<string, string> = {
  free: 'Free', 'under-500': '₹ Under 500', 'under-2000': '₹ Under 2,000', 'no-limit': '₹₹₹',
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
  const colors = SEVERITY_COLORS[severity];

  const isOpen = () => {
    const now = new Date();
    const day = now.getDay() === 0 ? 'sunday' : 'saturday';
    const hours = place.openHours[day];
    if (!hours) return { status: 'Closed', color: 'text-red-500' };
    const currentHour = now.getHours() * 60 + now.getMinutes();
    const [oh, om] = hours.open.split(':').map(Number);
    const [ch, cm] = hours.close.split(':').map(Number);
    const openMin = oh * 60 + om;
    const closeMin = ch * 60 + cm;
    if (currentHour >= openMin && currentHour < closeMin) {
      const remaining = closeMin - currentHour;
      if (remaining <= 120) return { status: `Closes in ${Math.floor(remaining / 60)}h ${remaining % 60}m`, color: 'text-orange-500' };
      return { status: 'Open now', color: 'text-green-600' };
    }
    return { status: 'Closed', color: 'text-red-500' };
  };

  const openStatus = isOpen();

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${!isFirst && trafficAlert ? `border-l-4 ${colors.border}` : ''}`}>
      {/* Traffic panel */}
      {!isFirst && trafficAlert && (
        <div className={`px-4 py-3 ${colors.bg}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{SEVERITY_EMOJI[severity]}</span>
              <span className={`font-semibold ${colors.text}`}>
                {SEVERITY_LABEL[severity]} — {Math.round(trafficAlert.currentTravelTime)} min
              </span>
              {trafficAlert.delayMinutes > 0 && (
                <span className="text-sm text-gray-500">
                  vs normally {Math.round(trafficAlert.normalTravelTime)} min (+{Math.round(trafficAlert.delayMinutes)} min)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {trafficAlert.isLive ? '📡 Live' : '📊 Estimated'}
              </span>
              <button
                onClick={() => onCheckTraffic?.(place.id)}
                disabled={isCheckingTraffic}
                className="text-xs px-2 py-1 bg-white rounded-full border hover:bg-gray-50 disabled:opacity-50"
              >
                {isCheckingTraffic ? '⏳' : '🔄'} Check Now
              </button>
            </div>
          </div>
          {trafficAlert.alternative && (severity === 'heavy' || severity === 'standstill') && (
            <div className="mt-2 p-2 bg-white/80 rounded-lg text-sm">
              <span className="font-medium">💡 Consider {trafficAlert.alternative.placeName} instead</span>
              <span className="text-gray-600"> — only {Math.round(trafficAlert.alternative.travelTime)} min away. {trafficAlert.alternative.reason}</span>
            </div>
          )}
          {trafficAlert.bestDepartureWindow && (
            <p className="mt-1 text-sm text-gray-600">⏰ {trafficAlert.bestDepartureWindow}</p>
          )}
        </div>
      )}

      {/* Place info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 bg-[#1B4965] text-white rounded-full flex items-center justify-center text-sm font-bold">
                {stop.order}
              </span>
              <h3 className="text-lg font-bold text-[#1B4965]">{place.name}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="px-2 py-0.5 bg-[#FAF7F2] rounded-full text-xs font-medium">
                {CATEGORY_ICONS[place.category]} {place.category.replace('-', ' ')}
              </span>
              <span className="text-gray-500">{place.area}</span>
              <span className="text-yellow-500">⭐ {place.rating}</span>
              <span className="text-gray-400">({place.reviewCount.toLocaleString()})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
          <span className={openStatus.color + ' font-medium'}>{openStatus.status}</span>
          <span>•</span>
          <span>{BUDGET_LABELS[place.budget]}</span>
          <span>•</span>
          <span>{place.indoor && place.outdoor ? 'Indoor/Outdoor' : place.indoor ? 'Indoor' : 'Outdoor'}</span>
          <span>•</span>
          <span>⏱️ {place.avgTimeMinutes} min</span>
        </div>

        <p className="text-sm text-gray-600 mb-2">{place.description}</p>

        <p className="text-sm italic text-gray-500 mb-3">💡 {place.insiderTip}</p>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">{stop.arrivalTime} - {stop.departureTime}</span>
        </div>

        <div className="flex gap-2 mt-3">
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#1B4965] text-white rounded-full text-sm hover:bg-[#15384f]"
          >
            🗺️ Navigate
          </a>
          {onSwap && (
            <button
              onClick={() => onSwap(place.id)}
              className="px-4 py-2 border border-[#1B4965] text-[#1B4965] rounded-full text-sm hover:bg-[#FAF7F2]"
            >
              🔄 Swap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
