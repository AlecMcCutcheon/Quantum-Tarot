import type { TarotCard } from "../../types/deck";
import { MINOR_SEMANTICS } from "./minorSemantics";

/** Core tags used by the dual-reading decision tree (not pair-specific). */
export type EnergyKind =
  | "expansive"
  | "contractive"
  | "liminal"
  | "disruptive"
  | "integrative"
  | "illuminating"
  | "binding";

export type RoleKind =
  | "initiator"
  | "stabilizer"
  | "revealer"
  | "transformer"
  | "connector"
  | "challenger"
  | "healer";

export interface CardSemanticProfile {
  themes: string[];
  energy: EnergyKind;
  role: RoleKind;
  /** What this card contributes when entangled */
  contributes: string;
  /** Stitching verb for relation sentences */
  stitch: string;
}

export const MAJOR_SEMANTICS: Record<string, CardSemanticProfile> = {
  "major-00": {
    themes: ["beginning", "leap", "innocence", "risk"],
    energy: "liminal",
    role: "initiator",
    contributes: "unmeasured possibility and first-step courage",
    stitch: "opens",
  },
  "major-01": {
    themes: ["will", "skill", "focus", "manifestation"],
    energy: "expansive",
    role: "initiator",
    contributes: "directed will and executable craft",
    stitch: "focuses",
  },
  "major-02": {
    themes: ["mystery", "intuition", "silence", "pattern"],
    energy: "liminal",
    role: "revealer",
    contributes: "hidden knowledge and unspoken pattern",
    stitch: "veils",
  },
  "major-03": {
    themes: ["growth", "pleasure", "nurture", "abundance"],
    energy: "expansive",
    role: "healer",
    contributes: "fertility and embodied care",
    stitch: "nurtures",
  },
  "major-04": {
    themes: ["order", "authority", "structure", "boundary"],
    energy: "contractive",
    role: "stabilizer",
    contributes: "law, frame, and sovereign limit",
    stitch: "frames",
  },
  "major-05": {
    themes: ["tradition", "teaching", "belief", "lineage"],
    energy: "integrative",
    role: "connector",
    contributes: "shared axiom and initiatory grammar",
    stitch: "initiates",
  },
  "major-06": {
    themes: ["choice", "values", "union", "desire"],
    energy: "expansive",
    role: "connector",
    contributes: "entangled values and ethical fork",
    stitch: "couples",
  },
  "major-07": {
    themes: ["drive", "victory", "direction", "conflict"],
    energy: "expansive",
    role: "challenger",
    contributes: "momentum and contested path",
    stitch: "drives",
  },
  "major-08": {
    themes: ["strength", "patience", "courage", "regulation"],
    energy: "integrative",
    role: "stabilizer",
    contributes: "coherent nerve and gentle mastery",
    stitch: "steadies",
  },
  "major-09": {
    themes: ["solitude", "wisdom", "search", "lantern"],
    energy: "liminal",
    role: "revealer",
    contributes: "inner signal and earned distance",
    stitch: "illuminates",
  },
  "major-10": {
    themes: ["cycle", "fate", "turn", "fortune"],
    energy: "liminal",
    role: "transformer",
    contributes: "phase change and seasonal law",
    stitch: "rotates",
  },
  "major-11": {
    themes: ["justice", "truth", "consequence", "balance"],
    energy: "contractive",
    role: "stabilizer",
    contributes: "proportion and accountable verdict",
    stitch: "weighs",
  },
  "major-12": {
    themes: ["pause", "sacrifice", "reframe", "surrender"],
    energy: "liminal",
    role: "revealer",
    contributes: "suspended view and willing invert",
    stitch: "reframes",
  },
  "major-13": {
    themes: ["ending", "release", "change", "grief"],
    energy: "disruptive",
    role: "transformer",
    contributes: "entropic close and irreversible shift",
    stitch: "dissolves",
  },
  "major-14": {
    themes: ["balance", "blend", "patience", "healing"],
    energy: "integrative",
    role: "healer",
    contributes: "measured mixture and middle way",
    stitch: "blends",
  },
  "major-15": {
    themes: ["bondage", "desire", "shadow", "appetite"],
    energy: "binding",
    role: "challenger",
    contributes: "attachment and lower bargain",
    stitch: "binds",
  },
  "major-16": {
    themes: ["upheaval", "truth", "break", "lightning"],
    energy: "disruptive",
    role: "challenger",
    contributes: "structural break and forced clarity",
    stitch: "shatters",
  },
  "major-17": {
    themes: ["hope", "healing", "renewal", "guidance"],
    energy: "illuminating",
    role: "healer",
    contributes: "restorative light after weather",
    stitch: "restores",
  },
  "major-18": {
    themes: ["dream", "fear", "illusion", "depth"],
    energy: "liminal",
    role: "revealer",
    contributes: "psychic tide and half-seen path",
    stitch: "obscures",
  },
  "major-19": {
    themes: ["joy", "vitality", "clarity", "success"],
    energy: "illuminating",
    role: "healer",
    contributes: "radiance and uncomplicated warmth",
    stitch: "brightens",
  },
  "major-20": {
    themes: ["calling", "reckoning", "awakening", "absolution"],
    energy: "integrative",
    role: "transformer",
    contributes: "vocational measure and answered trumpet",
    stitch: "summons",
  },
  "major-21": {
    themes: ["completion", "wholeness", "integration", "arrival"],
    energy: "integrative",
    role: "stabilizer",
    contributes: "closed cycle and conserved lesson",
    stitch: "completes",
  },
};

const SUIT_SEMANTICS: Record<
  string,
  Pick<CardSemanticProfile, "themes" | "energy" | "contributes">
> = {
  wands: {
    themes: ["fire", "initiative", "passion", "visibility"],
    energy: "expansive",
    contributes: "photon spark and visible will",
  },
  cups: {
    themes: ["water", "feeling", "bond", "intuition"],
    energy: "expansive",
    contributes: "emotional flux and relational depth",
  },
  swords: {
    themes: ["air", "thought", "truth", "conflict"],
    energy: "contractive",
    contributes: "mental cut and decisive word",
  },
  pentacles: {
    themes: ["earth", "work", "body", "resource"],
    energy: "contractive",
    contributes: "lattice craft and material consequence",
  },
};

const RANK_SEMANTICS: Record<
  string,
  Pick<CardSemanticProfile, "themes" | "role" | "stitch">
> = {
  ace: { themes: ["origin", "gift", "spark"], role: "initiator", stitch: "ignites" },
  "2": { themes: ["duality", "choice", "pair"], role: "connector", stitch: "pairs with" },
  "3": { themes: ["growth", "expression", "spread"], role: "initiator", stitch: "expands" },
  "4": { themes: ["rest", "foundation", "hold"], role: "stabilizer", stitch: "grounds" },
  "5": { themes: ["strife", "test", "friction"], role: "challenger", stitch: "agitates" },
  "6": { themes: ["harmony", "repair", "gift"], role: "healer", stitch: "mends" },
  "7": { themes: ["assessment", "defense", "wait"], role: "revealer", stitch: "tests" },
  "8": { themes: ["speed", "skill", "motion"], role: "challenger", stitch: "accelerates" },
  "9": { themes: ["near-end", "worry", "peak"], role: "revealer", stitch: "intensifies" },
  "10": { themes: ["culmination", "burden", "legacy"], role: "transformer", stitch: "culminates" },
  page: { themes: ["message", "study", "curiosity"], role: "initiator", stitch: "announces" },
  knight: { themes: ["pursuit", "charge", "campaign"], role: "challenger", stitch: "rides into" },
  queen: { themes: ["mastery", "reception", "care"], role: "healer", stitch: "holds" },
  king: { themes: ["rule", "stewardship", "command"], role: "stabilizer", stitch: "governs" },
};

export function getCardSemantics(card: TarotCard): CardSemanticProfile {
  const major = MAJOR_SEMANTICS[card.id];
  if (major) return major;

  const minor = MINOR_SEMANTICS[card.id];
  if (minor) {
    const suit = card.suit ?? "wands";
    const s = SUIT_SEMANTICS[suit];
    return {
      themes: [...new Set([...s.themes, ...minor.themes])],
      energy: s.energy,
      role: minor.role,
      contributes: minor.contributes,
      stitch: minor.stitch,
    };
  }

  const suit = card.suit ?? "wands";
  const rk = String(card.rank);
  const s = SUIT_SEMANTICS[suit];
  const r = RANK_SEMANTICS[rk] ?? RANK_SEMANTICS.ace!;

  return {
    themes: [...new Set([...s.themes, ...r.themes])],
    energy: s.energy,
    role: r.role,
    contributes: `${r.stitch === "ignites" ? "pip" : "field"} ${s.contributes}`,
    stitch: r.stitch,
  };
}
