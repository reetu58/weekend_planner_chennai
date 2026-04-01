'use client';
import { useState, useMemo } from 'react';
import { PLACES } from '../../lib/places-data';
import { PlaceCategory, CATEGORY_LABELS, CATEGORY_ICONS, Place } from '../../types';

const ALL_CATEGORIES: ('all' | PlaceCategory)[] = [
  'all', 'beaches', 'cafes', 'parks', 'sports-fun', 'temples-heritage',
  'shopping', 'art-museums', 'street-food', 'photography',
];

const BUDGET_LABELS: Record<string, string> = {
  free: 'Free', 'under-500': '₹ Under 500', 'under-2000': '₹ Under 2,000', 'no-limit': '₹₹₹',
};

function isOpenNow(place: Place): boolean {
  const now = new Date();
  const day = now.getDay() === 0 ? 'sunday' : 'saturday';
  const hours = place.openHours[day];
  if (!hours) return false;
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = hours.open.split(':').map(Number);
  const [ch, cm] = hours.close.split(':').map(Number);
  return currentMin >= oh * 60 + om && currentMin < ch * 60 + cm;
}

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | PlaceCategory>('all');
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterFree, setFilterFree] = useState(false);
  const [filterIndoor, setFilterIndoor] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  const filtered = useMemo(() => {
    let list = [...PLACES];
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
    if (filterOpenNow) list = list.filter(isOpenNow);
    if (filterFree) list = list.filter(p => p.budget === 'free');
    if (filterIndoor) list = list.filter(p => p.indoor);
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [selectedCategory, filterOpenNow, filterFree, filterIndoor, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="bg-gradient-to-br from-[#1B4965] to-[#2d7da8] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Explore Chennai</h1>
          <p className="text-white/70">Browse all places — find your next weekend spot</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
          {ALL_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-[#1B4965] text-white shadow-sm'
                  : 'bg-white text-gray-600 border hover:border-gray-400'
              }`}
            >
              {c === 'all' ? '🌟 All' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={filterOpenNow} onChange={() => setFilterOpenNow(!filterOpenNow)}
              className="rounded text-[#1B4965]" />
            Open now
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={filterFree} onChange={() => setFilterFree(!filterFree)}
              className="rounded text-[#1B4965]" />
            Free entry
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={filterIndoor} onChange={() => setFilterIndoor(!filterIndoor)}
              className="rounded text-[#1B4965]" />
            Indoor
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded-lg px-3 py-1 text-gray-600"
          >
            <option value="rating">Sort: Rating</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Place Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(place => (
            <div key={place.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[#1B4965]">{place.name}</h3>
                  <p className="text-sm text-gray-500">{place.area}</p>
                </div>
                <span className="text-2xl">{CATEGORY_ICONS[place.category]}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                <span className="text-yellow-500 font-medium">⭐ {place.rating}</span>
                <span>({place.reviewCount.toLocaleString()})</span>
                <span>•</span>
                <span>{BUDGET_LABELS[place.budget]}</span>
                <span>•</span>
                <span>{place.indoor ? '🏠 Indoor' : '🌤️ Outdoor'}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{place.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isOpenNow(place) ? 'text-green-600' : 'text-red-500'}`}>
                  {isOpenNow(place) ? '✅ Open now' : '❌ Closed'}
                </span>
                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1B4965] font-medium hover:underline"
                >
                  Navigate →
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">🤷</p>
            <p className="text-gray-500">No places match your filters. Try adjusting them!</p>
          </div>
        )}
      </div>
    </div>
  );
}
