import type { Orientation } from "../types/deck";

/** All four orientation labels in axis order. */
export const ORIENTATIONS: Orientation[] = [
  "upright",
  "reversed",
  "transverse",
  "conjugate",
];

/** Partner card takes the opposite pole on both axes. */
export function invertOrientation(primary: Orientation): Orientation {
  const opposite: Record<Orientation, Orientation> = {
    upright: "reversed",
    reversed: "upright",
    transverse: "conjugate",
    conjugate: "transverse",
  };
  return opposite[primary];
}

const POLE_LABEL: Record<Orientation, string> = {
  upright: "direct",
  reversed: "inverted",
  transverse: "transverse",
  conjugate: "conjugate",
};

export function orientationPairLabel(
  primary: Orientation,
  partner: Orientation,
): string {
  return `primary ${POLE_LABEL[primary]} · partner ${POLE_LABEL[partner]} (opposite pole)`;
}
