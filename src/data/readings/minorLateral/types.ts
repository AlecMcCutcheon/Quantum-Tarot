import type { ReadingText } from "../../../types/reading";

/** Per-pip sources: Biddy Tarot keywords + researched lateral poles (see docs/ORIENTATION_RESEARCH.md §4). */
export interface MinorPipSource {
  biddyUpright: string;
  biddyReversed: string;
  transverse: ReadingText;
  conjugate: ReadingText;
}

export type MinorLateralMap = Record<string, MinorPipSource>;
