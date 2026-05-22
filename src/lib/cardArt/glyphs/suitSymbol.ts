import type { Suit } from "../../../types/deck";

export interface SymbolStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  glow?: string;
}

/** Single suit emblem centered at 0,0 — scale via transform. Size ~24 units. */
export function suitSymbolPath(suit: Suit): string {
  switch (suit) {
    case "wands":
      // Photon rod: staff + radiant head + emission lines
      return `
        <line x1="0" y1="10" x2="0" y2="-12" stroke-width="inherit"/>
        <circle cx="0" cy="-14" r="5" fill="inherit" opacity="0.85"/>
        <line x1="-6" y1="-10" x2="6" y2="-10" stroke-width="inherit" opacity="0.7"/>
        <line x1="-4" y1="4" x2="0" y2="-2" stroke-width="inherit" opacity="0.5"/>
        <line x1="4" y1="4" x2="0" y2="-2" stroke-width="inherit" opacity="0.5"/>
      `;
    case "cups":
      // Chalice / fluid vessel — unmistakable cup silhouette
      return `
        <path d="M -11 2 Q 0 -14 11 2 L 8 10 Q 0 5 -8 10 Z" fill="inherit" fill-opacity="0.25" stroke-width="inherit"/>
        <ellipse cx="0" cy="11" rx="9" ry="3" fill="inherit" fill-opacity="0.35"/>
        <path d="M -5 2 Q 0 -4 5 2" fill="none" stroke-width="inherit" opacity="0.6"/>
      `;
    case "swords":
      // Operator blade — triangle blade + crossbar
      return `
        <polygon points="0,-16 7,12 -7,12" fill="inherit" fill-opacity="0.2" stroke-width="inherit"/>
        <line x1="-9" y1="6" x2="9" y2="6" stroke-width="inherit"/>
        <line x1="0" y1="-16" x2="0" y2="14" stroke-width="inherit" opacity="0.5"/>
      `;
    case "pentacles":
      // Lattice coin — double ring + inner star
      return `
        <circle cx="0" cy="0" r="14" fill="none" stroke-width="inherit"/>
        <circle cx="0" cy="0" r="10" fill="inherit" fill-opacity="0.15" stroke-width="inherit"/>
        <polygon points="0,-8 7,6 -7,6" fill="none" stroke-width="inherit"/>
        <circle cx="0" cy="0" r="3" fill="inherit" fill-opacity="0.5"/>
      `;
  }
}

export function renderSuitSymbolAt(
  suit: Suit,
  x: number,
  y: number,
  scale: number,
  style: SymbolStyle,
  rotate = 0,
): string {
  const sw = style.strokeWidth / scale;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rotate}) scale(${scale})" fill="${style.fill}" stroke="${style.stroke}" stroke-width="${sw}" style="stroke-width:${sw}px">
    ${suitSymbolPath(suit)}
  </g>`;
}
