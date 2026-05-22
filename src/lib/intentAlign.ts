import { DECK, DECK_SIZE } from "../data/deck";
import type { SpacetimeSnapshot } from "../types/spacetime";
import { ORIENTATIONS } from "./orientation";

const ORIENTATION_COUNT = 4;

export interface QuantumBasis {
  quantumRaw: number[];
  drawId: string;
}

export interface AlignedOutcome {
  cardIndex: number;
  orientationIndex: number;
  artSeed: number[];
  /** Short hex fingerprint of the intent alignment (for display). */
  alignmentDigest: string;
}

async function sha256Bytes(input: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(buf);
}

function alignmentPayloadJson(
  basis: QuantumBasis,
  freshQuantum: number[],
  intentText: string,
  spacetime?: SpacetimeSnapshot | null,
): string {
  const payload: Record<string, unknown> = {
    basis: basis.quantumRaw,
    basisId: basis.drawId,
    fresh: freshQuantum,
    intent: intentText.trim(),
  };
  if (spacetime) payload.spacetime = spacetime;
  return JSON.stringify(payload);
}

/** Map hash bytes into [0, span) without floating-point bias. */
function modFromBytes(bytes: Uint8Array, offset: number, span: number): number {
  let acc = 0n;
  for (let i = 0; i < 8; i++) {
    acc = (acc * 256n + BigInt(bytes[(offset + i) % bytes.length]!)) % BigInt(span);
  }
  return Number(acc);
}

/**
 * Phase-align fresh quantum measurements with prior basis + user intent.
 * Quantum values remain in the chain; intent shifts how they collapse into indices.
 */
export async function alignWithIntent(
  basis: QuantumBasis,
  freshQuantum: number[],
  intentText: string,
  spacetime?: SpacetimeSnapshot | null,
): Promise<AlignedOutcome> {
  const payload = alignmentPayloadJson(
    basis,
    freshQuantum,
    intentText,
    spacetime,
  );
  const hash = await sha256Bytes(payload);
  const cardIndex = modFromBytes(hash, 0, DECK_SIZE);
  const orientationIndex = modFromBytes(hash, 8, ORIENTATION_COUNT);
  const artSeed = [
    modFromBytes(hash, 16, 2_147_483_646),
    modFromBytes(hash, 24, 2_147_483_646),
    modFromBytes(hash, 0, 1_000_000_000),
    modFromBytes(hash, 4, 1_000_000_000),
  ];
  const alignmentDigest = Array.from(hash.slice(0, 6))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { cardIndex, orientationIndex, artSeed, alignmentDigest };
}

function circularIndexDistance(a: number, b: number, span: number): number {
  const d = Math.abs(a - b);
  return Math.min(d, span - d);
}

export interface IntentAlignmentReport {
  direct: {
    cardIndex: number;
    orientationIndex: number;
    cardName: string;
    orientation: string;
  };
  aligned: {
    cardIndex: number;
    orientationIndex: number;
    cardName: string;
    orientation: string;
  };
  /** 0–100 how far focus shifted collapse from direct QRNG map. */
  phaseShiftScore: number;
  cardIndexDistance: number;
  orientationDistance: number;
  cardChanged: boolean;
  orientationChanged: boolean;
  hashHex: string;
  digest: string;
  steps: {
    cardFormula: string;
    orientationFormula: string;
    artFormulas: string[];
  };
}

function directFromFresh(fresh: number[]) {
  const cardIndex = Math.abs(fresh[0] ?? 0) % DECK_SIZE;
  const orientationIndex = Math.abs(fresh[1] ?? 0) % ORIENTATION_COUNT;
  const card = DECK[cardIndex]!;
  return {
    cardIndex,
    orientationIndex,
    cardName: card.quantumName,
    orientation: ORIENTATIONS[orientationIndex]!,
  };
}

/** Full breakdown for the transaction modal (recomputes alignment). */
export async function buildIntentAlignmentReport(
  basis: QuantumBasis,
  freshQuantum: number[],
  intentText: string,
  spacetime?: SpacetimeSnapshot | null,
): Promise<IntentAlignmentReport> {
  const payload = alignmentPayloadJson(
    basis,
    freshQuantum,
    intentText,
    spacetime,
  );
  const hash = await sha256Bytes(payload);
  const aligned = await alignWithIntent(
    basis,
    freshQuantum,
    intentText,
    spacetime,
  );
  const direct = directFromFresh(freshQuantum);

  const cardIndexDistance = circularIndexDistance(
    direct.cardIndex,
    aligned.cardIndex,
    DECK_SIZE,
  );
  const orientationDistance = circularIndexDistance(
    direct.orientationIndex,
    aligned.orientationIndex,
    ORIENTATION_COUNT,
  );

  const cardShiftPct = (cardIndexDistance / (DECK_SIZE / 2)) * 100;
  const oriShiftPct = (orientationDistance / (ORIENTATION_COUNT / 2)) * 100;
  const phaseShiftScore = Math.min(
    100,
    Math.round(cardShiftPct * 0.65 + oriShiftPct * 0.35),
  );

  const alignedCard = DECK[aligned.cardIndex]!;

  return {
    direct,
    aligned: {
      cardIndex: aligned.cardIndex,
      orientationIndex: aligned.orientationIndex,
      cardName: alignedCard.quantumName,
      orientation: ORIENTATIONS[aligned.orientationIndex]!,
    },
    phaseShiftScore,
    cardIndexDistance,
    orientationDistance,
    cardChanged: direct.cardIndex !== aligned.cardIndex,
    orientationChanged: direct.orientationIndex !== aligned.orientationIndex,
    hashHex: Array.from(hash)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    digest: aligned.alignmentDigest,
    steps: {
      cardFormula: `hash bytes [0…7] → mod ${DECK_SIZE} = ${aligned.cardIndex}`,
      orientationFormula: `hash bytes [8…15] → mod ${ORIENTATION_COUNT} = ${aligned.orientationIndex} (${ORIENTATIONS[aligned.orientationIndex]})`,
      artFormulas: [
        `hash bytes [16…23] → mod 2,147,483,646 = ${aligned.artSeed[0]}`,
        `hash bytes [24…31] → mod 2,147,483,646 = ${aligned.artSeed[1]}`,
        `hash bytes [0…7] → mod 1,000,000,000 = ${aligned.artSeed[2]}`,
        `hash bytes [4…11] → mod 1,000,000,000 = ${aligned.artSeed[3]}`,
      ],
    },
  };
}
