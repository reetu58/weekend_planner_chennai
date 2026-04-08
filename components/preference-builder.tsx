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

function Chip({ label, selected, onClick, variant = 'single' }: {
  label: string; selected: boolean; onClick: () => void; variant?: 'single' | 'multi';
}) {
  const base = 'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border select-none';
  const styles = selected
    ? variant === 'multi'
      ? `${base} bg-[#FFB703] text-[#1B4965] border-[#FFB703] shadow-md scale-[1.02]`
      : `${base} bg-[#1B4965] text-white border-[#1B4965] shadow-md scale-[1.02]`
    : `${base} bg-white text-gray-500 border-gray-200 hover:border-[#1B4965]/30 hover:shadow-sm`;
  return <button type="button" className={styles} onClick={onClick}>{label}</button>;
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-[#1B4965] uppercase tracking-wider mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

const VIBE_LABELS: Record<Vibe, string> = {
  chill: '😌 Chill', adventure: '🏄 Adventure', romantic: '💕 Romantic',
  cultural: '🏛️ Cultural', social: '🎉 Social', artsy: '🎨 Artsy',
  family: '👨‍👩‍👧‍👦 Family', foodie: '🍜 Foodie', nature: '🌿 Nature',
  productive: '💻 Productive', wellness: '🧘 Wellness',
  nightout: '🌙 Night Out', learning: '🎓 Learn Something',
};

const GROUP_LABELS: Record<GroupType, string> = {
  solo: '🧑 Solo', couple: '💑 Couple', friends: '👯 Friends',
  family: '👨‍👩‍👧 Family', 'large-group': '🎊 Large Group',
};

const BUDGET_LABELS: Record<BudgetRange, string> = {
  free: 'Free only', 'under-500': 'Under ₹500', 'under-2000': 'Under ₹2,000', 'no-limit': 'No limit',
};

const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '🌅 Morning', afternoon: '☀️ Afternoon', evening: '🌆 Evening', flexible: '🔄 Flexible',
};

const DURATION_LABELS: Record<string, string> = {
  '120': '2h', '240': '4h', '360': '6h', '480': 'Full Day',
};

function getDayFromDate(dateStr: string): DayChoice {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'saturday'; // weekdays default to saturday hours
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
      // Use Nominatim (OpenStreetMap) geocoding — free, no key needed
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
      // Fallback: filter known areas
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
        const label = `My Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`;
        setSelectedLabel(label);
        setQuery(label);
        onSelect('My Location', pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // Denied or error — ignore
      }
    );
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => query.length >= 2 && results.length > 0 && setShowResults(true)}
            placeholder="Search any area, street, or landmark in Chennai..."
            className="w-full px-4 py-3 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4965] pr-10"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400">⏳</span>
          )}
          {selectedLabel && !isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="px-4 py-3 bg-[#1B4965] text-white rounded-xl text-sm font-medium hover:bg-[#15384f] whitespace-nowrap"
        >
          📍 Use My Location
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-[#FAF7F2] border-b last:border-b-0 transition-colors"
            >
              <span className="text-gray-400 mr-2">📍</span>
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Quick area chips as fallback */}
      <div className="flex flex-wrap gap-2 mt-3">
        <p className="w-full text-xs text-gray-400 mb-1">Or pick a popular area:</p>
        {AREAS.map(a => (
          <button
            key={a}
            type="button"
            onClick={() => handleSelect({ name: a, lat: AREA_COORDINATES[a].lat, lng: AREA_COORDINATES[a].lng })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              selectedLabel === a
                ? 'bg-[#1B4965] text-white border-[#1B4965]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
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
    // Default to next Saturday
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
      day,
      date: selectedDate,
      duration,
      timeSlot,
      departureTime,
      groupType,
      budget,
      vibes,
      categories,
      startArea,
      startLat,
      startLng,
      distanceLimit,
    });
  };

  // Get day label for selected date
  const selectedDayLabel = (() => {
    const d = new Date(selectedDate + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  })();

  // Get min date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Date Picker */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#1B4965] uppercase tracking-wide mb-1">
          Pick a Date
        </h3>
        <p className="text-xs text-gray-400 mb-3">When do you want to go out?</p>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            min={minDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4965] text-lg"
          />
          <span className="text-sm text-gray-500 bg-[#FAF7F2] px-3 py-2 rounded-lg">
            📅 {selectedDayLabel}
          </span>
        </div>
      </div>

      {/* Duration */}
      <Section title="How Long" subtitle="How much time do you have?">
        {(Object.keys(DURATION_LABELS) as string[]).map(d => (
          <Chip key={d} label={DURATION_LABELS[d]} selected={duration === Number(d)} onClick={() => setDuration(Number(d) as Duration)} />
        ))}
      </Section>

      <Section title="Time Slot" subtitle="What part of the day?">
        {(Object.keys(SLOT_LABELS) as TimeSlot[]).map(s => (
          <Chip key={s} label={SLOT_LABELS[s]} selected={timeSlot === s} onClick={() => setTimeSlot(s)} />
        ))}
      </Section>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#1B4965] uppercase tracking-wide mb-1">
          Departure Time
        </h3>
        <p className="text-xs text-gray-400 mb-3">When are you heading out? (triggers live traffic check)</p>
        <input
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="px-4 py-3 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4965]"
        />
      </div>

      <Section title="Who's Coming">
        {(Object.keys(GROUP_LABELS) as GroupType[]).map(g => (
          <Chip key={g} label={GROUP_LABELS[g]} selected={groupType === g} onClick={() => setGroupType(g)} />
        ))}
      </Section>

      <Section title="Budget">
        {(Object.keys(BUDGET_LABELS) as BudgetRange[]).map(b => (
          <Chip key={b} label={BUDGET_LABELS[b]} selected={budget === b} onClick={() => setBudget(b)} />
        ))}
      </Section>

      <Section title="Mood" subtitle="Pick as many as you like">
        {(Object.keys(VIBE_LABELS) as Vibe[]).map(v => (
          <Chip key={v} label={VIBE_LABELS[v]} selected={vibes.includes(v)} onClick={() => toggleVibe(v)} variant="multi" />
        ))}
      </Section>

      <Section title="Distance Limit" subtitle="How far are you willing to travel?">
        <Chip label="📍 Within 10 km" selected={distanceLimit === 10} onClick={() => setDistanceLimit(10)} />
        <Chip label="🚗 Within 30 km" selected={distanceLimit === 30} onClick={() => setDistanceLimit(30)} />
        <Chip label="🌍 No Limit" selected={distanceLimit === 0} onClick={() => setDistanceLimit(0)} />
      </Section>

      <Section title="Categories" subtitle="What kind of places?">
        {(Object.keys(CATEGORY_LABELS) as PlaceCategory[]).map(c => (
          <Chip key={c} label={CATEGORY_LABELS[c]} selected={categories.includes(c)} onClick={() => toggleCategory(c)} variant="multi" />
        ))}
      </Section>

      {/* Location Search */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#1B4965] uppercase tracking-wide mb-1">
          Starting Location
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Where are you starting from? Search any area, street, or use your live location for exact distances.
        </p>
        <LocationSearch onSelect={handleLocationSelect} />
      </div>

      {vibes.length === 0 && categories.length === 0 && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl mb-6">
          <span className="text-amber-500 text-lg">💡</span>
          <p className="text-sm text-amber-700">Pick at least one mood or category for best results</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-4 bg-gradient-to-r from-[#1B4965] to-[#2d7da8] text-white text-lg font-bold rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 shadow-lg btn-shine"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Building your plan...
          </span>
        ) : 'Generate My Plan'}
      </button>
    </div>
  );
}
