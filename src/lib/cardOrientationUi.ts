import type { Orientation } from "../types/deck";

export const ROTATION: Record<Orientation, string> = {
  upright: "rotate-0",
  reversed: "rotate-180",
  transverse: "rotate-90",
  conjugate: "-rotate-90",
};

export const ORIENTATION_SHORT: Record<Orientation, string> = {
  upright: "Upright",
  reversed: "Reversed",
  transverse: "Transverse",
  conjugate: "Conjugate",
};

export const ORIENTATION_LABEL: Record<Orientation, string> = {
  upright: "Upright · Direct",
  reversed: "Reversed · Inverted",
  transverse: "Transverse · Lateral",
  conjugate: "Conjugate · Second crossing",
};

export const ORIENTATION_STYLE: Record<
  Orientation,
  { badge: string; ring: string }
> = {
  upright: { badge: "bg-accent/20 text-accent", ring: "" },
  reversed: { badge: "bg-cosmic/30 text-accent", ring: "" },
  transverse: { badge: "bg-gold/20 text-gold", ring: "ring-2 ring-gold/50" },
  conjugate: {
    badge: "bg-gold/10 text-gold/90",
    ring: "ring-2 ring-accent/40",
  },
};

export function isLateralOrientation(o: Orientation): boolean {
  return o === "transverse" || o === "conjugate";
}

/** Fixed footprints so primary and partner columns match per orientation. */
export const PAIRED_SLOT = {
  vertical:
    "h-[min(220px,48vh)] w-[min(150px,40vw)] sm:h-[300px] sm:w-[200px]",
  lateral:
    "h-[min(120px,26vh)] w-[min(200px,48vw)] sm:h-[172px] sm:w-[248px]",
} as const;

export function pairedCardSlotClass(orientation: Orientation): string {
  const size = isLateralOrientation(orientation)
    ? PAIRED_SLOT.lateral
    : PAIRED_SLOT.vertical;
  return `flex shrink-0 items-center justify-center ${size}`;
}
