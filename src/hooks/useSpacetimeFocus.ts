import { useCallback, useEffect, useRef, useState } from "react";
import { fetchApproximateIpLocation } from "../lib/ipGeolocation";
import { captureSpacetimeSnapshot } from "../lib/spacetimeEphemeris";
import type { GpsReading, SpacetimeSnapshot } from "../types/spacetime";

export type GeoPermissionState =
  | "idle"
  | "prompt"
  | "locating"
  | "granted"
  | "denied"
  | "unavailable";

const LOCATION_WAIT_MS = 12_000;
const POLL_MS = 80;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => window.setTimeout(r, ms));
}

export function useSpacetimeFocus() {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<GeoPermissionState>("idle");
  const [gps, setGps] = useState<GpsReading | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [ipLoading, setIpLoading] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const ipInFlightRef = useRef<Promise<GpsReading | null> | null>(null);
  const gpsRef = useRef<GpsReading | null>(null);
  const ipLoadingRef = useRef(false);
  const geoErrorRef = useRef<string | null>(null);

  const runIpFallback = useCallback(async (force = false): Promise<GpsReading | null> => {
    if (!force && ipInFlightRef.current) {
      return ipInFlightRef.current;
    }
    if (!force && gpsRef.current) {
      return gpsRef.current;
    }

    const task = (async () => {
      setIpLoading(true);
      setGeoError(null);
      setPermission("locating");
      try {
        const reading = await fetchApproximateIpLocation();
        if (!gpsRef.current) {
          setGps(reading);
          setPermission("granted");
        }
        return reading;
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "IP location lookup failed";
        setGeoError(msg);
        return null;
      } finally {
        setIpLoading(false);
        ipInFlightRef.current = null;
      }
    })();

    ipInFlightRef.current = task;
    return task;
  }, []);

  const resolveLocation = useCallback(async (): Promise<GpsReading | null> => {
    if (!enabled) return null;

    if (gpsRef.current) {
      return gpsRef.current;
    }

    if (!ipInFlightRef.current) {
      void runIpFallback();
    }

    const deadline = Date.now() + LOCATION_WAIT_MS;
    while (Date.now() < deadline) {
      if (gpsRef.current) {
        return gpsRef.current;
      }
      if (
        !ipLoadingRef.current &&
        !ipInFlightRef.current &&
        geoErrorRef.current
      ) {
        return null;
      }
      await sleep(POLL_MS);
    }

    if (!gpsRef.current && !ipInFlightRef.current) {
      await runIpFallback(true);
    }
    return gpsRef.current;
  }, [enabled, runIpFallback]);

  useEffect(() => {
    gpsRef.current = gps;
    ipLoadingRef.current = ipLoading;
    geoErrorRef.current = geoError;
  }, [gps, ipLoading, geoError]);

  useEffect(() => {
    if (!enabled) {
      ipInFlightRef.current = null;
      setPermission("idle");
      setGps(null);
      setGeoError(null);
      setIpLoading(false);
      return;
    }

    setPermission("locating");
    setGeoError(null);
    setGps(null);
    ipInFlightRef.current = null;
    void runIpFallback();
  }, [enabled, runIpFallback]);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 50);
    return () => window.clearInterval(id);
  }, [enabled]);

  const retryIpApprox = useCallback(() => {
    ipInFlightRef.current = null;
    void runIpFallback(true);
  }, [runIpFallback]);

  const setManualCoords = useCallback((latitude: number, longitude: number) => {
    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setGeoError("Enter latitude −90…90 and longitude −180…180.");
      return;
    }
    setGps({
      latitude,
      longitude,
      altitudeM: null,
      accuracyM: null,
      source: "manual",
    });
    setPermission("granted");
    setGeoError(null);
  }, []);

  const captureForCollapse = useCallback(async (): Promise<SpacetimeSnapshot | null> => {
    if (!enabled) return null;
    try {
      const fix = await resolveLocation();
      return captureSpacetimeSnapshot(Date.now(), fix);
    } catch (e) {
      throw e instanceof Error
        ? e
        : new Error("Failed to build spacetime snapshot");
    }
  }, [enabled, resolveLocation]);

  const toggle = useCallback(() => {
    setEnabled((v) => !v);
  }, []);

  return {
    enabled,
    setEnabled,
    toggle,
    permission,
    gps,
    geoError,
    ipLoading,
    nowMs,
    captureForCollapse,
    retryIpApprox,
    setManualCoords,
  };
}
