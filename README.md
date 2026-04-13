# Weekend Planner Chennai

A smart weekend planner for Chennai that helps you discover 64 handpicked spots, dodge traffic, and build the perfect itinerary — all for free, no sign-up required.

Built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## What It Does

**The problem:** Every weekend, Chennaiites ask "where should we go?" — then end up stuck in traffic or at the same old places.

**The solution:** This app curates 64 places across Chennai (beaches, temples, cafes, parks, restaurants, malls, and more), factors in real-time traffic, and generates a ready-to-follow itinerary with Google Maps navigation.

## Features

- **64 Curated Places** — Beaches, temples, heritage sites, cafes, restaurants, parks, malls, sports venues, and wellness spots. Each with real photos, ratings, budget info, and open hours.
- **Smart Itinerary Generator** — Tell it your vibe (chill, adventure, foodie, cultural, etc.), budget, group size, and starting area. It scores all 64 places and picks the best 2-5 stops based on your available time.
- **Real-Time Traffic** — Live Chennai traffic data with corridor-level severity (OMR, ECR, Anna Salai, Mount Road, etc.). Routes are optimized to avoid jams.
- **Weather Integration** — Current Chennai weather displayed on the homepage so you can plan accordingly.
- **Interactive Maps** — Leaflet.js maps showing your full itinerary route with all stops plotted.
- **Quick Templates** — One-tap plans: Beach Day, Cafe Hopping, Heritage Walk, Adventure Day, Foodie Trail, Photo Walk.
- **Share & Navigate** — Share your itinerary with friends. Each stop has a direct Google Maps link.

## Pages

| Page | Description |
|------|-------------|
| `/` | Homepage with hero, Chennai photo marquee, quick-start templates, weather & traffic widgets |
| `/explore` | Browse and filter all 64 places by category, budget, open status, indoor/outdoor |
| `/plan` | Preference builder — pick your vibe, budget, group, time, and location |
| `/itinerary/[id]` | Generated itinerary with timed stops, travel times, traffic alerts, and map |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/plan` | POST | Generate a personalized itinerary from user preferences |
| `/api/plan?id=...` | GET | Retrieve a previously generated itinerary |
| `/api/traffic` | GET | Chennai traffic data with corridor severity and incidents |
| `/api/weather` | GET | Current Chennai weather via Open-Meteo API |
| `/api/photo` | GET | Image proxy — serves real photos from Wikimedia Commons / Wikipedia |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **Maps:** Leaflet.js + OpenStreetMap
- **Photos:** Wikimedia Commons (landmarks) + Pexels (local businesses)
- **Traffic:** TomTom Traffic API
- **Weather:** Open-Meteo API
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
  page.tsx              # Homepage with hero, templates, weather/traffic
  explore/page.tsx      # Browse & filter all 64 places
  plan/page.tsx         # Preference builder
  itinerary/[id]/       # Generated itinerary view
  api/
    plan/route.ts       # Itinerary generation engine
    traffic/route.ts    # Chennai traffic data
    weather/route.ts    # Weather from Open-Meteo
    photo/route.ts      # Image proxy with curated mappings
components/
  nav.tsx               # Glass-effect navigation bar
  place-card.tsx        # Place card with photo, rating, tags
  weather-widget.tsx    # Live weather display
  traffic-map.tsx       # Interactive Leaflet traffic map
  traffic-alert.tsx     # Traffic severity alerts
  preference-builder.tsx # Multi-step preference form
  share-buttons.tsx     # Social sharing
  footer.tsx            # Site footer
lib/
  places-data.ts        # All 64 places with metadata & photos
types/
  index.ts              # TypeScript interfaces
```
