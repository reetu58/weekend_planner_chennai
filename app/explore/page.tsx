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
    <div className="min-h-screen bg-sand">
      {/* Hero Header */}
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="hero-dots absolute inset-0" />
        <div className="absolute top-10 left-[15%] w-48 h-48 bg-[#FFB703]/8 rounded-full blur-[80px]" />

        <div className="relative max-w-5xl mx-auto text-center px-4 pt-28 pb-14">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in-up tracking-tight">Explore Chennai</h1>
          <p className="text-white/50 text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Browse all places — find your next weekend spot
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40h1440V20c-240 15-480 22-720 15S240 10 0 25v15z" fill="#FAF7F2"/></svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-5 pb-2">
          {ALL_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 chip-press ${
                selectedCategory === c
                  ? 'bg-[#1B4965] text-white shadow-glow-primary/20'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c === 'all' ? '🌟 All' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-soft">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters</span>
          <div className="w-px h-5 bg-gray-200" />
          <label className="flex items-center gap-2 text-sm cursor-pointer group">
            <input type="checkbox" checked={filterOpenNow} onChange={() => setFilterOpenNow(!filterOpenNow)}
              className="rounded border-gray-300 text-[#1B4965] focus:ring-[#1B4965]/20" />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Open now</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer group">
            <input type="checkbox" checked={filterFree} onChange={() => setFilterFree(!filterFree)}
              className="rounded border-gray-300 text-[#1B4965] focus:ring-[#1B4965]/20" />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Free entry</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer group">
            <input type="checkbox" checked={filterIndoor} onChange={() => setFilterIndoor(!filterIndoor)}
              className="rounded border-gray-300 text-[#1B4965] focus:ring-[#1B4965]/20" />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Indoor</span>
          </label>
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1B4965]/20 focus:border-[#1B4965] bg-white"
            >
              <option value="rating">Sort: Rating</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-4">
          {filtered.length} {filtered.length === 1 ? 'place' : 'places'} found
        </p>

        {/* Place Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {filtered.map(place => (
            <div key={place.id} className="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden card-hover group">
              {/* Image */}
              <div className="relative w-full h-36 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                {place.photoUrl ? (
                  <img
                    src={place.photoUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      const fb = `https://placehold.co/800x400/1B4965/FFB703?text=${encodeURIComponent(place.name)}`;
                      if (t.src !== fb) t.src = fb;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1B4965] to-[#2d7da8] flex items-center justify-center">
                    <span className="text-4xl">{CATEGORY_ICONS[place.category]}</span>
                  </div>
                )}
                {/* Category badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 glass rounded-lg text-xs font-medium shadow-sm">
                    {CATEGORY_ICONS[place.category]}
                  </span>
                </div>
                {/* Status */}
                <div className="absolute bottom-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${
                    isOpenNow(place) ? 'bg-green-500/90 text-white' : 'bg-black/50 text-white/80'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow(place) ? 'bg-white' : 'bg-red-400'}`} />
                    {isOpenNow(place) ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <a
                      href={place.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Chennai')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#1B4965] hover:text-[#2d7da8] transition-colors truncate block text-base"
                    >
                      {place.name}
                    </a>
                    <p className="text-sm text-gray-400 mt-0.5">{place.area}</p>
                  </div>
                </div>

                {/* Rating & meta */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg text-xs font-semibold text-yellow-600 border border-yellow-100">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {place.rating}
                  </span>
                  <span className="px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-500 font-medium border border-gray-100">
                    {BUDGET_LABELS[place.budget]}
                  </span>
                  <span className="px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-500 font-medium border border-gray-100">
                    {place.indoor ? '🏠 Indoor' : '🌤️ Outdoor'}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{place.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={place.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#1B4965] text-white rounded-xl text-xs font-medium hover:bg-primary-dark transition-colors chip-press"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Navigate
                  </a>
                  <a
                    href={place.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(place.name + ' Chennai')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#FFB703] text-[#1B4965] rounded-xl text-xs font-bold hover:bg-accent-light transition-colors chip-press"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Google It
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤷</span>
            </div>
            <p className="text-gray-400 text-lg font-medium">No places match your filters</p>
            <p className="text-gray-300 text-sm mt-1">Try adjusting your filters!</p>
          </div>
        )}
      </div>
    </div>
  );
}
