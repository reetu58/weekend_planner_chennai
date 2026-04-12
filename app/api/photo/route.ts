import { NextRequest, NextResponse } from 'next/server';

// Curated mapping: search query → exact Wikimedia Commons filename
// All filenames verified to exist on Wikimedia Commons
const CURATED_IMAGES: Record<string, string> = {
  // Beaches
  'besant nagar beach': 'Elliots_Beach_at_Besant_Nagar,_Chennai.JPG',
  'marina beach chennai': 'Marina_Beach,_Chennai.jpg',
  'marina beach chennai food': 'Marina_Beach,_Chennai.jpg',
  'kovalam beach chennai': 'Kovalam-beach-ECR-chennai-3.JPG',
  'covelong beach chennai': 'Kovalam-beach-ECR-chennai-3.JPG',
  'besant nagar beach chennai': 'Elliots_Beach_at_Besant_Nagar,_Chennai.JPG',
  'thiruvanmiyur beach chennai': 'Elliots_Beach_at_Besant_Nagar,_Chennai.JPG',
  'broken bridge chennai adyar': 'Adyar_estuary_broken_bridge_panorama.jpg',

  // Temples & Heritage
  'kapaleeshwarar temple': 'Mylapore_Kapaleeshwarar_temple_facade.jpg',
  'kapaleeshwarar temple gopuram': 'Kapaleeswarar_Temple,_Mylapore,_Chennai.jpg',
  'fort st george chennai': 'Fort_St._George,_Chennai_2.jpg',
  'san thome cathedral': 'St._Thomas_Cathedral_Basilica,_Chennai_-_Santhome_Church.jpg',
  'ashtalakshmi temple chennai': 'Ashtalakshmi_Kovil_-_Temple_of_Eight_Lakshmis,_Chennai,_Tamil_Nadu,_India.jpg',
  'marundeeswarar temple': 'Golden_Chariot_Arulmigu_Marundeeswarar_Temple.jpg',
  'chennai lighthouse': 'The_lighthouse_chennai.jpg',

  // Museums & Culture
  'government museum chennai': 'The_Government_Museum_at_Egmore.jpeg',
  'dakshinachitra': 'Dakshina-Chitra-Household-Items-1.JPG',
  'birla planetarium chennai': 'B.M._Birla_Planetarium_in_Chennai.jpg',
  'cholamandal artists village': 'Cholamandal-Center-for-Contemporary-Art-ECR-Chennai-9.JPG',
  'kalakshetra foundation': 'Kalakshetra_Academy_Office.jpg',
  'connemara public library': 'Connemara_Public_Library_Chennai.jpg',

  // Parks & Nature
  'guindy national park': 'Guindy_National_Park,_Chennai.jpg',
  'semmozhi poonga': 'Semmozhi_Poonga_flower.jpg',
  'tholkappia poonga adyar eco park': 'Adyar_Eco_Park.JPG',
  'vedanthangal bird sanctuary': 'Vedanthangal_Bird_Sanctuary_17.JPG',
  'muttukadu boat house': 'Muttukadu-Boat-House-Chennai-ECR-6.JPG',
  'mahabalipuram shore temple': 'Shore_Temple_Mahabalipuram_Tamil_Nadu.JPG',
  'auroville': 'Auroville.JPG',

  // Malls & Shopping
  'phoenix marketcity chennai': 'Phoenix_Market_City_Chennai_(8494782733).jpg',
  'express avenue mall chennai': 'Express_Avenue,_Chennai_1.JPG',
  'ranganathan street t nagar': 'TNagar_Ranganathan_Street.JPG',

  // Food & Restaurants
  'murugan idli shop': 'Ghee_Podi_Idli_-_Murugan_Idli_Shop,_Chennai_-_TamilNadu_-_PXL0246.jpg',
  'dindigul thalappakatti': 'Dindigul_Thalappakatti_Biryani.jpg',
  'mylapore chennai': 'Mylapore_tank_at_dawn_panorama.jpg',
  'triplicane chennai': 'A_typical_market_place_in_the_neighbourhood_of_Triplicane,_Chennai..JPG',
  'itc grand chola chennai': 'ITC-Grand-Chola-Chennai-2.JPG',

  // Entertainment
  'sathyam cinemas chennai': 'Satyam_Cinemas_(27907729516).jpg',
  'pvr vr chennai': 'PVR_VR_Mall_1.jpg',
};

// Local businesses that have NO Wikipedia/Wikimedia presence.
// Skip Wikipedia search for these — it returns wrong images (buses, train stations, etc.)
const SKIP_SEARCH = new Set([
  'amethyst chennai restaurant',
  'sowcarpet chennai',
  'mystery rooms chennai',
  'the brew room chennai',
  'chamiers cafe chennai',
  'ciclo cafe chennai',
  'sandys chocolate laboratory chennai',
  'writers cafe chennai',
  'cafe de paris chennai',
  'tea villa cafe chennai',
  'illusions the madras pub',
  'bay 146 chennai restaurant',
  'junior kuppanna chennai',
  'dugout chennai',
  '10 downing street chennai pub',
  'the vault chennai pub',
  'leather bar chennai',
  'o2 spa chennai',
  'mudra yoga shala chennai',
  'spa fusion chennai',
  'ikigai coworking chennai',
  'starbucks ecr chennai',
  'smaaash chennai',
  'vr chennai mall',
  'pottery workshop ecr chennai',
  'art lounge chennai',
  'mylapore chennai cooking',
  'naturally auroville',
]);

// Generate Wikimedia Commons thumbnail URL from filename
function getWikimediaThumbUrl(filename: string, width = 800): string {
  return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(filename)}&w=${width}`;
}

// Cache for API lookups
const imageCache = new Map<string, { url: string; fetched: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getImageUrl(query: string): Promise<string> {
  const cached = imageCache.get(query);
  if (cached && Date.now() - cached.fetched < CACHE_TTL) {
    return cached.url;
  }

  const normalizedQuery = query.toLowerCase().trim();

  // 1. Check curated mapping (exact match)
  if (CURATED_IMAGES[normalizedQuery]) {
    const url = getWikimediaThumbUrl(CURATED_IMAGES[normalizedQuery]);
    imageCache.set(query, { url, fetched: Date.now() });
    return url;
  }

  // 2. Try partial match on curated mapping
  for (const [key, filename] of Object.entries(CURATED_IMAGES)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      const url = getWikimediaThumbUrl(filename);
      imageCache.set(query, { url, fetched: Date.now() });
      return url;
    }
  }

  // 3. Skip Wikipedia search for known local businesses (returns wrong images)
  if (SKIP_SEARCH.has(normalizedQuery)) {
    const fallback = `https://placehold.co/800x400/1B4965/FFB703?text=${encodeURIComponent(query.replace(/\+/g, ' '))}`;
    imageCache.set(query, { url: fallback, fetched: Date.now() });
    return fallback;
  }

  // 4. For remaining unmatched queries, try Wikipedia API
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=1`;
    const searchRes = await fetch(searchUrl);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.query?.search?.length > 0) {
        const pageTitle = searchData.query.search[0].title;
        const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=800`;
        const imageRes = await fetch(imageUrl);
        if (imageRes.ok) {
          const imageData = await imageRes.json();
          const pages = imageData.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0] as any;
            if (page?.thumbnail?.source) {
              const url = page.thumbnail.source;
              imageCache.set(query, { url, fetched: Date.now() });
              return url;
            }
          }
        }
      }
    }
  } catch {
    // Fall through to placeholder
  }

  // 5. Fallback: styled placeholder
  const fallback = `https://placehold.co/800x400/1B4965/FFB703?text=${encodeURIComponent(query.replace(/\+/g, ' '))}`;
  imageCache.set(query, { url: fallback, fetched: Date.now() });
  return fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });
  }

  const imageUrl = await getImageUrl(query);

  return NextResponse.redirect(imageUrl, 302);
}
