import { memo, startTransition, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DECK } from "../data/deck";
import { getReading } from "../data/readings";
import { useLibraryThumbs } from "../hooks/useLibraryThumbs";
import { getLibraryDetailSvg } from "../lib/cardArt/libraryDetailSvg";
import type { Orientation, TarotCard } from "../types/deck";

const ORIENTATIONS: Orientation[] = [
  "upright",
  "reversed",
  "transverse",
  "conjugate",
];

const ORIENTATION_SHORT: Record<Orientation, string> = {
  upright: "Upright",
  reversed: "Reversed",
  transverse: "Transverse",
  conjugate: "Conjugate",
};

const ORIENTATION_LABEL: Record<Orientation, string> = {
  upright: "Upright · Direct",
  reversed: "Reversed · Inverted",
  transverse: "Transverse · Lateral",
  conjugate: "Conjugate · Second crossing",
};

const ROTATION: Record<Orientation, string> = {
  upright: "rotate-0",
  reversed: "rotate-180",
  transverse: "rotate-90",
  conjugate: "-rotate-90",
};

const ORIENTATION_BADGE: Record<Orientation, string> = {
  upright: "bg-accent/20 text-accent",
  reversed: "bg-cosmic/30 text-accent",
  transverse: "bg-gold/20 text-gold",
  conjugate: "bg-gold/10 text-gold/90",
};

interface CardLibraryProps {
  open: boolean;
  onClose: () => void;
}

interface LibraryListItemProps {
  card: TarotCard;
  active: boolean;
  thumbUrl?: string;
  onSelect: (id: string) => void;
}

const LibraryListItem = memo(function LibraryListItem({
  card,
  active,
  thumbUrl,
  onSelect,
}: LibraryListItemProps) {
  return (
    <li className="[content-visibility:auto] [contain-intrinsic-size:auto_3.5rem]">
      <button
        type="button"
        onClick={() => onSelect(card.id)}
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition ${
          active
            ? "bg-accent/15 ring-1 ring-accent/30"
            : "hover:bg-white/5"
        }`}
      >
        <div className="relative aspect-[2/3] w-11 shrink-0 overflow-hidden rounded-md border border-white/10 bg-void/80">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt=""
              width={44}
              height={66}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-white/5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-star/95">
            {card.quantumName}
          </p>
          <p className="truncate text-[10px] text-star/45 italic">
            {card.classicName}
          </p>
        </div>
      </button>
    </li>
  );
});

export function CardLibrary({ open, onClose }: CardLibraryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("upright");
  const [filter, setFilter] = useState<"all" | "major" | "minor">("all");
  const cards = useMemo(() => {
    if (filter === "major") return DECK.filter((c) => c.arcana === "major");
    if (filter === "minor") return DECK.filter((c) => c.arcana === "minor");
    return DECK;
  }, [filter]);

  const thumbUrls = useLibraryThumbs(cards, open);

  const selected = selectedId
    ? DECK.find((c) => c.id === selectedId)
    : null;
  const reading =
    selected && getReading(selected.id, orientation);

  const detailSvg = selected ? getLibraryDetailSvg(selected) : null;

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setOrientation("upright");
  };

  const setFilterDeferred = (f: "all" | "major" | "minor") => {
    startTransition(() => setFilter(f));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close card library"
            onClick={handleClose}
          />
          <motion.div
            className="fixed top-0 left-0 z-50 flex h-dvh max-w-[100vw] overflow-hidden border-r border-white/10 bg-void/95 shadow-2xl backdrop-blur-md"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            role="dialog"
            aria-label="Card library"
          >
            <nav
              className="flex h-full w-[min(100vw,18rem)] shrink-0 flex-col border-r border-white/10 sm:w-72"
              aria-label="Card index"
            >
              <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-widest text-accent uppercase">
                    Deck library
                  </h2>
                  <p className="mt-0.5 text-xs text-star/50">
                    {DECK.length} cards
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-2 py-1 text-star/60 hover:bg-white/10 hover:text-star"
                  aria-label="Close library"
                >
                  ✕
                </button>
              </header>

              <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 py-2">
                {(["all", "major", "minor"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterDeferred(f)}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                      filter === f
                        ? "bg-accent/25 text-accent"
                        : "text-star/50 hover:text-star/80"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <ul className="library-scroll min-h-0 flex-1 overflow-y-auto px-2 py-2">
                {cards.map((card) => (
                  <LibraryListItem
                    key={card.id}
                    card={card}
                    active={selectedId === card.id}
                    thumbUrl={thumbUrls[card.id]}
                    onSelect={handleSelect}
                  />
                ))}
              </ul>
            </nav>

            <AnimatePresence>
              {selectedId && selected && detailSvg && (
                <motion.aside
                  key="library-detail"
                  className="flex h-full w-[min(calc(100vw-18rem),24rem)] shrink-0 flex-col overflow-hidden border-l border-white/10 bg-nebula/50 sm:w-96"
                  initial={{ x: -32, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -32, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  aria-label={`${selected.quantumName} details`}
                >
                  <motion.div
                    key={selected.id}
                    className="flex min-h-0 flex-1 flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                  <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="rounded-lg px-2 py-1 text-xs text-star/60 hover:bg-white/10 hover:text-star"
                      aria-label="Back to card list"
                    >
                      ←
                    </button>
                    <p className="truncate text-xs text-star/50">
                      Card detail
                    </p>
                  </header>

                  <div className="library-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-xl border border-white/15 bg-void/80 shadow-[0_0_40px_rgba(167,139,250,0.25)] transition-transform duration-500 ${ROTATION[orientation]} ${
                          orientation === "transverse"
                            ? "ring-2 ring-gold/50"
                            : orientation === "conjugate"
                              ? "ring-2 ring-accent/40"
                              : ""
                        }`}
                      >
                        <div
                          className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                          dangerouslySetInnerHTML={{ __html: detailSvg }}
                        />
                      </div>
                      <span
                        className={`mt-3 rounded-full px-3 py-1 text-xs font-medium tracking-wide ${ORIENTATION_BADGE[orientation]}`}
                      >
                        {ORIENTATION_LABEL[orientation]}
                      </span>
                    </div>

                    <div className="mt-5 text-center">
                      <h3 className="font-display text-base font-semibold text-accent">
                        {selected.quantumName}
                      </h3>
                      <p className="mt-1 text-sm text-star/55 italic">
                        {selected.classicName}
                      </p>
                      {selected.arcana === "major" ? (
                        <p className="mt-1 font-mono text-[10px] tracking-wide text-star/40 uppercase">
                          Major · {selected.romanLabel}
                        </p>
                      ) : (
                        <p className="mt-1 font-mono text-[10px] tracking-wide text-star/40 uppercase">
                          {selected.suit} · {String(selected.rank)}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                      {ORIENTATIONS.map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setOrientation(o)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase transition ${
                            orientation === o
                              ? "bg-gold/25 text-gold ring-1 ring-gold/40"
                              : "bg-white/5 text-star/50 hover:bg-white/10 hover:text-star/80"
                          }`}
                        >
                          {ORIENTATION_SHORT[o]}
                        </button>
                      ))}
                    </div>

                    {reading ? (
                      <article className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                        <p className="text-sm leading-relaxed font-medium text-star/95">
                          {reading.summary}
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-star/80">
                          {reading.detail}
                        </p>
                        <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 px-3 py-3">
                          <p className="text-[10px] font-semibold tracking-wide text-gold uppercase">
                            Guidance
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-star/85">
                            {reading.guidance}
                          </p>
                        </div>
                      </article>
                    ) : (
                      <p className="mt-6 text-center text-xs text-red-300/90">
                        Reading missing for this orientation.
                      </p>
                    )}
                  </div>
                  </motion.div>
                </motion.aside>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Fixed tab to open the library */
export function CardLibraryTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed top-1/2 left-0 z-30 -translate-y-1/2 rounded-r-lg border border-l-0 border-white/15 bg-void/80 px-2 py-4 text-[10px] font-semibold tracking-widest text-accent uppercase shadow-lg backdrop-blur-sm transition hover:border-accent/40 hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Open card library"
    >
      <span
        className="inline-block"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        Library
      </span>
    </button>
  );
}
