import type { CourtGlyphId } from "../types";

export function courtEmblemPath(court: CourtGlyphId): string {
  switch (court) {
    case "initiate":
      return `<circle cx="0" cy="-8" r="6" fill="inherit"/><path d="M-14,8 Q0,-4 14,8" fill="none" stroke-width="inherit"/><line x1="0" y1="8" x2="0" y2="18" stroke-width="inherit"/>`;
    case "propagator":
      return `<polygon points="0,-16 12,12 -12,12" fill="inherit" fill-opacity="0.2" stroke-width="inherit"/><line x1="-18" y1="0" x2="18" y2="0" stroke-width="inherit"/>`;
    case "eigenstate":
      return `<circle cx="0" cy="0" r="16" fill="none" stroke-width="inherit"/><path d="M-10,-6 Q0,-14 10,-6 Q0,14 -10,-6" fill="inherit" fill-opacity="0.25"/>`;
    case "sovereign":
      return `<path d="M-16,-4 L0,-18 L16,-4 L12,14 L-12,14 Z" fill="inherit" fill-opacity="0.2" stroke-width="inherit"/><rect x="-6" y="2" width="12" height="12" fill="none" stroke-width="inherit"/>`;
  }
}

export function renderCourtEmblem(
  court: CourtGlyphId,
  cx: number,
  cy: number,
  scale: number,
  fill: string,
  stroke: string,
  strokeWidth: number,
): string {
  const sw = strokeWidth / scale;
  return `<g transform="translate(${cx},${cy}) scale(${scale})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}">
    ${courtEmblemPath(court)}
  </g>`;
}
