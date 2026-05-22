import type { TarotCard } from "../types/deck";

/** Roman numerals 0–39 (covers Major Arcana 0–XXI and minor pips I–X). */
export function toRoman(n: number): string {
  if (n === 0) return "0";
  if (n < 0 || n > 39) return String(n);

  const pairs: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let rest = n;
  let out = "";
  for (const [value, numeral] of pairs) {
    while (rest >= value) {
      out += numeral;
      rest -= value;
    }
  }
  return out;
}

const COURT_FOOTER: Record<string, string> = {
  page: "Page",
  knight: "Knight",
  queen: "Queen",
  king: "King",
};

/**
 * Footer index on the card face (traditional placement: bottom band).
 * — Major Arcana: 0, I … XXI matching rank
 * — Minor pips: I (ace) through X (ten)
 * — Courts: spelled rank (not Roman)
 */
export function getCardFooterLabel(card: TarotCard): string {
  if (card.arcana === "major") {
    const rank = card.rank as number;
    return toRoman(rank);
  }

  if (card.rank === "ace") return toRoman(1);

  if (typeof card.rank === "number") {
    return toRoman(card.rank);
  }

  return COURT_FOOTER[card.rank] ?? "";
}

export function footerUsesDisplayFont(card: TarotCard): boolean {
  return card.arcana === "major" || card.rank === "ace" || typeof card.rank === "number";
}
