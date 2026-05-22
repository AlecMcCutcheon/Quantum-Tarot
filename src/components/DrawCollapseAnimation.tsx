import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DECK, DECK_SIZE } from "../data/deck";
import { getHeroCardSvg } from "../lib/cardArt/heroSvgCache";
import { generateThumbSvg } from "../lib/cardArt/generateThumbSvg";
import type { CollapseFrame, CollapsePreview } from "../lib/collapseEntropy";
import { MIN_COLLAPSE_MS, delay } from "../lib/collapseEntropy";
import { useMobileViewport } from "../lib/useMobileViewport";
import { ORIENTATION_LABEL } from "../lib/cardOrientationUi";
import type { Orientation } from "../types/deck";
import type { QuantumDrawResult } from "../lib/quantumDraw";
import { ORIENTATIONS } from "../lib/orientation";
import { CardStageWithOrbits } from "./CardStageWithOrbits";
import { ReadabilityBlob } from "./ReadabilityBlob";
import { HERO_STAGE, HeroCardFace } from "./HeroCardStage";

/** Opaque badges during collapse (not the translucent paired/hero styles). */
const COLLAPSE_ORIENTATION_BADGE: Record<Orientation, string> = {
  upright: "border border-accent/45 bg-void text-accent",
  reversed: "border border-accent/45 bg-void text-accent",
  transverse: "border border-gold/50 bg-void text-gold",
  conjugate: "border border-gold/45 bg-void text-gold",
};

interface DrawCollapseAnimationProps {
  preview: CollapsePreview;
  finalResult: QuantumDrawResult;
  onComplete: (draw: QuantumDrawResult) => void;
}

type Phase = "measure" | "flicker" | "slow" | "converge" | "lock";

interface FrameView {
  key: string;
  cardId: string;
  quantumName: string;
  orientation: Orientation;
  svg: string;
}

function frameToView(frame: CollapseFrame, key: string): FrameView {
  const card = DECK[frame.cardIndex % DECK_SIZE]!;
  const orientation = ORIENTATIONS[frame.orientationIndex % ORIENTATIONS.length]!;
  return {
    key,
    cardId: card.id,
    quantumName: card.quantumName,
    orientation,
    svg: generateThumbSvg(card, frame.artSeed),
  };
}

function resultToView(result: QuantumDrawResult): FrameView {
  return {
    key: result.drawId,
    cardId: result.card.id,
    quantumName: result.card.quantumName,
    orientation: result.orientation,
    svg: getHeroCardSvg(result.card, result.artSeed, result.drawId),
  };
}

/** Chromatic split — violet / cyan / gold channel separation. */
function collapseChromaFilter(intensity: number): string {
  if (intensity <= 0.05) return "none";
  const px = 6 + Math.round(intensity * 10);
  const dy = Math.round(px * 0.5);
  const v = 0.55 + intensity * 0.4;
  const c = 0.5 + intensity * 0.38;
  const g = 0.4 + intensity * 0.32;
  return `drop-shadow(${px}px 0 0 rgba(167,139,250,${v})) drop-shadow(-${px}px 0 0 rgba(34,211,238,${c})) drop-shadow(0 ${dy}px 0 rgba(251,191,36,${g})) drop-shadow(0 -${Math.round(dy * 0.6)}px 0 rgba(244,114,182,${g * 0.65}))`;
}

const STATUS: Record<Phase, string> = {
  measure: "Requesting quantum measurements…",
  flicker: "Superposing deck states…",
  slow: "Decohering toward one outcome…",
  converge: "Collapsing to measured pole…",
  lock: "Wavefunction collapsed.",
};

const CROSSFADE_MS = {
  flicker: 180,
  slow: 280,
  converge: 420,
  lock: 500,
} as const;

function CardSvg({ view }: { view: FrameView }) {
  return (
    <HeroCardFace orientation={view.orientation}>
      <div
        className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: view.svg }}
      />
    </HeroCardFace>
  );
}

export function DrawCollapseAnimation({
  preview,
  finalResult,
  onComplete,
}: DrawCollapseAnimationProps) {
  const isMobile = useMobileViewport();
  const [phase, setPhase] = useState<Phase>("measure");
  const [current, setCurrent] = useState<FrameView | null>(null);
  const [outgoing, setOutgoing] = useState<FrameView | null>(null);
  const completedRef = useRef(false);
  const mountTimeRef = useRef(Date.now());
  const transitionMsRef = useRef<number>(CROSSFADE_MS.flicker);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const measurementLabel = `${finalResult.quantumRaw.length} quantum values in this collapse`;

  const currentRef = useRef<FrameView | null>(null);

  const showFrame = (next: FrameView, crossfadeMs: number) => {
    transitionMsRef.current = crossfadeMs;
    if (currentRef.current) {
      setOutgoing(currentRef.current);
    }
    currentRef.current = next;
    setCurrent(next);
    window.setTimeout(() => setOutgoing(null), crossfadeMs + 40);
  };

  useEffect(() => {
    let cancelled = false;
    completedRef.current = false;
    mountTimeRef.current = Date.now();
    setPhase("measure");
    setCurrent(null);
    setOutgoing(null);
    currentRef.current = null;

    const run = async () => {
      const frames = preview.frames;
      const draw = finalResult;
      const finalView = resultToView(draw);

      if (frames.length > 0) {
        const rapid = Math.min(isMobile ? 6 : 12, frames.length);
        const slow = Math.min(isMobile ? 2 : 5, frames.length);
        const rapidViews = Array.from({ length: rapid }, (_, i) =>
          frameToView(frames[i % frames.length]!, `p-${i}`),
        );
        const slowViews = Array.from({ length: slow }, (_, i) => {
          const idx = (rapid + i) % frames.length;
          return frameToView(frames[idx]!, `s-${i}`);
        });

        setPhase("flicker");
        for (let i = 0; i < rapid; i++) {
          if (cancelled) return;
          showFrame(rapidViews[i]!, isMobile ? 120 : CROSSFADE_MS.flicker);
          await delay(isMobile ? 65 + Math.floor(i * 4) : 95 + Math.floor(i * 6));
        }

        setPhase("slow");
        for (let i = 0; i < slow; i++) {
          if (cancelled) return;
          showFrame(slowViews[i]!, isMobile ? 200 : CROSSFADE_MS.slow);
          await delay(isMobile ? 180 + i * 40 : 240 + i * 60);
        }
      } else {
        await delay(700);
      }
      setPhase("converge");
      showFrame(finalView, CROSSFADE_MS.converge);
      await delay(CROSSFADE_MS.converge + 100);
      await delay(400);

      setPhase("lock");
      setOutgoing(null);
      currentRef.current = finalView;
      setCurrent(finalView);
      await delay(CROSSFADE_MS.lock);

      const elapsed = Date.now() - mountTimeRef.current;
      if (elapsed < MIN_COLLAPSE_MS) {
        await delay(MIN_COLLAPSE_MS - elapsed);
      }
      await delay(550);

      if (!cancelled && !completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current(draw);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [preview, finalResult, isMobile]);

  const fxIntensity =
    phase === "flicker"
      ? 1
      : phase === "slow"
        ? 0.55
        : phase === "measure"
          ? 0.3
          : phase === "converge"
            ? 0.15
            : 0.08;

  const chromaIntensity =
    isMobile ? 0 : phase === "flicker" ? 1 : phase === "slow" ? 0.5 : 0;
  const isSharpPhase = phase === "converge" || phase === "lock";

  return (
    <div
      className="flex w-full max-w-[min(280px,92vw)] flex-col items-center gap-4 py-2 sm:max-w-[320px] sm:gap-5 sm:py-4"
      aria-live="polite"
      aria-busy={phase !== "lock"}
    >
      <CardStageWithOrbits
        intensity={isMobile ? fxIntensity * 0.55 : fxIntensity}
        variant="draw"
        tall
        reducedOrbits={isMobile}
      >
        <div className={HERO_STAGE}>
          {outgoing && (
            <motion.div
              key={`out-${outgoing.key}`}
              className="pointer-events-none absolute inset-0 z-[8]"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: transitionMsRef.current / 1000,
                ease: "easeIn",
              }}
            >
              <CardSvg view={outgoing} />
            </motion.div>
          )}

          {current && (
            <motion.div
              key={
                isSharpPhase
                  ? `sharp-${current.key}`
                  : `in-${current.key}-${current.orientation}`
              }
              className="absolute inset-0 z-10"
              initial={
                isSharpPhase
                  ? { opacity: 1, filter: "blur(6px)" }
                  : {
                      opacity: 0.2,
                      filter: collapseChromaFilter(chromaIntensity),
                    }
              }
              animate={
                isSharpPhase
                  ? { opacity: 1, filter: "blur(0px)" }
                  : {
                      opacity: 1,
                      filter: collapseChromaFilter(chromaIntensity),
                    }
              }
              transition={
                isSharpPhase
                  ? {
                      duration:
                        phase === "lock"
                          ? 0.35
                          : CROSSFADE_MS.converge / 1000,
                      ease: [0.22, 1, 0.36, 1],
                    }
                  : {
                      duration: transitionMsRef.current / 1000,
                      ease: "easeOut",
                    }
              }
            >
              <CardSvg view={current} />
            </motion.div>
          )}

          {!current && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-dashed border-accent/30 bg-void/50">
              <span className="font-display text-xs tracking-widest text-accent/70 uppercase">
                QRNG
              </span>
            </div>
          )}
        </div>
      </CardStageWithOrbits>

      {(phase === "lock" || phase === "converge") && current && (
        <>
          <motion.p
            className="font-display text-sm font-medium text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {current.quantumName}
          </motion.p>
          <motion.div
            className="relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <ReadabilityBlob compact contentClassName="flex justify-center px-4 py-1.5">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-medium tracking-wide ${COLLAPSE_ORIENTATION_BADGE[current.orientation]}`}
              >
                {ORIENTATION_LABEL[current.orientation]}
              </span>
            </ReadabilityBlob>
          </motion.div>
        </>
      )}

      <p className="min-h-[2.5rem] text-center text-sm text-star/60">
        {STATUS[phase]}
      </p>
      <p className="font-mono text-[10px] text-star/40">{measurementLabel}</p>
    </div>
  );
}
