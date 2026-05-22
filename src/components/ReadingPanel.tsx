import { useState } from "react";
import { motion } from "framer-motion";
import type { ReadingText } from "../types/reading";
import type { Orientation, TarotCard } from "../types/deck";
import { ORIENTATION_SHORT } from "../lib/cardOrientationUi";

interface ReadingPanelProps {
  card: TarotCard;
  reading: ReadingText;
  orientation: Orientation;
  /** In dual layout: smaller header, starts collapsed */
  variant?: "full" | "solo";
  sectionLabel?: string;
}

const ORIENTATION_NOTE: Record<Orientation, string> = {
  upright: "Direct pole—expression of the card’s archetype without tilt.",
  reversed: "Inverted pole—internalized energy, delays, shadows, or resistance.",
  transverse:
    "First lateral crossing—this archetype blocking or stretching the path sideways (often liminal, not yet decided).",
  conjugate:
    "Second lateral crossing—another way this archetype crosses you; not “more reversed.” Pair differs per card.",
};

export function ReadingPanel({
  card,
  reading,
  orientation,
  variant = "full",
  sectionLabel,
}: ReadingPanelProps) {
  const [expanded, setExpanded] = useState(variant === "full");

  const isSolo = variant === "solo";

  return (
    <motion.article
      className={`mx-auto w-full text-left max-sm:backdrop-blur-none backdrop-blur-sm ${
        isSolo
          ? "rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          : "w-full rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10"
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isSolo ? 0.1 : 0.25 }}
    >
      {sectionLabel && (
        <p className="text-[10px] font-medium tracking-wide text-star/45 uppercase">
          {sectionLabel}
        </p>
      )}
      <p
        className={`font-medium tracking-wide text-accent/80 uppercase ${
          sectionLabel ? "mt-1" : ""
        } ${isSolo ? "text-[10px]" : "text-xs"}`}
      >
        Solo · {ORIENTATION_SHORT[orientation]}
      </p>
      <h2
        className={`font-display font-semibold text-accent ${
          isSolo ? "mt-1 text-base" : "mt-2 text-xl"
        }`}
      >
        {card.quantumName}
      </h2>
      <p className={`text-star/50 italic ${isSolo ? "text-xs" : "text-sm"}`}>
        {card.classicName}
      </p>
      {!isSolo && (
        <p className="mt-2 text-xs text-star/45">{ORIENTATION_NOTE[orientation]}</p>
      )}

      <p
        className={`leading-relaxed font-medium text-star/95 ${
          isSolo ? "mt-3 text-sm" : "mt-5 text-base"
        }`}
      >
        {reading.summary}
      </p>

      {expanded && (
        <>
          {isSolo && (
            <p className="mt-2 text-xs text-star/45">
              {ORIENTATION_NOTE[orientation]}
            </p>
          )}
          <p
            className={`leading-relaxed text-star/80 ${
              isSolo ? "mt-3 text-xs" : "mt-4 text-sm"
            }`}
          >
            {reading.detail}
          </p>
          <div
            className={`rounded-lg border border-accent/20 bg-accent/5 ${
              isSolo ? "mt-3 px-3 py-2" : "mt-5 px-4 py-3"
            }`}
          >
            <p className="text-xs font-semibold tracking-wide text-gold uppercase">
              Guidance
            </p>
            <p
              className={`leading-relaxed text-star/85 ${
                isSolo ? "mt-1 text-xs" : "mt-2 text-sm"
              }`}
            >
              {reading.guidance}
            </p>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-4 text-sm text-accent underline-offset-2 hover:underline"
      >
        {expanded ? "Show less" : "Read full interpretation"}
      </button>
    </motion.article>
  );
}
