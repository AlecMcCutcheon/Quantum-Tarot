import type { Orientation } from "../../../types/deck";
import type { ReadingText } from "../../../types/reading";

export type DepthPatch = Partial<ReadingText>;
export type CardDepth = Partial<Record<Orientation, DepthPatch>>;
