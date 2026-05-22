import type { MinorLateralMap } from "./types";

/** Biddy Tarot Suit of Swords keywords + per-pip lateral research. */
export const SWORDS_LATERAL: MinorLateralMap = {
  "swords-ace": {
    biddyUpright: "Breakthroughs, new ideas, mental clarity, success",
    biddyReversed:
      "Inner clarity, re-thinking an idea, clouded judgement",
    transverse: {
      summary:
        "Transverse Singularity—blade of thought raised; cut not yet made.",
      detail:
        "Ace of Swords upright: mental breakthrough (Biddy). Transverse crossing is clarity approaching—idea sharp, verdict uncollapsed.",
      guidance:
        "Draft the truth sentence. Delay public cut until breath steadies.",
    },
    conjugate: {
      summary:
        "Conjugate—clouded judgement crosses the blade.",
      detail:
        "Reversed Ace: re-thinking, clouded judgement (Biddy). The crossing dulls edge—overthinking, or weaponized 'logic' without fairness.",
      guidance:
        "Fact-check one assumption. Speak truth without cruelty.",
    },
  },
  "swords-02": {
    biddyUpright:
      "Difficult decisions, weighing up options, an impasse, avoidance",
    biddyReversed:
      "Indecision, confusion, information overload, stalemate",
    transverse: {
      summary:
        "Transverse Pair—blindfolded balance; choice crossing the mind.",
      detail:
        "Two of Swords upright: impasse, avoidance (Biddy). Transverse is stalemate lateral—you know options exist, sight still bound.",
      guidance:
        "Remove one blindfold input—noise or ally. Weigh with body, not only mind.",
    },
    conjugate: {
      summary:
        "Conjugate—information overload crosses decision.",
      detail:
        "Reversed Two: confusion, overload, stalemate (Biddy). The crossing is analysis paralysis—too much data, no cut.",
      guidance:
        "Limit sources to three. Choose a good-enough path by deadline.",
    },
  },
  "swords-03": {
    biddyUpright:
      "Heartbreak, emotional pain, sorrow, grief, hurt",
    biddyReversed:
      "Negative self-talk, releasing pain, optimism, forgiveness",
    transverse: {
      summary:
        "Transverse Triplet—heart pierced; sorrow crossing the field.",
      detail:
        "Three of Swords upright: grief, hurt (Biddy). Transverse is pain acknowledged—heartbreak present, healing path not yet walked.",
      guidance:
        "Let sorrow move. Do not rush silver linings.",
    },
    conjugate: {
      summary:
        "Conjugate—negative self-talk crosses release.",
      detail:
        "Reversed Three: negative self-talk vs releasing pain (Biddy). The crossing turns blade inward—rumination that reopens wound.",
      guidance:
        "Speak to yourself as to a friend. One forgiveness act proportionate to harm.",
    },
  },
  "swords-04": {
    biddyUpright:
      "Rest, relaxation, meditation, contemplation, recuperation",
    biddyReversed:
      "Exhaustion, burn-out, deep contemplation, stagnation",
    transverse: {
      summary:
        "Transverse Quartet—truce declared; mind still processing.",
      detail:
        "Four of Swords upright: recuperation (Biddy). Transverse crossing is necessary pause—rest real, return not yet scheduled.",
      guidance:
        "Protect sleep. Let thoughts pass without enlistment.",
    },
    conjugate: {
      summary:
        "Conjugate—burn-out or stagnation cross rest.",
      detail:
        "Reversed Four: exhaustion, burn-out, stagnation (Biddy). The crossing is coffin rest—collapse mistaken for strategy, or meditation that avoids life.",
      guidance:
        "If rested enough, rise. If burned out, seek help beyond willpower.",
    },
  },
  "swords-05": {
    biddyUpright:
      "Conflict, disagreements, competition, defeat, winning at all costs",
    biddyReversed:
      "Reconciliation, making amends, past resentment",
    transverse: {
      summary:
        "Transverse Quintet—battle ended; cost being counted.",
      detail:
        "Five of Swords upright: hollow victory (Biddy). Transverse crossing is conflict aftermath—someone won, integrity still in question.",
      guidance:
        "Ask if winning was worth it. Offer repair if you took too much.",
    },
    conjugate: {
      summary:
        "Conjugate—resentment crosses reconciliation.",
      detail:
        "Reversed Five: amends possible, past resentment (Biddy). The crossing is unfinished peace—apology without change, or grudge that blocks truce.",
      guidance:
        "Name resentment specifically. One amend without expecting applause.",
    },
  },
  "swords-06": {
    biddyUpright:
      "Transition, change, rite of passage, releasing baggage",
    biddyReversed:
      "Personal transition, resistance to change, unfinished business",
    transverse: {
      summary:
        "Transverse Sextet—boat moving; shore of trouble fading.",
      detail:
        "Six of Swords upright: passage to calmer water (Biddy). Transverse is transition crossing—baggage lighter, journey mid-channel.",
      guidance:
        "Travel light. Honor what you leave without haunting it.",
    },
    conjugate: {
      summary:
        "Conjugate—unfinished business crosses passage.",
      detail:
        "Reversed Six: resistance to change, unfinished business (Biddy). The crossing drags the boat back—legal loose ends, emotional trunks unopened.",
      guidance:
        "Close one open loop. Accept that some waves follow awhile.",
    },
  },
  "swords-07": {
    biddyUpright:
      "Betrayal, deception, getting away with something, acting strategically",
    biddyReversed:
      "Imposter syndrome, self-deceit, keeping secrets",
    transverse: {
      summary:
        "Transverse Septet—strategy active; motives partly hidden.",
      detail:
        "Seven of Swords upright: stealth, tactics (Biddy). Transverse crossing is maneuver—information asymmetry, not yet exposed.",
      guidance:
        "Ask if secrecy protects or steals. Choose ethics over cleverness.",
    },
    conjugate: {
      summary:
        "Conjugate—self-deceit crosses strategy.",
      detail:
        "Reversed Seven: imposter syndrome, self-deceit, secrets (Biddy). The crossing is thief in mirror—you outsmart yourself or hide truth from allies.",
      guidance:
        "Confess one secret to a safe witness. Stop grading yourself as fraud.",
    },
  },
  "swords-08": {
    biddyUpright:
      "Negative thoughts, self-imposed restriction, imprisonment, victim mentality",
    biddyReversed:
      "Self-limiting beliefs, inner critic, releasing negative thoughts, open to new perspectives",
    transverse: {
      summary:
        "Transverse Octet—blindfolded among swords; prison mostly imagined.",
      detail:
        "Eight of Swords upright: self-imposed restriction, victim mentality (Biddy). RW shows loose bonds and a clear path the figure does not take. Transverse crossing is mental captivity—Operators have fixed a story that forecloses options while facts remain negotiable.",
      guidance:
        "Test one ‘impossible’ assumption with a small experiment. Ask someone to name exits you stopped seeing.",
    },
    conjugate: {
      summary:
        "Conjugate—inner critic loud at the threshold.",
      detail:
        "Reversed Eight: inner critic, releasing negative thoughts (Biddy). Conjugate is the critic as crossing—self-limiting beliefs sharpened just when a door opens, so you stay bound to avoid being wrong in public.",
      guidance:
        "Write the critic’s sentence; answer in evidence. One step beyond the blindfold—literal walk counts.",
    },
  },
  "swords-09": {
    biddyUpright:
      "Anxiety, worry, fear, depression, nightmares",
    biddyReversed:
      "Inner turmoil, deep-seated fears, secrets, releasing worry",
    transverse: {
      summary:
        "Transverse Nonet—night mind loud; dawn not yet trusted.",
      detail:
        "Nine of Swords upright: insomnia grief (Biddy). Transverse crossing is anxiety present—worry real, catastrophe not confirmed.",
      guidance:
        "Ground body. Delay major decisions until sleep returns.",
    },
    conjugate: {
      summary:
        "Conjugate—secrets amplify fear.",
      detail:
        "Reversed Nine: deep fears, secrets, releasing worry (Biddy). The crossing hoards shame—truth unspoken, mind spinning plots.",
      guidance:
        "Tell one trusted person the fear. Professional help if nightmares persist.",
    },
  },
  "swords-10": {
    biddyUpright:
      "Painful endings, deep wounds, betrayal, loss, crisis",
    biddyReversed:
      "Recovery, regeneration, resisting an inevitable end",
    transverse: {
      summary:
        "Transverse Decet—ending visible; bottom reached.",
      detail:
        "Ten of Swords upright: definitive end (Biddy). Transverse crossing is aftermath—loss clear, recovery not yet begun.",
      guidance:
        "Do not pick up the swords again. Lie down; breathe.",
    },
    conjugate: {
      summary:
        "Conjugate—resisting inevitable end crosses recovery.",
      detail:
        "Reversed Ten: recovery possible, or resisting end (Biddy). The crossing is zombie narrative—refusing burial, or rising too fast without healing.",
      guidance:
        "Let the chapter end. If recovering, do so with gentleness not denial.",
    },
  },
  "swords-page": {
    biddyUpright:
      "New ideas, curiosity, thirst for knowledge, new ways of communicating",
    biddyReversed:
      "Self-expression, all talk and no action, haphazard action, haste",
    transverse: {
      summary:
        "Transverse Initiate—sharp curiosity; message forming.",
      detail:
        "Page of Swords upright: keen student (Biddy). Transverse crossing is ideas arriving—communication experimental.",
      guidance:
        "Learn before you debate. Verify facts you repeat.",
    },
    conjugate: {
      summary:
        "Conjugate—all talk, no action crosses the page.",
      detail:
        "Reversed Page: all talk, haphazard action, haste (Biddy). The crossing is gossip velocity—words without spine.",
      guidance:
        "Publish one small truth tested in action. Pause hot takes.",
    },
  },
  "swords-knight": {
    biddyUpright:
      "Ambitious, action-oriented, driven to succeed, fast-thinking",
    biddyReversed: "Restless, unfocused, impulsive, burn-out",
    transverse: {
      summary:
        "Transverse Propagator—charge of mind; target in motion.",
      detail:
        "Knight of Swords upright: rapid pursuit (Biddy). Transverse crossing is intellectual assault—speed high, accuracy still proving.",
      guidance:
        "Slow for precision on matters that cut. Apologize for collateral words.",
    },
    conjugate: {
      summary:
        "Conjugate—restless burn-out crosses ambition.",
      detail:
        "Reversed Knight: restless, unfocused, burn-out (Biddy). The crossing is blade dull from swing—impulsive arguments, exhaustion.",
      guidance:
        "Rest mind. One issue per campaign.",
    },
  },
  "swords-queen": {
    biddyUpright:
      "Independent, unbiased judgement, clear boundaries, direct communication",
    biddyReversed:
      "Overly-emotional, easily influenced, bitchy, cold-hearted",
    transverse: {
      summary:
        "Transverse Eigenstate—clarity forming; edges sharpening.",
      detail:
        "Queen of Swords upright: honest discernment (Biddy). Transverse crossing is truth-telling approaching—boundaries drafting.",
      guidance:
        "Speak with compassion's spine. Cut confusion, not people.",
    },
    conjugate: {
      summary:
        "Conjugate—cold harm crosses discernment.",
      detail:
        "Reversed Queen: overly emotional or cold-hearted extremes (Biddy). The crossing warps sword—cruelty called honesty, or mood swaying verdict.",
      guidance:
        "Check tone before send. Feel feeling; don't weaponize it.",
    },
  },
  "swords-king": {
    biddyUpright:
      "Mental clarity, intellectual power, authority, truth",
    biddyReversed:
      "Quiet power, inner truth, misuse of power, manipulation",
    transverse: {
      summary:
        "Transverse Sovereign—law of mind declared; case in progress.",
      detail:
        "King of Swords upright: authoritative truth (Biddy). Transverse crossing is judgment forming—power present, appeal still possible.",
      guidance:
        "Rule with transparent reasoning. Invite dissent on facts.",
    },
    conjugate: {
      summary:
        "Conjugate—misuse of power crosses truth.",
      detail:
        "Reversed King: manipulation, misuse of power (Biddy). The crossing is tyrant logic—truth bent to win, silence punished.",
      guidance:
        "Audit one rule for fairness. Correct misuse publicly if you caused it.",
    },
  },
};
