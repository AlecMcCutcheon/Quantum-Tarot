import { DECK } from "../../data/deck";
import type { TarotCard } from "../../types/deck";
import { loadAllThumbUrlsFromIdb, saveThumbUrlToIdb } from "./libraryRasterIdb";
import { generateThumbSvg } from "./generateThumbSvg";
import {
  LIBRARY_DETAIL_SIZE,
  LIBRARY_THUMB_SIZE,
  svgToWebpDataUrl,
} from "./svgRaster";

const thumbCache = new Map<string, string>();
const detailCache = new Map<string, string>();
const thumbPending = new Map<string, Promise<string>>();
let idbHydrated = false;
let idbHydratePromise: Promise<void> | null = null;

function librarySeed(card: TarotCard): number[] {
  return [card.index, card.index * 7, card.index * 13, 1];
}

function thumbSvg(card: TarotCard): string {
  return generateThumbSvg(card, librarySeed(card));
}

export function getCachedLibraryThumbUrl(cardId: string): string | undefined {
  return thumbCache.get(cardId);
}

export function getCachedLibraryDetailUrl(cardId: string): string | undefined {
  return detailCache.get(cardId);
}

/** Load persisted WebP thumbs from IndexedDB into memory. */
export function hydrateLibraryCacheFromIdb(): Promise<void> {
  if (idbHydrated) return Promise.resolve();
  if (!idbHydratePromise) {
    idbHydratePromise = loadAllThumbUrlsFromIdb().then((stored) => {
      for (const [id, url] of stored) {
        thumbCache.set(id, url);
      }
      idbHydrated = true;
    });
  }
  return idbHydratePromise;
}

/** Rasterize one card thumb off the critical path. */
export function ensureLibraryThumbUrl(card: TarotCard): Promise<string> {
  const hit = thumbCache.get(card.id);
  if (hit) return Promise.resolve(hit);

  const pending = thumbPending.get(card.id);
  if (pending) return pending;

  const job = svgToWebpDataUrl(
    thumbSvg(card),
    LIBRARY_THUMB_SIZE.width,
    LIBRARY_THUMB_SIZE.height,
    0.78,
  ).then((url) => {
    thumbCache.set(card.id, url);
    thumbPending.delete(card.id);
    void saveThumbUrlToIdb(card.id, url);
    return url;
  });

  thumbPending.set(card.id, job);
  return job;
}

export function ensureLibraryDetailUrl(card: TarotCard): Promise<string> {
  const hit = detailCache.get(card.id);
  if (hit) return Promise.resolve(hit);

  return svgToWebpDataUrl(
    thumbSvg(card),
    LIBRARY_DETAIL_SIZE.width,
    LIBRARY_DETAIL_SIZE.height,
    0.92,
  ).then((url) => {
    detailCache.set(card.id, url);
    return url;
  });
}

const BATCH = 6;

/** Progressive warm-up — yields between batches to keep INP low. */
export async function warmLibraryThumbs(
  cards: readonly TarotCard[],
  onBatch?: () => void,
): Promise<void> {
  const pending = cards.filter((c) => !thumbCache.has(c.id));
  if (pending.length === 0) {
    onBatch?.();
    return;
  }

  for (let i = 0; i < pending.length; i += BATCH) {
    const slice = pending.slice(i, i + BATCH);
    await Promise.all(slice.map((c) => ensureLibraryThumbUrl(c)));
    onBatch?.();
    await new Promise<void>((r) => {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(() => r(), { timeout: 120 });
      } else {
        setTimeout(r, 0);
      }
    });
  }
}

/** Background preload after first paint — majors first for fast library filter. */
export function preloadLibraryCacheInBackground(): void {
  const run = () => {
    void hydrateLibraryCacheFromIdb().then(() => {
      const majors = DECK.filter((c) => c.arcana === "major");
      void warmLibraryThumbs(majors);
    });
  };
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 4000 });
  } else {
    setTimeout(run, 1500);
  }
}
