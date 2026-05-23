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
import { applyReadingDepth } from "./applyReadingDepth";
import { getMinorReading } from "./minorContent";
import type { Orientation } from "../../types/deck";

function depth(
  cardId: string,
  orientation: Orientation,
  reading: CardReading[Orientation],
): CardReading[Orientation] {
  return applyReadingDepth(cardId, orientation, reading);
}

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
        upright: depth(
          card.id,
          "upright",
          enrichMajorVertical(card.id, "upright", content.upright),
        ),
        reversed: depth(
          card.id,
          "reversed",
          enrichMajorVertical(card.id, "reversed", content.reversed),
        ),
        transverse: depth(
          card.id,
          "transverse",
          enrichMajorTransverse(card.id, transverse),
        ),
        conjugate: depth(
          card.id,
          "conjugate",
          enrichMajorConjugate(card.id, conjugate),
        ),
      };
    }
    const minor = getMinorReading(card);
    if (!minor) {
      throw new Error(`Missing minor reading: ${card.id}`);
    }
    return {
      cardId: card.id,
      upright: depth(card.id, "upright", minor.upright),
      reversed: depth(card.id, "reversed", minor.reversed),
      transverse: depth(card.id, "transverse", minor.transverse),
      conjugate: depth(card.id, "conjugate", minor.conjugate),
    };
  });
}
