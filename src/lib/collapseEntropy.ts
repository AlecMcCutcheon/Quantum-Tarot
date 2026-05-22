import { DECK_SIZE } from "../data/deck";
import type { QuantumDrawResult } from "./quantumDraw";
import { ORIENTATIONS } from "./orientation";

export interface CollapseFrame {
  cardIndex: number;
  orientationIndex: number;
  artSeed: number[];
}

/** Drives the visual collapse shuffle (derived from the draw's QRNG chain). */
export interface CollapsePreview {
  frames: CollapseFrame[];
}

const PREVIEW_FRAMES = 24;
const ORIENTATION_COUNT = ORIENTATIONS.length;

/** Shuffle sequence from the same quantum measurement as the final card. */
export function buildCollapsePreviewFromDraw(
  draw: QuantumDrawResult,
  frameCount = PREVIEW_FRAMES,
): CollapsePreview {
  const raw = draw.quantumRaw;
  const frames: CollapseFrame[] = [];
  for (let i = 0; i < frameCount; i++) {
    const a = raw[i % raw.length] ?? i;
    const b = raw[(i + 1) % raw.length] ?? i + 1;
    const c = raw[(i + 2) % raw.length] ?? i + 2;
    const d = raw[(i + 3) % raw.length] ?? i + 3;
    frames.push({
      cardIndex: Math.abs(a) % DECK_SIZE,
      orientationIndex: Math.abs(b) % ORIENTATION_COUNT,
      artSeed: [Math.abs(c), Math.abs(d)],
    });
  }
  return { frames };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Minimum time the collapse theatre runs before revealing (ms). */
export const MIN_COLLAPSE_MS = 4200;
