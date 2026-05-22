import type { MinorLateralMap } from "./types";
import { CUPS_LATERAL } from "./cups";
import { PENTACLES_LATERAL } from "./pentacles";
import { SWORDS_LATERAL } from "./swords";
import { WANDS_LATERAL } from "./wands";

export type { MinorPipSource, MinorLateralMap } from "./types";

export const MINOR_LATERAL: MinorLateralMap = {
  ...WANDS_LATERAL,
  ...CUPS_LATERAL,
  ...SWORDS_LATERAL,
  ...PENTACLES_LATERAL,
};

export function getMinorPipSource(cardId: string) {
  return MINOR_LATERAL[cardId];
}
