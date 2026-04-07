import { NextRequest, NextResponse } from 'next/server';

// Cache Wikipedia image URLs in memory (persists across requests in same deployment)
const imageCache = new Map<string, { url: string; fetched: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getWikipediaImage(query: string): Promise<string> {
  const cached = imageCache.get(query);
  if (cached && Date.now() - cached.fetched < CACHE_TTL) {
    return cached.url;
  }

  try {
    // Use Wikipedia API to search for page and get thumbnail
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' Chennai')}&format=json&srlimit=1`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error('Search failed');
    const searchData = await searchRes.json();

    if (searchData.query?.search?.length > 0) {
      const pageTitle = searchData.query.search[0].title;
      // Get page image
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
  } catch {
    // Fall through to fallback
  }

  // Fallback: generate a nice gradient placeholder with place name
  const fallback = `https://placehold.co/800x400/1B4965/FFB703?text=${encodeURIComponent(query)}`;
  imageCache.set(query, { url: fallback, fetched: Date.now() });
  return fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });
  }

  const imageUrl = await getWikipediaImage(query);

  // Redirect to the actual image
  return NextResponse.redirect(imageUrl, 302);
}
