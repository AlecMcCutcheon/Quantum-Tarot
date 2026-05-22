import type { TarotCard } from "../../types/deck";
import {
  buildDualReadingResult,
  type DualReadingResult,
} from "./dualSynthesis";
import { getCardSemantics } from "./cardSemantics";
import type { DualReadingInput } from "./types";

export type { DualReadingInput } from "./types";
export type {
  CardSemanticProfile,
  EnergyKind,
  RoleKind,
} from "./cardSemantics";
export type {
  ArcanaPair,
  DualReadingResult,
  DualSynthesisMeta,
  DualSynthesisSection,
  PoleAxis,
  SynthesisArchetype,
  ThemeRelation,
} from "./dualSynthesis";
export {
  buildDualReadingResult,
  buildDualReadingSynthesis,
  ENTANGLED_STATE_COUNT,
  synthesisArchetypeLabel,
  themeRelationLabel,
} from "./dualSynthesis";

/** @deprecated Use getCardSemantics */
export interface CardResonance {
  offers: string;
  lens: string;
}

export function getCardResonance(card: TarotCard): CardResonance {
  const s = getCardSemantics(card);
  return { offers: s.contributes, lens: s.stitch };
}

export { getCardSemantics } from "./cardSemantics";

export function buildDualReading(input: DualReadingInput): DualReadingResult {
  return buildDualReadingResult(input);
}
