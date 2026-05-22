import { DECK, DECK_SIZE } from "../data/deck";
import type { Orientation } from "../types/deck";
import type { QuantumBasis } from "./intentAlign";
import type { SpacetimeSnapshot } from "../types/spacetime";
import { invertOrientation, ORIENTATIONS } from "./orientation";
import type { PartnerDrawResult, QuantumDrawResult } from "./quantumDraw";

export interface DirectCollapse {
  cardIndex: number;
  orientationIndex: number;
  cardName: string;
  orientation: Orientation;
}

export function directCollapseFromRaw(raw: number[]): DirectCollapse {
  const cardIndex = Math.abs(raw[0] ?? 0) % DECK_SIZE;
  const orientationIndex = Math.abs(raw[1] ?? 0) % ORIENTATIONS.length;
  const card = DECK[cardIndex]!;
  return {
    cardIndex,
    orientationIndex,
    cardName: card.quantumName,
    orientation: ORIENTATIONS[orientationIndex]!,
  };
}

export function formatQuantumRaw(
  raw: number[],
  roles?: string[],
): string {
  return raw
    .map((n, i) => {
      const role = roles?.[i];
      return role ? `[${i}] ${n}  · ${role}` : `[${i}] ${n}`;
    })
    .join("\n");
}

export const FRESH_MEASUREMENT_ROLES = [
  "card (mod 78)",
  "pole (mod 4)",
  "art entropy",
  "art entropy",
  "art entropy",
  "art entropy",
] as const;

export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function buildAlignmentPayload(
  basis: QuantumBasis,
  freshQuantum: number[],
  intent: string,
  spacetime?: SpacetimeSnapshot | null,
): string {
  const payload: Record<string, unknown> = {
    basis: basis.quantumRaw,
    basisId: basis.drawId,
    fresh: freshQuantum,
    intent: intent.trim(),
  };
  if (spacetime) payload.spacetime = spacetime;
  return JSON.stringify(payload, null, 2);
}

export function partnerCollapseExplain(
  draw: PartnerDrawResult,
  primaryCardId: string,
  primaryOrientation: Orientation,
): {
  direct: DirectCollapse;
  bumped: boolean;
  orientationRule: string;
} {
  const direct = directCollapseFromRaw(draw.quantumRaw);
  const bumped = DECK[direct.cardIndex]!.id === primaryCardId;
  const orientationRule = `${primaryOrientation} → ${invertOrientation(primaryOrientation)} (entangled opposite pole, not re-rolled)`;
  return { direct, bumped, orientationRule };
}

export const SOURCE_LABEL: Record<QuantumDrawResult["source"], string> = {
  outshift: "Outshift QRNG",
  qrandom: "qrandom.io Quantum RNG",
  unknown: "Quantum source unknown",
};

/** How procedural card art is seeded — changes every draw, not fixed per card. */
export function primaryArtEntropyExplain(draw: QuantumDrawResult): {
  source: string;
  note: string;
} {
  if (draw.realigned) {
    return {
      source: "SHA-256 alignment hash",
      note: "Pattern, hue, and symmetry come from hash bytes—not a fixed look for this card.",
    };
  }
  const end = draw.quantumRaw.length - 1;
  return {
    source:
      end >= 2 ? `raw[2] … raw[${end}] (same QRNG batch)` : "QRNG batch tail",
    note: "Same archetype can render with different kaleidoscope / burst art each collapse.",
  };
}

export function partnerArtEntropyExplain(partner: PartnerDrawResult): {
  source: string;
  note: string;
} {
  const end = partner.quantumRaw.length - 1;
  return {
    source: end >= 1 ? `raw[1] … raw[${end}]` : "QRNG batch tail",
    note: "Partner face art is independently seeded from its own measurement.",
  };
}
