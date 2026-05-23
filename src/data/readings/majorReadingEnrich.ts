import type { ReadingText } from "../../types/reading";

/** Depth overrides in readingDepth/ replace enrich appends at build time. */
export function enrichMajorTransverse(
  _id: string,
  base: ReadingText,
): ReadingText {
  return base;
}

export function enrichMajorConjugate(
  _id: string,
  base: ReadingText,
): ReadingText {
  return base;
}

export function enrichMajorVertical(
  _id: string,
  _pole: "upright" | "reversed",
  base: ReadingText,
): ReadingText {
  return base;
}
