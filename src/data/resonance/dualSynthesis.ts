import { getReading } from "../readings";
import type { Orientation } from "../../types/deck";
import type { ReadingText } from "../../types/reading";
import type { DualReadingInput } from "./types";
import {
  getCardSemantics,
  type CardSemanticProfile,
  type EnergyKind,
} from "./cardSemantics";
import {
  buildCardVoiceLine,
  buildDualSummary,
  buildInterferenceVariant,
  buildPoleNarrative,
  FRAME_VARIANTS,
  GUIDANCE_VARIANTS,
  pairSeed,
  pickVariant,
} from "./pairVariation";

/** How the two cards' tags interact — chosen by decision tree. */
export type ThemeRelation =
  | "resonance"
  | "friction"
  | "crosscurrent"
  | "catalysis"
  | "veil"
  | "grounding";

export type SynthesisArchetype =
  | "harmonic_field"
  | "productive_tension"
  | "rupture_line"
  | "threshold_gate"
  | "emblem_story"
  | "pole_inversion"
  | "lateral_braid";

export type ArcanaPair =
  | "major-major"
  | "major-minor"
  | "minor-major"
  | "minor-minor";

export type PoleAxis = "vertical" | "lateral";

export interface DualSynthesisSection {
  label: string;
  body: string;
}

export interface DualSynthesisMeta {
  synthesisArchetype: SynthesisArchetype;
  themeRelation: ThemeRelation;
  sharedThemes: string[];
  primaryOnlyThemes: string[];
  partnerOnlyThemes: string[];
  primaryEnergy: EnergyKind;
  partnerEnergy: EnergyKind;
  arcanaPair: ArcanaPair;
  poleAxis: PoleAxis;
  sections: DualSynthesisSection[];
}

/** First primary orientation fixes the partner pole (invert) — 4 layouts per unordered card pair. */
export const ENTANGLED_STATE_COUNT = {
  unorderedCardPairs: (78 * 77) / 2,
  orientationsPerPair: 4,
  unorderedDualStates: ((78 * 77) / 2) * 4,
  orderedCardPairs: 78 * 77,
  orderedDualStates: 78 * 77 * 4,
} as const;


const ARCANA_CHEMISTRY: Record<ArcanaPair, string[]> = {
  "major-major": [
    "Two archetypes speak at full volume—myth meets myth; the pairing is a chapter, not a footnote.",
    "Major meets major: symbols argue as equals—neither card is background music.",
    "Fate-scale figures in dialogue—treat the pair like a scene change, not a footnote to one card.",
  ],
  "major-minor": [
    "Archetype meets daily current: the major sets weather, the minor shows how it rains on your street.",
    "Law meets life: the major names the pattern; the minor shows the receipt.",
    "The myth is not abstract here—the minor is the emblem the major insists you respect.",
  ],
  "minor-major": [
    "Daily detail is lifted into symbol—the minor’s circumstance is named by the major’s law.",
    "The street scene meets the archetype: small facts become omen under the major’s gaze.",
    "Circumstance rises to symbol—the minor is the door the major knocks on.",
  ],
  "minor-minor": [
    "Two currents in the same element of life—immediate, practical, doubled.",
    "Pip meets pip: the situation is mundane on the surface, urgent underneath.",
    "Daily life doubled—watch logistics, money, messages, and nerves as much as myth.",
  ],
};

const ENERGY_PAIR_NARRATIVE: Record<string, string> = {
  "expansive+expansive": "Both cards push outward—amplification, competition for air, or generous overflow.",
  "expansive+contractive":
    "Expansion meets boundary—growth needs a frame, or pressure builds until something gives.",
  "expansive+liminal":
    "Force meets threshold—the situation wants to move but has not chosen its shape.",
  "expansive+disruptive":
    "Momentum meets break—progress triggers upheaval, or upheaval demands a new push.",
  "expansive+integrative":
    "Heat meets alchemy—initiative is tempered into something durable.",
  "expansive+illuminating":
    "Drive meets dawn—effort becomes visible reward, or success exposes what was rushed.",
  "expansive+binding":
    "Desire meets chain—passion collides with habit, debt, or devotion that limits.",
  "contractive+contractive":
    "Double boundary—conservation, law, or fear of loss shapes every move.",
  "contractive+liminal":
    "Structure at the gate—rules form before the unknown is entered.",
  "contractive+disruptive":
    "Order under strike—what was managed is tested by necessary break.",
  "contractive+integrative":
    "Discipline meets blend—limits are negotiated, not abandoned.",
  "contractive+illuminating":
    "Clarity with cost—truth requires sacrifice of comfort.",
  "contractive+binding":
    "Tight grip—security and bondage rhyme; ask which you chose.",
  "liminal+liminal":
    "Double threshold—symbols loud, verdicts delayed; live the question without false answers.",
  "liminal+disruptive":
    "Fog then lightning—uncertainty cleared by shock, or shock that leaves fog.",
  "liminal+integrative":
    "Incubation toward synthesis—pieces not yet whole, but relating.",
  "liminal+illuminating":
    "Dawn through mist—insight flickers before the road is plain.",
  "liminal+binding":
    "Pause at the chain—almost free, almost caught; the bind is psychological as much as material.",
  "disruptive+disruptive":
    "Cascade—multiple endings or breaks; stabilize before you rebuild twice.",
  "disruptive+integrative":
    "Break then mend—debris sorted into new design.",
  "disruptive+illuminating":
    "Storm then star—pain and hope in sequence, not contradiction.",
  "disruptive+binding":
    "Break the chain—or break yourself against it.",
  "integrative+integrative":
    "Double mixing—healing, diplomacy, long calibration; do not rush the third thing forming.",
  "integrative+illuminating":
    "Healing visible—recovery others can see; stay honest inside the glow.",
  "integrative+binding":
    "Integration inside bond—freedom through commitment, or commitment that finally matures.",
  "illuminating+illuminating":
    "Bright field—joy, success, or exposure doubled; shade is still required.",
  "illuminating+binding":
    "Light on the leash—success, pleasure, or truth with strings attached.",
  "binding+binding":
    "Deep well—two habits, dependencies, or loyalties entangled; naming the payoff is the exit.",
};

function arcanaPair(a: { arcana: string }, b: { arcana: string }): ArcanaPair {
  if (a.arcana === "major" && b.arcana === "major") return "major-major";
  if (a.arcana === "major") return "major-minor";
  if (b.arcana === "major") return "minor-major";
  return "minor-minor";
}

function energyKey(a: EnergyKind, b: EnergyKind): string {
  const [x, y] = [a, b].sort();
  return `${x}+${y}`;
}

function sharedThemes(a: CardSemanticProfile, b: CardSemanticProfile): string[] {
  const setB = new Set(b.themes);
  return a.themes.filter((t) => setB.has(t));
}

function sameSuit(
  a: { suit: string | null },
  b: { suit: string | null },
): boolean {
  return Boolean(a.suit && b.suit && a.suit === b.suit);
}

function poleAxis(pO: Orientation, nO: Orientation): PoleAxis {
  const lateral =
    (pO === "transverse" && nO === "conjugate") ||
    (pO === "conjugate" && nO === "transverse");
  return lateral ? "lateral" : "vertical";
}

function excerptDetail(text: string, maxLen = 240): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSentence = cut.lastIndexOf(". ");
  if (lastSentence >= 100) return cut.slice(0, lastSentence + 1);
  return `${cut.trimEnd()}…`;
}

function rankPairNote(
  a: { arcana: string; rank?: string | number; suit: string | null },
  b: { arcana: string; rank?: string | number; suit: string | null },
): string {
  if (a.arcana !== "minor" || b.arcana !== "minor") return "";
  if (String(a.rank) === String(b.rank) && a.suit !== b.suit) {
    return "Same rank across suits—the same station in life (page, ten, ace…) spoken in two elements; compare how fire vs water (etc.) colors the same lesson.";
  }
  return "";
}

const ARCHETYPE_LABEL: Record<SynthesisArchetype, string> = {
  harmonic_field: "Harmonic field",
  productive_tension: "Productive tension",
  rupture_line: "Rupture line",
  threshold_gate: "Threshold gate",
  emblem_story: "Emblem story",
  pole_inversion: "Pole inversion",
  lateral_braid: "Lateral braid",
};

const RELATION_LABEL: Record<ThemeRelation, string> = {
  resonance: "Theme resonance",
  friction: "Theme friction",
  crosscurrent: "Crosscurrent",
  catalysis: "Catalysis",
  veil: "Veil",
  grounding: "Grounding",
};

const ROLE_PAIR_NOTE: Record<string, string> = {
  "initiator+stabilizer": "One card starts the wave; the other gives it form and limit.",
  "initiator+revealer": "Motion meets mystery—action uncovers what was hidden.",
  "initiator+transformer": "A beginning triggers change; the old shape cannot survive unchanged.",
  "initiator+challenger": "Two engines of change—cooperation or collision depends on aim.",
  "initiator+healer": "Spark meets care—passion needs tending or it burns out.",
  "initiator+connector": "Opening meets relation—bonds form or bifurcate quickly.",
  "stabilizer+revealer": "Structure meets the unseen—rules confront what was omitted.",
  "stabilizer+transformer": "Order meets ending—foundations tested by necessary shift.",
  "stabilizer+challenger": "Wall meets hammer—defense and assault define the field.",
  "stabilizer+healer": "Frame meets balm—security and repair negotiate.",
  "stabilizer+connector": "Law meets link—contracts, family, or alliance.",
  "revealer+transformer": "Truth meets release—seeing clearly costs the old form.",
  "revealer+challenger": "Exposure meets conflict—what was hidden becomes fought over.",
  "revealer+healer": "Depth meets compassion—pain witnessed can mend.",
  "revealer+connector": "Secret meets bond—intimacy complicated by knowledge.",
  "transformer+challenger": "Ending meets fight—change resisted or accelerated.",
  "transformer+healer": "Death meets balm—grief and renewal intertwined.",
  "transformer+connector": "Change meets bond—relationships reshape or break.",
  "challenger+healer": "Friction meets repair—hurt and remedy in one field.",
  "challenger+connector": "Strife in relation—rivalry or honest debate.",
  "healer+connector": "Care meets link—nurture through union or dependency.",
  "connector+connector": "Two bonds interact—merge, triangle, or mirrored desire.",
};

function rolePairNote(a: CardSemanticProfile, b: CardSemanticProfile): string {
  const key = [a.role, b.role].sort().join("+");
  return ROLE_PAIR_NOTE[key] ?? "Their roles differ—notice who initiates, who stabilizes, who reveals.";
}

function themeRelation(
  shared: string[],
  a: CardSemanticProfile,
  b: CardSemanticProfile,
): ThemeRelation {
  if (shared.length >= 2) return "resonance";
  if (shared.length === 1) return "catalysis";

  const disruptive = (e: EnergyKind) =>
    e === "disruptive" || e === "binding";
  if (disruptive(a.energy) || disruptive(b.energy)) {
    if (a.energy === "liminal" || b.energy === "liminal") return "veil";
    return "friction";
  }
  if (a.energy === "liminal" && b.energy === "liminal") return "veil";
  if (a.role === "stabilizer" || b.role === "stabilizer") return "grounding";
  if (a.role === "challenger" || b.role === "challenger") return "friction";
  return "crosscurrent";
}

/** Decision tree → synthesis archetype */
function selectArchetype(
  pair: ArcanaPair,
  relation: ThemeRelation,
  primaryO: Orientation,
  partnerO: Orientation,
  a: CardSemanticProfile,
  b: CardSemanticProfile,
): SynthesisArchetype {
  const verticalPair =
    (primaryO === "upright" && partnerO === "reversed") ||
    (primaryO === "reversed" && partnerO === "upright");
  const lateralPair =
    (primaryO === "transverse" && partnerO === "conjugate") ||
    (primaryO === "conjugate" && partnerO === "transverse");

  if (lateralPair) return "lateral_braid";
  if (verticalPair && relation === "friction") return "pole_inversion";
  if (verticalPair) return "pole_inversion";
  if (pair === "major-minor" || pair === "minor-major") return "emblem_story";
  if (a.energy === "liminal" && b.energy === "liminal") return "threshold_gate";
  if (relation === "resonance") return "harmonic_field";
  if (relation === "friction" || relation === "crosscurrent")
    return "productive_tension";
  if (a.energy === "disruptive" || b.energy === "disruptive")
    return "rupture_line";
  return "harmonic_field";
}

interface StitchContext {
  pName: string;
  nName: string;
  pO: Orientation;
  nO: Orientation;
  sharedWord: string;
  contrastWord: string;
  pContrib: string;
  nContrib: string;
  pStitch: string;
  nStitch: string;
  pSummary: string;
  nSummary: string;
  pDetailExcerpt: string;
  nDetailExcerpt: string;
  relation: ThemeRelation;
  archetype: SynthesisArchetype;
  roleNote: string;
  suitNote: string;
  rankNote: string;
  frameNote: string;
  pairSeed: number;
  pVoice: string;
  nVoice: string;
}

function uniqueThemes(
  a: CardSemanticProfile,
  b: CardSemanticProfile,
): { onlyA: string[]; onlyB: string[] } {
  const setB = new Set(b.themes);
  const setA = new Set(a.themes);
  return {
    onlyA: a.themes.filter((t) => !setB.has(t)).slice(0, 2),
    onlyB: b.themes.filter((t) => !setA.has(t)).slice(0, 2),
  };
}

function buildInterference(ctx: StitchContext): string {
  return buildInterferenceVariant(
    ctx.archetype,
    ctx.relation,
    ctx.sharedWord,
    ctx.pairSeed,
  );
}

function buildSections(
  ctx: StitchContext,
  chemistry: string,
  energyNote: string,
): DualSynthesisSection[] {
  const contrast =
    ctx.contrastWord.length > 0
      ? ` Where they do not overlap, watch ${ctx.contrastWord}—the friction often lives in the gap between keywords.`
      : "";

  return [
    { label: "Entanglement frame", body: ctx.frameNote },
    {
      label: "Arcana & roles",
      body: [chemistry, ctx.suitNote, ctx.rankNote, ctx.roleNote]
        .filter(Boolean)
        .join(" "),
    },
    {
      label: "Opposite poles",
      body: buildPoleNarrative(ctx.pO, ctx.nO, ctx.pairSeed),
    },
    {
      label: "Energies in the field",
      body: `${energyNote}${contrast}`,
    },
    {
      label: `Primary voice (${ctx.pO})`,
      body: `${ctx.pSummary} ${ctx.pDetailExcerpt}`.trim(),
    },
    {
      label: `Partner voice (${ctx.nO})`,
      body: `${ctx.nSummary} ${ctx.nDetailExcerpt}`.trim(),
    },
    { label: "How they stitch", body: `${ctx.pVoice} ${ctx.nVoice}` },
    { label: "Interference pattern", body: buildInterference(ctx) },
  ];
}

function buildDetailFromSections(sections: DualSynthesisSection[]): string {
  return sections.map((s) => s.body).join("\n\n");
}

function buildGuidance(
  ctx: StitchContext,
  pGuide: string,
  nGuide: string,
): string {
  const template = pickVariant(
    ctx.pairSeed,
    GUIDANCE_VARIANTS[ctx.archetype],
    19,
  );
  return template
    .replace("{pGuide}", pGuide)
    .replace("{nGuide}", nGuide);
}

export function buildDualReadingSynthesis(input: DualReadingInput): ReadingText {
  return buildDualReadingResult(input).reading;
}

export interface DualReadingResult {
  reading: ReadingText;
  meta: DualSynthesisMeta;
}

export function buildDualReadingResult(
  input: DualReadingInput,
): DualReadingResult {
  const primaryText = getReading(
    input.primaryCard.id,
    input.primaryOrientation,
  );
  const partnerText = getReading(
    input.partnerCard.id,
    input.partnerOrientation,
  );
  if (!primaryText || !partnerText) {
    const fallback = {
      summary: "Dual synthesis unavailable for these cards.",
      detail: "Reading data is missing for one or both cards.",
      guidance: "Draw again or choose a different pair.",
    };
    return {
      reading: fallback,
      meta: {
        synthesisArchetype: "harmonic_field",
        themeRelation: "crosscurrent",
        sharedThemes: [],
        primaryOnlyThemes: [],
        partnerOnlyThemes: [],
        primaryEnergy: "liminal",
        partnerEnergy: "liminal",
        arcanaPair: "major-major",
        poleAxis: "vertical",
        sections: [],
      },
    };
  }

  const semA = getCardSemantics(input.primaryCard);
  const semB = getCardSemantics(input.partnerCard);
  const shared = sharedThemes(semA, semB);
  const relation = themeRelation(shared, semA, semB);
  const pair = arcanaPair(input.primaryCard, input.partnerCard);
  const archetype = selectArchetype(
    pair,
    relation,
    input.primaryOrientation,
    input.partnerOrientation,
    semA,
    semB,
  );
  const energyNote =
    ENERGY_PAIR_NARRATIVE[energyKey(semA.energy, semB.energy)] ??
    "Their energies meet in uncommon proportion—notice which card sets tempo and which sets tone.";

  const { onlyA, onlyB } = uniqueThemes(semA, semB);
  const contrastWord = [
    onlyA.length ? `${onlyA.join(" and ")} (primary)` : "",
    onlyB.length ? `${onlyB.join(" and ")} (partner)` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const suitNote = sameSuit(input.primaryCard, input.partnerCard)
    ? "Same suit doubles the element—this is not abstract myth only; the same weather system runs through both cards."
    : input.primaryCard.arcana === "minor" && input.partnerCard.arcana === "minor"
      ? "Different suits braid elements—fire with water, air with earth—so the entanglement is cross-realm, not single-domain."
      : "";

  const seed = pairSeed(
    input.primaryCard.id,
    input.partnerCard.id,
    input.primaryOrientation,
  );

  const pVoice = buildCardVoiceLine(
    input.primaryCard,
    semA,
    input.partnerCard.quantumName,
    seed,
    2,
    "primary",
  );
  const nVoice = buildCardVoiceLine(
    input.partnerCard,
    semB,
    input.primaryCard.quantumName,
    seed,
    4,
    "partner",
  );

  const ctx: StitchContext = {
    pName: input.primaryCard.quantumName,
    nName: input.partnerCard.quantumName,
    pO: input.primaryOrientation,
    nO: input.partnerOrientation,
    sharedWord: shared.slice(0, 2).join(" and ") || "",
    contrastWord,
    pContrib: semA.contributes,
    nContrib: semB.contributes,
    pStitch: semA.stitch,
    nStitch: semB.stitch,
    pSummary: primaryText.summary,
    nSummary: partnerText.summary,
    pDetailExcerpt: excerptDetail(primaryText.detail),
    nDetailExcerpt: excerptDetail(partnerText.detail),
    relation,
    archetype,
    roleNote: rolePairNote(semA, semB),
    suitNote,
    rankNote: rankPairNote(input.primaryCard, input.partnerCard),
    frameNote: pickVariant(
      seed,
      FRAME_VARIANTS[input.primaryOrientation],
      3,
    ),
    pairSeed: seed,
    pVoice,
    nVoice,
  };

  const chemistry = pickVariant(seed, ARCANA_CHEMISTRY[pair], 9);
  const sections = buildSections(ctx, chemistry, energyNote);

  const voiceCtx = {
    pName: ctx.pName,
    nName: ctx.nName,
    shared: ctx.sharedWord,
    pContrib: ctx.pContrib,
    nContrib: ctx.nContrib,
    pStitch: ctx.pStitch,
    nStitch: ctx.nStitch,
    onlyP: onlyA.join(" and "),
    onlyN: onlyB.join(" and "),
    pO: ctx.pO,
    nO: ctx.nO,
  };

  return {
    reading: {
      summary: buildDualSummary(archetype, voiceCtx, pVoice, nVoice, seed),
      detail: buildDetailFromSections(sections),
      guidance: buildGuidance(ctx, primaryText.guidance, partnerText.guidance),
    },
    meta: {
      synthesisArchetype: archetype,
      themeRelation: relation,
      sharedThemes: shared,
      primaryOnlyThemes: onlyA,
      partnerOnlyThemes: onlyB,
      primaryEnergy: semA.energy,
      partnerEnergy: semB.energy,
      arcanaPair: pair,
      poleAxis: poleAxis(input.primaryOrientation, input.partnerOrientation),
      sections,
    },
  };
}

/** Human-readable labels for UI chips */
export function synthesisArchetypeLabel(a: SynthesisArchetype): string {
  return ARCHETYPE_LABEL[a];
}

export function themeRelationLabel(r: ThemeRelation): string {
  return RELATION_LABEL[r];
}
