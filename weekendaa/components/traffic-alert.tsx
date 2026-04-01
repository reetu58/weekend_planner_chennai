'use client';

import { TrafficAlert } from '../types';

interface Props {
  alert: TrafficAlert;
}

export default function TrafficAlertCard({ alert }: Props) {
  const {
    from,
    to,
    currentTravelTime,
    normalTravelTime,
    delayMinutes,
    severity,
    incidents,
    alternative,
    bestDepartureWindow,
    isLive,
  } = alert;

  const liveIndicator = isLive ? '📡 Live traffic' : '📊 Estimated';

  if (severity === 'clear') {
    return (
      <div className="border-b-4 border-[#2D6A4F] bg-white rounded-lg px-4 py-2 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium text-gray-800">{from}</span>
          <span>→</span>
          <span className="font-medium text-gray-800">{to}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#2D6A4F] font-medium">🟢 Smooth ride — {currentTravelTime} min</span>
          <span className="text-xs text-gray-400">{liveIndicator}</span>
        </div>
      </div>
    );
  }

  if (severity === 'light') {
    return (
      <div className="border-l-4 border-yellow-400 bg-white rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-800">{from}</span>
            <span>→</span>
            <span className="font-medium text-gray-800">{to}</span>
          </div>
          <span className="text-xs text-gray-400">{liveIndicator}</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm flex-wrap">
          <span className="text-yellow-600 font-medium">
            🟡 Slightly slow — {currentTravelTime} min (+{delayMinutes})
          </span>
          <span className="text-gray-400 text-xs line-through">{normalTravelTime} min normally</span>
        </div>
        {alternative && (
          <p className="mt-1 text-xs text-[#1B4965]">
            💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away. {alternative.reason}
          </p>
        )}
        {bestDepartureWindow && (
          <p className="mt-1 text-xs text-gray-500">⏰ {bestDepartureWindow}</p>
        )}
      </div>
    );
  }

  if (severity === 'moderate') {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{from}</span>
            <span>→</span>
            <span className="font-semibold text-gray-900">{to}</span>
          </div>
          <span className="text-xs text-gray-400">{liveIndicator}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <span className="text-[#EF9F27] font-semibold text-sm">🟠 Moderate traffic</span>
          <span className="text-sm text-gray-700">
            {currentTravelTime} min <span className="text-gray-400 line-through text-xs">{normalTravelTime} min</span>
          </span>
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
            +{delayMinutes} min delay
          </span>
        </div>
        <p className="mt-2 text-xs text-orange-700 bg-orange-100 rounded px-2 py-1">
          Consider waiting a bit — traffic may ease soon.
        </p>
        {alternative && (
          <p className="mt-2 text-xs text-[#1B4965]">
            💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away. {alternative.reason}
          </p>
        )}
        {bestDepartureWindow && (
          <p className="mt-1 text-xs text-gray-600">⏰ {bestDepartureWindow}</p>
        )}
      </div>
    );
  }

  if (severity === 'heavy') {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-4 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-gray-900">{from}</span>
            <span className="text-gray-500">→</span>
            <span className="font-bold text-gray-900">{to}</span>
          </div>
          <span className="text-xs text-gray-400">{liveIndicator}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <span className="text-[#E24B4A] font-bold text-sm">🔴 Heavy traffic</span>
          <span className="text-sm text-gray-700">
            {currentTravelTime} min{' '}
            <span className="text-gray-400 line-through text-xs">({normalTravelTime} min normally)</span>
          </span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
            +{delayMinutes} min
          </span>
        </div>
        {incidents.length > 0 && (
          <div className="mt-2 space-y-1">
            {incidents.map((inc, i) => (
              <p key={i} className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                ⚠️ {inc.type}: {inc.description}
              </p>
            ))}
          </div>
        )}
        {alternative && (
          <div className="mt-3 bg-white border border-[#1B4965] rounded px-3 py-2">
            <p className="text-xs text-[#1B4965] font-semibold">
              💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away.
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{alternative.reason}</p>
          </div>
        )}
        {bestDepartureWindow && (
          <p className="mt-2 text-xs text-gray-600 font-medium">⏰ {bestDepartureWindow}</p>
        )}
      </div>
    );
  }

  // standstill
  return (
    <div className="w-full bg-[#E24B4A] text-white rounded-lg px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">{from}</span>
          <span className="opacity-75">→</span>
          <span className="font-bold">{to}</span>
        </div>
        <span className="text-xs opacity-75 bg-white/10 px-2 py-0.5 rounded-full">{liveIndicator}</span>
      </div>
      <div className="mt-2 flex items-center gap-3 flex-wrap">
        <span className="font-bold text-base">🛑 Standstill</span>
        <span className="text-sm opacity-90">
          {currentTravelTime} min{' '}
          <span className="opacity-60 line-through text-xs">({normalTravelTime} min normally)</span>
        </span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">+{delayMinutes} min</span>
      </div>
      {incidents.length > 0 && (
        <div className="mt-2 space-y-1">
          {incidents.map((inc, i) => (
            <p key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
              ⚠️ {inc.type}: {inc.description}
            </p>
          ))}
        </div>
      )}
      {alternative && (
        <div className="mt-3 bg-white text-[#1B4965] rounded px-3 py-2">
          <p className="text-xs font-bold">
            💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away.
          </p>
          <p className="text-xs text-gray-600 mt-0.5">{alternative.reason}</p>
        </div>
      )}
      {bestDepartureWindow && (
        <p className="mt-2 text-xs opacity-90 font-medium">⏰ {bestDepartureWindow}</p>
      )}
    </div>
  );
}
