import type { ReadingText } from "../../types/reading";

/** Depth overrides in readingDepth/ replace lateral expand appends at build time. */
export function enrichMinorLateralExpand(
  _cardId: string,
  _pole: "transverse" | "conjugate",
  base: ReadingText,
): ReadingText {
  return base;
}
