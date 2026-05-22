import type { TarotCard } from "../../../types/deck";

export type PatternFn = (
  rng: () => number,
  w: number,
  h: number,
  hue: number,
  card: TarotCard,
) => string;

function hsl(h: number, s: number, l: number, a = 1): string {
  return `hsla(${h % 360},${s}%,${l}%,${a})`;
}

export const lissajous: PatternFn = (rng, w, h, hue) => {
  const cx = w / 2;
  const cy = h / 2;
  const a = 3 + Math.floor(rng() * 4);
  const b = 2 + Math.floor(rng() * 5);
  const delta = rng() * Math.PI;
  const scale = Math.min(w, h) * 0.32;
  let d = `M ${cx} ${cy}`;
  for (let t = 0; t <= Math.PI * 2; t += 0.04) {
    const x = cx + scale * Math.sin(a * t + delta);
    const y = cy + scale * Math.sin(b * t);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `<path d="${d}" fill="none" stroke="${hsl(hue, 70, 65)}" stroke-width="1.2" opacity="0.85"/>`;
};

export const roseCurve: PatternFn = (rng, w, h, hue) => {
  const cx = w / 2;
  const cy = h / 2;
  const k = 3 + Math.floor(rng() * 5);
  const scale = Math.min(w, h) * 0.28;
  let d = "";
  for (let t = 0; t <= Math.PI * 2; t += 0.05) {
    const r = scale * Math.cos(k * t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    d += `${t === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="none" stroke="${hsl(hue + 40, 75, 60)}" stroke-width="1"/>`;
};

export const interference: PatternFn = (rng, w, h, hue) => {
  const lines: string[] = [];
  const n = 12 + Math.floor(rng() * 10);
  for (let i = 0; i < n; i++) {
    const y = (h / (n + 1)) * (i + 1);
    const amp = 8 + rng() * 24;
    let d = `M 0 ${y}`;
    for (let x = 0; x <= w; x += 4) {
      const yy = y + amp * Math.sin((x / w) * Math.PI * 4 + rng() * 6);
      d += ` L ${x} ${yy.toFixed(1)}`;
    }
    lines.push(
      `<path d="${d}" fill="none" stroke="${hsl(hue + i * 8, 60, 55, 0.35)}" stroke-width="0.8"/>`,
    );
  }
  return lines.join("");
};

export const recursiveCircles: PatternFn = (rng, w, h, hue) => {
  const cx = w / 2;
  const cy = h / 2;
  const parts: string[] = [];
  let r = Math.min(w, h) * 0.38;
  for (let i = 0; i < 6; i++) {
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${hsl(hue + i * 25, 65, 58, 0.5)}" stroke-width="1"/>`,
    );
    r *= 0.62 + rng() * 0.1;
  }
  return parts.join("");
};

export const triangularLattice: PatternFn = (_rng, w, h, hue, card) => {
  const sharp = card.suit === "swords";
  const step = sharp ? 22 : 28;
  const parts: string[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const px = x + (y / step) % 2 * (step / 2);
      parts.push(
        `<polygon points="${px},${y} ${px + step / 2},${y + step} ${px - step / 2},${y + step}" fill="none" stroke="${hsl(hue, 50, 50, 0.2)}" stroke-width="0.6"/>`,
      );
    }
  }
  return parts.join("");
};

export const PATTERNS: PatternFn[] = [
  lissajous,
  roseCurve,
  interference,
  recursiveCircles,
  triangularLattice,
];

export function suitHueOffset(card: TarotCard): number {
  const map: Record<string, number> = {
    wands: 25,
    cups: 200,
    swords: 260,
    pentacles: 130,
  };
  if (card.arcana === "major") return (card.rank as number) * 14;
  return card.suit ? map[card.suit] ?? 0 : 0;
}
