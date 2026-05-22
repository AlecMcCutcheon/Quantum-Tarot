import { useEffect, useState } from "react";
import type { TarotCard } from "../types/deck";
import {
  getCachedLibraryThumbUrl,
  hydrateLibraryCacheFromIdb,
  warmLibraryThumbs,
} from "../lib/cardArt/libraryRasterCache";

/** Progressive WebP thumb URLs for library list rows. */
export function useLibraryThumbs(
  cards: readonly TarotCard[],
  enabled: boolean,
): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!enabled) {
      setUrls({});
      return;
    }

    let cancelled = false;

    const syncFromCache = () => {
      const next: Record<string, string> = {};
      for (const card of cards) {
        const url = getCachedLibraryThumbUrl(card.id);
        if (url) next[card.id] = url;
      }
      if (!cancelled) setUrls(next);
    };

    void hydrateLibraryCacheFromIdb().then(() => {
      if (cancelled) return;
      syncFromCache();
      void warmLibraryThumbs(cards, () => {
        if (!cancelled) syncFromCache();
      });
    });

    return () => {
      cancelled = true;
    };
  }, [cards, enabled]);

  return urls;
}
