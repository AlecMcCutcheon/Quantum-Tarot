import { useEffect, useMemo, useState } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  tone: "white" | "accent" | "gold";
  twinkleSec: number;
  twinkleDelay: number;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const toneRoll = rand();
    const tone: Star["tone"] =
      toneRoll > 0.88 ? "gold" : toneRoll > 0.72 ? "accent" : "white";
    return {
      x: rand() * 100,
      y: rand() * 100,
      size: rand() > 0.82 ? 2.5 : rand() > 0.55 ? 1.5 : 1,
      opacity: 0.12 + rand() * 0.78,
      tone,
      twinkleSec: 2.2 + rand() * 4.8,
      twinkleDelay: rand() * 6,
    };
  });
}

const TONE_COLOR: Record<Star["tone"], string> = {
  white: "rgba(255,255,255,1)",
  accent: "rgba(167,139,250,1)",
  gold: "rgba(251,191,36,1)",
};

const TONE_GLOW: Record<Star["tone"], string> = {
  white: "rgba(255,255,255,0.4)",
  accent: "rgba(167,139,250,0.45)",
  gold: "rgba(251,191,36,0.4)",
};

interface StarfieldProps {
  className?: string;
  /** Faster drift (opening splash). */
  fastDrift?: boolean;
  starCount?: number;
  seed?: number;
}

export function Starfield({
  className = "",
  fastDrift = false,
  starCount = 160,
  seed = 0x71a9_0f0c,
}: StarfieldProps) {
  const [reduced, setReduced] = useState(false);
  const stars = useMemo(() => buildStars(starCount, seed), [starCount, seed]);
  const driftSec = fastDrift ? 38 : 55;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const renderStar = (star: Star, key: string, offsetX = 0, offsetY = 0) => (
    <span
      key={key}
      className="starfield-star absolute rounded-full"
      style={{
        left: `calc(${star.x + offsetX}% - ${star.size / 2}px)`,
        top: `calc(${star.y + offsetY}% - ${star.size / 2}px)`,
        width: star.size,
        height: star.size,
        background: TONE_COLOR[star.tone],
        opacity: star.opacity,
        ["--star-o" as string]: String(star.opacity),
        boxShadow:
          star.size > 2
            ? `0 0 ${star.size * 3}px ${TONE_GLOW[star.tone]}`
            : undefined,
        animation: reduced
          ? undefined
          : `star-twinkle ${star.twinkleSec}s ease-in-out ${star.twinkleDelay}s infinite`,
      }}
    />
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="starfield-drift-layer absolute -left-1/4 -top-1/4 h-[150%] w-[150%]"
        style={
          reduced
            ? undefined
            : { animation: `starfield-drift ${driftSec}s linear infinite` }
        }
      >
        {stars.map((s, i) => renderStar(s, `a-${i}`))}
        {stars.map((s, i) => renderStar(s, `b-${i}`, 37.7, 41.3))}
        {stars.map((s, i) => renderStar(s, `c-${i}`, 71.2, 19.8))}
      </div>
    </div>
  );
}
