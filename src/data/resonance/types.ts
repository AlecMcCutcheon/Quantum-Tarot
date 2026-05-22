import type { Orientation, TarotCard } from "../../types/deck";

export interface DualReadingInput {
  primaryCard: TarotCard;
  primaryOrientation: Orientation;
  partnerCard: TarotCard;
  partnerOrientation: Orientation;
}
