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

  const liveIndicator = (
    <span className="inline-flex items-center gap-1 text-xs opacity-60">
      <span className={`w-1 h-1 rounded-full ${isLive ? 'bg-green-400' : 'bg-gray-400'}`} />
      {isLive ? 'Live' : 'Estimated'}
    </span>
  );

  const routeLabel = (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-semibold text-gray-800">{from}</span>
      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
      <span className="font-semibold text-gray-800">{to}</span>
    </div>
  );

  if (severity === 'clear') {
    return (
      <div className="border-l-4 border-emerald-400 bg-white rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-soft">
        {routeLabel}
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 font-medium text-sm flex items-center gap-1.5">
            🟢 Smooth ride — {currentTravelTime} min
          </span>
          {liveIndicator}
        </div>
      </div>
    );
  }

  if (severity === 'light') {
    return (
      <div className="border-l-4 border-yellow-400 bg-white rounded-xl px-5 py-4 shadow-soft">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {routeLabel}
          {liveIndicator}
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm flex-wrap">
          <span className="text-yellow-600 font-semibold">
            🟡 Slightly slow — {currentTravelTime} min
          </span>
          <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-lg font-medium border border-yellow-100">+{delayMinutes}m</span>
          <span className="text-gray-400 text-xs line-through">{normalTravelTime}m normally</span>
        </div>
        {alternative && (
          <p className="mt-2 text-xs text-[#0F172A] bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
            💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away. {alternative.reason}
          </p>
        )}
        {bestDepartureWindow && (
          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">⏰ {bestDepartureWindow}</p>
        )}
      </div>
    );
  }

  if (severity === 'moderate') {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 shadow-soft">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {routeLabel}
          {liveIndicator}
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <span className="text-orange-600 font-bold text-sm">🟠 Moderate traffic</span>
          <span className="text-sm text-gray-700 font-medium">
            {currentTravelTime} min
          </span>
          <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-lg font-semibold border border-orange-200">
            +{delayMinutes}m delay
          </span>
        </div>
        <p className="mt-3 text-xs text-orange-700 bg-orange-100 rounded-lg px-3 py-2 border border-orange-200/50">
          Consider waiting a bit — traffic may ease soon.
        </p>
        {alternative && (
          <p className="mt-2 text-xs text-[#0F172A] bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
            💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away. {alternative.reason}
          </p>
        )}
        {bestDepartureWindow && (
          <p className="mt-2 text-xs text-gray-600 font-medium flex items-center gap-1">⏰ {bestDepartureWindow}</p>
        )}
      </div>
    );
  }

  if (severity === 'heavy') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-5 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {routeLabel}
          {liveIndicator}
        </div>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span className="text-red-600 font-bold text-sm">🔴 Heavy traffic</span>
          <span className="text-sm text-gray-700 font-medium">{currentTravelTime} min</span>
          <span className="text-xs bg-red-100 text-red-700 px-2.5 py-0.5 rounded-lg font-bold border border-red-200">
            +{delayMinutes}m
          </span>
        </div>
        {incidents.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {incidents.map((inc, i) => (
              <p key={i} className="text-xs text-red-700 bg-red-100/70 px-3 py-2 rounded-lg border border-red-200/50 flex items-center gap-1.5">
                <span className="text-sm">⚠️</span> {inc.type}: {inc.description}
              </p>
            ))}
          </div>
        )}
        {alternative && (
          <div className="mt-3 bg-white border border-[#0F172A]/20 rounded-xl px-4 py-3">
            <p className="text-xs text-[#0F172A] font-semibold">
              💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away.
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{alternative.reason}</p>
          </div>
        )}
        {bestDepartureWindow && (
          <p className="mt-3 text-xs text-gray-600 font-medium flex items-center gap-1">⏰ {bestDepartureWindow}</p>
        )}
      </div>
    );
  }

  // standstill
  return (
    <div className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl px-5 py-5 shadow-elevated">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">{from}</span>
          <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          <span className="font-bold">{to}</span>
        </div>
        <span className="text-xs opacity-70 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm">{isLive ? 'Live' : 'Estimated'}</span>
      </div>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="font-bold text-base">🛑 Standstill</span>
        <span className="text-sm opacity-90">{currentTravelTime} min</span>
        <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-lg font-bold backdrop-blur-sm">+{delayMinutes}m</span>
      </div>
      {incidents.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {incidents.map((inc, i) => (
            <p key={i} className="text-xs bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
              ⚠️ {inc.type}: {inc.description}
            </p>
          ))}
        </div>
      )}
      {alternative && (
        <div className="mt-3 bg-white text-[#0F172A] rounded-xl px-4 py-3">
          <p className="text-xs font-bold">
            💡 Consider {alternative.placeName} instead — only {alternative.travelTime} min away.
          </p>
          <p className="text-xs text-gray-600 mt-0.5">{alternative.reason}</p>
        </div>
      )}
      {bestDepartureWindow && (
        <p className="mt-3 text-xs opacity-90 font-medium flex items-center gap-1">⏰ {bestDepartureWindow}</p>
      )}
    </div>
  );
}
