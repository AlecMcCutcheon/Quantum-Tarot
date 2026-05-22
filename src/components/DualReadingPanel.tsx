import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { DualSynthesisMeta } from "../data/resonance";
import {
  synthesisArchetypeLabel,
  themeRelationLabel,
} from "../data/resonance";
import type { ReadingText } from "../types/reading";
import type { Orientation, TarotCard } from "../types/deck";
import { orientationPairLabel } from "../lib/orientation";
import { ReadingPanel } from "./ReadingPanel";

interface DualReadingPanelProps {
  primary: TarotCard;
  primaryOrientation: Orientation;
  primaryReading: ReadingText;
  partner: TarotCard;
  partnerOrientation: Orientation;
  partnerReading: ReadingText;
  synthesis: ReadingText;
  meta: DualSynthesisMeta;
}

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-gold/90 uppercase">
      {children}
    </span>
  );
}

export function DualReadingPanel({
  primary,
  primaryOrientation,
  primaryReading,
  partner,
  partnerOrientation,
  partnerReading,
  synthesis,
  meta,
}: DualReadingPanelProps) {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-2xl flex-col gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
    >
      <p className="text-center text-xs text-star/50">
        Each card’s solo reading at its pole, then the entangled synthesis below.
      </p>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <ReadingPanel
          card={primary}
          reading={primaryReading}
          orientation={primaryOrientation}
          variant="solo"
          sectionLabel="Primary card"
        />
        <ReadingPanel
          card={partner}
          reading={partnerReading}
          orientation={partnerOrientation}
          variant="solo"
          sectionLabel="Partner card"
        />
      </div>

      <motion.article
        className="w-full rounded-2xl border border-gold/30 bg-gold/[0.06] p-6 text-left shadow-[0_0_32px_rgba(212,175,55,0.08)] max-sm:backdrop-blur-none backdrop-blur-sm sm:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-xs font-medium tracking-wide text-gold uppercase">
          Entangled synthesis
        </p>
        <p className="mt-2 font-mono text-[10px] text-star/40">
          {orientationPairLabel(primaryOrientation, partnerOrientation)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <MetaChip>{synthesisArchetypeLabel(meta.synthesisArchetype)}</MetaChip>
          <MetaChip>{themeRelationLabel(meta.themeRelation)}</MetaChip>
          <MetaChip>
            {meta.poleAxis === "lateral" ? "Lateral axis" : "Vertical axis"}
          </MetaChip>
          <MetaChip>{meta.arcanaPair.replace("-", " · ")}</MetaChip>
          {meta.sharedThemes.length > 0 && (
            <MetaChip>shared: {meta.sharedThemes.join(", ")}</MetaChip>
          )}
        </div>

        <h2 className="font-display mt-4 text-lg font-semibold text-accent">
          {primary.quantumName}
          <span className="mx-2 text-gold/50">⊗</span>
          {partner.quantumName}
        </h2>
        <p className="mt-1 text-xs text-star/50 italic">
          {primary.classicName} · {partner.classicName}
        </p>

        <p className="mt-5 text-base leading-relaxed font-medium text-star/95">
          {synthesis.summary}
        </p>

        {meta.sections.length > 0 ? (
          <div className="mt-5 flex flex-col gap-4">
            {meta.sections.map((section) => (
              <div key={section.label}>
                <p className="text-[10px] font-semibold tracking-wide text-gold/80 uppercase">
                  {section.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-star/80">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-star/80">
            {synthesis.detail}
          </p>
        )}

        <div className="mt-5 rounded-lg border border-gold/25 bg-gold/10 px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-gold uppercase">
            Guidance
          </p>
          <p className="mt-2 text-sm leading-relaxed text-star/85">
            {synthesis.guidance}
          </p>
        </div>
      </motion.article>
    </motion.div>
  );
}
