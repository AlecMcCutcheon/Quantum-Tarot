import type { CardDepth } from "./readingDepth/types";

let depthByCard: Record<string, CardDepth> | null = null;
let loadPromise: Promise<void> | null = null;

/** Load depth overrides in parallel chunks (majors + four suits). */
export function loadReadingDepth(): Promise<void> {
  if (depthByCard) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const [majors, wands, cups, swords, pentacles] = await Promise.all([
      import("./readingDepth/majors"),
      import("./readingDepth/wands"),
      import("./readingDepth/cups"),
      import("./readingDepth/swords"),
      import("./readingDepth/pentacles"),
    ]);
    depthByCard = {
      ...majors.MAJOR_DEPTH,
      ...wands.WANDS_DEPTH,
      ...cups.CUPS_DEPTH,
      ...swords.SWORDS_DEPTH,
      ...pentacles.PENTACLES_DEPTH,
    };
  })();

  return loadPromise;
}

export function getDepthPatch(
  cardId: string,
): CardDepth | undefined {
  return depthByCard?.[cardId];
}

export function isReadingDepthLoaded(): boolean {
  return depthByCard !== null;
}
