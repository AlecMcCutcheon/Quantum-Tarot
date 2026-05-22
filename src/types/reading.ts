import type { Orientation } from "./deck";

export interface ReadingText {
  summary: string;
  detail: string;
  guidance: string;
}

export interface CardReading {
  cardId: string;
  upright: ReadingText;
  reversed: ReadingText;
  transverse: ReadingText;
  conjugate: ReadingText;
}

export type ReadingByOrientation = Record<Orientation, ReadingText>;
