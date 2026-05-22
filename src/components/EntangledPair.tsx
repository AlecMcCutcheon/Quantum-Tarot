import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type {
  PartnerDrawResult,
  QuantumDrawResult,
} from "../lib/quantumDraw";
import {
  ORIENTATION_LABEL,
  ORIENTATION_STYLE,
} from "../lib/cardOrientationUi";
import { invertOrientation } from "../lib/orientation";
import type { Orientation } from "../types/deck";
import { TarotCard } from "./TarotCard";
import { EntanglementStrand } from "./EntanglementStrand";
import { DrawAnimation } from "./DrawAnimation";
import { PairedCardSlot } from "./PairedCardSlot";
import { ReadabilityBlob } from "./ReadabilityBlob";

export type EntangledPhase =
  | "complete"
  | "entangling"
  | "partnerLoading";

interface EntangledPairProps {
  primary: QuantumDrawResult;
  partner: PartnerDrawResult | null;
  phase: EntangledPhase;
  onEntangleComplete?: () => void;
}

const HEADER_ROW =
  "grid h-[5.5rem] grid-rows-[auto_auto_auto] items-end gap-1.5";

function ColumnHeader({
  label,
  labelTone,
  orientation,
  status,
}: {
  label: string;
  labelTone: "primary" | "partner";
  orientation: Orientation;
  status?: string;
}) {
  const badge = ORIENTATION_STYLE[orientation].badge;
  return (
    <ReadabilityBlob
      compact
      className={`${HEADER_ROW} w-full`}
      contentClassName="grid h-full w-full grid-rows-[auto_auto_auto] items-end gap-1.5"
    >
      <span
        className={`text-center text-[10px] font-medium tracking-wide uppercase ${
          labelTone === "partner" ? "text-gold/60" : "text-star/50"
        }`}
      >
        {label}
      </span>
      <span
        className={`justify-self-center rounded-full px-3 py-1 text-center text-xs font-medium tracking-wide ${badge}`}
      >
        {ORIENTATION_LABEL[orientation]}
      </span>
      <span
        className={`text-center text-[10px] font-medium tracking-wide ${
          status ? "text-gold/70" : "invisible"
        }`}
        aria-hidden={!status}
      >
        {status ?? "\u00a0"}
      </span>
    </ReadabilityBlob>
  );
}

function PartnerPlaceholderBody({
  phase,
}: {
  phase: EntangledPhase;
}) {
  if (phase === "partnerLoading") {
    return (
      <div className="flex h-full w-full scale-[0.72] items-center justify-center">
        <DrawAnimation />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
      <div className="h-14 w-14 rounded-full border border-gold/30 sm:h-16 sm:w-16" />
      <p className="max-w-[9rem] text-center text-[10px] leading-snug text-star/50">
        Opposite pole · awaiting collapse
      </p>
    </div>
  );
}

function PairedColumn({
  header,
  card,
  entangleGlow,
}: {
  header: ReactNode;
  card: ReactNode;
  entangleGlow?: boolean;
}) {
  return (
    <div
      className={`flex w-full max-w-[280px] flex-col items-center gap-3 ${
        entangleGlow ? "entangle-primary-glow" : ""
      }`}
    >
      {header}
      <div className="flex items-center justify-center">{card}</div>
    </div>
  );
}

export function EntangledPair({
  primary,
  partner,
  phase,
  onEntangleComplete,
}: EntangledPairProps) {
  useEffect(() => {
    if (phase !== "entangling" || !onEntangleComplete) return;
    const timer = window.setTimeout(onEntangleComplete, 2000);
    return () => window.clearTimeout(timer);
  }, [phase, onEntangleComplete]);

  const expectedPartnerOrientation = invertOrientation(primary.orientation);
  const status =
    phase === "entangling"
      ? "Entangling…"
      : phase === "partnerLoading"
        ? "Collapsing…"
        : undefined;

  const strandActive = phase !== "complete" || !partner;
  const strandIntense = phase === "entangling" || phase === "partnerLoading";

  const primaryColumn = (
    <PairedColumn
      entangleGlow={phase === "entangling"}
      header={
        <ColumnHeader
          label="Primary"
          labelTone="primary"
          orientation={primary.orientation}
        />
      }
      card={
        <TarotCard
          drawId={primary.drawId}
          card={primary.card}
          orientation={primary.orientation}
          artSeed={primary.artSeed}
          layout="paired"
          hidePairedHeader
          animateEntrance={false}
        />
      }
    />
  );

  const partnerColumn =
    partner && phase === "complete" ? (
      <PairedColumn
        header={
          <ColumnHeader
            label="Partner"
            labelTone="partner"
            orientation={partner.orientation}
          />
        }
        card={
          <TarotCard
            drawId={partner.drawId}
            card={partner.card}
            orientation={partner.orientation}
            artSeed={partner.artSeed}
            layout="paired"
            hidePairedHeader
            animateEntrance
          />
        }
      />
    ) : (
      <PairedColumn
        header={
          <ColumnHeader
            label="Partner"
            labelTone="partner"
            orientation={expectedPartnerOrientation}
            status={status}
          />
        }
        card={
          <PairedCardSlot
            orientation={expectedPartnerOrientation}
            placeholder
          >
            <PartnerPlaceholderBody phase={phase} />
          </PairedCardSlot>
        }
      />
    );

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <div className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-3 sm:gap-x-6 md:gap-x-10">
        <div className="flex justify-end pr-1 sm:pr-2">{primaryColumn}</div>

        <div className="flex items-center justify-center px-1 sm:px-2">
          <EntanglementStrand active={strandActive} intense={strandIntense} />
        </div>

        <div className="flex justify-start pl-1 sm:pl-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={partner?.drawId ?? phase}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {partnerColumn}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {phase === "entangling" && (
        <p className="max-w-sm text-center text-xs text-star/50">
          Primary holds its collapse while a partner card entangles on the
          opposite pole (
          {ORIENTATION_LABEL[expectedPartnerOrientation]
            .split(" · ")[0]
            .toLowerCase()}
          )—linked by correlation, not replacement.
        </p>
      )}
    </div>
  );
}
