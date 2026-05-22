import type { TarotCard } from "../../types/deck";
import { generateCardSvg } from "./generateCardSvg";

const cache = new Map<string, string>();

function librarySeed(card: TarotCard): number[] {
  return [card.index, card.index * 7, card.index * 13, 1];
}

/** Full-quality SVG for library detail panel (sharp at large size). */
export function getLibraryDetailSvg(card: TarotCard): string {
  const hit = cache.get(card.id);
  if (hit) return hit;
  const svg = generateCardSvg(card, librarySeed(card));
  cache.set(card.id, svg);
  return svg;
}
