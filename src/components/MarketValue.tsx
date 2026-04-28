"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Loader } from "lucide-react";

interface MarketValueProps {
  address: string;
  city: string;
  state: string;
  zip?: string;
}

// Client-side cache for market values
const valueCache: Record<string, number | null> = {};

export function MarketValue({ address, city, state, zip }: MarketValueProps) {
  const [zestimate, setZestimate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [zillowUrl, setZillowUrl] = useState<string>("");

  useEffect(() => {
    const fetchZestimate = async () => {
      if (!address || !city || !state) {
        setLoading(false);
        return;
      }

      try {
        // Build cache key
        const cacheKey = `${address}|${city}|${state}|${zip || ''}`;
        
        // Check cache first
        if (cacheKey in valueCache) {
          setZestimate(valueCache[cacheKey]);
          setLoading(false);
          
          // Build Zillow URL regardless
          const searchAddress = `${address.trim()} ${city.trim()} ${state.trim()}${zip ? ` ${zip}` : ""}`;
          const zillowSearchUrl = `https://www.zillow.com/homes/${encodeURIComponent(
            searchAddress.replace(/\s+/g, "-").toLowerCase()
          )}/`;
          setZillowUrl(zillowSearchUrl);
          return;
        }

        // Build Zillow search URL
        const searchAddress = `${address.trim()} ${city.trim()} ${state.trim()}${zip ? ` ${zip}` : ""}`;
        const zillowSearchUrl = `https://www.zillow.com/homes/${encodeURIComponent(
          searchAddress.replace(/\s+/g, "-").toLowerCase()
        )}/`;
        
        setZillowUrl(zillowSearchUrl);

        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const params = new URLSearchParams({
          address,
          city,
          state,
          ...(zip && { zip })
        });

        const res = await fetch(`/api/zillow-zestimate?${params}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          valueCache[cacheKey] = data.zestimate || null;
          setZestimate(data.zestimate || null);
        } else {
          valueCache[cacheKey] = null;
        }
      } catch (error) {
        // Cache null on error to avoid repeated requests
        const cacheKey = `${address}|${city}|${state}|${zip || ''}`;
        valueCache[cacheKey] = null;
        console.error("Error fetching Zestimate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchZestimate();
  }, [address, city, state, zip]);

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <Loader className="w-3 h-3 animate-spin text-primary" />
      </div>
    );
  }

  if (zestimate && zestimate > 0) {
    return (
      <a
        href={zillowUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold text-green hover:text-green/80 flex items-center gap-1.5 underline"
      >
        ${(zestimate / 1000000 >= 1 ? (zestimate / 1000000).toFixed(2) + "M" : (zestimate / 1000).toFixed(0) + "K")}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <a
      href={zillowUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-medium text-primary hover:text-primary/80 underline"
    >
      View on Zillow →
    </a>
  );
}
