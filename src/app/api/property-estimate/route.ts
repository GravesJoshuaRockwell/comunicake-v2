import { NextRequest, NextResponse } from "next/server";

// Cache for property estimates
const estimateCache = new Map<string, { value: number; timestamp: number }>();
const CACHE_TTL = 86400000; // 24 hours

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    const city = req.nextUrl.searchParams.get("city");
    const state = req.nextUrl.searchParams.get("state");
    const zip = req.nextUrl.searchParams.get("zip");

    if (!address || !city || !state) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const cacheKey = `${address}|${city}|${state}|${zip}`;

    // Check cache
    if (estimateCache.has(cacheKey)) {
      const cached = estimateCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({ estimate: cached.value, cached: true });
      }
    }

    const fullAddress = `${address.trim()}, ${city.trim()}, ${state.trim()}${zip ? ` ${zip}` : ""}`;

    try {
      // Use Zillow's search API (no authentication needed)
      const searchUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=${encodeURIComponent(
        JSON.stringify({
          usersSearchTerm: fullAddress,
          mapBounds: null,
          regionSelection: null,
          pagination: { currentPage: 1 },
          isMapVisible: false,
          filterState: {},
          isListVisible: true,
          mapZoom: null
        })
      )}`;

      const res = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json"
        }
      });

      if (res.ok) {
        const data: any = await res.json();
        
        if (data.cat1 && data.cat1.searchResults && data.cat1.searchResults.listResults) {
          const listings = data.cat1.searchResults.listResults;
          if (listings.length > 0) {
            const first = listings[0];
            // Try different price fields
            const price = first.price || first.zestimate || first.estimatedValue || null;
            
            if (price) {
              const numPrice = typeof price === "string" 
                ? parseInt(price.replace(/[^\d]/g, "")) 
                : price;
              
              if (numPrice > 0) {
                estimateCache.set(cacheKey, { value: numPrice, timestamp: Date.now() });
                return NextResponse.json({ estimate: numPrice, source: "Zillow" });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Zillow API error:", e);
    }

    // Return null but 200 OK - UI will just show link
    return NextResponse.json({ estimate: null });
  } catch (error: any) {
    console.error("Property estimate error:", error);
    return NextResponse.json({ estimate: null }, { status: 200 });
  }
}
