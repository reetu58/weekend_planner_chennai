'use client';
import { useState, useRef, useCallback } from 'react';
import {
  UserPrefs, PlaceCategory, Vibe, GroupType, BudgetRange, DistanceLimit,
  DayChoice, TimeSlot, Duration, AREAS, CATEGORY_LABELS, AREA_COORDINATES,
} from '../types';

interface Props {
  onGenerate: (prefs: UserPrefs) => void;
  isGenerating?: boolean;
}

function Chip({ label, selected, onClick }: {
  label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border select-none ${
        selected
          ? 'bg-[#F43F5E] border-[#F43F5E] text-white shadow-[0_4px_14px_rgba(244,63,94,0.3)]'
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-[#0F172A] shadow-sm'
      }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-sm font-bold text-[#0F172A]">{label}</span>
      <span className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

const VIBE_LABELS: Record<Vibe, string> = {
  chill: 'Chill', adventure: 'Adventure', romantic: 'Romantic',
  cultural: 'Cultural', social: 'Social', family: 'Family',
  foodie: 'Foodie', nature: 'Nature',
};

const GROUP_LABELS: Record<GroupType, string> = {
  solo: 'Solo', couple: 'Couple', friends: 'Friends',
  family: 'Family', 'large-group': 'Large Group',
};

const BUDGET_LABELS: Record<BudgetRange, string> = {
  free: 'Free only', 'under-500': 'Under ₹500', 'under-2000': 'Under ₹2,000', 'no-limit': 'No limit',
};

const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', flexible: 'Flexible',
};

const DURATION_LABELS: Record<string, string> = {
  '120': '2 hrs', '240': '4 hrs', '360': '6 hrs', '480': 'Full day',
};

function getDayFromDate(dateStr: string): DayChoice {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'saturday';
}

function LocationSearch({ onSelect }: {
  onSelect: (area: string, lat: number, lng: number) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ name: string; lat: number; lng: number }>>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchLocation = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Chennai, India')}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.map((r: any) => ({
          name: r.display_name.split(',').slice(0, 3).join(', '),
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
        })));
        setShowResults(true);
      }
    } catch {
      const filtered = AREAS
        .filter(a => a.toLowerCase().includes(q.toLowerCase()))
        .map(a => ({ name: a, lat: AREA_COORDINATES[a].lat, lng: AREA_COORDINATES[a].lng }));
      setResults(filtered);
      setShowResults(true);
    }
    setIsSearching(false);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    setSelectedLabel('');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => searchLocation(val), 400);
  };

  const handleSelect = (r: { name: string; lat: number; lng: number }) => {
    setSelectedLabel(r.name);
    setQuery(r.name);
    setShowResults(false);
    onSelect(r.name, r.lat, r.lng);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const label = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setSelectedLabel(label);
        setQuery(label);
        onSelect('My Location', pos.coords.latitude, pos.coords.longitude);
      },
      () => {}
    );
  };

  return (
    <div className="relative">
      <div className="flex gap-3 items-center bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus-within:border-[#F43F5E] focus-within:shadow-[0_0_0_3px_rgba(244,63,94,0.08)] transition-all">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setShowResults(true)}
          placeholder="Search any area, street, or landmark..."
          className="flex-1 bg-transparent text-[#0F172A] placeholder-slate-400 focus:outline-none text-sm"
          spellCheck={false}
        />
        {isSearching && (
          <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin flex-shrink-0" />
        )}
        {selectedLabel && !isSearching && (
          <span className="w-4 h-4 flex-shrink-0 text-emerald-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </span>
        )}
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="text-[11px] text-slate-400 hover:text-[#F43F5E] font-semibold tracking-wide whitespace-nowrap transition-colors flex-shrink-0"
        >
          Use GPS
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto animate-fade-in-up">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors flex items-center gap-3 text-slate-600 hover:text-[#0F172A]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] flex-shrink-0" />
              {r.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {AREAS.map(a => (
          <button
            key={a}
            type="button"
            onClick={() => handleSelect({ name: a, lat: AREA_COORDINATES[a].lat, lng: AREA_COORDINATES[a].lng })}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all border ${
              selectedLabel === a
                ? 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/20'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PreferenceBuilder({ onGenerate, isGenerating }: Props) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
    const nextSat = new Date(today);
    nextSat.setDate(today.getDate() + daysUntilSat);
    return nextSat.toISOString().split('T')[0];
  });
  const [duration, setDuration] = useState<Duration>(240);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('flexible');
  const [departureTime, setDepartureTime] = useState('');
  const [groupType, setGroupType] = useState<GroupType>('friends');
  const [budget, setBudget] = useState<BudgetRange>('under-500');
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [startArea, setStartArea] = useState(AREAS[0] as string);
  const [startLat, setStartLat] = useState<number | undefined>(undefined);
  const [startLng, setStartLng] = useState<number | undefined>(undefined);
  const [distanceLimit, setDistanceLimit] = useState<DistanceLimit>(0);

  const toggleVibe = (v: Vibe) =>
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleCategory = (c: PlaceCategory) =>
    setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleLocationSelect = (area: string, lat: number, lng: number) => {
    setStartArea(area);
    setStartLat(lat);
    setStartLng(lng);
  };

  const handleGenerate = () => {
    const day = getDayFromDate(selectedDate);
    onGenerate({
      day, date: selectedDate, duration, timeSlot, departureTime,
      groupType, budget, vibes, categories, startArea, startLat, startLng, distanceLimit,
    });
  };

  const selectedDayLabel = (() => {
    const d = new Date(selectedDate + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  })();

  const minDate = new Date().toISOString().split('T')[0];

  const hasConflict = (categories.includes('nightlife') && (timeSlot === 'morning' || timeSlot === 'afternoon'))
    || (categories.includes('nightlife') && categories.includes('nature'));

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm px-8 py-10 flex flex-col gap-9">

      {/* Section: When */}
      <section className="flex flex-col gap-0">
        <SectionLabel label="When" />
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="date"
            value={selectedDate}
            min={minDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-[#F43F5E] transition-colors shadow-sm"
          />
          <span className="text-sm text-slate-500 font-medium">{selectedDayLabel}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {(Object.keys(DURATION_LABELS) as string[]).map(d => (
            <Chip key={d} label={DURATION_LABELS[d]} selected={duration === Number(d)} onClick={() => setDuration(Number(d) as Duration)} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {(Object.keys(SLOT_LABELS) as TimeSlot[]).map(s => (
            <Chip key={s} label={SLOT_LABELS[s]} selected={timeSlot === s} onClick={() => setTimeSlot(s)} />
          ))}
        </div>

        <div className="mt-5">
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mb-2">Departure time (optional)</p>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-[#F43F5E] transition-colors shadow-sm"
          />
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* Section: Group & Budget */}
      <section className="flex flex-col gap-0">
        <SectionLabel label="Group & Budget" />
        <div className="flex flex-wrap gap-2.5 mb-4">
          {(Object.keys(GROUP_LABELS) as GroupType[]).map(g => (
            <Chip key={g} label={GROUP_LABELS[g]} selected={groupType === g} onClick={() => setGroupType(g)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {(Object.keys(BUDGET_LABELS) as BudgetRange[]).map(b => (
            <Chip key={b} label={BUDGET_LABELS[b]} selected={budget === b} onClick={() => setBudget(b)} />
          ))}
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* Section: Mood & Places */}
      <section className="flex flex-col gap-0">
        <SectionLabel label="Mood & Places" />
        <div className="flex flex-wrap gap-2.5 mb-4">
          {(Object.keys(VIBE_LABELS) as Vibe[]).map(v => (
            <Chip key={v} label={VIBE_LABELS[v]} selected={vibes.includes(v)} onClick={() => toggleVibe(v)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {(Object.keys(CATEGORY_LABELS) as PlaceCategory[]).map(c => (
            <Chip key={c} label={CATEGORY_LABELS[c]} selected={categories.includes(c)} onClick={() => toggleCategory(c)} />
          ))}
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* Section: Starting Point */}
      <section className="flex flex-col gap-0">
        <SectionLabel label="Starting Point" />
        <div className="mb-5 flex flex-wrap gap-2.5">
          <Chip label="Within 10 km" selected={distanceLimit === 10} onClick={() => setDistanceLimit(10)} />
          <Chip label="Within 30 km" selected={distanceLimit === 30} onClick={() => setDistanceLimit(30)} />
          <Chip label="No limit" selected={distanceLimit === 0} onClick={() => setDistanceLimit(0)} />
        </div>
        <LocationSearch onSelect={handleLocationSelect} />
      </section>

      {/* Conflict warning */}
      {hasConflict && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
          <p className="text-sm text-red-600">
            {categories.includes('nightlife') && (timeSlot === 'morning' || timeSlot === 'afternoon')
              ? 'Nightlife venues open from 5 PM — switch to Evening or remove Nightlife.'
              : 'Nightlife and nature parks run on opposite schedules — pick one.'}
          </p>
        </div>
      )}

      {vibes.length === 0 && categories.length === 0 && !hasConflict && (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-rose-50 border border-rose-100 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]/40 flex-shrink-0" />
          <p className="text-sm text-slate-400">Pick at least one mood or category for best results</p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || hasConflict}
        className="w-full relative overflow-hidden bg-[#F43F5E] text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.98] shadow-[0_8px_24px_rgba(244,63,94,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-base"
      >
        <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        {isGenerating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Building your plan…</span>
          </>
        ) : (
          <>
            <span>Build My Plan</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
