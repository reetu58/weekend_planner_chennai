import { NextRequest, NextResponse } from 'next/server';
import { PLACES } from '../../../lib/places-data';
import type { Place, PlaceCategory, Vibe, BudgetRange } from '../../../types';
import { AREAS } from '../../../types';

export const dynamic = 'force-dynamic';

interface ChatPlace {
  id: string;
  name: string;
  area: string;
  category: PlaceCategory;
  rating: number;
  budget: BudgetRange;
  photoUrl?: string;
  googleMapsUrl: string;
  insiderTip: string;
}

interface ChatAction {
  label: string;
  href: string;
}

interface ChatReply {
  reply: string;
  places?: ChatPlace[];
  actions?: ChatAction[];
  suggestions?: string[];
}

const CATEGORY_KEYWORDS: Record<PlaceCategory, string[]> = {
  beaches: ['beach', 'beaches', 'sea', 'shore', 'ocean', 'marina', 'sand'],
  food: ['food', 'eat', 'restaurant', 'cafe', 'coffee', 'breakfast', 'lunch', 'dinner', 'foodie', 'dine', 'biryani', 'dosa'],
  culture: ['temple', 'culture', 'cultural', 'heritage', 'historic', 'history', 'museum', 'monument', 'art'],
  nature: ['nature', 'park', 'green', 'garden', 'outdoor', 'tree', 'walk', 'hike'],
  entertainment: ['fun', 'entertainment', 'play', 'arcade', 'movie', 'game', 'activity', 'adventure'],
  shopping: ['shop', 'shopping', 'mall', 'market', 'buy', 'retail'],
  nightlife: ['night', 'nightlife', 'bar', 'pub', 'club', 'drinks', 'lounge'],
  wellness: ['wellness', 'spa', 'massage', 'yoga', 'relax', 'meditation'],
  workshops: ['workshop', 'class', 'learn', 'pottery', 'craft'],
};

const VIBE_KEYWORDS: Record<Vibe, string[]> = {
  chill: ['chill', 'relax', 'calm', 'quiet', 'peaceful', 'laid back'],
  adventure: ['adventure', 'adventurous', 'thrill', 'exciting', 'active'],
  romantic: ['romantic', 'date', 'couple', 'anniversary'],
  cultural: ['cultural', 'culture', 'heritage', 'traditional'],
  social: ['social', 'friends', 'group', 'hangout', 'party'],
  family: ['family', 'kids', 'children', 'parents'],
  foodie: ['foodie', 'food lover', 'eating'],
  nature: ['nature', 'natural', 'outdoor', 'green'],
};

function toChatPlace(p: Place): ChatPlace {
  return {
    id: p.id,
    name: p.name,
    area: p.area,
    category: p.category,
    rating: p.rating,
    budget: p.budget,
    photoUrl: p.photoUrl,
    googleMapsUrl: p.googleMapsUrl,
    insiderTip: p.insiderTip,
  };
}

function matchCategories(text: string): PlaceCategory[] {
  const out: PlaceCategory[] = [];
  (Object.keys(CATEGORY_KEYWORDS) as PlaceCategory[]).forEach((cat) => {
    if (CATEGORY_KEYWORDS[cat].some((kw) => text.includes(kw))) out.push(cat);
  });
  return out;
}

function matchVibes(text: string): Vibe[] {
  const out: Vibe[] = [];
  (Object.keys(VIBE_KEYWORDS) as Vibe[]).forEach((v) => {
    if (VIBE_KEYWORDS[v].some((kw) => text.includes(kw))) out.push(v);
  });
  return out;
}

function matchArea(text: string): string | null {
  const lower = text.toLowerCase();
  const found = AREAS.find((a) => lower.includes(a.toLowerCase()));
  return found ?? null;
}

function matchBudget(text: string): BudgetRange | null {
  if (/\bfree\b|no money|budget|cheap/.test(text)) return 'free';
  if (/under.?500|less than 500/.test(text)) return 'under-500';
  if (/under.?2000|less than 2000|mid/.test(text)) return 'under-2000';
  if (/no limit|premium|expensive|luxury/.test(text)) return 'no-limit';
  return null;
}

function pickTop(places: Place[], n = 4): Place[] {
  return [...places].sort((a, b) => b.rating - a.rating).slice(0, n);
}

function budgetRank(b: BudgetRange): number {
  return { free: 0, 'under-500': 1, 'under-2000': 2, 'no-limit': 3 }[b];
}

function buildReply(message: string): ChatReply {
  const text = message.toLowerCase().trim();

  if (!text) {
    return {
      reply: "Hey! Ask me anything about your Chennai weekend — like 'beach near Adyar' or 'free things to do on Sunday'.",
      suggestions: ['Best beaches', 'Romantic spots', 'Free things to do', 'Build me a plan'],
    };
  }

  // Greetings
  if (/^(hi|hello|hey|yo|namaste|vanakkam)\b/.test(text)) {
    return {
      reply: "Vanakkam! I'm Weekendaa's planner bot. Tell me your vibe — chill, foodie, adventure — and I'll suggest spots, or hit 'Build me a plan' for a full itinerary.",
      suggestions: ['Chill spots', 'Foodie places', 'Family friendly', 'Build me a plan'],
    };
  }

  // Help / how it works
  if (/help|how (does|do)|what can you/.test(text)) {
    return {
      reply: "I can help you in three ways:\n• Find places — try 'cafes in Nungambakkam' or 'beaches'\n• Suggest by mood — try 'chill date spot' or 'fun with friends'\n• Plan a full weekend — tap the button below.",
      actions: [{ label: 'Build a Plan', href: '/plan' }, { label: 'Explore All', href: '/explore' }],
    };
  }

  // Traffic / weather
  if (/traffic|jam|road/.test(text)) {
    return {
      reply: "Real-time Chennai traffic is on the homepage with corridor-level severity (OMR, ECR, Anna Salai, etc.). Plans I generate automatically route around heavy corridors.",
      actions: [{ label: 'See Traffic', href: '/' }, { label: 'Plan Around Traffic', href: '/plan' }],
    };
  }
  if (/weather|rain|sunny|hot/.test(text)) {
    return {
      reply: "Live Chennai weather is on the homepage. If it's rainy I'd lean toward indoor picks — cafes, malls, museums.",
      actions: [{ label: 'See Weather', href: '/' }],
    };
  }

  // Itinerary / plan
  if (/plan|itinerary|build|generate|schedule/.test(text)) {
    return {
      reply: "Sweet — let's build one. The preference builder asks for your vibe, budget, group, time, and starting area, then picks the best 2-5 stops. Takes ~30 seconds.",
      actions: [{ label: 'Build My Plan', href: '/plan' }],
    };
  }

  // Categories / vibes / area / budget
  const cats = matchCategories(text);
  const vibes = matchVibes(text);
  const area = matchArea(text);
  const budget = matchBudget(text);
  const wantOpen = /open now|right now|today/.test(text);
  const wantIndoor = /indoor|inside|ac /.test(text);
  const wantOutdoor = /outdoor|outside|open air/.test(text);

  let pool: Place[] = PLACES;
  if (cats.length) pool = pool.filter((p) => cats.includes(p.category));
  if (vibes.length) pool = pool.filter((p) => p.vibes.some((v) => vibes.includes(v)));
  if (area) pool = pool.filter((p) => p.area === area);
  if (budget) pool = pool.filter((p) => budgetRank(p.budget) <= budgetRank(budget));
  if (wantIndoor) pool = pool.filter((p) => p.indoor);
  if (wantOutdoor) pool = pool.filter((p) => p.outdoor);

  if (cats.length || vibes.length || area || budget || wantIndoor || wantOutdoor) {
    if (pool.length === 0) {
      return {
        reply: "Couldn't find a match for that combo. Try broadening — drop the area, or pick a different vibe.",
        suggestions: ['Show all beaches', 'Chill spots', 'Free places', 'Build me a plan'],
      };
    }
    const top = pickTop(pool, 4);
    const labelBits = [
      cats.length ? cats.join(' & ') : null,
      vibes.length ? `${vibes.join('/')} vibe` : null,
      area ? `in ${area}` : null,
      budget === 'free' ? 'free' : null,
    ].filter(Boolean).join(', ');
    return {
      reply: `Here are my top picks${labelBits ? ` for ${labelBits}` : ''}:`,
      places: top.map(toChatPlace),
      actions: [{ label: 'Turn into a Plan', href: '/plan' }, { label: 'See All', href: '/explore' }],
    };
  }

  // "Best of" / popular
  if (/best|top|popular|famous|must/.test(text)) {
    const top = pickTop(PLACES, 5);
    return {
      reply: "Top-rated spots across Chennai right now:",
      places: top.map(toChatPlace),
      actions: [{ label: 'Build a Plan', href: '/plan' }],
    };
  }

  // Direct name search
  const direct = PLACES.find((p) => text.includes(p.name.toLowerCase()));
  if (direct) {
    return {
      reply: `${direct.name} — ${direct.description}\n\nInsider tip: ${direct.insiderTip}`,
      places: [toChatPlace(direct)],
    };
  }

  // Fallback
  return {
    reply: "Not sure I caught that. Try asking about a category (beaches, cafes, temples), a vibe (chill, romantic, foodie), or an area (Adyar, OMR, T. Nagar).",
    suggestions: ['Beaches near me', 'Foodie spots', 'Chill date', 'Build me a plan'],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = typeof body?.message === 'string' ? body.message : '';
    const reply = buildReply(message);
    return NextResponse.json(reply);
  } catch {
    return NextResponse.json(
      { reply: "Something glitched on my end. Try again?" },
      { status: 200 },
    );
  }
}
