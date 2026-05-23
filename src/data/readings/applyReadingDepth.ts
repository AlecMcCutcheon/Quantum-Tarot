import type { Orientation } from "../../types/deck";
import type { ReadingText } from "../../types/reading";
import { getDepthPatch } from "./readingDepthLoader";

export function applyReadingDepth(
  cardId: string,
  orientation: Orientation,
  reading: ReadingText,
): ReadingText {
  const patch = getDepthPatch(cardId)?.[orientation];
  if (!patch) return reading;
  return {
    summary: patch.summary ?? reading.summary,
    detail: patch.detail ?? reading.detail,
    guidance: patch.guidance ?? reading.guidance,
  };
}
