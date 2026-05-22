import {
  Body,
  Ecliptic,
  Equator,
  GeoVector,
  Horizon,
  Observer,
  SunPosition,
} from "astronomy-engine";
import type { CelestialBodyLine, GpsReading, SpacetimeSnapshot } from "../types/spacetime";

/** Milky Way + Solar System + Sol (IAU Sun) naming for the hash payload. */
export const COSMIC_FRAME = {
  galaxy: { name: "Milky Way", latin: "Via Lactea" },
  stellarSystem: { name: "Solar System", latin: "Systema Solare" },
  centralStar: { name: "Sol", iauName: "Sun", latin: "Sol" },
} as const;

const MAJOR_BODIES: {
  body: Body;
  name: string;
  latinName: string;
}[] = [
  { body: Body.Sun, name: "Sun", latinName: "Sol" },
  { body: Body.Moon, name: "Moon", latinName: "Luna" },
  { body: Body.Mercury, name: "Mercury", latinName: "Mercurius" },
  { body: Body.Venus, name: "Venus", latinName: "Venus" },
  { body: Body.Mars, name: "Mars", latinName: "Mars" },
  { body: Body.Jupiter, name: "Jupiter", latinName: "Iuppiter" },
  { body: Body.Saturn, name: "Saturn", latinName: "Saturnus" },
  { body: Body.Uranus, name: "Uranus", latinName: "Uranus" },
  { body: Body.Neptune, name: "Neptune", latinName: "Neptunus" },
];

function round6(n: number): number {
  return Math.round(n * 1_000_000) / 1_000_000;
}

function isValidGps(gps: GpsReading | null): gps is GpsReading {
  if (!gps) return false;
  return (
    Number.isFinite(gps.latitude) &&
    Number.isFinite(gps.longitude) &&
    gps.latitude >= -90 &&
    gps.latitude <= 90 &&
    gps.longitude >= -180 &&
    gps.longitude <= 180
  );
}

/**
 * Geocentric ecliptic longitude of date (degrees), as seen from Earth's center.
 * Uses astronomy-engine GeoVector + Ecliptic (not EclipticLongitude, which is
 * heliocentric and disagrees with horizon math — e.g. Moon ~108° off).
 */
function bodyGeocentricEclipticLongitudeDeg(body: Body, when: Date): number {
  if (body === Body.Sun) {
    return round6(SunPosition(when).elon);
  }
  const vector = GeoVector(body, when, true);
  return round6(Ecliptic(vector).elon);
}

/**
 * Topocentric altitude: observer lat/lon, apparent equator-of-date, refraction.
 * Matches geocentric longitude frame (observer on Earth).
 */

function bodyAltitudeDeg(
  body: Body,
  when: Date,
  observer: Observer,
): number | null {
  try {
    const eq = Equator(body, when, observer, true, true);
    const hor = Horizon(when, observer, eq.ra, eq.dec, "normal");
    return round6(hor.altitude);
  } catch {
    return null;
  }
}

export function formatUtcWithMs(epochMs: number): string {
  const d = new Date(epochMs);
  const iso = d.toISOString();
  const ms = String(epochMs % 1000).padStart(3, "0");
  return iso.replace(/\.\d{3}Z$/, `.${ms}Z`);
}

/**
 * Build a collapse-time snapshot: UTC/local clock to ms, optional GPS, and
 * geocentric ecliptic longitudes + altitudes (astronomy-engine, computed locally).
 */
export function captureSpacetimeSnapshot(
  epochMs: number,
  gps: GpsReading | null,
): SpacetimeSnapshot {
  const when = new Date(epochMs);
  const observer = isValidGps(gps)
    ? new Observer(gps.latitude, gps.longitude, gps.altitudeM ?? 0)
    : null;

  const celestialBodies: CelestialBodyLine[] = MAJOR_BODIES.map(
    ({ body, name: bodyName, latinName }) => {
      let eclipticLongitudeDeg = 0;
      try {
        eclipticLongitudeDeg = bodyGeocentricEclipticLongitudeDeg(body, when);
      } catch {
        eclipticLongitudeDeg = 0;
      }
      const altitudeDeg = observer
        ? bodyAltitudeDeg(body, when, observer)
        : null;
      return {
        body: bodyName,
        latinName,
        eclipticLongitudeDeg,
        altitudeDeg,
      };
    },
  );

  return {
    capturedAtUtc: formatUtcWithMs(epochMs),
    capturedAtLocal: formatLocalWithMs(when),
    epochMs,
    gps: isValidGps(gps)
      ? {
          latitude: round6(gps.latitude),
          longitude: round6(gps.longitude),
          altitudeM: gps.altitudeM !== null ? round6(gps.altitudeM) : null,
          accuracyM: gps.accuracyM !== null ? round6(gps.accuracyM) : null,
          source: gps.source,
        }
      : null,
    galaxy: { ...COSMIC_FRAME.galaxy },
    stellarSystem: { ...COSMIC_FRAME.stellarSystem },
    centralStar: { ...COSMIC_FRAME.centralStar },
    celestialBodies,
  };
}

export function formatLocalWithMs(date: Date): string {
  const ms = String(date.getMilliseconds()).padStart(3, "0");
  const base = date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `${base}.${ms}`;
}

const LOCATION_SOURCE_LABEL: Record<
  NonNullable<GpsReading["source"]>,
  string
> = {
  device: "device GPS",
  manual: "manual",
  ip: "approx. IP",
};

export function formatGpsDisplay(gps: GpsReading): string {
  const lat = gps.latitude >= 0 ? "N" : "S";
  const lon = gps.longitude >= 0 ? "E" : "W";
  const tag = gps.source ? ` · ${LOCATION_SOURCE_LABEL[gps.source]}` : "";
  return (
    `${Math.abs(gps.latitude).toFixed(6)}°${lat}, ` +
    `${Math.abs(gps.longitude).toFixed(6)}°${lon}` +
    (gps.altitudeM !== null ? ` · ${gps.altitudeM.toFixed(1)} m` : "") +
    (gps.accuracyM !== null ? ` ±${gps.accuracyM.toFixed(0)} m` : "") +
    tag
  );
}
