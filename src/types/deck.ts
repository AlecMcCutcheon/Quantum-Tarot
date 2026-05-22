export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Arcana = "major" | "minor";
export type Rank =
  | number
  | "ace"
  | "page"
  | "knight"
  | "queen"
  | "king";

/**
 * Four collapse poles on two axes:
 * - upright / reversed (direct vertical)
 * - transverse / conjugate (two lateral crossings; not “more reversed”)
 */
export type Orientation =
  | "upright"
  | "reversed"
  | "transverse"
  | "conjugate";

export interface TarotCard {
  id: string;
  index: number;
  classicName: string;
  quantumName: string;
  arcana: Arcana;
  suit: Suit | null;
  rank: Rank;
  romanLabel: string;
}
