import type { PatternFn } from "./index";

function hsl(h: number, s: number, l: number, a = 1): string {
  return `hsla(${h % 360},${s}%,${l}%,${a})`;
}

export const starfield: PatternFn = (rng, w, h, hue) => {
  const parts: string[] = [];
  const n = 80 + Math.floor(rng() * 60);
  for (let i = 0; i < n; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const r = 0.3 + rng() * 1.2;
    const op = 0.15 + rng() * 0.5;
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${hsl(hue + 200, 30, 90, op)}"/>`,
    );
  }
  return parts.join("");
};

export const mandala: PatternFn = (rng, w, h, hue) => {
  const cx = w / 2;
  const cy = h / 2;
  const parts: string[] = [];
  const petals = 8 + Math.floor(rng() * 8);
  for (let ring = 1; ring <= 5; ring++) {
    const r = (Math.min(w, h) * 0.12 * ring);
    for (let p = 0; p < petals * ring; p++) {
      const a = (p / (petals * ring)) * Math.PI * 2;
      const x1 = cx + r * Math.cos(a);
      const y1 = cy + r * Math.sin(a);
      const x2 = cx + (r + 12) * Math.cos(a + 0.08);
      const y2 = cy + (r + 12) * Math.sin(a + 0.08);
      parts.push(
        `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${hsl(hue + ring * 12, 55, 60, 0.25)}" stroke-width="0.7"/>`,
      );
    }
  }
  return parts.join("");
};

export const spirograph: PatternFn = (rng, w, h, hue) => {
  const cx = w / 2;
  const cy = h / 2;
  const R = 55 + rng() * 25;
  const r = 18 + rng() * 20;
  const d = 25 + rng() * 30;
  let path = "";
  for (let t = 0; t < Math.PI * 16; t += 0.02) {
    const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    path += `${t === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `<path d="${path}" fill="none" stroke="${hsl(hue, 75, 68)}" stroke-width="0.9" opacity="0.75"/>`;
};

export const phaseVortex: PatternFn = (rng, w, h, hue) => {
  const cx = w / 2;
  const cy = h / 2;
  const arms = 5 + Math.floor(rng() * 4);
  const parts: string[] = [];
  for (let a = 0; a < arms; a++) {
    const offset = (a / arms) * Math.PI * 2;
    let d = `M ${cx} ${cy}`;
    for (let i = 0; i < 120; i++) {
      const t = i / 15;
      const r = t * 4.5;
      const ang = offset + t * 0.9;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang);
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    parts.push(
      `<path d="${d}" fill="none" stroke="${hsl(hue + a * 30, 70, 62, 0.5)}" stroke-width="1.1"/>`,
    );
  }
  return parts.join("");
};

export const juliaDots: PatternFn = (rng, w, h, hue, card) => {
  const cx = w / 2;
  const cy = h / 2;
  const cRe = -0.4 + rng() * 0.3;
  const cIm = 0.5 + rng() * 0.2;
  const parts: string[] = [];
  const step = card.suit === "swords" ? 5 : 6;
  for (let py = 60; py < h - 60; py += step) {
    for (let px = 40; px < w - 40; px += step) {
      let zx = (px - cx) / 90;
      let zy = (py - cy) / 90;
      let iter = 0;
      const max = 24;
      while (iter < max && zx * zx + zy * zy < 4) {
        const xtemp = zx * zx - zy * zy + cRe;
        zy = 2 * zx * zy + cIm;
        zx = xtemp;
        iter++;
      }
      if (iter > 6 && iter < max - 2) {
        const op = 0.15 + (iter / max) * 0.55;
        parts.push(
          `<rect x="${px}" y="${py}" width="1.2" height="1.2" fill="${hsl(hue + iter * 8, 65, 55, op)}"/>`,
        );
      }
    }
  }
  return parts.join("");
};

export const radialBurst: PatternFn = (rng, w, h, hue) => {
  const cx = w / 2;
  const cy = h / 2;
  const rays = 24 + Math.floor(rng() * 20);
  const parts: string[] = [];
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const len = Math.min(w, h) * (0.35 + rng() * 0.15);
    const x2 = cx + len * Math.cos(a);
    const y2 = cy + len * Math.sin(a);
    parts.push(
      `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${hsl(hue, 50, 55, 0.12)}" stroke-width="${(0.5 + rng()).toFixed(1)}"/>`,
    );
  }
  return parts.join("");
};

export const cornerOrnaments = (hue: number, w: number, h: number): string => {
  const s = 28;
  const mk = (x: number, y: number, rot: number) =>
    `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M0,0 Q${s / 2},${s / 4} ${s},0 Q${s * 0.75},${s / 2} ${s / 2},${s} Q0,${s / 2} 0,0" fill="none" stroke="${hsl(hue, 45, 70, 0.35)}" stroke-width="1"/><circle cx="${s / 2}" cy="${s / 2}" r="2" fill="${hsl(hue + 50, 70, 75, 0.5)}"/></g>`;
  return [
    mk(14, 14, 0),
    mk(w - 14, 14, 90),
    mk(w - 14, h - 14, 180),
    mk(14, h - 14, 270),
  ].join("");
};

export const ADVANCED_PATTERNS: PatternFn[] = [
  mandala,
  spirograph,
  phaseVortex,
  juliaDots,
  radialBurst,
];
