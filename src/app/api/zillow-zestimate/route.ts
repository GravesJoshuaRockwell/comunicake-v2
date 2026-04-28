import { NextRequest, NextResponse } from "next/server";

// Simple cache for API responses
const apiCache: Record<string, { value: number | null; timestamp: number }> = {};
const CACHE_TTL = 3600000; // 1 hour

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    const city = req.nextUrl.searchParams.get("city");
    const state = req.nextUrl.searchParams.get("state");
    const zip = req.nextUrl.searchParams.get("zip");

    if (!address || !city || !state) {
      return NextResponse.json(
        { error: "Missing address parameters" },
        { status: 400 }
      );
    }

    const cacheKey = `${address}|${city}|${state}|${zip || ''}`;
    
    // Check cache
    if (cacheKey in apiCache) {
      const cached = apiCache[cacheKey];
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({
          zestimate: cached.value,
          cached: true
        });
      }
    }

    const fullAddress = `${address.trim()}, ${city.trim()}, ${state.trim()}${zip ? ` ${zip}` : ""}`;

    let zestimate: number | null = null;

    // Try Zillow direct first (fastest)
    try {
      const zillowUrl = `https://www.zillow.com/api/house/details/v1?address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&state=${state}${zip ? `&zip=${zip}` : ''}`;
      
      const zillowRes = await Promise.race([
        fetch(zillowUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
      ]);

      if (zillowRes instanceof Response && zillowRes.ok) {
        const data: any = await zillowRes.json();
        if (data.zestimate) {
          zestimate = Math.round(data.zestimate);
        }
      }
    } catch (e) {
      console.error("Zillow API error (non-fatal):", e);
    }

    // Fallback to estimate based on last sold price or listed price
    if (!zestimate) {
      try {
        // Use a simpler approach - just return null and let UI show link
        // Real Zillow estimates require API key or scraping which is unreliable
        zestimate = null;
      } catch (e) {
        console.error("Fallback error:", e);
      }
    }

    // Cache result
    apiCache[cacheKey] = { value: zestimate, timestamp: Date.now() };

    return NextResponse.json({
      zestimate,
      address: fullAddress,
      source: zestimate ? "Zillow" : "Link"
    });
    
  } catch (error: any) {
    console.error("Zestimate lookup error:", error);
    return NextResponse.json(
      { zestimate: null, error: "Unable to fetch market value" },
      { status: 200 }
    );
  }
}
