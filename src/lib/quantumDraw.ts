import { getLastQrngSource, randint, type QrngSource } from "../api/qrng";
import { DECK, DECK_SIZE } from "../data/deck";
import type { Orientation, TarotCard } from "../types/deck";
import { hasActiveFocus } from "./focusPayload";
import {
  alignWithIntent,
  type QuantumBasis,
} from "./intentAlign";
import { invertOrientation, ORIENTATIONS } from "./orientation";
import type { SpacetimeSnapshot } from "../types/spacetime";

export interface QuantumDrawResult {
  /** Unique per draw — used to remount UI and verify no stale state. */
  drawId: string;
  card: TarotCard;
  orientation: Orientation;
  artSeed: number[];
  /** Raw QRNG values for this collapse (fresh batch). */
  quantumRaw: number[];
  /** First-draw quantum chain preserved when intent realigns. */
  quantumBasis?: number[];
  /** Draw that anchored `quantumBasis` (for transaction display). */
  quantumBasisDrawId?: string;
  source: QrngSource;
  drawnAt: number;
  intent?: string;
  spacetime?: SpacetimeSnapshot;
  alignmentDigest?: string;
  realigned?: boolean;
}

export interface QuantumDrawOptions {
  intent?: string;
  spacetime?: SpacetimeSnapshot | null;
  /** First measurement — combined with fresh QRNG + intent for realigned draws. */
  quantumBasis?: QuantumBasis;
}

/** One QRNG batch per draw — card, orientation, and art entropy. */
const DRAW_BATCH_SIZE = 6;

/**
 * Each outcome uses one quantum measurement batch. With focus text, fresh QRNG is
 * phase-aligned via SHA-256 (first collapse anchors the chain; later collapses
 * mix in the preserved first measurement).
 */
export async function performQuantumDraw(
  options?: QuantumDrawOptions,
): Promise<QuantumDrawResult | null> {
  const batch = await randint({
    min: 0,
    max: 2147483646,
    size: DRAW_BATCH_SIZE,
  });

  if (!batch?.length || batch[0] === undefined || batch[1] === undefined) {
    return null;
  }

  const source = getLastQrngSource();
  const freshQuantum = [...batch];
  const drawId = crypto.randomUUID();
  const intentText = options?.intent?.trim() ?? "";
  const spacetime = options?.spacetime ?? undefined;
  const hasFocus = hasActiveFocus(intentText, spacetime);

  let cardIndex: number;
  let orientationIndex: number;
  let artSeed: number[];
  let alignmentDigest: string | undefined;
  let quantumBasis: number[] | undefined;
  let quantumBasisDrawId: string | undefined;
  let realigned = false;

  if (hasFocus && options?.quantumBasis) {
    const aligned = await alignWithIntent(
      options.quantumBasis,
      freshQuantum,
      intentText,
      spacetime,
    );
    cardIndex = aligned.cardIndex;
    orientationIndex = aligned.orientationIndex;
    artSeed = aligned.artSeed;
    alignmentDigest = aligned.alignmentDigest;
    quantumBasis = [...options.quantumBasis.quantumRaw];
    quantumBasisDrawId = options.quantumBasis.drawId;
    realigned = true;
  } else if (hasFocus) {
    const anchor: QuantumBasis = { quantumRaw: freshQuantum, drawId };
    const aligned = await alignWithIntent(
      anchor,
      freshQuantum,
      intentText,
      spacetime,
    );
    cardIndex = aligned.cardIndex;
    orientationIndex = aligned.orientationIndex;
    artSeed = aligned.artSeed;
    alignmentDigest = aligned.alignmentDigest;
    quantumBasis = [...freshQuantum];
    quantumBasisDrawId = drawId;
    realigned = true;
  } else {
    cardIndex = batch[0]! % DECK_SIZE;
    orientationIndex = batch[1]! % ORIENTATIONS.length;
    artSeed = batch.slice(2).map((n) => Math.abs(n));
  }

  const orientation = ORIENTATIONS[orientationIndex]!;

  return {
    drawId,
    card: DECK[cardIndex]!,
    orientation,
    artSeed: [...artSeed],
    quantumRaw: [...freshQuantum],
    quantumBasis,
    quantumBasisDrawId,
    source,
    drawnAt: Date.now(),
    intent: intentText || undefined,
    spacetime,
    alignmentDigest,
    realigned,
  };
}

export interface PartnerDrawResult {
  drawId: string;
  card: TarotCard;
  /** Always the inverted pole of the primary card’s orientation. */
  orientation: Orientation;
  artSeed: number[];
  quantumRaw: number[];
  source: QrngSource;
  drawnAt: number;
}

/**
 * Second card in a dual reading: quantum picks the card; orientation mirrors
 * the primary (upright ↔ reversed; transverse ↔ conjugate).
 */
const PARTNER_BATCH_SIZE = 4;

export async function performPartnerDraw(
  primaryCardId: string,
  primaryOrientation: Orientation,
): Promise<PartnerDrawResult | null> {
  const batch = await randint({
    min: 0,
    max: 2147483646,
    size: PARTNER_BATCH_SIZE,
  });

  if (!batch?.length || batch[0] === undefined) {
    return null;
  }

  let cardIndex = batch[0]! % DECK_SIZE;
  if (DECK[cardIndex]!.id === primaryCardId) {
    cardIndex = (cardIndex + 1) % DECK_SIZE;
  }

  const source = getLastQrngSource();
  const orientation = invertOrientation(primaryOrientation);
  const artSeed = batch.slice(1).map((n) => Math.abs(n));
  const quantumRaw = [...batch];

  return {
    drawId: crypto.randomUUID(),
    card: DECK[cardIndex]!,
    orientation,
    artSeed: [...artSeed],
    quantumRaw,
    source,
    drawnAt: Date.now(),
  };
}
