import type { ReactNode } from "react";
import { ORIENTATION_STYLE, ROTATION } from "../lib/cardOrientationUi";
import type { Orientation } from "../types/deck";

/** Fixed stage — same size during collapse flicker and final reading. */
export const HERO_STAGE =
  "relative mx-auto h-[400px] w-full max-w-[300px] sm:h-[450px] sm:max-w-[320px]";

interface HeroCardFaceProps {
  orientation: Orientation;
  children: ReactNode;
}

/** Card art rotated inside the stage (no outer size change). */
export function HeroCardFace({ orientation, children }: HeroCardFaceProps) {
  const ring = ORIENTATION_STYLE[orientation].ring;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${ROTATION[orientation]}`}
    >
      <div
        className={`aspect-[2/3] h-full max-h-full w-auto max-w-full overflow-hidden rounded-xl bg-void shadow-[0_0_48px_rgba(167,139,250,0.2)] ${ring}`}
      >
        {children}
      </div>
    </div>
  );
}

interface HeroCardStageProps {
  orientation: Orientation;
  children: ReactNode;
}

export function HeroCardStage({ orientation, children }: HeroCardStageProps) {
  return (
    <div className={HERO_STAGE}>
      <HeroCardFace orientation={orientation}>{children}</HeroCardFace>
    </div>
  );
}
