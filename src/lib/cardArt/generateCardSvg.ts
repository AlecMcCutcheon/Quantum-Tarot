import type { TarotCard } from "../../types/deck";
import { seededRng, seedFromIntegers } from "../seededRng";
import { densityLayers, getCardArtBundle } from "./cardArtConfig";
import { escapeXml } from "./roman";
import {
  footerUsesDisplayFont,
  getCardFooterLabel,
} from "../romanNumerals";
import {
  ADVANCED_PATTERNS,
  cornerOrnaments,
  radialBurst,
  starfield,
} from "./patterns/advanced";
import { PATTERNS, suitHueOffset } from "./patterns/index";
import { kaleidoscopeSymmetry } from "./kaleidoscope";
import { renderProminentGlyphs } from "./renderGlyphs";

const W = 280;
const H = 420;

const ART_BOX = { x: 20, y: 72, width: W - 40, height: H - 130 };

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickPattern(
  pool: typeof PATTERNS,
  rng: () => number,
  offset: number,
): (typeof PATTERNS)[number] {
  return pool[(Math.floor(rng() * pool.length) + offset) % pool.length]!;
}

export function generateCardSvg(card: TarotCard, seed: number[]): string {
  const bundle = getCardArtBundle(card);
  const { profile } = bundle;
  const rng = seededRng(seedFromIntegers([...seed, hashId(card.id), suitHueOffset(card)]));
  const hue = (hashId(card.id) + seed[0]! + suitHueOffset(card)) % 360;
  const suitOffset = card.suit
    ? ["wands", "cups", "swords", "pentacles"].indexOf(card.suit)
    : (card.rank as number);

  const bgOpacity = profile.backgroundOpacity;
  const layers = densityLayers(profile.patternDensity);

  const bgStars = starfield(rng, W, H, hue, card);
  const burst = radialBurst(rng, W, H, hue, card);
  const patterns: string[] = [];
  const pools = [
    () => pickPattern(PATTERNS, rng, suitOffset)(rng, W, H, hue, card),
    () => pickPattern(ADVANCED_PATTERNS, rng, suitOffset + 2)(rng, W, H, hue + 60, card),
    () => pickPattern(PATTERNS, rng, suitOffset + 4)(rng, W, H, hue + 120, card),
    () => pickPattern(ADVANCED_PATTERNS, rng, suitOffset + 6)(rng, W, H, hue + 30, card),
  ];
  for (let i = 0; i < layers; i++) {
    patterns.push(pools[i % pools.length]!());
  }

  const prominentGlyphs = renderProminentGlyphs(card, ART_BOX, hue);
  const ornaments = cornerOrnaments(hue, W, H);

  const qName = escapeXml(card.quantumName);
  const cName = escapeXml(card.classicName);
  const footerLabel = escapeXml(getCardFooterLabel(card));
  const footerRoman = footerUsesDisplayFont(card);
  const footerFontSize = footerRoman
    ? card.arcana === "major"
      ? 18
      : 15
    : 9;

  const patternOpacities = [0.25, 0.35, 0.45, 0.3].slice(0, layers);

  const patternLayers = patterns
    .map(
      (p, i) =>
        `<g opacity="${(patternOpacities[i]! * bgOpacity * 1.4).toFixed(2)}" filter="url(#glow-${card.id})">${p}</g>`,
    )
    .join("");

  const artClip = `art-${card.id}`;

  const kaleidoscopePatterns = kaleidoscopeSymmetry(
    patternLayers,
    ART_BOX,
    card.id,
    artClip,
  );

  const kaleidoscopeField = kaleidoscopeSymmetry(
    `<g opacity="${(bgOpacity * 0.7).toFixed(2)}">${bgStars}</g><g opacity="${(bgOpacity * 0.5).toFixed(2)}">${burst}</g>`,
    ART_BOX,
    `${card.id}-field`,
    artClip,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" role="img" aria-label="${qName}">
  <defs>
    <linearGradient id="bg-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${hue},42%,6%)"/>
      <stop offset="45%" stop-color="hsl(${(hue + 50) % 360},38%,11%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 100) % 360},45%,8%)"/>
    </linearGradient>
    <radialGradient id="vignette-${card.id}" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="hsla(0,0%,0%,0.55)"/>
    </radialGradient>
    <linearGradient id="bar-${card.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsla(${hue},40%,20%,0.85)"/>
      <stop offset="100%" stop-color="hsla(${hue},30%,8%,0.3)"/>
    </linearGradient>
    <linearGradient id="footer-bar-${card.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsla(${hue},30%,8%,0.35)"/>
      <stop offset="100%" stop-color="hsla(${hue},40%,18%,0.9)"/>
    </linearGradient>
    <filter id="glow-${card.id}">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glyph-halo">
      <feGaussianBlur stdDeviation="12" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="${artClip}"><rect x="${ART_BOX.x}" y="${ART_BOX.y}" width="${ART_BOX.width}" height="${ART_BOX.height}" rx="4"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" rx="14" fill="url(#bg-${card.id})"/>
  ${kaleidoscopeField}
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="10" fill="none" stroke="hsla(${hue},55%,72%,0.4)" stroke-width="1.2"/>
  <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="8" fill="none" stroke="hsla(${(hue + 40) % 360},45%,58%,0.25)" stroke-width="0.8" stroke-dasharray="4 6"/>
  ${ornaments}
  <rect x="16" y="16" width="${W - 32}" height="56" rx="4" fill="url(#bar-${card.id})"/>
  <text x="${W / 2}" y="38" text-anchor="middle" fill="hsl(${hue},75%,82%)" font-family="Orbitron,sans-serif" font-size="10.5" font-weight="600">${qName}</text>
  <text x="${W / 2}" y="54" text-anchor="middle" fill="hsla(0,0%,92%,0.5)" font-family="DM Sans,sans-serif" font-size="7.5">${cName}</text>
  ${kaleidoscopePatterns}
  ${prominentGlyphs}
  <rect x="16" y="${H - 48}" width="${W - 32}" height="36" rx="4" fill="url(#footer-bar-${card.id})"/>
  <line x1="24" y1="${H - 48}" x2="${W - 24}" y2="${H - 48}" stroke="hsla(${hue},50%,70%,0.25)" stroke-width="0.8"/>
  <text x="${W / 2}" y="${H - 22}" text-anchor="middle" fill="hsl(${hue},65%,80%)" font-family="${footerRoman ? "Orbitron" : "DM Sans"},sans-serif" font-size="${footerFontSize}" font-weight="${footerRoman ? "600" : "500"}" letter-spacing="${footerRoman ? "0.12em" : "0.04em"}">${footerLabel}</text>
  <rect width="${W}" height="${H}" rx="14" fill="url(#vignette-${card.id})" pointer-events="none"/>
</svg>`;
}
