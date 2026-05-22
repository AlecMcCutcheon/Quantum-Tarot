import { useState } from "react";
import { isNetworkLocationBlocked } from "../lib/geoErrors";
import {
  COSMIC_FRAME,
  formatGpsDisplay,
  formatLocalWithMs,
  formatUtcWithMs,
} from "../lib/spacetimeEphemeris";
import type { GeoPermissionState } from "../hooks/useSpacetimeFocus";
import type { GpsReading } from "../types/spacetime";

interface SpacetimeFocusPanelProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  permission: GeoPermissionState;
  gps: GpsReading | null;
  geoError: string | null;
  nowMs: number;
  ipLoading?: boolean;
  onRetryIp?: () => void;
  onSetManualCoords?: (lat: number, lon: number) => void;
}

export function SpacetimeFocusPanel({
  enabled,
  onToggle,
  disabled,
  permission,
  gps,
  geoError,
  nowMs,
  ipLoading = false,
  onRetryIp,
  onSetManualCoords,
}: SpacetimeFocusPanelProps) {
  const when = new Date(nowMs);
  const [manualOpen, setManualOpen] = useState(false);
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const showManualEntry =
    !gps && !ipLoading && Boolean(onSetManualCoords);
  const showIpRetry =
    !gps && !ipLoading && isNetworkLocationBlocked(geoError) && onRetryIp;

  const applyManual = () => {
    if (!onSetManualCoords) return;
    onSetManualCoords(parseFloat(latInput), parseFloat(lonInput));
  };

  return (
    <div className="w-full max-w-md text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-xs font-medium tracking-wide text-star/60 uppercase">
          Spacetime focus
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={disabled}
          onClick={onToggle}
          className={`font-display rounded-full border px-4 py-1.5 text-[10px] font-semibold tracking-widest uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 ${
            enabled
              ? "border-gold bg-gold/25 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              : "border-white/20 bg-void/50 text-star/55 hover:border-white/35"
          }`}
        >
          {enabled ? "On" : "Off"}
        </button>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-star/45">
        When on, your place and live clock (to the millisecond) mix into the
        collapse with the Solar System frame—optionally combined with text focus
        below.
      </p>

      {enabled ? (
        <div className="mt-3 space-y-3 rounded-xl border border-gold/30 bg-gold/5 px-3 py-3">
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-gold/75 uppercase">
              Location
            </p>
            {gps ? (
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-star/80">
                {formatGpsDisplay(gps)}
              </p>
            ) : permission === "denied" ? (
              <p className="mt-1 text-[11px] text-amber-200/80">
                Browser blocked location — use a fallback below or collapse with
                time and sky only.
              </p>
            ) : permission === "unavailable" ? (
              <p className="mt-1 text-[11px] text-amber-200/80">
                Geolocation unavailable in this browser.
              </p>
            ) : ipLoading || permission === "locating" ? (
              <p className="mt-1 text-[11px] text-star/55">
                Resolving approximate location…
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-star/55">
                Location will resolve automatically when you collapse.
              </p>
            )}
            {geoError && !gps && !ipLoading ? (
              <p className="mt-1 text-[10px] leading-relaxed text-amber-200/80">
                {geoError}
              </p>
            ) : null}

            {(showIpRetry || showManualEntry) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {showIpRetry ? (
                  <button
                    type="button"
                    onClick={() => onRetryIp?.()}
                    className="rounded-lg border border-accent/35 bg-accent/10 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-accent uppercase transition hover:bg-accent/20"
                  >
                    Retry IP location
                  </button>
                ) : null}
                {showManualEntry ? (
                  <button
                    type="button"
                    onClick={() => setManualOpen((o) => !o)}
                    className="rounded-lg border border-white/20 bg-void/50 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-star/70 uppercase transition hover:border-white/35"
                  >
                    {manualOpen ? "Hide coordinates" : "Enter coordinates"}
                  </button>
                ) : null}
              </div>
            )}

            {manualOpen && onSetManualCoords ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-[10px] text-star/50">
                  Latitude
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 40.7128"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-void/60 px-2 py-1.5 font-mono text-[11px] text-star"
                  />
                </label>
                <label className="text-[10px] text-star/50">
                  Longitude
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. -74.0060"
                    value={lonInput}
                    onChange={(e) => setLonInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-void/60 px-2 py-1.5 font-mono text-[11px] text-star"
                  />
                </label>
                <button
                  type="button"
                  onClick={applyManual}
                  className="col-span-2 rounded-lg border border-gold/35 bg-gold/10 py-1.5 text-[10px] font-semibold tracking-wide text-gold uppercase hover:bg-gold/20"
                >
                  Apply manual location
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-wide text-gold/75 uppercase">
              Time (live)
            </p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-star/80">
              {formatLocalWithMs(when)}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-star/50">
              {formatUtcWithMs(nowMs)} UTC
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-wide text-gold/75 uppercase">
              Frame
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-star/70">
              {COSMIC_FRAME.galaxy.name}{" "}
              <span className="text-star/45">({COSMIC_FRAME.galaxy.latin})</span>
              {" · "}
              {COSMIC_FRAME.stellarSystem.name}{" "}
              <span className="text-star/45">
                ({COSMIC_FRAME.stellarSystem.latin})
              </span>
              {" · "}
              {COSMIC_FRAME.centralStar.name}{" "}
              <span className="text-star/45">
                (IAU {COSMIC_FRAME.centralStar.iauName})
              </span>
            </p>
            <p className="mt-1 text-[10px] text-star/50">
              Planet longitudes at collapse are taken from geocentric ecliptic
              ephemeris (Mercury–Neptune, Luna, Sol).
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
