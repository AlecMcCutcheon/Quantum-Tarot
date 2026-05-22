import type { TarotCard } from "../../types/deck";
import { seededRng, seedFromIntegers } from "../seededRng";
import { getCardFooterLabel, footerUsesDisplayFont } from "../romanNumerals";
import { escapeXml } from "./roman";
import { renderProminentGlyphs } from "./renderGlyphs";
import { lissajous, suitHueOffset } from "./patterns/index";
import { radialBurst } from "./patterns/advanced";

const W = 280;
const H = 420;
const ART_BOX = { x: 20, y: 72, width: W - 40, height: H - 130 };

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Lightweight SVG for library thumbs and collapse preview (no kaleidoscope / julia). */
export function generateThumbSvg(card: TarotCard, seed: number[]): string {
  const rng = seededRng(seedFromIntegers([...seed, hashId(card.id), suitHueOffset(card)]));
  const hue = (hashId(card.id) + seed[0]! + suitHueOffset(card)) % 360;
  const pattern =
    rng() > 0.5
      ? lissajous(rng, W, H, hue, card)
      : radialBurst(rng, W, H, hue, card);
  const glyphs = renderProminentGlyphs(card, ART_BOX, hue);
  const qName = escapeXml(card.quantumName);
  const footerLabel = escapeXml(getCardFooterLabel(card));
  const footerRoman = footerUsesDisplayFont(card);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" role="img" aria-label="${qName}">
  <defs>
    <linearGradient id="bg-t-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${hue},42%,6%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 80) % 360},40%,10%)"/>
    </linearGradient>
    <clipPath id="art-t-${card.id}"><rect x="${ART_BOX.x}" y="${ART_BOX.y}" width="${ART_BOX.width}" height="${ART_BOX.height}" rx="4"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" rx="14" fill="url(#bg-t-${card.id})"/>
  <rect x="16" y="16" width="${W - 32}" height="40" rx="4" fill="hsla(${hue},35%,14%,0.9)"/>
  <text x="${W / 2}" y="38" text-anchor="middle" fill="hsl(${hue},70%,78%)" font-family="system-ui,sans-serif" font-size="9" font-weight="600">${qName}</text>
  <g clip-path="url(#art-t-${card.id})" opacity="0.55">${pattern}</g>
  ${glyphs}
  <rect x="16" y="${H - 40}" width="${W - 32}" height="28" rx="4" fill="hsla(${hue},30%,10%,0.85)"/>
  <text x="${W / 2}" y="${H - 20}" text-anchor="middle" fill="hsl(${hue},60%,75%)" font-family="system-ui,sans-serif" font-size="${footerRoman ? 11 : 8}" font-weight="500">${footerLabel}</text>
</svg>`;
}
