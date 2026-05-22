import type { Orientation } from "../../types/deck";
import type { TarotCard } from "../../types/deck";
import type { CardSemanticProfile } from "./cardSemantics";

export type SynthesisArchetype =
  | "harmonic_field"
  | "productive_tension"
  | "rupture_line"
  | "threshold_gate"
  | "emblem_story"
  | "pole_inversion"
  | "lateral_braid";

export type ThemeRelation =
  | "resonance"
  | "friction"
  | "crosscurrent"
  | "catalysis"
  | "veil"
  | "grounding";

export function pairSeed(
  primaryId: string,
  partnerId: string,
  primaryO: Orientation,
): number {
  const cards = [primaryId, partnerId].sort().join("|");
  const s = `${cards}|${primaryO}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickIndex(seed: number, count: number, salt = 0): number {
  if (count <= 0) return 0;
  return ((seed + salt * 9973) % count + count) % count;
}

export function pickVariant<T>(seed: number, variants: T[], salt = 0): T {
  return variants[pickIndex(seed, variants.length, salt)]!;
}

type VoiceCtx = {
  pName: string;
  nName: string;
  shared: string;
  pContrib: string;
  nContrib: string;
  pStitch: string;
  nStitch: string;
  onlyP: string;
  onlyN: string;
};

export function buildCardVoiceLine(
  card: TarotCard,
  sem: CardSemanticProfile,
  otherName: string,
  seed: number,
  salt: number,
  role: "primary" | "partner",
): string {
  const { line } = pickMajorVoice(card.id, role, seed, salt);
  if (line) {
    return line
      .replaceAll("{p}", role === "primary" ? card.quantumName : otherName)
      .replaceAll("{n}", role === "partner" ? card.quantumName : otherName)
      .replaceAll("{other}", otherName);
  }

  const suitBit =
    card.arcana === "minor" && card.suit
      ? ` in ${card.suit}`
      : "";
  const rankBit =
    card.arcana === "minor" && card.rank !== undefined
      ? ` (${String(card.rank)})`
      : "";

  const templates = [
    `${card.quantumName}${suitBit}${rankBit} ${sem.stitch} the link with ${otherName}—${sem.contributes}.`,
    `Through ${otherName}, ${card.quantumName} ${sem.stitch} what was solo: ${sem.contributes}.`,
    `${otherName} meets ${card.quantumName}${suitBit}; this pip ${sem.stitch} the field (${sem.contributes}).`,
    `Where ${otherName} stands, ${card.quantumName} ${sem.stitch} the crossing—${sem.contributes}.`,
  ];
  return pickVariant(seed, templates, salt + (role === "partner" ? 11 : 3));
}

function pickMajorVoice(
  cardId: string,
  role: "primary" | "partner",
  seed: number,
  salt: number,
): { line: string | null } {
  const bank = MAJOR_PAIR_VOICE[cardId];
  if (!bank) return { line: null };
  const lines = role === "primary" ? bank.asPrimary : bank.asPartner;
  return { line: pickVariant(seed, lines, salt) };
}

const MAJOR_PAIR_VOICE: Record<
  string,
  { asPrimary: string[]; asPartner: string[] }
> = {
  "major-00": {
    asPrimary: [
      "{p} treats {n} as permission—the leap is not escape from {n}'s law but a fresher entry.",
      "Before {n} hardens the path, {p} asks you to step as beginner where pride would refuse.",
    ],
    asPartner: [
      "{n} answers {p}'s innocence with consequence—wonder meets the cost of motion.",
      "What {p} left open, {n} names: the ground still exists after the jump.",
    ],
  },
  "major-01": {
    asPrimary: [
      "{p} concentrates will toward {n}—manifestation is aimed, not scattered.",
      "{p} says the tool is ready; {n} shows whether the will is clean.",
    ],
    asPartner: [
      "{n} tests whether {p}'s focus is mastery or control dressed as magic.",
      "Skill meets {p}'s intent through {n}—power without ethics misfires here.",
    ],
  },
  "major-02": {
    asPrimary: [
      "{p} withholds the full answer from {n}—the mystery stays veiled until you stop prying.",
      "Intuition between {p} and {n} is tidal; speak less, listen in symbols.",
    ],
    asPartner: [
      "{n} presses on {p}'s silence—outer noise demands inner knowing.",
      "The veil {p} kept lifts at {n}'s pole: not all truth is for public timing.",
    ],
  },
  "major-03": {
    asPrimary: [
      "{p} fertilizes what {n} carries—abundance wants a body, not only a vision.",
      "Creation between {p} and {n} is sensual and practical: grow it, don't only imagine.",
    ],
    asPartner: [
      "{n} ripens or exposes {p}'s nurture—care can smother or heal.",
      "What {p} mothers, {n} grades: is this devotion or dependency?",
    ],
  },
  "major-04": {
    asPrimary: [
      "{p} structures the field for {n}—order is offered, not imposed without cause.",
      "Authority in {p} meets {n}: build the throne you can actually sit in.",
    ],
    asPartner: [
      "{n} challenges {p}'s rule—law must justify itself or crack.",
      "The empire {p} built faces {n}'s audit: discipline or rigidity?",
    ],
  },
  "major-05": {
    asPrimary: [
      "{p} initiates {n} into tradition—mentor energy asks consent, not capture.",
      "Belief links {p} and {n}; question the teacher, keep the teaching.",
    ],
    asPartner: [
      "{n} loosens {p}'s dogma—faith tested becomes faith owned.",
      "What {p} consecrated, {n} re-examines: belonging or compliance?",
    ],
  },
  "major-06": {
    asPrimary: [
      "{p} names the bond with {n}—choice is the magic, not fate alone.",
      "Desire between {p} and {n} is a fork: align values before bodies.",
    ],
    asPartner: [
      "{n} mirrors {p}'s values—partnership reveals what you already chose.",
      "Union under {p} meets {n}'s honesty: love or habit?",
    ],
  },
  "major-07": {
    asPrimary: [
      "{p} drives toward {n}—victory needs direction, not only speed.",
      "The chariot between {p} and {n} asks: who holds the reins, fear or aim?",
    ],
    asPartner: [
      "{n} steers or stalls {p}'s campaign—momentum meets resistance with meaning.",
      "What {p} charged at, {n} refines: conquer the right thing.",
    ],
  },
  "major-08": {
    asPrimary: [
      "{p} gentles force in {n}'s presence—courage without cruelty.",
      "Inner lion meets {n}: tame the impulse before it chooses for you.",
    ],
    asPartner: [
      "{n} tests {p}'s compassion—strength proves itself in restraint.",
      "Raw nerve {p} carried softens or snaps at {n}'s pole.",
    ],
  },
  "major-09": {
    asPrimary: [
      "{p} lights the lantern for {n}—solitude is counsel, not punishment.",
      "Withdrawal between {p} and {n} yields a truth too quiet for crowds.",
    ],
    asPartner: [
      "{n} ends {p}'s isolation—wisdom returns to the marketplace when ready.",
      "The hermit path {p} walked meets {n}: share the finding or hoard it.",
    ],
  },
  "major-10": {
    asPrimary: [
      "{p} turns the wheel over {n}—cycles are visible; panic is optional.",
      "Fortune links {p} and {n}: luck is posture as much as fate.",
    ],
    asPartner: [
      "{n} lifts or drops {p}'s season—change is not moral, it is timed.",
      "What {p} rode upward, {n} tempers: hubris at the crest.",
    ],
  },
  "major-11": {
    asPrimary: [
      "{p} weighs {n} without sentiment—truth is the kindness here.",
      "Scales between {p} and {n}: account for what you omitted.",
    ],
    asPartner: [
      "{n} delivers verdict on {p}'s story—consequence arrives on schedule.",
      "Mercy and severity meet in {n}'s answer to {p}'s books.",
    ],
  },
  "major-12": {
    asPrimary: [
      "{p} suspends urgency for {n}—surrender is strategy, not defeat.",
      "The pause {p} enforces lets {n} show what was upside down all along.",
    ],
    asPartner: [
      "{n} releases {p}'s grip—what you release may finally move.",
      "Sacrifice {p} offered finds its meaning through {n}.",
    ],
  },
  "major-13": {
    asPrimary: [
      "{p} clears the old floor for {n}—endings are compost, not erasure.",
      "Transformation between {p} and {n} is surgical: let the dead branch fall.",
    ],
    asPartner: [
      "{n} finishes what {p} began—grief and renewal share one breath.",
      "What {p} ended, {n} anoints: the new shape needs its name.",
    ],
  },
  "major-14": {
    asPrimary: [
      "{p} tempers extremes in {n}—patience is alchemy, not delay.",
      "Measure flows from {p} to {n}: blend before you broadcast.",
    ],
    asPartner: [
      "{n} stabilizes {p}'s swing—integration beats oscillation.",
      "The experiment {p} started finds proportion in {n}.",
    ],
  },
  "major-15": {
    asPrimary: [
      "{p} names the bond that hooks {n}—desire is data, not doom.",
      "Shadow between {p} and {n}: what you want owns you until seen.",
    ],
    asPartner: [
      "{n} exposes {p}'s tether—freedom starts where honesty hurts.",
      "The chain {p} denied rattles at {n}'s pole.",
    ],
  },
  "major-16": {
    asPrimary: [
      "{p} strikes the false tower in {n}—collapse is clarity.",
      "Lightning between {p} and {n}: built on lie, built to fall.",
    ],
    asPartner: [
      "{n} completes {p}'s break—ruins are the new foundation.",
      "What {p} shattered, {n} forbids you to rebuild the same way.",
    ],
  },
  "major-17": {
    asPrimary: [
      "{p} pours hope toward {n}—repair is slow light after flood.",
      "Healing between {p} and {n} is honest, not performative.",
    ],
    asPartner: [
      "{n} answers {p}'s wound with constellation—you are not alone in the dark.",
      "Quiet renewal {p} began brightens at {n}'s pole.",
    ],
  },
  "major-18": {
    asPrimary: [
      "{p} floods the path to {n}—dream and fear share a shoreline.",
      "Illusion between {p} and {n}: test what you think you saw.",
    ],
    asPartner: [
      "{n} clarifies or deepens {p}'s fog—intuition needs grounding.",
      "The tide {p} raised recedes at {n}: name the real from the projected.",
    ],
  },
  "major-19": {
    asPrimary: [
      "{p} shines success on {n}—joy is visible, shadow still exists.",
      "Vitality links {p} and {n}: celebrate without going blind.",
    ],
    asPartner: [
      "{n} warms what {p} grew—harvest meets honest pride.",
      "Radiance {p} carried finds shade and gift in {n}.",
    ],
  },
  "major-20": {
    asPrimary: [
      "{p} calls {n} to account—judgment is awakening, not punishment theater.",
      "The trumpet between {p} and {n}: answer your own name.",
    ],
    asPartner: [
      "{n} resurrects {p}'s purpose—old self meets new vow.",
      "What {p} weighed, {n} releases into action.",
    ],
  },
  "major-21": {
    asPrimary: [
      "{p} crowns the cycle with {n}—completion is world-sized, not private only.",
      "Wholeness between {p} and {n}: the dance ends in integration.",
    ],
    asPartner: [
      "{n} seals {p}'s world—travel returns home changed.",
      "The world {p} envisioned lands in {n}'s body.",
    ],
  },
};

export function buildDualSummary(
  archetype: SynthesisArchetype,
  ctx: VoiceCtx & { pO: Orientation; nO: Orientation },
  pVoice: string,
  nVoice: string,
  seed: number,
): string {
  const opener = pickVariant(seed, SUMMARY_OPENERS[archetype], 0)(ctx);
  const bridge = pickVariant(seed, SUMMARY_BRIDGES, 7)(ctx);
  return [opener, pVoice, nVoice, bridge].join(" ").replace(/\s+/g, " ").trim();
}

export const SUMMARY_OPENERS: Record<
  SynthesisArchetype,
  ((c: VoiceCtx & { pO: Orientation; nO: Orientation }) => string)[]
> = {
  harmonic_field: [
    (c) =>
      `Between ${c.pName} and ${c.nName}, ${c.shared || "a shared current"} rings louder than either solo reading.`,
    (c) =>
      `${c.pName} and ${c.nName} hum on the same frequency${c.shared ? ` (${c.shared})` : ""}—`,
    (c) =>
      `Resonance links ${c.pName} to ${c.nName}; the pair is one chord, two strings.`,
  ],
  productive_tension: [
    (c) =>
      `${c.pName} (${c.pO}) and ${c.nName} (${c.nO}) pull against each other without canceling—`,
    (c) =>
      `Tension between ${c.pName} and ${c.nName} is productive, not petty—`,
    (c) =>
      `${c.pName} and ${c.nName} argue in opposite poles until a third truth appears—`,
  ],
  rupture_line: [
    (c) =>
      `${c.pName} and ${c.nName} mark a rupture—what held before this pairing may not hold after.`,
    (c) =>
      `A break line runs through ${c.pName} and ${c.nName}—`,
    (c) =>
      `${c.pName} stresses the structure ${c.nName} tests—`,
  ],
  threshold_gate: [
    (c) =>
      `${c.pName} and ${c.nName} guard a threshold together—passage is not denied, only unripe.`,
    (c) =>
      `Two liminal gates (${c.pName}, ${c.nName}) face opposite poles—`,
    (c) =>
      `The doorway between ${c.pName} and ${c.nName} stays half-open—`,
  ],
  emblem_story: [
    (c) =>
      `${c.pName} sets the myth; ${c.nName} (${c.nO}) walks it on your street—`,
    (c) =>
      `Archetype ${c.pName} meets circumstance ${c.nName}—`,
    (c) =>
      `${c.pName} names the law; ${c.nName} shows the receipt—`,
  ],
  pole_inversion: [
    (c) =>
      `${c.pName} (${c.pO}) inverts through ${c.nName} (${c.nO})—`,
    (c) =>
      `The mirror between ${c.pName} and ${c.nName} is live voltage—`,
    (c) =>
      `${c.pName} faces its opposite pole in ${c.nName}—`,
  ],
  lateral_braid: [
    (c) =>
      `${c.pName} (${c.pO}) and ${c.nName} (${c.nO}) cross the same path from two sideways angles—`,
    (c) =>
      `Lateral braid: ${c.pName} and ${c.nName} name two faces of one obstacle—`,
    (c) =>
      `${c.pName} and ${c.nName} do not only invert—they cross—`,
  ],
};

export const SUMMARY_BRIDGES: ((
  c: VoiceCtx & { pO: Orientation; nO: Orientation },
) => string)[] = [
  (c) =>
    c.onlyP && c.onlyN
      ? `watch ${c.onlyP} meet ${c.onlyN} in the gap.`
      : "read the gap between them as carefully as the overlap.",
  (c) =>
    c.shared
      ? `the overlap on ${c.shared} is the lever; the rest is friction.`
      : "no shared keyword—listen for the friction in what each insists on alone.",
  (c) =>
    `${c.pName} ${c.pStitch} what ${c.nName} ${c.nStitch}—one field, two verbs.`,
];

export function buildPoleNarrative(
  pO: Orientation,
  nO: Orientation,
  seed: number,
): string {
  const lateral =
    (pO === "transverse" && nO === "conjugate") ||
    (pO === "conjugate" && nO === "transverse");
  const bank = lateral ? LATERAL_POLE_LINES : VERTICAL_POLE_LINES;
  return pickVariant(seed, bank, 5);
}

const VERTICAL_POLE_LINES = [
  "On the vertical axis, what the first card declared outward, the partner tends inward—and vice versa. The mirror has voltage: inner and outer trade places until you integrate both.",
  "Direct and inverted poles face each other: public story versus private motive. Neither card cancels the other; they complete the sentence.",
  "Vertically, the entanglement is reflection with teeth—what you show and what you hide negotiate through the partner collapse.",
  "The upright/reversed braid is psychological optics: the partner names what the primary could not face while facing forward.",
];

const LATERAL_POLE_LINES = [
  "On the lateral axis, the first card marks one crossing of your path; the partner marks the other face—ambient fog becomes a named obstacle.",
  "Transverse and conjugate are two sideways questions about the same block—answer both or you will misread pause as refusal.",
  "Laterally, the situation is crossed, not flipped: the partner does not mirror the first card, it intersects it.",
  "The braid runs across your timeline—timing, detour, and second crossing—not up/down morality alone.",
];

export function buildInterferenceVariant(
  archetype: SynthesisArchetype,
  relation: ThemeRelation,
  sharedWord: string,
  seed: number,
): string {
  const rel = RELATION_VERB[relation];
  const shared = sharedWord.length > 0 ? `around ${sharedWord}` : "without a shared keyword";
  const bank =
    INTERFERENCE_BY_ARCHETYPE[archetype] ?? INTERFERENCE_BY_ARCHETYPE.harmonic_field;
  const line = pickVariant(seed, bank, 13);
  return line.replace("{rel}", rel).replace("{shared}", shared);
}

const RELATION_VERB: Record<ThemeRelation, string> = {
  resonance: "Themes converge",
  friction: "Themes pull",
  crosscurrent: "Themes cross",
  catalysis: "One theme catalyzes",
  veil: "One theme veils",
  grounding: "One theme grounds",
};

const INTERFERENCE_BY_ARCHETYPE: Record<SynthesisArchetype, string[]> = {
  harmonic_field: [
    "{rel} {shared}—trust the chord, but do not erase the dissonance that gives it shape.",
    "{rel} {shared}—harmony here is tuned tension, not sameness.",
    "{rel} {shared}—amplify what repeats once; do not double-book the same lesson.",
  ],
  productive_tension: [
    "{rel} {shared}—the stretch between them is the reading; compromise too early lies.",
    "{rel} {shared}—hold both cards' insistence until a third stance emerges.",
    "{rel} {shared}—argument is data: name what each refuses to lose.",
  ],
  rupture_line: [
    "{rel} {shared}—separate what must end from what can be reforged.",
    "{rel} {shared}—structural honesty beats polite blending.",
    "{rel} {shared}—the break is information, not failure.",
  ],
  threshold_gate: [
    "{rel} {shared}—stay in the question; forced clarity collapses useful ambiguity.",
    "{rel} {shared}—the gate opens when you stop kicking it.",
    "{rel} {shared}—liminal time is not wasted time.",
  ],
  emblem_story: [
    "{rel} {shared}—the small detail is the emblem the major forces you to respect.",
    "{rel} {shared}—myth without daily proof is decoration.",
    "{rel} {shared}—make the archetype walk in one concrete act.",
  ],
  pole_inversion: [
    "{rel} {shared}—the inverted pole says what the first could not while standing upright.",
    "{rel} {shared}—inner and outer swap jobs; integrate before you judge.",
    "{rel} {shared}—what you called 'other' may be your pole turned.",
  ],
  lateral_braid: [
    "{rel} {shared}—read both crossings; neither alone is the full obstacle.",
    "{rel} {shared}—sideways pressure is not 'more reversed'—it is a second question.",
    "{rel} {shared}—map detour and deadline together.",
  ],
};

export const FRAME_VARIANTS: Record<Orientation, string[]> = {
  upright: [
    "The first collapse landed on the direct pole; the partner must answer inverted vertically—outer declaration met by inner reckoning.",
    "Direct pole first: what you show the world meets what the partner hides or delays—not contradiction, completion.",
    "Upright lead means public truth; the partner pole privatizes the lesson until you integrate both.",
  ],
  reversed: [
    "The first collapse landed inverted; the partner answers upright—shadow met by plain naming.",
    "Inner reversal first: the partner forces outward honesty about what you circled privately.",
    "Reversed lead means the private story spoke first; the partner demands direct expression.",
  ],
  transverse: [
    "The first collapse crossed laterally (transverse); the partner must answer conjugate—the same archetype from the other sideways angle.",
    "Transverse first: one crossing of the path is named; the partner names the other face of that crossing.",
    "Lateral lead (transverse): ambiguity becomes specific through the partner's conjugate reply.",
  ],
  conjugate: [
    "The first collapse used the conjugate face; the partner answers transverse—outside pressure and inside crossing trade places.",
    "Conjugate first: external pressure was named; the partner shows the crossing you felt internally.",
    "Lateral lead (conjugate): do not read the partner as 'more reversed'—it is the other sideways question.",
  ],
};

export const GUIDANCE_VARIANTS: Record<SynthesisArchetype, string[]> = {
  harmonic_field: [
    "Treat both cards as one chord—act once on what repeats. Primary: {pGuide} Partner pole refines: {nGuide}",
    "Name the shared theme and move once. {pGuide} Let inversion polish, not revoke: {nGuide}",
    "Harmony is not uniformity. {pGuide} {nGuide} Integrate the overlap before you fix the difference.",
  ],
  productive_tension: [
    "Do not resolve early. Primary: {pGuide} Partner: {nGuide} Wait for the third position.",
    "Hold the stretch. {pGuide} {nGuide} The tension is the teacher.",
    "Both insist—good. {pGuide} {nGuide} Name what each protects.",
  ],
  rupture_line: [
    "Stabilize, then rebuild. {pGuide} {nGuide} Cut what is rotten; keep the root.",
    "Separate endings from beginnings. {pGuide} Partner: {nGuide}",
    "Honesty before comfort. {pGuide} {nGuide}",
  ],
  threshold_gate: [
    "Honor the gate—no forcing. {pGuide} {nGuide} Revisit after sleep.",
    "Stay liminal on purpose. {pGuide} {nGuide}",
    "Let the passage ripen. {pGuide} Partner adds: {nGuide}",
  ],
  emblem_story: [
    "Live the myth in small proof. {pGuide} Daily partner: {nGuide}",
    "One concrete act carries the archetype. {pGuide} {nGuide}",
    "Street-level truth. {pGuide} {nGuide}",
  ],
  pole_inversion: [
    "Integrate the mirror. Outer: {pGuide} Inner/inverted: {nGuide}",
    "Swap perspectives deliberately. {pGuide} {nGuide}",
    "What you judged other may be your pole turned. {pGuide} {nGuide}",
  ],
  lateral_braid: [
    "Map both crossings. {pGuide} Then: {nGuide}",
    "Sideways obstacles need sideways answers. {pGuide} {nGuide}",
    "Neither crossing alone is complete. {pGuide} {nGuide}",
  ],
};
