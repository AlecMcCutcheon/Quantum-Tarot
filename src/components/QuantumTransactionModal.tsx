import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DECK_SIZE } from "../data/deck";
import { getHeroCardSvg } from "../lib/cardArt/heroSvgCache";
import {
  ORIENTATION_STYLE,
  ROTATION,
} from "../lib/cardOrientationUi";
import {
  buildIntentAlignmentReport,
  type IntentAlignmentReport,
  type QuantumBasis,
} from "../lib/intentAlign";
import type { Orientation, TarotCard } from "../types/deck";
import {
  directCollapseFromRaw,
  formatTimestamp,
  FRESH_MEASUREMENT_ROLES,
  partnerArtEntropyExplain,
  partnerCollapseExplain,
  primaryArtEntropyExplain,
  SOURCE_LABEL,
} from "../lib/quantumTransactionExplain";
import { hasActiveFocus } from "../lib/focusPayload";
import type { PartnerDrawResult, QuantumDrawResult } from "../lib/quantumDraw";
import { formatGpsDisplay } from "../lib/spacetimeEphemeris";
import { ORIENTATIONS } from "../lib/orientation";
import type { SpacetimeSnapshot } from "../types/spacetime";

interface QuantumTransactionModalProps {
  open: boolean;
  onClose: () => void;
  primary: QuantumDrawResult;
  partner?: PartnerDrawResult | null;
  chainBasis?: QuantumBasis | null;
}

function OutcomeBadge({
  card,
  drawId,
  artSeed,
  name,
  classic,
  orientation,
  index,
  accent = "accent",
}: {
  card: TarotCard;
  drawId: string;
  artSeed: number[];
  name: string;
  classic: string;
  orientation: Orientation;
  index: number;
  accent?: "accent" | "gold";
}) {
  const svg = useMemo(
    () => getHeroCardSvg(card, artSeed, drawId),
    [card, artSeed, drawId],
  );
  const orientStyle = ORIENTATION_STYLE[orientation];
  const shell =
    accent === "gold"
      ? "border-gold/25 bg-gold/10"
      : "border-accent/25 bg-accent/10";
  const title = accent === "gold" ? "text-gold" : "text-accent";

  return (
    <div className={`flex h-full min-h-0 gap-3 rounded-xl border px-3 py-3 ${shell}`}>
      <div
        className={`relative h-full min-h-[4.75rem] w-[3.125rem] shrink-0 self-stretch overflow-hidden rounded-lg bg-void shadow-[0_0_16px_rgba(167,139,250,0.15)] ${orientStyle.ring}`}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center ${ROTATION[orientation]}`}
        >
          <div
            className="aspect-[2/3] h-full max-h-full w-auto max-w-full [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <p className={`font-display text-base font-semibold leading-snug ${title}`}>
          {name}
        </p>
        <p className="text-sm leading-snug text-star/55 italic">{classic}</p>
        <p className="text-xs text-star/70">
          <span className="capitalize">{orientation}</span>
          <span className="text-star/40"> · deck {index}</span>
        </p>
      </div>
    </div>
  );
}

function RawIntegerTable({
  raw,
  roles,
}: {
  raw: number[];
  roles?: string[];
}) {
  return (
    <div className="font-mono text-[11px]">
      <div className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-4 border-b border-white/10 pb-2 text-left text-[10px] text-star/40">
        <span>#</span>
        <span>value</span>
        <span className="min-w-[5.5rem]">role</span>
      </div>
      {raw.map((n, i) => (
        <div
          key={i}
          className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-4 border-t border-white/5 py-2 text-left"
        >
          <span className="text-star/45">{i}</span>
          <span className="break-all tabular-nums text-star/90">{n}</span>
          <span className="min-w-[5.5rem] text-[10px] text-star/50">
            {roles?.[i] ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

function chainMatchesFresh(basis: number[], fresh: number[]): boolean {
  return (
    basis.length === fresh.length && basis.every((n, i) => n === fresh[i])
  );
}

function RawBlock({
  title,
  raw,
  roles,
  footnote,
  grow = false,
}: {
  title: string;
  raw: number[];
  roles?: string[];
  footnote?: string;
  grow?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg border border-white/10 bg-void/50 ${
        grow ? "min-h-0 flex-1" : ""
      }`}
    >
      <div className="shrink-0 border-b border-white/8 px-3 py-2">
        <p className="text-[10px] font-semibold tracking-wide text-star/45 uppercase">
          {title}
        </p>
        {footnote ? (
          <p className="mt-1 text-[10px] leading-snug text-star/45">{footnote}</p>
        ) : null}
      </div>
      <div
        className={`themed-scroll overflow-auto p-3 ${
          grow ? "min-h-0 flex-1" : "max-h-40"
        }`}
      >
        <RawIntegerTable raw={raw} roles={roles} />
      </div>
    </div>
  );
}

function PhaseShiftMeter({ report }: { report: IntentAlignmentReport }) {
  const {
    phaseShiftScore,
    cardIndexDistance,
    orientationDistance,
    cardChanged,
    orientationChanged,
  } = report;

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-3 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <p className="font-display text-base font-semibold text-gold">Phase shift</p>
        <p className="shrink-0 font-display text-3xl font-semibold leading-none tabular-nums text-gold">
          {phaseShiftScore}
          <span className="text-lg font-normal text-gold/60">%</span>
        </p>
      </div>
      <div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-white/10"
          role="meter"
          aria-valuenow={phaseShiftScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="How far focus shifted the collapse from direct QRNG mapping"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400/80 via-accent to-gold"
            style={{ width: `${Math.max(4, phaseShiftScore)}%` }}
          />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-star/70">
          Card ring {cardIndexDistance}/{Math.floor(DECK_SIZE / 2)} · pole{" "}
          {orientationDistance}/{ORIENTATIONS.length / 2}
          {!cardChanged && !orientationChanged
            ? " · focus changed art only"
            : cardChanged || orientationChanged
              ? ` · ${cardChanged ? "card " : ""}${orientationChanged ? "pole " : ""}shifted`
              : ""}
        </p>
      </div>
    </div>
  );
}

function ProceduralArtBlock({
  artSeed,
  source,
  note,
  artFormulas,
}: {
  artSeed: number[];
  source: string;
  note: string;
  artFormulas?: string[];
}) {
  return (
    <div className="shrink-0 rounded-xl border border-white/10 bg-void/35 px-4 py-3">
      <p className="text-[10px] font-semibold tracking-wide text-star/45 uppercase">
        Procedural art
      </p>
      <p className="mt-2 font-mono text-[11px] leading-relaxed text-star/70">
        [{artSeed.join(", ")}]
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-star/50">
        {source}. {note}
      </p>
      {artFormulas && artFormulas.length > 0 && (
        <ul className="mt-2 space-y-0.5 font-mono text-[10px] text-star/45">
          {artFormulas.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TxMeta({
  source,
  drawnAt,
  drawId,
}: {
  source: string;
  drawnAt: number;
  drawId: string;
}) {
  return (
    <div className="space-y-1.5 text-[11px] leading-snug">
      <p className="text-star/65">
        <span className="font-medium text-star/85">{source}</span>
        <span className="text-star/40"> · </span>
        {formatTimestamp(drawnAt)}
      </p>
      <p className="font-mono text-[10px] leading-relaxed break-all text-star/45">
        {drawId}
      </p>
    </div>
  );
}

/** Left column: metadata + flow in one bordered panel. */
function CalculationPanel({
  meta,
  children,
}: {
  meta: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-void/25">
      <div className="shrink-0 border-b border-white/8 px-4 py-3">
        <p className="text-[10px] font-semibold tracking-wide text-star/45 uppercase">
          Calculation
        </p>
        <div className="mt-2">{meta}</div>
      </div>
      <div className="themed-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
}

function CalculationTrace({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/8 bg-void/35">{children}</div>
  );
}

function TraceLine({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.5rem_1fr] gap-x-3 border-b border-white/6 px-3 py-3.5 last:border-b-0 sm:px-4">
      <span className="pt-0.5 font-mono text-[11px] font-medium text-accent">
        {n}
      </span>
      <div className="min-w-0 text-left">
        <p className="text-sm font-medium text-star/92">{title}</p>
        <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-star/65">
          {children}
        </div>
      </div>
    </div>
  );
}

function focusReference(intent?: string, spacetime?: SpacetimeSnapshot): string {
  const parts: string[] = [];
  if (spacetime) {
    const gpsLine = spacetime.gps
      ? formatGpsDisplay(spacetime.gps)
      : "no place fix — time and sky ephemeris only";
    parts.push(
      `${spacetime.capturedAtUtc} (${spacetime.capturedAtLocal} local) · ${gpsLine}. ` +
        `Sky ephemeris at your place and time is in the hash (astronomy-engine, local).`,
    );
  }
  if (intent?.trim()) {
    parts.push("Reader text is in the hash (not shown).");
  }
  if (parts.length === 0) return "No focus was submitted.";
  return parts.join(" ");
}

/** Two-column body with matched min-height. */
function TxColumns({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
      <div className="flex min-h-[24rem] flex-col gap-4">{left}</div>
      <div className="flex min-h-[24rem] flex-col gap-4">{right}</div>
    </div>
  );
}

function PrimaryTransaction({
  draw,
  chainBasis,
}: {
  draw: QuantumDrawResult;
  chainBasis?: QuantumBasis | null;
}) {
  const direct = directCollapseFromRaw(draw.quantumRaw);
  const art = primaryArtEntropyExplain(draw);
  const basisForPayload = useMemo(
    () =>
      chainBasis ??
      (draw.quantumBasis
        ? {
            quantumRaw: draw.quantumBasis,
            drawId: draw.quantumBasisDrawId ?? draw.drawId,
          }
        : null),
    [chainBasis, draw.quantumBasis, draw.quantumBasisDrawId, draw.drawId],
  );

  const [alignReport, setAlignReport] = useState<IntentAlignmentReport | null>(
    null,
  );
  const [alignLoading, setAlignLoading] = useState(false);

  useEffect(() => {
    if (
      !draw.realigned ||
      !basisForPayload ||
      !hasActiveFocus(draw.intent ?? "", draw.spacetime)
    ) {
      setAlignReport(null);
      return;
    }
    let cancelled = false;
    setAlignLoading(true);
    buildIntentAlignmentReport(
      basisForPayload,
      draw.quantumRaw,
      draw.intent ?? "",
      draw.spacetime,
    ).then((r) => {
      if (!cancelled) {
        setAlignReport(r);
        setAlignLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [
    draw.realigned,
    draw.intent,
    draw.spacetime,
    draw.quantumRaw,
    basisForPayload,
  ]);

  const freshRoles = FRESH_MEASUREMENT_ROLES.slice(0, draw.quantumRaw.length);
  const focusAligned = Boolean(
    draw.realigned &&
      basisForPayload &&
      hasActiveFocus(draw.intent ?? "", draw.spacetime),
  );
  const chainIsThisDraw =
    basisForPayload?.drawId === draw.drawId;

  const calculationTrace = focusAligned ? (
    <CalculationTrace>
      <TraceLine n={1} title="Measure">
        Fresh QRNG batch for this collapse — integers on the right, unchanged in
        the record.
      </TraceLine>
      <TraceLine n={2} title={chainIsThisDraw ? "Chain anchor" : "Prior chain"}>
        {chainIsThisDraw ? (
          <>
            This collapse anchors the chain (
            <span className="font-mono text-[10px] text-star/50">
              {draw.drawId.slice(0, 8)}…
            </span>
            ). Those QRNG values stay in the hash input.
          </>
        ) : (
          <>
            Anchored to first draw{" "}
            <span className="font-mono text-[10px] text-star/50">
              {basisForPayload!.drawId.slice(0, 8)}…
            </span>
            . Prior measurement stays in the hash; fresh QRNG is new.
          </>
        )}
      </TraceLine>
      <TraceLine n={3} title="Reader focus">
        {focusReference(draw.intent, draw.spacetime)}
      </TraceLine>
      <TraceLine n={4} title="Hash → collapse">
        <p>
          <code className="text-[11px] text-star/55">
            SHA-256(anchored chain + fresh integers + intent
            {draw.spacetime ? " + spacetime" : ""})
          </code>{" "}
          picks card index and pole. Every collapse still uses a new QRNG batch.
        </p>
        {alignReport ? (
          <>
            <p className="font-mono text-[10px] leading-relaxed break-all text-star/45">
              {alignReport.hashHex.slice(0, 48)}…
            </p>
            <p className="font-mono text-[11px] text-star/60">
              {alignReport.steps.cardFormula}
            </p>
            <p className="font-mono text-[11px] text-star/60">
              {alignReport.steps.orientationFormula}
            </p>
          </>
        ) : (
          <p className="text-star/45">Computing…</p>
        )}
      </TraceLine>
      <TraceLine n={5} title="Outcome">
        <p className="font-medium text-accent">
          {draw.card.quantumName} · {draw.orientation}
        </p>
        {alignReport && (
          <p className="text-[11px] text-star/50">
            Same integers, direct map only: {alignReport.direct.cardName} ·{" "}
            {alignReport.direct.orientation} (raw[0]→{alignReport.direct.cardIndex},
            raw[1]→{alignReport.direct.orientationIndex}).
          </p>
        )}
      </TraceLine>
    </CalculationTrace>
  ) : (
    <CalculationTrace>
      <TraceLine n={1} title="Measure">
        One QRNG batch — no reader focus submitted.
      </TraceLine>
      <TraceLine n={2} title="Direct map">
        <p>
          raw[0] mod {DECK_SIZE} → {direct.cardIndex} ({direct.cardName})
        </p>
        <p>
          raw[1] mod {ORIENTATIONS.length} → {direct.orientation}
        </p>
      </TraceLine>
      <TraceLine n={3} title="Outcome">
        Same as the direct map. Shuffle animation permutes this batch.
      </TraceLine>
    </CalculationTrace>
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h3 className="font-display text-xs font-semibold tracking-widest text-accent uppercase">
        Primary collapse
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:items-stretch">
        <OutcomeBadge
          card={draw.card}
          drawId={draw.drawId}
          artSeed={draw.artSeed}
          name={draw.card.quantumName}
          classic={draw.card.classicName}
          orientation={draw.orientation}
          index={draw.card.index}
        />
        {focusAligned ? (
          alignLoading ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-xs text-star/45">
              Computing phase shift…
            </div>
          ) : alignReport ? (
            <PhaseShiftMeter report={alignReport} />
          ) : (
            <div className="h-full rounded-xl border border-white/10 bg-void/25" aria-hidden />
          )
        ) : (
          <div className="flex h-full flex-col justify-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
            <p className="font-display text-base font-semibold text-accent">
              Pure quantum
            </p>
            <p className="text-xs text-star/70">
              Direct map — no focus submitted on this collapse.
            </p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <TxColumns
          left={
            <CalculationPanel
              meta={
                <TxMeta
                  source={SOURCE_LABEL[draw.source]}
                  drawnAt={draw.drawnAt}
                  drawId={draw.drawId}
                />
              }
            >
              {calculationTrace}
            </CalculationPanel>
          }
          right={
            <>
              <ProceduralArtBlock
                artSeed={draw.artSeed}
                source={art.source}
                note={art.note}
                artFormulas={alignReport?.steps.artFormulas}
              />
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                <RawBlock
                  title={`Fresh QRNG integers (${draw.quantumRaw.length})`}
                  raw={draw.quantumRaw}
                  roles={[...freshRoles]}
                  grow
                />
                {focusAligned && basisForPayload ? (
                  <RawBlock
                    title={
                      chainIsThisDraw
                        ? `Chain anchor (${basisForPayload.quantumRaw.length})`
                        : `Anchored chain (${basisForPayload.quantumRaw.length})`
                    }
                    footnote={
                      chainIsThisDraw &&
                      chainMatchesFresh(
                        basisForPayload.quantumRaw,
                        draw.quantumRaw,
                      )
                        ? "First focused collapse: this batch is both the anchor and the fresh input to SHA-256."
                        : !chainIsThisDraw
                          ? `Anchored to draw ${basisForPayload.drawId.slice(0, 8)}…`
                          : undefined
                    }
                    raw={basisForPayload.quantumRaw}
                    roles={FRESH_MEASUREMENT_ROLES.slice(
                      0,
                      basisForPayload.quantumRaw.length,
                    )}
                    grow
                  />
                ) : null}
              </div>
            </>
          }
        />
      </div>
    </section>
  );
}

function PartnerTransaction({
  partner,
  primary,
}: {
  partner: PartnerDrawResult;
  primary: QuantumDrawResult;
}) {
  const { direct, bumped, orientationRule } = partnerCollapseExplain(
    partner,
    primary.card.id,
    primary.orientation,
  );
  const art = partnerArtEntropyExplain(partner);
  const roles = ["card (mod 78)", ...FRESH_MEASUREMENT_ROLES.slice(1)].slice(
    0,
    partner.quantumRaw.length,
  );

  return (
    <section className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-5 sm:p-6">
      <h3 className="font-display text-xs font-semibold tracking-widest text-gold uppercase">
        Partner entanglement
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:items-stretch">
        <OutcomeBadge
          card={partner.card}
          drawId={partner.drawId}
          artSeed={partner.artSeed}
          name={partner.card.quantumName}
          classic={partner.card.classicName}
          orientation={partner.orientation}
          index={partner.card.index}
          accent="gold"
        />
        <div className="flex h-full flex-col justify-center rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
          <p className="text-[10px] font-semibold tracking-wide text-gold/80 uppercase">
            Entangled pole
          </p>
          <p className="mt-2 text-sm text-star/70">{orientationRule}</p>
        </div>
      </div>

      <div className="mt-5">
        <TxColumns
          left={
            <CalculationPanel
              meta={
                <TxMeta
                  source={SOURCE_LABEL[partner.source]}
                  drawnAt={partner.drawnAt}
                  drawId={partner.drawId}
                />
              }
            >
              <CalculationTrace>
                <TraceLine n={1} title="Measure">
                  Separate QRNG batch from the primary collapse.
                </TraceLine>
                <TraceLine n={2} title="Card">
                  <p>
                    raw[0] mod {DECK_SIZE} → {direct.cardName}
                    {bumped ? " (bumped +1 — matched primary)" : ""}
                  </p>
                </TraceLine>
                <TraceLine n={3} title="Pole">
                  {orientationRule}
                </TraceLine>
                <TraceLine n={4} title="Outcome">
                  <p className="font-medium text-gold">
                    {partner.card.quantumName} · {partner.orientation}
                  </p>
                </TraceLine>
              </CalculationTrace>
            </CalculationPanel>
          }
          right={
            <>
              <ProceduralArtBlock
                artSeed={partner.artSeed}
                source={art.source}
                note={art.note}
              />
              <RawBlock
                title={`Partner QRNG integers (${partner.quantumRaw.length})`}
                raw={partner.quantumRaw}
                roles={roles}
                grow
              />
            </>
          }
        />
      </div>
    </section>
  );
}

export function QuantumTransactionModal({
  open,
  onClose,
  primary,
  partner,
  chainBasis,
}: QuantumTransactionModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-labelledby="quantum-tx-title"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="themed-scroll flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-white/12 bg-nebula shadow-2xl lg:max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative sticky top-0 z-10 border-b border-white/10 bg-nebula/95 px-5 py-4 backdrop-blur-md sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg border border-white/10 px-2.5 py-1 text-sm text-star/60 transition hover:bg-white/10 hover:text-star sm:right-6"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="mx-auto max-w-2xl px-10 text-center">
            <h2
              id="quantum-tx-title"
              className="font-display text-sm font-semibold tracking-wide text-accent uppercase"
            >
              Quantum transaction
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-star/55">
              Fresh random numbers, how they collapsed, how optional focus mixed
              in, and the final card.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-5 px-5 py-5 sm:px-8 sm:py-6">
          <PrimaryTransaction draw={primary} chainBasis={chainBasis} />
          {partner && (
            <PartnerTransaction partner={partner} primary={primary} />
          )}
        </div>
      </div>
    </div>
  );
}

export function QuantumTransactionButton({
  onClick,
  label = "Quantum transaction",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-star/60 transition hover:border-accent/35 hover:bg-accent/10 hover:text-accent"
    >
      {label}
    </button>
  );
}
