import type { CardReading } from "../../types/reading";
import type { Orientation } from "../../types/deck";
import { buildAllReadings } from "./buildReadings";

const ALL_READINGS = buildAllReadings();

export const READINGS_MAP: Map<string, CardReading> = new Map(
  ALL_READINGS.map((r) => [r.cardId, r]),
);

export function getReading(
  cardId: string,
  orientation: Orientation,
): CardReading[Orientation] | undefined {
  const card = READINGS_MAP.get(cardId);
  return card?.[orientation];
}
