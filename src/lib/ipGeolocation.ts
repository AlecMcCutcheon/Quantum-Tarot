import type { GpsReading } from "../types/spacetime";

/** Coarse city/region fix when browser network location fails (e.g. Google 403 on Linux). */
export async function fetchApproximateIpLocation(): Promise<GpsReading> {
  const res = await fetch("https://ipapi.co/json/", {
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`IP location lookup failed (${res.status})`);
  }
  const data = (await res.json()) as {
    latitude?: number;
    longitude?: number;
    error?: boolean;
    reason?: string;
  };
  if (data.error) {
    throw new Error(data.reason ?? "IP location lookup unavailable");
  }
  if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
    throw new Error("IP lookup returned no coordinates");
  }
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    altitudeM: null,
    accuracyM: 25_000,
    source: "ip",
  };
}
