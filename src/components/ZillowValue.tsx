"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Loader } from "lucide-react";

interface ZillowValueProps {
  address: string;
  city: string;
  state: string;
  zip?: string;
}

const cache = new Map<string, number | null>();

export function ZillowValue({ address, city, state, zip }: ZillowValueProps) {
  const [estimate, setEstimate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [zillowUrl, setZillowUrl] = useState<string>("");

  useEffect(() => {
    const fetchEstimate = async () => {
      if (!address || !city || !state) {
        setLoading(false);
        return;
      }

      try {
        const searchAddress = `${address.trim()} ${city.trim()} ${state.trim()}${zip ? ` ${zip}` : ""}`;
        const url = `https://www.zillow.com/homes/${encodeURIComponent(
          searchAddress.replace(/\s+/g, "-").toLowerCase()
        )}/`;
        setZillowUrl(url);

        const cacheKey = `${address}|${city}|${state}|${zip}`;
        
        // Check local cache
        if (cache.has(cacheKey)) {
          const cached = cache.get(cacheKey);
          setEstimate(cached ?? null);
          setLoading(false);
          return;
        }

        // Fetch from API
        const params = new URLSearchParams({ address, city, state, ...(zip && { zip }) });
        const res = await fetch(`/api/property-estimate?${params}`);
        
        if (res.ok) {
          const data = await res.json();
          cache.set(cacheKey, data.estimate || null);
          setEstimate(data.estimate);
        }
      } catch (error) {
        console.error("Error fetching estimate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [address, city, state, zip]);

  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return "$" + (price / 1000000).toFixed(2) + "M";
    }
    return "$" + (price / 1000).toFixed(0) + "K";
  };

  return (
    <a
      href={zillowUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5"
    >
      {loading ? (
        <>
          <Loader className="w-3 h-3 animate-spin text-primary" />
          <span className="text-xs text-text-muted">Loading...</span>
        </>
      ) : estimate ? (
        <span className="text-sm font-bold text-green">{formatPrice(estimate)}</span>
      ) : (
        <span className="text-xs font-medium text-primary underline">View on Zillow</span>
      )}
      <ExternalLink className="w-3 h-3 text-primary" />
    </a>
  );
}
