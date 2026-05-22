import type { ReactNode } from "react";
import {
  ROTATION,
  isLateralOrientation,
  pairedCardSlotClass,
} from "../lib/cardOrientationUi";
import type { Orientation } from "../types/deck";

interface PairedCardSlotProps {
  orientation: Orientation;
  children: ReactNode;
  /** Dashed shell while partner is not yet drawn */
  placeholder?: boolean;
}

export function PairedCardSlot({
  orientation,
  children,
  placeholder = false,
}: PairedCardSlotProps) {
  const lateral = isLateralOrientation(orientation);

  return (
    <div className={pairedCardSlotClass(orientation)}>
      <div
        className={`flex h-full w-full items-center justify-center ${ROTATION[orientation]}`}
      >
        <div
          className={`flex aspect-[2/3] items-center justify-center overflow-hidden rounded-xl ${
            placeholder
              ? "border-2 border-dashed border-accent/40 bg-void/60"
              : "shadow-[0_0_48px_rgba(167,139,250,0.2)]"
          } ${lateral ? "h-full w-auto" : "h-full w-full"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
