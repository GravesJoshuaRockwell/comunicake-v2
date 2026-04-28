import { NextRequest, NextResponse } from "next/server";

// Fetch property market values from free sources
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

    // Try to get property data from Redfin API (public, no key needed)
    const fullAddress = `${address.trim()}, ${city.trim()}, ${state.trim()}${zip ? ` ${zip}` : ""}`;

    try {
      // Redfin has a public API for property searches
      const redfinUrl = `https://www.redfin.com/api/home/details?al=${encodeURIComponent(fullAddress)}`;
      
      const res = await fetch(redfinUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });

      if (res.ok) {
        const data: any = await res.json();
        
        if (data.homes && data.homes.length > 0) {
          const home = data.homes[0];
          
          // Extract estimated value from various possible fields
          const estimatedValue = 
            home.zestimate || // Zillow estimate
            home.price || // Listed price
            home.lastSoldPrice || // Last sold price
            null;

          if (estimatedValue) {
            return NextResponse.json({
              estimatedValue: Math.round(estimatedValue),
              source: "Redfin",
              address: home.fullAddress,
              lastUpdated: home.lastSoldDate
            });
          }
        }
      }
    } catch (redfinError) {
      console.error("Redfin API error:", redfinError);
    }

    // Fallback: Try Zillow's public search (returns HTML that could be parsed)
    // For now, return null and let UI show "View on Zillow" link
    try {
      const zillowSearchUrl = `https://www.zillow.com/homes/${encodeURIComponent(
        fullAddress.replace(/\s+/g, "-").toLowerCase()
      )}/`;

      // Attempt basic fetch to validate URL
      const res = await fetch(zillowSearchUrl, {
        method: "HEAD",
        redirect: "follow"
      });

      if (res.ok) {
        // Property exists on Zillow but we can't extract value without API key
        return NextResponse.json({
          estimatedValue: null,
          source: "Zillow (requires manual lookup)",
          address: fullAddress
        });
      }
    } catch (zillowError) {
      console.error("Zillow validation error:", zillowError);
    }

    // Return success but no value - UI will show "View on Zillow" link
    return NextResponse.json({
      estimatedValue: null,
      address: fullAddress,
      message: "Visit Zillow to see current market estimate"
    });
  } catch (error: any) {
    console.error("Property value lookup error:", error);
    return NextResponse.json(
      { error: error.message, estimatedValue: null },
      { status: 200 } // Return 200 with null value to avoid UI errors
    );
  }
}
