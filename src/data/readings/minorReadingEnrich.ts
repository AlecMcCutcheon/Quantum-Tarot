import type { ReadingText } from "../../types/reading";

type Expand = { detail?: string; guidance?: string };

function append(base: ReadingText, extra: Expand): ReadingText {
  return {
    summary: base.summary,
    detail: extra.detail ? `${base.detail} ${extra.detail}` : base.detail,
    guidance: extra.guidance
      ? `${base.guidance} ${extra.guidance}`
      : base.guidance,
  };
}

/**
 * Second-pass lateral depth from Biddy Tarot articles + Rider–Waite imagery
 * (see docs/ORIENTATION_RESEARCH.md §4). Merged at build after enrichMinorLateral.
 */
const MINOR_LATERAL_EXPAND: Record<
  string,
  Partial<Record<"transverse" | "conjugate", Expand>>
> = {
  "pentacles-ace": {
    transverse: {
      detail:
        "RW Ace of Pentacles: hand from cloud offering a single coin above a garden path (Biddy)—opportunity tangible, soil unchosen. Transverse is seed-in-hand crossing: manifestation approaching, planning and foresight still required before the lattice bonds.",
      guidance:
        "Treat the offer as real but unplanted: one budget line, one calendar block, one mentor conversation before you spend the coin symbolically.",
    },
    conjugate: {
      detail:
        "Biddy reversed: lost opportunity, lack of planning and foresight—the crossing drops the coin through procrastination, false scarcity, or refusing the door that opened. Not the same as transverse ‘not yet planted’: here forfeiture is active.",
    },
  },
  "pentacles-02": {
    transverse: {
      detail:
        "RW Two of Pentacles: figure dances with two coins looped in infinity, ships riding waves behind (Biddy)—adaptability under motion. Transverse crossing is priorities still tuning; books balanced on the move, not yet a single ledger.",
    },
    conjugate: {
      detail:
        "Biddy reversed: over-committed, disorganisation, need to reprioritise—the crossing drops a ball while pretending balance. Lattice stress from too many yeses, not from lack of skill.",
    },
  },
  "pentacles-03": {
    transverse: {
      detail:
        "RW Three of Pentacles: artisan, patron, and monk in cathedral—teamwork, learning, implementation (Biddy). Transverse is work-in-progress crossing: craft visible, blueprint still aligning, feedback loop open.",
    },
    conjugate: {
      detail:
        "Biddy reversed: disharmony, misalignment, working alone—the crew splits on ego, specs, or refusal to integrate critique. Crossing blocks the arch, not the apprentice.",
    },
  },
  "pentacles-04": {
    transverse: {
      detail:
        "RW Four of Pentacles: figure clutches coins, city behind (Biddy)—saving, security, conservatism. Transverse crossing is conservation with purpose unclear: stability prized, flow paused, generosity queued but not released.",
    },
    conjugate: {
      detail:
        "Biddy reversed: over-spending, greed, self-protection extremes—feast/famine swings or fortress that starves life. Crossing warps the purse, not merely tightens it.",
    },
  },
  "pentacles-05": {
    transverse: {
      detail:
        "RW Five of Pentacles: figures in snow pass lit church window (Biddy)—financial loss, isolation, worry, yet help exists unclaimed. Transverse deepens winter crossing: lack mindset real, community resource present but not yet received.",
    },
  },
  "pentacles-06": {
    transverse: {
      detail:
        "RW Six of Pentacles: merchant in red robes, scales in left hand, coins to two kneeling figures (Biddy). Upright teaches giving and receiving as one cycle—wealth shared, relief when you are the one in need. Transverse crossing is redistribution on the road: help offered, scales still settling, dignity and fairness not yet paired; who gives, who receives, and on what terms remains uncollapsed.",
      guidance:
        "If you lend, document trust with a return path (Biddy: short-term fix toward self-sufficiency). If you receive, name concrete need and one step toward standing on your own so charity does not become dependency.",
    },
    conjugate: {
      detail:
        "Biddy reversed: self-care after over-giving; unpaid debts; one-sided charity; generosity refused or exploited. RW imbalance warns of strings attached, taking without gratitude, or performative giving to prove virtue. Distinct from transverse calibration: the exchange is actively unfair or exhausted.",
      guidance:
        "Pause new yeses until you can support yourself. If you keep giving, require a healthy return of energy or repayment—Biddy’s fair exchange, not silent ledger debt.",
    },
  },
  "pentacles-07": {
    transverse: {
      detail:
        "RW Seven of Pentacles: farmer leaning on staff, watching pentacles on vine (Biddy)—long-term view, perseverance, investment. Transverse crossing is waiting for yield: effort planted, ROI uncollapsed, patience tested without uprooting.",
    },
    conjugate: {
      detail:
        "Biddy reversed: lack of long-term vision, limited success or reward—harvesting early, or persistence without learning from seasons. Crossing mistakes impatience for wisdom.",
    },
  },
  "pentacles-08": {
    transverse: {
      detail:
        "RW Eight of Pentacles: apprentice at bench, eight coins carved (Biddy)—skill development, repetitive tasks toward mastery. Transverse crossing is apprenticeship: product not final, competence accumulating.",
    },
    conjugate: {
      detail:
        "Biddy reversed: perfectionism, misdirected activity—endless polish, busy hands on wrong chisel. Crossing blocks shipment, not study.",
    },
  },
  "pentacles-09": {
    transverse: {
      detail:
        "RW Nine of Pentacles: figure in vineyard with falcon (Biddy)—abundance, self-sufficiency, financial independence. Transverse crossing is earned comfort near: grapes ripe, sharing optional, solitude chosen but still negotiating alliance.",
    },
    conjugate: {
      detail:
        "Biddy reversed: over-investment in work, hustling—success without felt worth. Crossing cannot rest in the vineyard it built.",
    },
  },
  "pentacles-10": {
    transverse: {
      detail:
        "RW Ten of Pentacles: patriarch, family, archway, dogs (Biddy)—wealth, legacy, long-term success. Transverse crossing is dynasty forming: inheritance, contribution, and family money themes active, settlement unsettled.",
    },
    conjugate: {
      detail:
        "Biddy reversed: financial failure, dark side of wealth—feud, loss, or gold without love. Crossing cracks the arch, not the coin.",
    },
  },
  "pentacles-page": {
    transverse: {
      detail:
        "Page of Pentacles upright: diligent student of earth, coin studied (Biddy)—manifestation through practice. Transverse crossing is opportunity to learn: offer in study, skill not yet embodied.",
    },
    conjugate: {
      detail:
        "Biddy reversed: lack of progress, procrastination—dreams of coin without ledger. Crossing stalls homework, not destiny.",
    },
  },
  "pentacles-knight": {
    transverse: {
      detail:
        "Knight of Pentacles upright: slow steady horse, coin held (Biddy)—hard work, productivity, routine. Transverse crossing is methodical advance: progress real, arrival delayed, steering conservative.",
    },
    conjugate: {
      detail:
        "Biddy reversed: boredom, feeling stuck, perfectionism—ox that will not move. Crossing confuses discipline with joyless rigidity.",
    },
  },
  "pentacles-queen": {
    transverse: {
      detail:
        "Queen of Pentacles upright: nurturing provider, garden and coin (Biddy)—practical care with commerce. Transverse crossing is feed-many-while-self-queued: throne of nurture, rest deferred.",
    },
    conjugate: {
      detail:
        "Biddy reversed: work-home conflict, self-care needed—parent absent while present, ledger on the lap. Crossing splits throne, not kindness.",
    },
  },
  "pentacles-king": {
    transverse: {
      detail:
        "King of Pentacles upright: master of material realm, bull and grapes (Biddy)—wealth, leadership, discipline. Transverse crossing is stewardship tested: abundance governed, ethics still on trial.",
    },
    conjugate: {
      detail:
        "Biddy reversed: financially inept or obsessed with status, stubborn—Midas flaw or rigidity that bankrupts trust. Crossing is throne without wisdom.",
    },
  },
  "swords-ace": {
    transverse: {
      detail:
        "RW Ace of Swords: hand from cloud, crowned blade, mountains (Biddy)—breakthrough, mental clarity. Transverse crossing is clarity approaching: idea sharp, verdict uncollapsed, breath before the cut.",
    },
    conjugate: {
      detail:
        "Biddy reversed: clouded judgement, re-thinking—edge dulled by overthinking or weaponized logic. Crossing blocks fair cut, not truth itself.",
    },
  },
  "swords-02": {
    transverse: {
      detail:
        "RW Two of Swords: blindfolded figure, crossed blades, moon water (Biddy)—impasse, avoidance, difficult choice. Transverse stalemate is lateral: options exist, sight bound, peace purchased by not deciding.",
    },
  },
  "swords-03": {
    transverse: {
      detail:
        "RW Three of Swords: heart pierced, storm (Biddy)—heartbreak, sorrow. Transverse crossing is grief in motion: pain acknowledged, healing not yet begun.",
    },
    conjugate: {
      detail:
        "Biddy reversed: recovery, forgiveness, release—heart still tender but turning. Crossing shifts from wound to scar tissue forming.",
    },
  },
  "swords-04": {
    transverse: {
      detail:
        "RW Four of Swords: knight at rest, stained glass (Biddy)—rest, recovery, contemplation. Transverse crossing is truce forming: pause legitimate, re-entry timed not yet chosen.",
    },
  },
  "swords-05": {
    transverse: {
      detail:
        "RW Five of Swords: figure collecting blades, others walk away (Biddy)—conflict, hollow victory. Transverse crossing is argument on the road: win possible, integrity still negotiable.",
    },
  },
  "swords-06": {
    transverse: {
      detail:
        "RW Six of Swords: ferry toward calmer shore (Biddy)—transition, moving on. Transverse crossing is passage underway: baggage lighter, destination not docked.",
    },
  },
  "swords-07": {
    transverse: {
      detail:
        "RW Seven of Swords: figure sneaking with swords (Biddy)—strategy, stealth. Transverse crossing is tactic in play: plan moving, ethics of means still open.",
    },
  },
  "swords-08": {
    transverse: {
      detail:
        "RW Eight of Swords: blindfolded, bound among swords (Biddy)—restriction, self-imposed limits. Transverse crossing is cage with door visible: fear binds more than rope.",
    },
  },
  "swords-09": {
    transverse: {
      detail:
        "RW Nine of Swords: figure awake in bed, nine blades on wall (Biddy)—anxiety, nightmares. Transverse crossing is night mind loud: almost dawn emotionally, peace not yet.",
    },
  },
  "swords-10": {
    transverse: {
      detail:
        "RW Ten of Swords: figure pierced, dawn on horizon (Biddy)—painful ending, rock bottom. Transverse crossing is aftermath: loss clear, recovery not begun, sky still lightening.",
    },
  },
  "swords-page": {
    transverse: {
      detail:
        "Page of Swords upright: keen youth with raised blade (Biddy)—curiosity, new ideas. Transverse crossing is herald energy: messages arriving, spine still forming.",
    },
    conjugate: {
      detail:
        "Biddy reversed: all talk, haphazard action—gossip velocity without accountability. Crossing is words without spine.",
    },
  },
  "swords-knight": {
    transverse: {
      detail:
        "Knight of Swords upright: charging horse (Biddy)—action, impulsive mind. Transverse crossing is campaign speed: truth pursued, steering uncertain.",
    },
  },
  "swords-queen": {
    transverse: {
      detail:
        "Queen of Swords upright: clear-eyed sovereign (Biddy)—perceptive, unbiased. Transverse crossing is discernment forming: boundaries sharpening, mercy not absent.",
    },
  },
  "swords-king": {
    conjugate: {
      detail:
        "Biddy reversed: manipulation, misuse of power—tyrant logic, truth bent to win. Crossing punishes silence and rewards spectacle over fact.",
    },
  },
  "cups-02": {
    transverse: {
      detail:
        "RW Two of Cups: exchange, caduceus lion (Biddy)—partnership, mutual attraction. Transverse crossing is chemistry visible, contract of trust still calibrating—not yet the Lovers’ vow, but entanglement preview.",
    },
    conjugate: {
      detail:
        "Biddy reversed: break-ups, disharmony, distrust—mirrors misaligned. Crossing questions reciprocity, not absence of feeling.",
    },
  },
  "cups-04": {
    conjugate: {
      detail:
        "Biddy reversed: retreat, withdrawal—numb escape rather than sacred pause (contrast High Priestess transverse). Crossing deepens thirst by disengaging from offered cups.",
    },
  },
  "cups-knight": {
    transverse: {
      detail:
        "Knight of Cups upright: romantic offer on white horse (Biddy)—charm, invitation. Transverse crossing is suitor on the road: aesthetics real, follow-through still proving.",
    },
    conjugate: {
      detail:
        "Biddy reversed: unrealistic fantasy, jealousy, moodiness—fairy-tale crash, unstable rider. Crossing is offer without capacity to land.",
    },
  },
  "cups-queen": {
    conjugate: {
      detail:
        "Biddy reversed: self-care needed, co-dependency—healing given while self lost in others’ storms. Crossing merges boundaries until the chalice empties.",
    },
  },
};

export function enrichMinorLateralExpand(
  cardId: string,
  pole: "transverse" | "conjugate",
  base: ReadingText,
): ReadingText {
  const extra = MINOR_LATERAL_EXPAND[cardId]?.[pole];
  return extra ? append(base, extra) : base;
}
