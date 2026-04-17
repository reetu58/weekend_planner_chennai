import { NextRequest, NextResponse } from 'next/server';
import { PLACES } from '../../../lib/places-data';
import { scoreAllPlaces } from '../../../lib/scoring';
import { estimateTravelTime } from '../../../lib/traffic-patterns';
import { haversineDistance } from '../../../lib/traffic-patterns';
import { Place, UserPrefs, Itinerary, ItineraryStop, AREA_COORDINATES } from '../../../types';

// In-memory store for plans (use Vercel KV in production)
const planStore = new Map<string, Itinerary>();

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function getMaxStops(duration: number): number {
  if (duration <= 120) return 2;
  if (duration <= 240) return 3;
  if (duration <= 360) return 4;
  return 5;
}

function getTimeString(base: string, addMin: number): string {
  const [h, m] = base.split(':').map(Number);
  const total = h * 60 + m + addMin;
  return `${Math.floor(total / 60) % 24}`.padStart(2, '0') + ':' + `${total % 60}`.padStart(2, '0');
}

function getDefaultTime(slot: string): string {
  if (slot === 'morning') return '08:00';
  if (slot === 'afternoon') return '13:00';
  if (slot === 'evening') return '17:00';
  return '10:00';
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const FOOD_CATEGORY = 'food';

function isFood(place: Place): boolean {
  return place.category === FOOD_CATEGORY;
}

// Returns true if a place is open at the given fractional hour (e.g. 13.5 = 1:30 PM)
function isOpenAtHour(place: Place, day: 'saturday' | 'sunday', hour: number): boolean {
  const hours = place.openHours[day];
  if (!hours) return false;
  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);
  const openMin = openH * 60 + openM;
  const closeMin = closeH * 60 + closeM;
  const visitMin = Math.floor(hour) * 60 + Math.round((hour % 1) * 60);
  return visitMin >= openMin && visitMin < closeMin;
}

// Detect impossible category + time combinations before planning
function checkIncompatibility(prefs: UserPrefs): string | null {
  const { categories, timeSlot } = prefs;

  // Nightlife + morning/afternoon — clubs don't open until evening
  if (categories.includes('nightlife') && (timeSlot === 'morning' || timeSlot === 'afternoon')) {
    return 'Nightlife venues only open from 5 PM — switch to "Evening" time slot, or remove Nightlife from your categories.';
  }

  // Nightlife + nature — parks close exactly when nightlife opens
  if (categories.includes('nightlife') && categories.includes('nature')) {
    return 'Nightlife and nature parks run on opposite schedules — parks close when clubs open. Try picking one or adding different categories.';
  }

  return null;
}

// ─── Smart Itinerary Builder ────────────────────────────────────
// Thinks like a real travel planner:
// 1. Places food at meal times (breakfast / lunch / snack / dinner)
// 2. Never puts two food stops back-to-back
// 3. Picks food near the previous activity
// 4. Matches food type to group (family → restaurant, couple → romantic)
// 5. Alternates: activity → food → activity → food
// 6. Filters every slot to places actually open at arrival time

// What meal window does this hour fall into?
function getMealType(hour: number): 'breakfast' | 'lunch' | 'snack' | 'dinner' | null {
  if (hour >= 7 && hour < 10) return 'breakfast';
  if (hour >= 11.5 && hour < 14) return 'lunch';
  if (hour >= 15.5 && hour < 18) return 'snack';
  if (hour >= 18.5 && hour < 22) return 'dinner';
  return null;
}

// Pick the best place from a pool, considering score + proximity + context
function pickBest(
  pool: { place: Place; score: number }[],
  prevLat: number,
  prevLng: number,
  prefs: UserPrefs,
  existing: Place[],
  mealType: string | null,
): { place: Place; score: number } | null {
  if (pool.length === 0) return null;

  let best: { item: typeof pool[0]; combined: number } | null = null;

  for (const item of pool) {
    let combined = item.score;

    // ── Proximity bonus: prefer places near previous stop ──
    const dist = haversineDistance(prevLat, prevLng, item.place.lat, item.place.lng);
    if (dist < 3) combined += 20;
    else if (dist < 5) combined += 15;
    else if (dist < 10) combined += 10;
    else if (dist < 15) combined += 5;

    // ── Same-category penalties ──
    // Consecutive same category (temple → temple): strong penalty
    if (existing.length > 0 && item.place.category === existing[existing.length - 1].category) {
      combined -= 30;
    }
    // Category already used anywhere in the plan: heavy penalty
    // A real planner never sends you to two beaches or two temples in one day
    if (existing.some(p => p.category === item.place.category)) {
      combined -= 50;
    }

    // ── Food context bonuses ──
    if (isFood(item.place)) {
      // Family groups → prefer family-friendly restaurants
      if (prefs.groupType === 'family') {
        if (item.place.groupTypes.includes('family')) combined += 12;
        // Avoid pubs/bar-type food places for families
        if (!item.place.groupTypes.includes('family')) combined -= 30;
      }

      // Couples → prefer romantic spots
      if (prefs.groupType === 'couple' && item.place.vibes.includes('romantic')) {
        combined += 10;
      }

      // Breakfast slot → prefer traditional/cultural food (idli shops, street food)
      if (mealType === 'breakfast' && item.place.vibes.includes('cultural')) {
        combined += 8;
      }

      // Snack slot → prefer cafes/chill spots over heavy restaurants
      if (mealType === 'snack' && item.place.vibes.includes('chill')) {
        combined += 8;
      }

      // Dinner slot → prefer proper restaurants/social spots
      if (mealType === 'dinner' && item.place.vibes.includes('social')) {
        combined += 8;
      }
    }

    if (!best || combined > best.combined) {
      best = { item, combined };
    }
  }

  return best ? best.item : null;
}

function buildSmartItinerary(prefs: UserPrefs) {
  const allScored = scoreAllPlaces(PLACES, prefs);
  const day = prefs.day === 'both' ? 'saturday' : prefs.day;

  // Separate into food and activity pools
  const foodPool = allScored.filter(s => isFood(s.place));
  const activityPool = allScored.filter(s => !isFood(s.place));

  const maxStops = getMaxStops(prefs.duration);

  // Max food stops: 1 for short outings (2-4h), 2 for longer (6-8h)
  const maxFoodStops = prefs.duration <= 240 ? 1 : 2;

  // If user ONLY selected food category, allow more food stops
  const onlyFoodSelected = prefs.categories.length > 0 &&
    prefs.categories.every(c => c === FOOD_CATEGORY);

  const startCoords = (prefs.startLat && prefs.startLng)
    ? { lat: prefs.startLat, lng: prefs.startLng }
    : AREA_COORDINATES[prefs.startArea] || { lat: 13.0418, lng: 80.2341 };

  const departureTime = prefs.departureTime || getDefaultTime(prefs.timeSlot);
  const startMinutes = timeToMinutes(departureTime);

  // Estimate average time per slot (activity time + travel between)
  const avgSlotMinutes = 100; // ~80min at place + ~20min travel

  const selected: Place[] = [];
  const usedIds = new Set<string>();
  let foodCount = 0;
  let prevLat = startCoords.lat;
  let prevLng = startCoords.lng;

  for (let i = 0; i < maxStops; i++) {
    // Estimate what time this slot starts
    const slotStartMin = startMinutes + i * avgSlotMinutes;
    const slotHour = slotStartMin / 60;
    const mealType = getMealType(slotHour);

    const prevWasFood = i > 0 && isFood(selected[i - 1]);

    // ── Filter each pool to places actually open at this slot's hour ──
    const openFoodPool = foodPool.filter(
      s => !usedIds.has(s.place.id) && isOpenAtHour(s.place, day, slotHour)
    );
    const openActivityPool = activityPool.filter(
      s => !usedIds.has(s.place.id) && isOpenAtHour(s.place, day, slotHour)
    );

    // ── Decide if this slot should be food ──
    let shouldBeFood = false;

    if (onlyFoodSelected) {
      // User explicitly wants a food crawl — allow more but still space them out
      shouldBeFood = !prevWasFood;
    } else {
      shouldBeFood = (
        mealType !== null &&
        foodCount < maxFoodStops &&
        !prevWasFood &&
        openFoodPool.length > 0
      );

      // Rule: morning start → begin with breakfast if early enough
      if (i === 0 && mealType === 'breakfast' && openFoodPool.length > 0) {
        shouldBeFood = true;
      }

      // Rule: evening/afternoon start → do an activity FIRST, eat later
      // People going out in the evening want to do something fun before eating
      if (i === 0 && (prefs.timeSlot === 'evening' || prefs.timeSlot === 'afternoon')) {
        shouldBeFood = false;
      }

      // Rule: last slot near dinner time → end with food
      if (i === maxStops - 1 && mealType === 'dinner' && foodCount < maxFoodStops && openFoodPool.length > 0) {
        shouldBeFood = true;
      }

      // Rule: second slot is a good food slot for evening outings (eat after first activity)
      if (i === 1 && prefs.timeSlot === 'evening' && foodCount === 0 && openFoodPool.length > 0 && !prevWasFood) {
        shouldBeFood = true;
      }
    }

    // ── Pick from the right pool (already filtered for open hours) ──
    const primaryPool = shouldBeFood ? openFoodPool : openActivityPool;
    const fallbackPool = shouldBeFood ? openActivityPool : openFoodPool;

    let pick = pickBest(primaryPool, prevLat, prevLng, prefs, selected, mealType);

    // Fall back to other pool if primary is empty
    if (!pick && fallbackPool.length > 0) {
      pick = pickBest(fallbackPool, prevLat, prevLng, prefs, selected, mealType);
    }

    if (!pick) break; // No more open places available for this slot

    selected.push(pick.place);
    usedIds.add(pick.place.id);
    prevLat = pick.place.lat;
    prevLng = pick.place.lng;
    if (isFood(pick.place)) foodCount++;
  }

  // ── Guarantee: every plan MUST have at least 1 food place ──
  // If no food was placed (e.g. user only picked non-food categories),
  // swap the weakest non-food stop with the best nearby food place
  if (foodCount === 0 && selected.length >= 2) {
    const allFood = scoreAllPlaces(PLACES, { ...prefs, categories: [] })
      .filter(s => isFood(s.place) && !usedIds.has(s.place.id));

    if (allFood.length > 0) {
      // Find the best swap position — prefer middle or later slots
      const swapIdx = selected.length >= 3 ? 1 : selected.length - 1;
      const swapSlotMin = startMinutes + swapIdx * avgSlotMinutes;
      const swapHour = swapSlotMin / 60;

      // Prefer food places open at the swap slot; fall back to any food place
      const openFood = allFood.filter(s => isOpenAtHour(s.place, day, swapHour));
      const foodCandidates = openFood.length > 0 ? openFood : allFood;

      const refLat = swapIdx === 0 ? startCoords.lat : selected[swapIdx - 1].lat;
      const refLng = swapIdx === 0 ? startCoords.lng : selected[swapIdx - 1].lng;

      const bestFood = pickBest(foodCandidates, refLat, refLng, prefs, selected, null);
      if (bestFood) {
        selected[swapIdx] = bestFood.place;
      }
    }
  }

  return { selected, startCoords, departureTime };
}

export async function POST(request: NextRequest) {
  try {
    const prefs: UserPrefs = await request.json();

    // Reject impossible category + time-slot combinations upfront
    const incompatError = checkIncompatibility(prefs);
    if (incompatError) {
      return NextResponse.json({ error: incompatError }, { status: 400 });
    }

    const { selected, startCoords, departureTime } = buildSmartItinerary(prefs);

    if (selected.length === 0) {
      return NextResponse.json({ error: 'No matching places found. Try adjusting your filters.' }, { status: 400 });
    }

    // Build timed stops
    let currentTime = departureTime;
    let totalTravel = 0;
    let totalOverhead = 0;
    const stops: ItineraryStop[] = [];

    for (let i = 0; i < selected.length; i++) {
      const place = selected[i];
      const fLat = i === 0 ? startCoords.lat : selected[i - 1].lat;
      const fLng = i === 0 ? startCoords.lng : selected[i - 1].lng;
      const est = estimateTravelTime(fLat, fLng, place.lat, place.lng);

      totalTravel += est.currentTime;
      totalOverhead += est.currentTime - est.normalTime;

      const arrival = getTimeString(currentTime, Math.round(est.currentTime));
      const depart = getTimeString(arrival, place.avgTimeMinutes);

      stops.push({
        place,
        order: i + 1,
        arrivalTime: arrival,
        departureTime: depart,
        travelFromPrevious: Math.round(est.currentTime),
        trafficAlert: {
          from: i === 0 ? prefs.startArea : selected[i - 1].name,
          to: place.name,
          currentTravelTime: Math.round(est.currentTime),
          normalTravelTime: Math.round(est.normalTime),
          delayMinutes: Math.round(est.currentTime - est.normalTime),
          severity: est.severity,
          incidents: [],
          isLive: false,
        },
      });

      currentTime = depart;
    }

    const id = generateId();
    const itinerary: Itinerary = {
      id,
      stops,
      preferences: prefs,
      totalDuration: Math.round(selected.reduce((s, p) => s + p.avgTimeMinutes, 0) + totalTravel),
      totalTravelTime: Math.round(totalTravel),
      totalTrafficOverhead: Math.round(totalOverhead),
      totalCost: {
        min: selected.filter(p => p.budget !== 'free').length * 100,
        max: selected.filter(p => p.budget !== 'free').length * 500,
      },
      createdAt: new Date().toISOString(),
    };

    planStore.set(id, itinerary);

    return NextResponse.json(itinerary);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to generate';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const plan = planStore.get(id);
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

  return NextResponse.json(plan);
}
