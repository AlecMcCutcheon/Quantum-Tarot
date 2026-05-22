import { motion } from "framer-motion";
import { useMemo } from "react";
import { getHeroCardSvg } from "../lib/cardArt/heroSvgCache";
import { ORIENTATION_LABEL, ORIENTATION_STYLE } from "../lib/cardOrientationUi";
import type { Orientation, TarotCard as TarotCardType } from "../types/deck";
import { HeroCardStage } from "./HeroCardStage";
import { PairedCardSlot } from "./PairedCardSlot";
import { ReadabilityBlob } from "./ReadabilityBlob";

interface TarotCardProps {
  drawId: string;
  card: TarotCardType;
  orientation: Orientation;
  artSeed: number[];
  /** @deprecated Use layout="paired" */
  compact?: boolean;
  /** hero = single draw; paired = equal-size entangled layout; thumb = library */
  layout?: "hero" | "paired" | "thumb";
  label?: string;
  /** Set false when card already visible (entanglement flow) */
  animateEntrance?: boolean;
  /** EntangledPair renders label/badge in a shared header row */
  hidePairedHeader?: boolean;
}

const LAYOUT_CLASS: Record<NonNullable<TarotCardProps["layout"]>, string> = {
  hero: "mx-auto w-full max-w-[320px] gap-4",
  paired: "shrink-0",
  thumb: "w-full max-w-[88px] gap-1",
};

export function TarotCard({
  drawId,
  card,
  orientation,
  artSeed,
  compact = false,
  layout: layoutProp,
  label,
  animateEntrance = true,
  hidePairedHeader = false,
}: TarotCardProps) {
  const layout = layoutProp ?? (compact ? "paired" : "hero");
  const svg = useMemo(
    () => getHeroCardSvg(card, [...artSeed], drawId),
    [drawId, card.id, artSeed],
  );
  const style = ORIENTATION_STYLE[orientation];

  if (layout === "paired" && hidePairedHeader) {
    return (
      <PairedCardSlot orientation={orientation}>
        <div
          className={`h-full w-full [&>svg]:h-full [&>svg]:w-full ${style.ring}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </PairedCardSlot>
    );
  }

  const Wrapper = animateEntrance ? motion.div : "div";
  const motionProps = animateEntrance
    ? {
        key: drawId,
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { type: "spring" as const, stiffness: 120, damping: 18 },
      }
    : {};

  const cardArt = (
    <div
      className={`h-full w-full [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );

  return (
    <Wrapper
      className={`flex flex-col items-center ${layout === "hero" ? "mb-2" : ""} ${LAYOUT_CLASS[layout]}`}
      {...motionProps}
    >
      {layout !== "thumb" && (
        <ReadabilityBlob
          compact
          className="mb-1 w-full max-w-[min(100%,20rem)]"
          contentClassName="flex flex-col items-center gap-1.5 px-5 py-2"
        >
          {label && (
            <span className="text-[10px] font-medium tracking-wide text-star/50 uppercase">
              {label}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide ${style.badge}`}
          >
            {ORIENTATION_LABEL[orientation]}
          </span>
        </ReadabilityBlob>
      )}
      {layout === "paired" ? (
        <PairedCardSlot orientation={orientation}>
          <div className={`h-full w-full ${style.ring}`}>{cardArt}</div>
        </PairedCardSlot>
      ) : layout === "hero" ? (
        <HeroCardStage orientation={orientation}>{cardArt}</HeroCardStage>
      ) : (
        <div
          className={`aspect-[2/3] w-full overflow-hidden rounded-xl shadow-[0_0_48px_rgba(167,139,250,0.2)] ${style.ring}`}
        >
          {cardArt}
        </div>
      )}
    </Wrapper>
  );
}
