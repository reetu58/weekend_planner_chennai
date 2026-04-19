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
      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border select-none ${
        selected
          ? 'bg-[#F43F5E] border-[#F43F5E] text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">{num}</span>
      <span className="w-8 h-px bg-white/10" />
      <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">{label}</span>
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
      <div className="flex gap-3 items-end border-b border-white/20 pb-3 focus-within:border-[#F43F5E] transition-colors">
        <svg className="w-5 h-5 text-white/40 flex-shrink-0 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setShowResults(true)}
          placeholder="Search any area, street, or landmark..."
          className="flex-1 bg-transparent text-white placeholder-white/25 focus:outline-none text-base"
          spellCheck={false}
        />
        {isSearching && (
          <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin flex-shrink-0" />
        )}
        {selectedLabel && !isSearching && (
          <span className="w-4 h-4 flex-shrink-0 text-green-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </span>
        )}
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="text-[11px] text-white/40 hover:text-white/70 font-medium tracking-wide whitespace-nowrap transition-colors flex-shrink-0"
        >
          Use GPS
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl max-h-52 overflow-y-auto animate-fade-in-up">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 border-b border-white/5 last:border-b-0 transition-colors flex items-center gap-3 text-white/70 hover:text-white"
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
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide transition-all ${
              selectedLabel === a
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/[0.03] text-white/50 border border-transparent hover:bg-white/8 hover:text-white'
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
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl px-8 py-10 flex flex-col gap-9">

      {/* Section 01: When */}
      <section className="flex flex-col gap-0">
        <SectionHeader num="01" label="When" />
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="date"
            value={selectedDate}
            min={minDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F43F5E] transition-colors"
          />
          <span className="text-sm text-white/50 font-medium">{selectedDayLabel}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {(Object.keys(DURATION_LABELS) as string[]).map(d => (
            <Chip key={d} label={DURATION_LABELS[d]} selected={duration === Number(d)} onClick={() => setDuration(Number(d) as Duration)} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {(Object.keys(SLOT_LABELS) as TimeSlot[]).map(s => (
            <Chip key={s} label={SLOT_LABELS[s]} selected={timeSlot === s} onClick={() => setTimeSlot(s)} />
          ))}
        </div>

        <div className="mt-5">
          <p className="text-[11px] text-white/30 uppercase tracking-widest font-bold mb-2">Departure time</p>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F43F5E] transition-colors"
          />
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* Section 02: Group & Budget */}
      <section className="flex flex-col gap-0">
        <SectionHeader num="02" label="Group & Budget" />
        <div className="flex flex-wrap gap-2.5 mb-5">
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

      <div className="border-t border-white/5" />

      {/* Section 03: Mood & Places */}
      <section className="flex flex-col gap-0">
        <SectionHeader num="03" label="Mood & Places" />
        <div className="flex flex-wrap gap-2.5 mb-5">
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

      <div className="border-t border-white/5" />

      {/* Section 04: Location */}
      <section className="flex flex-col gap-0">
        <SectionHeader num="04" label="Starting Point" />
        <div className="mb-5 flex flex-wrap gap-2.5">
          <Chip label="Within 10 km" selected={distanceLimit === 10} onClick={() => setDistanceLimit(10)} />
          <Chip label="Within 30 km" selected={distanceLimit === 30} onClick={() => setDistanceLimit(30)} />
          <Chip label="No limit" selected={distanceLimit === 0} onClick={() => setDistanceLimit(0)} />
        </div>
        <LocationSearch onSelect={handleLocationSelect} />
      </section>

      {/* Conflict warning */}
      {hasConflict && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
          <p className="text-sm text-red-400">
            {categories.includes('nightlife') && (timeSlot === 'morning' || timeSlot === 'afternoon')
              ? 'Nightlife venues open from 5 PM — switch to Evening or remove Nightlife.'
              : 'Nightlife and nature parks run on opposite schedules — pick one.'}
          </p>
        </div>
      )}

      {vibes.length === 0 && categories.length === 0 && !hasConflict && (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
          <p className="text-sm text-white/40">Pick at least one mood or category for best results</p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || hasConflict}
        className="w-full relative overflow-hidden bg-[#F43F5E] text-white font-semibold py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_30px_rgba(244,63,94,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        {isGenerating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Building your plan...</span>
          </>
        ) : (
          <>
            <span>Generate Blueprint</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
