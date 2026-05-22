import { DECK } from "../deck";
import type { CardReading } from "../../types/reading";
import { MAJOR_CONJUGATE } from "./majorConjugate";
import { MAJOR_CONTENT } from "./majorContent";
import { MAJOR_TRANSVERSE } from "./majorTransverse";
import {
  enrichMajorConjugate,
  enrichMajorTransverse,
  enrichMajorVertical,
} from "./majorReadingEnrich";
import { getMinorReading } from "./minorContent";

export function buildAllReadings(): CardReading[] {
  return DECK.map((card) => {
    if (card.arcana === "major") {
      const content = MAJOR_CONTENT[card.id];
      const transverse = MAJOR_TRANSVERSE[card.id];
      const conjugate = MAJOR_CONJUGATE[card.id];
      if (!content || !transverse || !conjugate) {
        throw new Error(`Missing major reading: ${card.id}`);
      }
      return {
        cardId: card.id,
        upright: enrichMajorVertical(card.id, "upright", content.upright),
        reversed: enrichMajorVertical(card.id, "reversed", content.reversed),
        transverse: enrichMajorTransverse(card.id, transverse),
        conjugate: enrichMajorConjugate(card.id, conjugate),
      };
    }
    const minor = getMinorReading(card);
    if (!minor) {
      throw new Error(`Missing minor reading: ${card.id}`);
    }
    return { cardId: card.id, ...minor };
  });
}
