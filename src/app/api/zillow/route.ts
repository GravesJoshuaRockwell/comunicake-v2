import { NextRequest, NextResponse } from "next/server";

// Property value lookup using public APIs
export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    const city = req.nextUrl.searchParams.get("city");
    const state = req.nextUrl.searchParams.get("state");
    const zip = req.nextUrl.searchParams.get("zip");

    if (!address || !city || !state) {
      return NextResponse.json({ error: "Missing address parameters" }, { status: 400 });
    }

    // Try PropertyShark or similar free API for market value
    // Format address for API
    const fullAddress = `${address.trim()}, ${city.trim()}, ${state.trim()}${zip ? ` ${zip}` : ""}`;

    // Using OpenCage Geocoding to get coordinates, then property data
    try {
      // Attempt to fetch from a free property database
      // Note: Real implementation would use Zillow API key or similar paid service
      const geoUrl = `https://geocode.xyz/${encodeURIComponent(fullAddress)}?json=1`;
      const geoRes = await fetch(geoUrl);
      
      if (!geoRes.ok) {
        throw new Error("Could not geocode address");
      }

      const geoData: any = await geoRes.json();
      
      if (!geoData.lon || !geoData.lat) {
        throw new Error("Invalid coordinates");
      }

      // For market value, we'd need Zillow API or similar
      // Since those are restricted, return Zillow link + estimated range
      const zillowUrl = `https://www.zillow.com/homes/${encodeURIComponent(
        fullAddress.replace(/\s+/g, "-").toLowerCase()
      )}/`;

      return NextResponse.json({
        address: fullAddress,
        lat: geoData.lat,
        lon: geoData.lon,
        zillowUrl,
        message: "View current market value on Zillow (live price estimates)"
      });
    } catch (geoError) {
      // Fallback: just return Zillow link
      const zillowUrl = `https://www.zillow.com/homes/${encodeURIComponent(
        fullAddress.replace(/\s+/g, "-").toLowerCase()
      )}/`;

      return NextResponse.json({
        address: fullAddress,
        zillowUrl,
        message: "View current market value on Zillow"
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
