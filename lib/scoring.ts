import { Place, UserPrefs, BudgetRange, TimeSlot, PlaceCategory } from '../types';
import { AREA_COORDINATES } from '../types';
import { haversineDistance } from './traffic-patterns';

const BUDGET_ORDER: BudgetRange[] = ['free', 'under-500', 'under-2000', 'no-limit'];

function budgetFits(placeBudget: BudgetRange, userBudget: BudgetRange): boolean {
  return BUDGET_ORDER.indexOf(placeBudget) <= BUDGET_ORDER.indexOf(userBudget);
}

function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + (m || 0);
}

function defaultDepartureMinutes(timeSlot: TimeSlot): number {
  switch (timeSlot) {
    case 'morning': return 8 * 60;
    case 'afternoon': return 13 * 60;
    case 'evening': return 17 * 60;
    default: return 10 * 60;
  }
}

// How well a category fits a time-of-day slot. Tuned for Chennai heat & vibe.
const TIME_OF_DAY_BOOST: Record<PlaceCategory, Record<TimeSlot, number>> = {
  beaches:       { morning: 8,   afternoon: -4, evening: 12, flexible: 5 },
  food:          { morning: 4,   afternoon: 4,  evening: 4,  flexible: 4 },
  culture:       { morning: 10,  afternoon: 4,  evening: 2,  flexible: 5 },
  nature:        { morning: 8,   afternoon: -3, evening: 8,  flexible: 5 },
  entertainment: { morning: 2,   afternoon: 6,  evening: 8,  flexible: 5 },
  shopping:      { morning: 2,   afternoon: 8,  evening: 6,  flexible: 5 },
  nightlife:     { morning: -15, afternoon: -8, evening: 14, flexible: 2 },
  wellness:      { morning: 6,   afternoon: 6,  evening: 6,  flexible: 5 },
  workshops:     { morning: 8,   afternoon: 6,  evening: 2,  flexible: 5 },
};

export function scorePlace(place: Place, prefs: UserPrefs): number {
  let score = 0;

  // Category match (highest weight)
  if (prefs.categories.length === 0 || prefs.categories.includes(place.category)) {
    score += 30;
  } else {
    return 0;
  }

  // Budget fit
  if (budgetFits(place.budget, prefs.budget)) {
    score += 20;
  } else {
    return 0;
  }

  // Vibe match
  const vibeOverlap = place.vibes.filter(v => prefs.vibes.includes(v)).length;
  score += vibeOverlap * 10;

  // Group type match
  if (place.groupTypes.includes(prefs.groupType)) {
    score += 15;
  } else {
    score -= 20;
  }

  // Open hours check + closing-time viability
  const day = prefs.day === 'both' ? 'saturday' : prefs.day;
  const hours = place.openHours[day];
  if (!hours) {
    return 0; // Closed on chosen day
  }

  const openMin = parseHHMM(hours.open);
  const closeMin = parseHHMM(hours.close);
  const tripStart = prefs.departureTime
    ? parseHHMM(prefs.departureTime)
    : defaultDepartureMinutes(prefs.timeSlot);
  const tripEnd = tripStart + prefs.duration;

  // Drop if the place's window can't host this stop at all.
  // Need at least: a feasible arrival before close - (stay time) - 15min buffer,
  // and the place must be open at some point during the trip window.
  const latestUsefulArrival = closeMin - place.avgTimeMinutes - 15;
  const earliestUsefulArrival = openMin;
  // Trip must overlap with [earliestUsefulArrival, latestUsefulArrival]
  if (latestUsefulArrival < tripStart) return 0; // closes before we can even reach it
  if (earliestUsefulArrival > tripEnd) return 0; // opens after we're done

  // Tight-closing penalty — closes within 30 min of latest possible useful arrival.
  const closingHeadroom = latestUsefulArrival - tripStart;
  if (closingHeadroom < 30) score -= 8;

  // Time-slot fit per category
  score += TIME_OF_DAY_BOOST[place.category][prefs.timeSlot];

  // Distance from starting location (use custom lat/lng if available, else area lookup)
  const startCoords = (prefs.startLat && prefs.startLng)
    ? { lat: prefs.startLat, lng: prefs.startLng }
    : AREA_COORDINATES[prefs.startArea];
  if (startCoords) {
    const dist = haversineDistance(startCoords.lat, startCoords.lng, place.lat, place.lng);
    if (prefs.distanceLimit > 0 && dist > prefs.distanceLimit) {
      return 0;
    }
    if (dist < 5) score += 10;
    else if (dist < 10) score += 5;
    else if (dist < 15) score += 2;
  }

  // Rating bonus — weighted by review volume so well-loved spots beat obscure 4.6s.
  // log10(50000)≈4.7, log10(100)=2 → adds 0–10 pts.
  const ratingBonus = (place.rating - 3.5) * 5;
  const popularityBonus = Math.log10(place.reviewCount + 1) * 2;
  score += ratingBonus + popularityBonus;

  return Math.max(0, score);
}

export function scoreAllPlaces(places: Place[], prefs: UserPrefs): { place: Place; score: number }[] {
  return places
    .map(place => ({ place, score: scorePlace(place, prefs) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}
