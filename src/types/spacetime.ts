/** IAU-style labels for the observer's cosmic frame at collapse. */
export interface CelestialBodyLine {
  body: string;
  latinName: string;
  /** Geocentric ecliptic longitude of date (0–360°), astronomy-engine. */
  eclipticLongitudeDeg: number;
  /** Above horizon at observer (degrees); null without GPS. */
  altitudeDeg: number | null;
}

export type LocationSource = "device" | "manual" | "ip";

export interface GpsReading {
  latitude: number;
  longitude: number;
  altitudeM: number | null;
  accuracyM: number | null;
  source?: LocationSource;
}

export interface SpacetimeSnapshot {
  capturedAtUtc: string;
  capturedAtLocal: string;
  epochMs: number;
  gps: GpsReading | null;
  galaxy: { name: string; latin: string };
  stellarSystem: { name: string; latin: string };
  centralStar: { name: string; iauName: string; latin: string };
  celestialBodies: CelestialBodyLine[];
}
