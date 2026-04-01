'use client';
import { useState } from 'react';
import {
  UserPrefs, PlaceCategory, Vibe, GroupType, BudgetRange,
  DayChoice, TimeSlot, Duration, AREAS, CATEGORY_LABELS,
} from '../types';

interface Props {
  onGenerate: (prefs: UserPrefs) => void;
  isGenerating?: boolean;
}

function Chip({ label, selected, onClick, variant = 'single' }: {
  label: string; selected: boolean; onClick: () => void; variant?: 'single' | 'multi';
}) {
  const base = 'px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border select-none';
  const styles = selected
    ? variant === 'multi'
      ? `${base} bg-[#FFB703] text-[#1B4965] border-[#FFB703] shadow-sm`
      : `${base} bg-[#1B4965] text-white border-[#1B4965] shadow-sm`
    : `${base} bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:scale-105`;
  return <button type="button" className={styles} onClick={onClick}>{label}</button>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-[#1B4965] uppercase tracking-wide mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const VIBE_LABELS: Record<Vibe, string> = {
  chill: '😌 Chill', adventure: '🏄 Adventure', romantic: '💕 Romantic',
  cultural: '🏛️ Cultural', social: '🎉 Social', artsy: '🎨 Artsy',
  family: '👨‍👩‍👧‍👦 Family', foodie: '🍜 Foodie', nature: '🌿 Nature',
};

const GROUP_LABELS: Record<GroupType, string> = {
  solo: '🧑 Solo', couple: '💑 Couple', friends: '👯 Friends',
  family: '👨‍👩‍👧 Family', 'large-group': '🎊 Large Group',
};

const BUDGET_LABELS: Record<BudgetRange, string> = {
  free: 'Free only', 'under-500': 'Under ₹500', 'under-2000': 'Under ₹2,000', 'no-limit': 'No limit',
};

const DAY_LABELS: Record<DayChoice, string> = {
  saturday: 'Saturday', sunday: 'Sunday', both: 'Both days',
};

const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '🌅 Morning', afternoon: '☀️ Afternoon', evening: '🌆 Evening', flexible: '🔄 Flexible',
};

const DURATION_LABELS: Record<string, string> = {
  '120': '2h', '240': '4h', '360': '6h', '480': 'Full Day',
};

export default function PreferenceBuilder({ onGenerate, isGenerating }: Props) {
  const [day, setDay] = useState<DayChoice>('saturday');
  const [duration, setDuration] = useState<Duration>(240);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('flexible');
  const [departureTime, setDepartureTime] = useState('');
  const [groupType, setGroupType] = useState<GroupType>('friends');
  const [budget, setBudget] = useState<BudgetRange>('under-500');
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [startArea, setStartArea] = useState<string>(AREAS[0]);

  const toggleVibe = (v: Vibe) =>
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleCategory = (c: PlaceCategory) =>
    setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleGenerate = () => {
    onGenerate({ day, duration, timeSlot, departureTime, groupType, budget, vibes, categories, startArea });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Section title="When & How Long">
        {(Object.keys(DAY_LABELS) as DayChoice[]).map(d => (
          <Chip key={d} label={DAY_LABELS[d]} selected={day === d} onClick={() => setDay(d)} />
        ))}
        <div className="w-full" />
        {(Object.keys(DURATION_LABELS) as string[]).map(d => (
          <Chip key={d} label={DURATION_LABELS[d]} selected={duration === Number(d)} onClick={() => setDuration(Number(d) as Duration)} />
        ))}
      </Section>

      <Section title="Time Slot">
        {(Object.keys(SLOT_LABELS) as TimeSlot[]).map(s => (
          <Chip key={s} label={SLOT_LABELS[s]} selected={timeSlot === s} onClick={() => setTimeSlot(s)} />
        ))}
      </Section>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#1B4965] uppercase tracking-wide mb-3">
          Departure Time
        </h3>
        <input
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="px-4 py-2 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4965]"
          placeholder="When are you heading out?"
        />
        <p className="text-xs text-gray-400 mt-1">When are you heading out? (triggers live traffic check)</p>
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

      <Section title="Mood (pick as many as you like)">
        {(Object.keys(VIBE_LABELS) as Vibe[]).map(v => (
          <Chip key={v} label={VIBE_LABELS[v]} selected={vibes.includes(v)} onClick={() => toggleVibe(v)} variant="multi" />
        ))}
      </Section>

      <Section title="Categories">
        {(Object.keys(CATEGORY_LABELS) as PlaceCategory[]).map(c => (
          <Chip key={c} label={CATEGORY_LABELS[c]} selected={categories.includes(c)} onClick={() => toggleCategory(c)} variant="multi" />
        ))}
      </Section>

      <Section title="Starting Area">
        {AREAS.map(a => (
          <Chip key={a} label={a} selected={startArea === a} onClick={() => setStartArea(a)} />
        ))}
      </Section>

      {vibes.length === 0 && categories.length === 0 && (
        <p className="text-sm text-orange-500 mb-4">💡 Pick at least one mood or category for best results</p>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-4 bg-[#1B4965] text-white text-lg font-bold rounded-full hover:bg-[#15384f] transition-all disabled:opacity-50 shadow-lg"
      >
        {isGenerating ? '⏳ Generating your plan...' : 'Generate My Plan ✨'}
      </button>
    </div>
  );
}
