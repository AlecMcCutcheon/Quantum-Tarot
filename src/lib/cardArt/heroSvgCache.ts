import type { TarotCard } from "../../types/deck";
import { generateCardSvg } from "./generateCardSvg";

const cache = new Map<string, string>();

export function getHeroCardSvg(
  card: TarotCard,
  artSeed: number[],
  drawId: string,
): string {
  const key = `${drawId}:${card.id}:${artSeed.join(",")}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const svg = generateCardSvg(card, artSeed);
  cache.set(key, svg);
  return svg;
}
