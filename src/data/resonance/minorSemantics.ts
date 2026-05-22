import type { CardSemanticProfile } from "./cardSemantics";

/** Per-pip semantics (Biddy/RW aligned) — overrides suit+rank defaults. */
type MinorProfile = Pick<
  CardSemanticProfile,
  "themes" | "role" | "contributes" | "stitch"
>;

function pip(
  suit: string,
  rank: string,
  p: MinorProfile,
): [string, MinorProfile] {
  const id =
    rank === "ace"
      ? `${suit}-ace`
      : ["page", "knight", "queen", "king"].includes(rank)
        ? `${suit}-${rank}`
        : `${suit}-${rank.padStart(2, "0")}`;
  return [id, p];
}

const WANDS: MinorProfile[] = [
  { themes: ["spark", "inspiration", "risk"], role: "initiator", contributes: "raw creative ignition", stitch: "ignites" },
  { themes: ["plan", "horizon", "choice"], role: "connector", contributes: "mapped ambition and future sight", stitch: "points toward" },
  { themes: ["expansion", "trade", "foresight"], role: "initiator", contributes: "enterprise stretching outward", stitch: "widens" },
  { themes: ["celebration", "home", "harmony"], role: "healer", contributes: "communal joy and belonging", stitch: "welcomes" },
  { themes: ["strife", "rivalry", "heat"], role: "challenger", contributes: "open contest and friction", stitch: "agitates" },
  { themes: ["victory", "recognition", "pride"], role: "challenger", contributes: "visible triumph and confidence", stitch: "crowns" },
  { themes: ["defense", "perseverance", "stand"], role: "challenger", contributes: "held ground under challenge", stitch: "defends" },
  { themes: ["speed", "news", "flight"], role: "challenger", contributes: "swift motion and arriving message", stitch: "accelerates" },
  { themes: ["endurance", "wound", "guard"], role: "revealer", contributes: "fatigue before the last push", stitch: "tests" },
  { themes: ["burden", "duty", "finish"], role: "transformer", contributes: "carried responsibility near completion", stitch: "loads" },
  { themes: ["message", "curiosity", "spark"], role: "initiator", contributes: "restless creative news", stitch: "announces" },
  { themes: ["charge", "passion", "haste"], role: "challenger", contributes: "reckless or noble pursuit", stitch: "rides into" },
  { themes: ["charisma", "warmth", "nerve"], role: "healer", contributes: "magnetic courageous presence", stitch: "radiates through" },
  { themes: ["vision", "command", "honor"], role: "stabilizer", contributes: "entrepreneurial authority", stitch: "governs" },
];

const CUPS: MinorProfile[] = [
  { themes: ["love", "spring", "compassion"], role: "initiator", contributes: "emotional opening and offer", stitch: "overflows into" },
  { themes: ["union", "trust", "mirror"], role: "connector", contributes: "reciprocal bond and attraction", stitch: "pairs with" },
  { themes: ["friendship", "joy", "gathering"], role: "healer", contributes: "celebration and shared feeling", stitch: "mends" },
  { themes: ["apathy", "offer", "pause"], role: "revealer", contributes: "emotional reevaluation", stitch: "cools" },
  { themes: ["grief", "loss", "regret"], role: "transformer", contributes: "mourning what spilled", stitch: "empties" },
  { themes: ["memory", "innocence", "past"], role: "healer", contributes: "nostalgia and kind history", stitch: "returns" },
  { themes: ["fantasy", "choice", "illusion"], role: "revealer", contributes: "many wishes unfiltered", stitch: "dazzles" },
  { themes: ["departure", "search", "depth"], role: "transformer", contributes: "walking away toward meaning", stitch: "leaves" },
  { themes: ["contentment", "wish", "satisfaction"], role: "healer", contributes: "emotional fulfillment", stitch: "fills" },
  { themes: ["family", "harmony", "legacy"], role: "stabilizer", contributes: "domestic bliss or its lack", stitch: "roots" },
  { themes: ["intuition", "dream", "message"], role: "initiator", contributes: "tender psychic news", stitch: "whispers into" },
  { themes: ["romance", "charm", "offer"], role: "connector", contributes: "seductive or artistic pursuit", stitch: "serenades" },
  { themes: ["empathy", "flow", "depth"], role: "healer", contributes: "mature emotional holding", stitch: "holds" },
  { themes: ["calm", "diplomacy", "depth"], role: "stabilizer", contributes: "emotional sovereignty", stitch: "governs" },
];

const SWORDS: MinorProfile[] = [
  { themes: ["clarity", "breakthrough", "truth"], role: "initiator", contributes: "mental breakthrough", stitch: "cuts through" },
  { themes: ["stalemate", "blindfold", "choice"], role: "connector", contributes: "indecision and blocked sight", stitch: "stalls" },
  { themes: ["heartbreak", "sorrow", "pierce"], role: "challenger", contributes: "grief and sharp pain", stitch: "wounds" },
  { themes: ["rest", "truce", "recovery"], role: "stabilizer", contributes: "needed mental pause", stitch: "grounds" },
  { themes: ["defeat", "ego", "conflict"], role: "challenger", contributes: "hollow victory or loss", stitch: "divides" },
  { themes: ["passage", "transition", "leave"], role: "transformer", contributes: "moving toward calmer water", stitch: "ferries" },
  { themes: ["strategy", "stealth", "theft"], role: "revealer", contributes: "clever maneuver or deceit", stitch: "outflanks" },
  { themes: ["fear", "trap", "mind"], role: "revealer", contributes: "self-imposed mental prison", stitch: "binds thought" },
  { themes: ["anxiety", "night", "worry"], role: "revealer", contributes: "insomnia and dread", stitch: "haunts" },
  { themes: ["ending", "betrayal", "rock-bottom"], role: "transformer", contributes: "painful terminus", stitch: "ends" },
  { themes: ["ideas", "curiosity", "speech"], role: "initiator", contributes: "keen intellectual news", stitch: "announces" },
  { themes: ["debate", "speed", "fight"], role: "challenger", contributes: "rapid argumentative force", stitch: "charges" },
  { themes: ["discernment", "boundary", "cool"], role: "stabilizer", contributes: "clear impartial judgment", stitch: "defines" },
  { themes: ["authority", "truth", "law"], role: "stabilizer", contributes: "intellectual command", stitch: "rules" },
];

const PENTACLES: MinorProfile[] = [
  { themes: ["opportunity", "seed", "money"], role: "initiator", contributes: "material opportunity offered", stitch: "plants" },
  { themes: ["balance", "juggle", "change"], role: "connector", contributes: "resource dance and adaptability", stitch: "balances" },
  { themes: ["craft", "team", "build"], role: "initiator", contributes: "skilled collaborative work", stitch: "builds" },
  { themes: ["security", "hoard", "save"], role: "stabilizer", contributes: "conservation and grip", stitch: "holds" },
  { themes: ["poverty", "exclusion", "worry"], role: "challenger", contributes: "scarcity and cold", stitch: "impoverishes" },
  { themes: ["charity", "exchange", "fair"], role: "healer", contributes: "giving and receiving proportion", stitch: "redistributes" },
  { themes: ["investment", "patience", "crop"], role: "revealer", contributes: "long-view labor", stitch: "cultivates" },
  { themes: ["apprentice", "skill", "labor"], role: "initiator", contributes: "repetitive mastery", stitch: "hones" },
  { themes: ["luxury", "self", "garden"], role: "healer", contributes: "self-sufficient comfort", stitch: "enjoys" },
  { themes: ["legacy", "family", "wealth"], role: "stabilizer", contributes: "dynasty and inheritance", stitch: "bequeaths" },
  { themes: ["study", "offer", "practical"], role: "initiator", contributes: "diligent material news", stitch: "offers" },
  { themes: ["routine", "slow", "duty"], role: "challenger", contributes: "methodical grind", stitch: "plows" },
  { themes: ["nurture", "home", "work"], role: "healer", contributes: "practical caregiving", stitch: "tends" },
  { themes: ["wealth", "business", "stability"], role: "stabilizer", contributes: "material empire", stitch: "governs" },
];

const RANKS = [
  "ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "page",
  "knight",
  "queen",
  "king",
] as const;

function buildSuitMap(
  suit: string,
  profiles: MinorProfile[],
): Record<string, MinorProfile> {
  const out: Record<string, MinorProfile> = {};
  RANKS.forEach((rank, i) => {
    const [id, p] = pip(suit, rank, profiles[i]!);
    out[id] = p;
  });
  return out;
}

export const MINOR_SEMANTICS: Record<string, MinorProfile> = {
  ...buildSuitMap("wands", WANDS),
  ...buildSuitMap("cups", CUPS),
  ...buildSuitMap("swords", SWORDS),
  ...buildSuitMap("pentacles", PENTACLES),
};
