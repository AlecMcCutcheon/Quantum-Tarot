import { useCallback, useMemo, useState } from "react";
import {
  QuantumTransactionButton,
  QuantumTransactionModal,
} from "../components/QuantumTransactionModal";
import { DrawCollapseAnimation } from "../components/DrawCollapseAnimation";
import { DrawButton } from "../components/DrawButton";
import { DualReadingPanel } from "../components/DualReadingPanel";
import { IntentField } from "../components/IntentField";
import { SpacetimeFocusPanel } from "../components/SpacetimeFocusPanel";
import { useSpacetimeFocus } from "../hooks/useSpacetimeFocus";
import { hasActiveFocus } from "../lib/focusPayload";
import { ReadingPanel } from "../components/ReadingPanel";
import { CardStageWithOrbits } from "../components/CardStageWithOrbits";
import { TarotCard } from "../components/TarotCard";
import { EntangledPair } from "../components/EntangledPair";
import { buildDualReading } from "../data/resonance";
import { getReading } from "../data/readings";
import type { QuantumBasis } from "../lib/intentAlign";
import type { CollapsePreview } from "../lib/collapseEntropy";
import { buildCollapsePreviewFromDraw } from "../lib/collapseEntropy";
import { takeQrngNotice } from "../api/qrng";
import {
  performPartnerDraw,
  performQuantumDraw,
  type PartnerDrawResult,
  type QuantumDrawResult,
} from "../lib/quantumDraw";

type DrawState =
  | "idle"
  | "drawing"
  | "revealed"
  | "entangling"
  | "partnerDrawing"
  | "dualRevealed"
  | "error";

export function Home() {
  const [state, setState] = useState<DrawState>("idle");
  const [result, setResult] = useState<QuantumDrawResult | null>(null);
  const [partner, setPartner] = useState<PartnerDrawResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quantumBasis, setQuantumBasis] = useState<QuantumBasis | null>(null);
  const [intent, setIntent] = useState("");
  const [collapsePreview, setCollapsePreview] =
    useState<CollapsePreview | null>(null);
  const [collapseFinal, setCollapseFinal] =
    useState<QuantumDrawResult | null>(null);
  const [drawSession, setDrawSession] = useState(0);
  const [txOpen, setTxOpen] = useState(false);
  const [qrngNotice, setQrngNotice] = useState<string | null>(null);
  const [awaitingLocation, setAwaitingLocation] = useState(false);
  const {
    enabled: spacetimeEnabled,
    toggle: toggleSpacetime,
    permission: geoPermission,
    gps: liveGps,
    geoError,
    nowMs,
    ipLoading,
    captureForCollapse,
    retryIpApprox,
    setManualCoords,
  } = useSpacetimeFocus();

  const hasPriorDraw = quantumBasis !== null;
  const isDual = state === "dualRevealed" && result && partner;
  const isEntanglementFlow =
    state === "entangling" ||
    state === "partnerDrawing" ||
    state === "dualRevealed";
  const containerClass = isEntanglementFlow
    ? "flex w-full max-w-2xl flex-col items-center text-center md:max-w-4xl"
    : "flex w-full max-w-lg flex-col items-center text-center md:max-w-3xl lg:max-w-4xl";

  const finishCollapse = useCallback(
    (draw: QuantumDrawResult) => {
      if (!quantumBasis) {
        setQuantumBasis({
          quantumRaw: draw.quantumBasis ?? draw.quantumRaw,
          drawId: draw.drawId,
        });
      }
      setResult(draw);
      setCollapsePreview(null);
      setCollapseFinal(null);
      setState("revealed");
    },
    [quantumBasis],
  );

  const runDraw = useCallback(async () => {
    setErrorMsg(null);
    setDrawSession((n) => n + 1);
    setResult(null);
    setPartner(null);
    setCollapsePreview(null);
    setCollapseFinal(null);
    setQrngNotice(null);

    let spacetime = null;
    if (spacetimeEnabled) {
      setAwaitingLocation(true);
      try {
        spacetime = await captureForCollapse();
      } catch (e) {
        setState("idle");
        setAwaitingLocation(false);
        setErrorMsg(
          e instanceof Error
            ? e.message
            : "Spacetime snapshot failed",
        );
        return;
      } finally {
        setAwaitingLocation(false);
      }
    }
    const useFocus = hasActiveFocus(intent, spacetime);
    setState("drawing");
    const draw = await performQuantumDraw(
      useFocus
        ? {
            intent,
            spacetime,
            ...(quantumBasis ? { quantumBasis } : {}),
          }
        : undefined,
    );

    if (!draw) {
      setState("error");
      setCollapsePreview(null);
      setCollapseFinal(null);
      setErrorMsg(
        "Quantum source unavailable. Open Settings (gear, bottom-right), pick a provider, and test the connection. For Outshift, paste your API key. No local fallback is used.",
      );
      return;
    }

    setCollapsePreview(buildCollapsePreviewFromDraw(draw));
    setCollapseFinal(draw);
    setQrngNotice(takeQrngNotice());
  }, [intent, quantumBasis, spacetimeEnabled, captureForCollapse]);

  const collapseBusy = awaitingLocation || state === "drawing";

  const handleCollapseComplete = useCallback(
    (draw: QuantumDrawResult) => {
      finishCollapse(draw);
    },
    [finishCollapse],
  );

  const runPartnerDraw = useCallback(async () => {
    if (!result) return;
    setState("partnerDrawing");
    setPartner(null);

    const second = await performPartnerDraw(
      result.card.id,
      result.orientation,
    );

    if (!second) {
      setState("revealed");
      setErrorMsg(
        "Partner draw failed—quantum source unavailable. Try again in a moment.",
      );
      return;
    }

    setPartner(second);
    setState("dualRevealed");
    const notice = takeQrngNotice();
    if (notice) setQrngNotice(notice);
  }, [result]);

  const handleEntangle = useCallback(() => {
    setErrorMsg(null);
    setState("entangling");
  }, []);

  const handleWaveComplete = useCallback(() => {
    void runPartnerDraw();
  }, [runPartnerDraw]);

  /** Return to home so focus can be edited before the next collapse. */
  const prepareNewMeasurement = useCallback(() => {
    setTxOpen(false);
    setPartner(null);
    setErrorMsg(null);
    setCollapsePreview(null);
    setCollapseFinal(null);
    setQrngNotice(null);
    setState("idle");
  }, []);

  const reading =
    result && getReading(result.card.id, result.orientation);

  const dualResult = useMemo(() => {
    if (!result || !partner) return null;
    return buildDualReading({
      primaryCard: result.card,
      primaryOrientation: result.orientation,
      partnerCard: partner.card,
      partnerOrientation: partner.orientation,
    });
  }, [result, partner]);

  const introText =
    hasPriorDraw && state === "idle"
      ? "Your first draw stays in the chain. Change focus below and collapse again—each time still uses new random numbers—or leave focus empty for a direct quantum map."
      : "One card from quantum randomness—orientation included. Optional focus below mixes your intention with fresh random numbers each draw.";

  return (
    <div className={containerClass}>
      {state === "idle" && (
        <>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-star/70 sm:text-base">
            {introText}
          </p>
          <div className="flex w-full flex-col items-center gap-6">
            <SpacetimeFocusPanel
              enabled={spacetimeEnabled}
              onToggle={toggleSpacetime}
              permission={geoPermission}
              gps={liveGps}
              geoError={geoError}
              nowMs={nowMs}
              ipLoading={ipLoading}
              onRetryIp={retryIpApprox}
              onSetManualCoords={setManualCoords}
            />
            <IntentField
              value={intent}
              onChange={setIntent}
              mode={hasPriorDraw ? "afterReading" : "initial"}
              spacetimeOn={spacetimeEnabled}
            />
            <DrawButton
              onClick={() => void runDraw()}
              disabled={collapseBusy}
              loading={collapseBusy}
              shimmer
              loadingLabel={
                awaitingLocation ? "Resolving location…" : undefined
              }
              variant="collapse"
            />
          </div>
        </>
      )}

      {state === "drawing" &&
        (collapsePreview && collapseFinal ? (
          <DrawCollapseAnimation
            key={drawSession}
            preview={collapsePreview}
            finalResult={collapseFinal}
            onComplete={handleCollapseComplete}
          />
        ) : (
          <div
            className="flex min-h-[420px] w-full max-w-[320px] flex-col items-center justify-center gap-4 py-8"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="flex h-[400px] w-full max-w-[300px] items-center justify-center rounded-xl border border-dashed border-accent/30 bg-void/50 sm:h-[450px] sm:max-w-[320px]">
              <span className="font-display text-xs tracking-widest text-accent/70 uppercase">
                QRNG
              </span>
            </div>
            <p className="text-center text-sm text-star/60">
              Requesting quantum measurements…
            </p>
          </div>
        ))}

      {state === "entangling" && result && (
        <div className="flex w-full flex-col items-center gap-8">
          <EntangledPair
            primary={result}
            partner={null}
            phase="entangling"
            onEntangleComplete={handleWaveComplete}
          />
          {reading && (
            <section className="mx-auto w-full max-w-3xl opacity-50 transition-opacity lg:max-w-4xl">
              <ReadingPanel
                card={result.card}
                reading={reading}
                orientation={result.orientation}
              />
            </section>
          )}
        </div>
      )}

      {state === "partnerDrawing" && result && (
        <div className="flex w-full flex-col items-center gap-6">
          <EntangledPair
            primary={result}
            partner={null}
            phase="partnerLoading"
          />
          <p className="text-sm text-star/50">Collapsing partner card…</p>
        </div>
      )}

      {state === "error" && (
        <div className="mt-8 w-full max-w-md rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">
          <p>{errorMsg}</p>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-4 text-accent underline-offset-2 hover:underline"
          >
            Back
          </button>
        </div>
      )}

      {state === "revealed" && result && reading && (
        <div key={result.drawId} className="flex w-full flex-col items-center gap-10">
          {qrngNotice && (
            <p
              className="max-w-md rounded-lg border border-accent/25 bg-accent/10 px-4 py-2.5 text-center text-sm text-star/75"
              role="status"
            >
              {qrngNotice}
            </p>
          )}
          <section className="flex w-full flex-col items-center">
            <CardStageWithOrbits intensity={0.28} variant="ambient">
              <TarotCard
                drawId={result.drawId}
                card={result.card}
                orientation={result.orientation}
                artSeed={result.artSeed}
                label="Primary"
                animateEntrance={false}
              />
            </CardStageWithOrbits>
          </section>

          <section className="mx-auto w-full max-w-3xl pt-2 lg:max-w-4xl">
            <ReadingPanel
              key={`reading-${result.drawId}`}
              card={result.card}
              reading={reading}
              orientation={result.orientation}
            />
          </section>

          {errorMsg && (
            <p className="text-sm text-red-300/90">{errorMsg}</p>
          )}

          <section className="flex w-full flex-col items-center gap-4 border-t border-white/10 pt-10">
            <button
              type="button"
              onClick={handleEntangle}
              className="font-display rounded-full border border-gold/40 bg-gold/10 px-8 py-3 text-sm font-semibold tracking-widest text-gold uppercase transition hover:border-gold hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Entangle partner card
            </button>
            <p className="max-w-sm text-xs text-star/45">
              A wavy second collapse: fresh quantum card on the opposite pole
              (upright↔reversed, transverse↔conjugate).
            </p>
            <DrawButton
              onClick={prepareNewMeasurement}
              disabled={false}
              loading={false}
              variant="another"
            />
            <QuantumTransactionButton onClick={() => setTxOpen(true)} />
          </section>
          <QuantumTransactionModal
            open={txOpen}
            onClose={() => setTxOpen(false)}
            primary={result}
            chainBasis={quantumBasis}
          />
        </div>
      )}

      {isDual && dualResult && (
        <div
          key={`${result.drawId}-${partner.drawId}`}
          className="flex w-full flex-col items-center gap-10"
        >
          {qrngNotice && (
            <p
              className="max-w-md rounded-lg border border-accent/25 bg-accent/10 px-4 py-2.5 text-center text-sm text-star/75"
              role="status"
            >
              {qrngNotice}
            </p>
          )}
          <EntangledPair
            primary={result}
            partner={partner}
            phase="complete"
          />

          <section className="mx-auto w-full max-w-3xl lg:max-w-4xl">
            <DualReadingPanel
              primary={result.card}
              primaryOrientation={result.orientation}
              primaryReading={reading!}
              partner={partner.card}
              partnerOrientation={partner.orientation}
              partnerReading={
                getReading(partner.card.id, partner.orientation)!
              }
              synthesis={dualResult.reading}
              meta={dualResult.meta}
            />
          </section>

          <section className="flex w-full flex-col items-center gap-4 border-t border-white/10 pt-10">
            <DrawButton
              onClick={prepareNewMeasurement}
              disabled={false}
              loading={false}
              variant="another"
            />
            <QuantumTransactionButton onClick={() => setTxOpen(true)} />
          </section>
          <QuantumTransactionModal
            open={txOpen}
            onClose={() => setTxOpen(false)}
            primary={result}
            partner={partner}
            chainBasis={quantumBasis}
          />
        </div>
      )}

      {state === "revealed" && result && !reading && (
        <p className="mt-8 text-red-300">Reading data missing for this card.</p>
      )}
    </div>
  );
}
