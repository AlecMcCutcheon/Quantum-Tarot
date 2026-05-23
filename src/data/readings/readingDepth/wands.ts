import type { Orientation } from "../../../types/deck";
import type { ReadingText } from "../../../types/reading";

type CardDepth = Partial<Record<Orientation, Partial<ReadingText>>>;

/** Biddy Wands keywords + Rider–Waite imagery; Photons suit (fire, creativity, enterprise). */
export const WANDS_DEPTH: Record<string, CardDepth> = {
  "wands-ace": {
    upright: {
      summary:
        "Photon Singularity: inspiration arrives as a living branch—new enterprise, creative potential, and growth asking for its first channel.",
      detail:
        "Rider–Waite shows a hand emerging from cloud, offering a wand still sprouting leaves while more foliage falls toward the ground—a living branch, not a finished staff (Biddy: inspiration, new opportunities, growth, potential). The castle on the hill confirms that worldly structure exists; the ace asks which gate your fire will illuminate first. In the Photons suit, this is discrete energy before it couples to a medium: ambition sensed as heat in the chest, a creative impulse that has not yet chosen its wire. Enterprise here is the courage to treat an idea as real before proof arrives. Passion is not performance; it is the body's vote for a new vector. This card favors beginnings you can name in one sentence—the prototype sketch, the honest conversation about what you want to build, the application sent before perfectionism wins. Mastery is not required; emission is. The falling leaves remind you that not every spark becomes a tree; choosing one branch is the work. When Photons first lase, the beam is narrow and bright—protect that aperture from the noise that would scatter it into pretty but useless glitter. Inspiration without embodiment stays myth; the ace blesses the first honest act that proves you mean it.",
      guidance:
        "Capture the spark in one concrete line—a title, a deadline, or a first deliverable. Choose a single outlet this week so Photons lase instead of scatter. Treat the castle as reachable, not as permission to wait for certainty.",
    },
    reversed: {
      summary:
        "Reversed ace: inspiration present but the channel blocked—emerging ideas, lack of direction, distractions, and delays leaking vitality.",
      detail:
        "Reversed, the Ace of Wands inverts the cloud-born gift: inspiration present, channel blocked (Biddy: an emerging idea, lack of direction, distractions, delays). Rider–Waite's falling leaves suggest vitality leaking before it roots—many sparks, no hearth. Photons refract through notifications, self-doubt, or parallel projects that never receive finishing energy. You may feel creative urgency while refusing the boring middle work that turns impulse into enterprise. Delays are often disguised decisions: the idea stays sacred because acting would expose it to measurement. Distraction is not always laziness; sometimes it protects an identity that has not updated to include the new role. Reversed asks whether you are waiting for a sign when the sign was the restlessness itself. The ace still exists—only the aperture is wrong. You might hoard inspiration as identity—always becoming, never being—so the emerging idea never meets the world that would refine it. Lack of direction can mean too many equally loud possibilities, or fear of choosing wrong and closing doors. Delays compound when you treat preparation as infinite and launch as optional. Photons in reversed ace scatter into heat without work—busy, warm, and ultimately inert.",
      guidance:
        "Remove one distraction source for forty-eight hours and protect one hour for the idea alone. Finish a micro-deliverable—outline, email, ten-minute recording—before opening another tab. If direction is unclear, pick the smallest experiment that would prove the idea wants to live.",
    },
    transverse: {
      summary:
        "Transverse spark: inspiration crosses as raw Photonic potential—growth sensed, channel uncollapsed, liminal ignition before the first wire is chosen.",
      detail:
        "Ace of Wands upright traditionally opens fire: inspiration and growth not yet directed (Biddy). As Singularity of Photons, the pulse is real but the experiment lacks a hypothesis—crossing you as creative heat that has not chosen its wire. This is liminal ignition, not failure. Rider–Waite's hand from cloud marks a threshold: the gift is offered, but your grip has not closed. Transverse is the first lateral crossing—the upright cluster of inspiration, opportunity, and potential meeting you sideways, before vertical commitment. You may feel called without knowing the vocation, excited without a calendar, or pregnant with enterprise while still debating names. Photons here behave as wavefront: present everywhere in the field, localized nowhere in action. The castle visible on the hill says structure awaits; the sprouting wand says life wants to move. Crossing energy asks you to honor the spark without either dismissing it as fantasy or inflating it into premature empire. Growth in transverse is cellular—division before differentiation. Creative fire at this crossing favors capture over performance: notebooks, voice memos, honest conversation with one trusted witness. Enterprise begins when you treat the impulse as data worth logging, not as mood to consume and forget.",
      guidance:
        "Capture the idea in one line before the crossing fades. Choose one outlet this week—one draft, one call, one prototype—so Photons begin to lase. Do not demand mastery; demand a first honest emission.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: distractions and delays scatter the first flame—emerging ideas refract through doubt, notifications, and unfinished starts.",
      detail:
        "Reversed Ace of Wands: emerging idea without direction, distractions, delays (Biddy). The conjugate crossing is the second lateral—reversed keyword cluster active—where scatter meets the original spark and steals its coherence. Photons refract instead of lasing: many tabs, many half-born projects, many eloquent reasons why tomorrow is better. The hand still offers the wand, but your attention splinters before contact. Delays dress as prudence; distractions dress as research. Self-limiting narratives may sound like spirituality or realism while functionally protecting you from the vulnerability of being measured. Emerging ideas need both protection and friction; conjugate errs toward over-protection—idea stays pure because it never meets reality. Lack of direction here is not absence of desire but refusal to rank desires. You may confuse consumption with creation—reading about the work instead of doing one ugly page. The falling leaves in the image warn that vitality dissipates when not rooted; conjugate is that dissipation in real time. This crossing is not a verdict against your gift—it is a mirror for aperture. Close one loop, however small, and the ace reappears as usable fire.",
      guidance:
        "Remove one distraction source for forty-eight hours. Finish one micro-deliverable from the idea before opening anything new. If direction is unclear, run the smallest experiment that would prove the spark wants to live.",
    },
  },
  "wands-02": {
    upright: {
      summary:
        "Photon Pair: on the ramparts with globe in hand—future planning, progress, decisions, and discovery before the next voyage commits.",
      detail:
        "The Two of Wands upright in Rider–Waite places a robed figure on the ramparts, wand in one hand and globe in the other, looking out over sea and distant hills (Biddy: future planning, progress, decisions, discovery). Fire has stabilized enough to survey territory—you are no longer merely ignited; you are choosing where to aim Photons next. Ambition becomes cartography: which market, relationship, craft, or migration deserves the next season of your life force. Progress here is strategic visibility, not hustle for its own sake. The globe is both privilege and responsibility; you already hold influence, even if it feels modest. Enterprise favors scouts over settlers at this stage—send the probe, price the trip, compare alliances. Passion cools into purposeful desire when you admit you cannot occupy every shore at once. Discovery is the reward for naming the decision you have postponed while pretending you are still gathering data. The second wand planted beside the figure says you have more than spark—you have continuity. Photons at this pip form a stable pair: enough coherence to interfere constructively if you aim deliberately. Worldly success is visible but not yet seized; the card blesses planning that serves motion rather than replacing it. Compare paths with honest costs—identity, time, reputation—not only money.",
      guidance:
        "List two paths with honest costs—not only money, but identity and energy. Set a decision date and, until then, gather one new fact per path. Hold the globe without clutching; planning works when it serves motion.",
    },
    reversed: {
      summary:
        "Reversed pair: personal goals and inner alignment unsettle the map—fear of the unknown and lack of planning masquerading as patience.",
      detail:
        "Reversed Two of Wands turns the ramparts inward (Biddy: personal goals, inner alignment, fear of the unknown, lack of planning). The figure may still hold the world, but the gaze retreats—private ambition disconnected from a map, or fear of the unknown masquerading as prudence. Photons pool behind the eyes instead of crossing the sea. You might know what you want yet refuse to price the voyage, lest success change who you are allowed to be. Lack of planning is not always chaos; sometimes it is a strategy to keep options imaginary, where they cannot fail. Inner alignment work is legitimate here—reconcile the part that wants expansion with the part that wants safety. Reversed warns against using spirituality or going with the flow to avoid the uncomfortable commitment that discovery requires. The unknown is not only danger; it is also the place your next chapter has not been measured yet. Personal goals may conflict with inherited scripts—family, culture, team—so you hold the globe silently. Fear of the unknown can manifest as endless research, credential collecting, or waiting for a partner to decide for you. Photons reversed here reflect back from the wall you built. Alignment work belongs on the calendar, not only in journaling.",
      guidance:
        "Name the fear in plain language—loss, visibility, wrong choice—and write what it protects. Take one scouting step into the unknown: a call, a visit, a published intention. Align personal goals with a calendar date, not only with mood.",
    },
    transverse: {
      summary:
        "Transverse Pair: plans and discovery hover in superposition—the world held, territory visible, decisive voyage not yet collapsed.",
      detail:
        "Two of Wands upright: holding the globe, planning progress (Biddy). Transverse is the crossing of choice—paths visible, decision uncollapsed. Pair of Photons in superposition between territories. Rider–Waite's figure stands between castle and sea—security behind, horizon ahead—embodying the liminal moment before commitment. You may feel competent yet suspended, ambitious yet unpinned, holding more optionality than your nervous system enjoys. Transverse energy is not weakness; it is the ethical pause before you spend life force on a direction that will reorganize identity. Future planning crosses you sideways: spreadsheets, conversations, fantasies, and dread all valid data. Progress at this crossing is informational—maps updated, allies sounded, costs estimated. Discovery tempts and terrifies in equal measure because choosing one shore means grieving imaginary versions of the others. The wand in hand says you are not empty-handed; the globe says influence is already yours. Enterprise here favors experiments over declarations—scout trips, pilot clients, sample chapters, dating apps opened with honest bios. Photons interfere constructively when you compare paths without pretending they are costless. Let the crossing teach you what you lean toward when no one is performing for.",
      guidance:
        "List two paths with costs—time, identity, money—and set a decision date. Until then, gather one new fact per path each week. Hold the globe lightly; planning should serve motion, not replace it.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: fear of the unknown and lack of planning block forward motion—inner alignment needed before the sea is crossed.",
      detail:
        "Reversed Two: inner alignment work, fear of unknown, lack of planning (Biddy). The conjugate crossing is hesitation dressed as prudence—you may know your goal but refuse the map that would make failure measurable. Discovery stalls at the gate while Photons circulate in anxious loops. Personal goals diverge from performed goals: you say one thing publicly while privately craving another shore. Lack of planning can be covert rebellion against expectations—if there is no plan, no one can say you chose wrong. Fear of the unknown amplifies every headline and family story until the globe feels like a burden, not a privilege. Inner alignment work is the medicine: which ambition is yours, which is inherited, which is revenge, which is joy? Conjugate does not mock caution; it names when caution became identity. You might be waiting for certainty that only action supplies—clarity after the first voyage, not before. The reversed cluster crosses the upright plan and introduces static: mixed signals to collaborators, delayed replies, half-commitments. Photons need a decision surface to reflect off. Choose alignment practices that touch the body—walks, conversations, constrained timelines—not only thought spirals.",
      guidance:
        "Name the fear in plain words and write what it protects. Take one scouting step into the unknown this week. Put personal goals on the calendar with a review date—not only in your head.",
    },
  },
  "wands-03": {
    upright: {
      summary:
        "Photon Triplet: ships on the horizon—progress, expansion, foresight, and overseas opportunity in transit toward reception.",
      detail:
        "Rider–Waite's Three of Wands shows a figure on the cliff edge, back to the viewer, watching ships approach on bright water—enterprise already launched, results still in transit (Biddy: progress, expansion, foresight, overseas opportunities). Photons left the harbor earlier; now the work is reception and patience without shrinking vision. This is foresight rewarded: alliances, exports, creative launches, or long investments beginning to return signal. Ambition matures from spark to supply chain—you are not only the artist but the merchant awaiting cargo. Expansion can be geographic, digital, or relational; the image is about horizons widening because you planned beyond the first sale. Passion here steadies into confidence that the world can meet you. Creativity scales when you treat collaboration as infrastructure, not betrayal of purity. The card does not promise instant arrival; it confirms direction. Stand on the height and read the water honestly—are those your ships, or distractions dressed as opportunity? Three wands planted mark stable commitment; the figure's posture is watchful, not frantic. Enterprise at this stage rewards systems: contracts, buffers, community, documentation. Photons arrive in packets—email threads, payments, invitations—handle capacity before applause. Foresight without reception discipline wastes prior launches; this upright pip asks you to prepare docks while trusting the tide.",
      guidance:
        "Prepare to receive results—clear inbox, capacity, and agreements before success arrives. Strengthen one partnership that shares the voyage rather than freeloading on your foresight. Measure progress by ships launched, not only by applause at the dock.",
    },
    reversed: {
      summary:
        "Reversed triplet: playing small, lack of foresight, and unexpected delays shrink the horizon just as vessels approach.",
      detail:
        "Reversed Three of Wands shrinks the horizon just as vessels approach (Biddy: playing small, lack of foresight, unexpected delays). The figure may still watch the sea, but interpretation turns pessimistic—delays become proof you were foolish to expand, or self-sabotage narrows what you allow yourself to receive. Photons dim through impostor reflex: playing small to avoid the responsibility of larger visibility. Lack of foresight can mean you shipped without logistics—no contracts, no buffers, no community—so legitimate delays feel like cosmic rejection. Unexpected setbacks are real; the reversal asks whether you confuse setback with verdict. Enterprise stalls when passion lacks stewardship—burning bright at launch, absent at maintenance. Reversed also flags envy of others' arriving ships while ignoring the fleet you already sent. Expansion requires nervous-system capacity; if you shrink, investigate whether the body needs rest or the story needs updating. Playing small protects against envy, criticism, and the labor of scale—but costs you arrivals meant for you. Delays may expose weak foresight: no follow-up, no backup vendor, no legal clarity. Photons cannot dock at a port you refuse to build.",
      guidance:
        "Identify where you play small to stay safe and test one expansion you have been deferring. Address a concrete delay—follow up, fix a bottleneck—instead of treating timing as fate. Revisit foresight: what single preparation would make the next arrival survivable?",
    },
    transverse: {
      summary:
        "Transverse Triplet: expansion approaching across open water—progress real, foresight active, ships visible but not yet docked.",
      detail:
        "Three of Wands upright: watching ships, foresight, expansion (Biddy). Transverse crossing is enterprise in transit—progress real but not yet received. Wait without shrinking. The figure's back turned to us marks a liminal stance: past launch, future arrival, present vigilance. Photons are en route—signals traveling, investments maturing, creative work circulating beyond your direct sight. This crossing can feel like anxiety dressed as patience: you check tracking obsessively or pretend you do not care. Transverse honors the middle—unsexy, uncelebrated—where most enterprise actually lives. Foresight crosses sideways as intuition plus preparation: you sense momentum and still must clear the dock. Overseas opportunities may appear as remote collaboration, import of ideas, or literal travel pending visas. Expansion at this crossing is not hype; it is infrastructure meeting timing. Allies matter now—people who can receive while you watch the horizon. The triplet structure suggests minimum stable foundation; do not uproot wands to chase every sail. Creative enterprise scales through reception discipline: onboarding, customer support, editorial feedback, community moderation. Let arrivals land without immediately launching anew.",
      guidance:
        "Prepare capacity before results arrive—inbox, calendar, agreements. Strengthen one partnership that shares the voyage. Measure progress by ships you launched, not only applause at shore.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: playing small and unexpected delays cross expansion—self-sabotage or weak logistics trip the stride as ships near.",
      detail:
        "Reversed Three: playing small, lack of foresight, unexpected delays (Biddy). The conjugate crossing shrinks vision just as opportunity widens—Photons dim through impostor reflex or preventable bottlenecks. You may interpret delay as destiny when it is follow-up neglected, paperwork stalled, or fear of visibility masquerading as humility. Playing small protects against responsibility of scale but ensures your ships arrive at a port you refuse to claim. Lack of foresight shows up as no buffer—financial, emotional, or operational—so the first wave overwhelms and you retreat. Unexpected delays are real; conjugate asks whether you also delay yourself—muted announcements, unpublished work, underpriced offers. Envy of others' fleets can cross your upright voyages and poison reception. Enterprise needs nervous-system capacity; if body says no, adjust pace without calling it failure. Conjugate is corrective friction: name one delay you can address today, one expansion you have been deferring from fear, one system that would make the next arrival survivable. Photons can only integrate if you stay visible long enough to receive.",
      guidance:
        "Identify where you play small and test one deferred expansion. Address one concrete delay directly—call, email, fix—instead of blaming fate. Add one foresight buffer before the next wave lands.",
    },
  },
  "wands-04": {
    upright: {
      summary:
        "Photon Quartet: garlanded threshold—celebration, joy, harmony, relaxation, and homecoming after enterprise finds shared ground.",
      detail:
        "The Four of Wands upright is Rider–Waite's garlanded archway—flower canopy, celebrants with raised wands, a castle home in the background (Biddy: celebration, joy, harmony, relaxation, homecoming). Photons settle into shared wavelength: enterprise pauses for integration, not abandonment. This is the milestone after effort—launch party, signed lease, reunion, creative season completed, team rhythm found. Ambition needs these thresholds; without them, fire becomes chronic stress. Harmony here is structural—a tent of agreements, rituals, and belonging that makes the next push sustainable. Homecoming can be literal or symbolic: returning to body, community, or values after a campaign. Passion expressed as joy is still passion; relaxation is not laziness when it cements loyalty and memory. Creativity flourishes when the studio, marriage, or friend group has a door you can walk through proudly. The card invites visible gratitude—let people see the arch you built together. Four wands anchor the canopy—stability beneath festivity. Enterprise that never celebrates burns out collaborators and forgets why the work mattered. Photons in quartet phase interfere constructively: individuals retain spark while moving in rhythm. Honor the pause long enough for nervous systems to register safety before the next quest.",
      guidance:
        "Mark the milestone with a simple rite—meal, announcement, or afternoon off—before rushing to the next quest. Invite the people who carried the wands with you; celebration heals hidden resentments. Rest with intention so the harmony becomes habit, not a one-night flare.",
    },
    reversed: {
      summary:
        "Reversed quartet: personal celebration and inner harmony possible while conflict with others or transition unsettles the public arch.",
      detail:
        "Reversed Four of Wands complicates the party at the gate (Biddy: personal celebration, inner harmony, conflict with others, transition). Rider–Waite's arch may still stand, but social friction, exclusion, or premature transition unsettles the scene. Photons flicker—joy available privately while public harmony cracks. Conflict with others can mean disputes about who belongs, who gets credit, or whether the home you built fits who you are becoming. Inner harmony is possible even when the guest list is wrong; reversed honors solo celebration when community performance would be dishonest. Transition warns against clinging to an old threshold because the garlands were pretty—some homecomings are temporary waystations. Enterprise suffers when teams celebrate symbols while avoiding the hard conversation about workload or values. Reversed asks whether you are forcing festivity to mask misalignment, or refusing festivity out of perfectionism. Personal celebration is medicine—not selfishness—when public space is unsafe or misrepresentative. Transition may require grieving an old home even as you decorate a new one. Photons need honest containers; fake harmony leaks heat as resentment.",
      guidance:
        "Resolve one interpersonal tension before the public rite, or choose private joy if the party would be theater. Name what is transitioning—role, address, relationship—and mark it honestly. If conflict persists, negotiate boundaries rather than torching the arch.",
    },
    transverse: {
      summary:
        "Transverse Quartet: homecoming near—the arch forming, celebration approaching, community gathering but threshold not yet fully crossed.",
      detail:
        "Four of Wands upright: threshold, harmony, homecoming (Biddy). Transverse is the archway before the party—joy approaching, community not fully gathered. A crossing of transition into belonging. Rider–Waite's garlands hang, wands raised, castle visible—structure and festivity co-present, integration incomplete. You may stand in the doorway between old campaign and new stability, tired enough to crave rest yet superstitious about naming success too soon. Transverse Photons warm the space without requiring performance—preparation, invitations, small acknowledgments. Harmony here is emergent: rhythms forming, not yet hardened into tradition. Homecoming crosses as body memory—returning to bed, table, ritual—after months of launch intensity. Enterprise benefits from marking liminal wins: beta shipped, lease signed pending, relationship repaired but fragile. Celebration deferred entirely becomes cynicism; celebration forced too early becomes hollow. The crossing asks who belongs under the arch and whether you will let them in before resentment calcifies. Relaxation is strategic—nervous systems learn safety through repeated gentle thresholds. Let joy be modest and real.",
      guidance:
        "Prepare the space and people for belonging—simple rite, honest invitation. Celebrate modestly before the next quest. If the arch is not ready publicly, honor private joy without shame.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: conflict with others and transition cross celebration—social friction at the gate disputes who belongs under the arch.",
      detail:
        "Reversed Four: inner harmony possible, but conflict with others, transition (Biddy). The conjugate crossing is social friction at the gate—disputes about credit, inclusion, or whether this home fits who you are becoming. Photons flicker between private peace and public strain. Transition may accelerate—moving, role change, relationship redefinition—while others cling to old festivity scripts. Conflict with others can be overt argument or quiet exclusion; both drain the quartet's harmony. Inner celebration remains available and may be the honest choice when public party would be theater. Enterprise teams at conjugate need one hard conversation before the toast— workload, values, money, boundaries. Forcing harmony wastes heat; negotiating truth preserves the arch. Some homecomings are temporary waystations; clinging to garlands past their season breeds resentment. Photons conjugate here ask: can you mark progress without lying about friction? Can you transition with ritual instead of ghosting? Private joy is not failure—it may be integrity.",
      guidance:
        "Resolve one interpersonal tension before the rite, or choose private celebration. Name what is transitioning and mark it honestly. Negotiate boundaries instead of torching the arch or faking harmony.",
    },
  },
  "wands-05": {
    upright: {
      summary:
        "Photon Quintet: open field of crossed staves—conflict, competition, tension, and diversity without crowned victor yet.",
      detail:
        "Rider–Waite's Five of Wands depicts five youths crossing staves in open ground—no crown at stake, only energetic disagreement (Biddy: conflict, disagreements, competition, tension, diversity). Photons interfere: multiple ambitions occupy the same field, and the pattern is messy before it clarifies. Enterprise meets market reality—rivals, critics, collaborators with incompatible visions, or internal teams pulling in different directions. Competition can sharpen craft when stakes are named and cruelty is refused. Diversity of voice is a feature here; the card is not unanimity but friction that prevents groupthink. Passion expressed as sparring needs rules—time boxes, shared goals, consent to debate. Creativity thrives when ideas collide, provided you distinguish sparring from sabotage. The upright lesson is not to flee tension but to metabolize it: who is fighting for what, and is the fight worth the heat loss? Conflict without clarity burns fuel; conflict with shared purpose can forge better structures. The open sky says no hidden puppeteer—this is visible contest. Photons scatter into interference patterns that, if read, reveal which frequencies strengthen the work. Enterprise leaders must name shared stakes or watch rivalry become war.",
      guidance:
        "State shared stakes aloud so rivalry does not become war. Engage competition with sportsmanship—clear roles, debrief after heated meetings. If you are one of the five, ask whether you want to win or to improve the work.",
    },
    reversed: {
      summary:
        "Reversed quintet: inner conflict, conflict avoidance, or tension release—the battle moves inward or underground without resolution.",
      detail:
        "Reversed Five of Wands moves the battle inward or underground (Biddy: inner conflict, conflict avoidance, tension release). The staves may lower without resolution—peace that is politeness, or explosion after long suppression. Photons scatter as anxiety when you debate everyone in your head but speak nowhere. Avoidance keeps enterprise frozen: the pitch unsent, the boundary unspoken, the creative difference un aired until it becomes resentment. Inner conflict can mean competing identities—artist versus provider, leader versus friend—each wielding a wand against the other. Tension release is possible upright-reversed: sometimes the card blesses ending a performative fight that never served growth. Reversed asks you to locate the real duel. Are you avoiding external conflict because you fear visibility, or inflaming internal conflict because it feels safer than negotiation? Release is healthy when it ends hollow competition; it is harmful when it abandons necessary truth. Passive aggression, side channels, and sarcasm are staves lowered dishonestly. Photons need a forum—meeting, letter, mediated conversation—or they heat tissue instead of air.",
      guidance:
        "If you have been avoiding a needed debate, schedule it with ground rules. If the war is internal, journal both sides, then choose one aligned action. Release tension through movement or honest conversation—not through passive-aggressive side channels.",
    },
    transverse: {
      summary:
        "Transverse Quintet: competition in the field—friction high, diverse voices clashing, outcome contested, agreement not yet forged.",
      detail:
        "Five of Wands upright: open contest, diverse voices clashing (Biddy). Transverse crossing is friction without victor—energy high, agreement absent. Photons scatter in interference patterns across the open ground. Rider–Waite's youths are not armored knights; this is scrimmage, brainstorm, market noise, or team debate before strategy crystallizes. Transverse honors productive mess—ideas colliding, egos flashing, values surfacing—if cruelty stays bounded. Enterprise at this crossing may feel like herding fire: everyone passionate, nobody aligned. Competition can sharpen craft when stakes are named: are we fighting for budget, credit, aesthetic, speed, ethics? Diversity of voice prevents groupthink but demands facilitation—time boxes, turn-taking, written summaries. Creative studios, startups, and families all know this field. The crossing is liminal: leave too early and you miss the synthesis; stay too long and heat becomes injury. Tension here is information about priorities, not proof of failure. Photons can constructively interfere when shared purpose exists beneath sparring. Your job is to name that purpose or exit the field.",
      guidance:
        "Compete without cruelty; name shared stakes so rivalry does not become war. Facilitate debate with clear roles and debrief. Ask whether you want to win or to improve the work.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: inner conflict and avoidance cross the open fight—battle moves inward or stays unspoken until it explodes.",
      detail:
        "Reversed Five: inner conflict, avoidance, or tension release (Biddy). The conjugate crossing moves battle inward—you dodge necessary debate, or fight yourself while blaming others. Photons become anxiety loops: rehearsed arguments without send button, boundaries unspoken until resentment spikes. Avoidance keeps enterprise frozen—pitch unsent, feedback ungiven, creative difference buried. Inner conflict may pit identities against each other—artist vs provider, leader vs friend—each wielding a wand silently. Tension release can be healthy when it ends hollow performative fights; harmful when it abandons truth that would save the project. Passive aggression, side channels, and sarcasm are staves lowered dishonestly. Conjugate asks you to locate the real duel: external negotiation feared, or internal story untested? Schedule the hard conversation with ground rules, or journal both inner sides then choose one aligned action. Photons need a forum or they burn tissue instead of illuminating work.",
      guidance:
        "If avoiding, schedule the hard conversation with ground rules. If inner war, journal both sides then act. Release tension through honest speech or movement—not side channels.",
    },
  },
  "wands-06": {
    upright: {
      summary:
        "Photon Sextet: laurel procession—success, public recognition, progress, and self-confidence riding forward with allies beside.",
      detail:
        "The Six of Wands upright shows a rider on a white horse, laurel wreath raised, companions with wands walking beside—public victory in motion (Biddy: success, public recognition, progress, self-confidence). Photons are visible: enterprise acknowledged, creative work landing, leadership recognized. This is the parade after competence—not luck alone, though grace plays a part. Self-confidence here is earned through prior trials; the crowd sees what you endured to arrive. Ambition fulfilled in public invites new responsibility: how you carry acclaim shapes the next campaign. Passion radiates as encouragement when you thank allies instead of hoarding spotlight. Rider–Waite emphasizes procession, not isolation—success is relational. Progress continues; the wreath is momentary. Use recognition to consolidate—secure resources, document lessons, mentor someone behind you. The card warns gently against confusing applause with arrival; still, receive it. Visibility is fuel for Photons when integrated, poison when it becomes identity's only food. The white horse suggests clarity of purpose; companions remind you the win was networked. Enterprise at this pip scales through gracious leadership—credit shared, standards maintained, next goal named without dimming today's joy.",
      guidance:
        "Accept praise without outsourcing self-worth—note three private reasons you respect your own work. Thank allies by name; shared victory lasts longer than solo myth. Plan the next chapter while energy is high, not after the crowd disperses.",
    },
    reversed: {
      summary:
        "Reversed sextet: private achievement, personal success definitions, fall from grace, or egotism—victory unseen or distorted by pride.",
      detail:
        "Reversed Six of Wands inverts the parade (Biddy: private achievement, personal definition of success, fall from grace, egotism). Victory may be real but unseen—success without platform, or public story diverging from private truth. Photons dim through fear of visibility: you win, then shrink from the wreath. Egotism is the shadow—performing triumph, exaggerating role, or punishing others when recognition is not total. Fall from grace warns that pedestals are narrow; one misstep from hubris or overpromising can undo goodwill. Personal definition of success is medicine here: perhaps the crowd's metric is wrong for your enterprise. Reversed honors quiet mastery—the book finished without bestseller status, the team saved without headline. It also flags hollow wins—titles without substance, viral moments without craft. Ask whether you chase applause to avoid deeper creative risk. Confidence rebuilt privately may be more durable than confidence rented from audience. Fear of visibility and hunger for visibility can coexist—both distort reception. Photons need integration: let the win land in body and ledger, not only in fantasy or dread.",
      guidance:
        "Define success on your terms in writing; let public metrics be one input, not the throne. If fame stings, scale visibility to tolerance rather than quitting the work. Check ego: celebrate without humiliating losers, and repair if you already did.",
    },
    transverse: {
      summary:
        "Transverse Sextet: acclaim approaching—progress visible, confidence building, public chapter forming before laurel is fully claimed.",
      detail:
        "Six of Wands upright: parade, recognition (Biddy). Transverse is acclaim approaching—progress seen, confidence building, public chapter not sealed. Crossing of visibility before integration. Rider–Waite's procession moves—horse mid-stride, wreath raised—not yet arrived at city gates. You may feel success adjacent: mentions, invitations, metrics ticking, impostor reflex flaring. Transverse Photons are bright and exposing; nervous systems need time to adjust. Enterprise here rewards gracious preparation for visibility—media training, financial hygiene, boundary scripts—without preemptively shrinking. Allies walk beside you in the image; transverse asks you to acknowledge them before the crowd does. Self-confidence at this crossing is emergent—tested in small receptions, not only imagined catastrophes. Progress continues; do not confuse approaching recognition with finished identity. Creative work may outpace your emotional capacity to be seen; scale exposure deliberately. The crossing blesses receiving praise as data—people resonate—while maintaining private reasons you respect your craft.",
      guidance:
        "Receive praise without outsourcing self-worth; thank allies by name. Prepare calmly for visibility—boundaries, logistics—without shrinking. Plan next steps while energy is high.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: egotism or fall from grace cross victory—pride isolates, or fear of visibility steals the win at the parade.",
      detail:
        "Reversed Six: private success, personal definition, fall from grace, egotism (Biddy). The conjugate crossing is pride—triumph that isolates, or fear of visibility that steals the win. Photons warp around ego: exaggerating role, punishing allies, performing humility while craving throne. Fall from grace warns pedestals are narrow—one hubristic decree, one overpromise, one cruelty masked as standards. Personal definition of success is medicine when crowd metrics misalign with your values—honor quiet mastery. Egotism can also hide as perpetual underdog story, refusing to integrate wins lest they obligate you. Fear of visibility shrinks reception just as opportunities arrive. Conjugate asks you to define success in writing, scale exposure to tolerance, and repair any harm done in prior triumphs. Photons integrated through gratitude and accountability last longer than applause rented for identity. Check whether you chase recognition to avoid deeper creative risk.",
      guidance:
        "Define success on your terms; let public metrics be one input. Scale visibility to tolerance. Celebrate without humiliating others; repair if ego already did damage.",
    },
  },
  "wands-07": {
    upright: {
      summary:
        "Photon Septet: high ground defense—challenge, competition, protection, and perseverance holding the hill worth keeping.",
      detail:
        "Rider–Waite's Seven of Wands shows a figure on higher ground, warding off six rising staves—outnumbered but advantaged by position (Biddy: challenge, competition, protection, perseverance). Photons cohere under pressure: enterprise defended, creative vision contested, boundaries tested. This is not the open skirmish of the Five; it is holding a strategic hill you earned. Perseverance matters because quitting now would surrender disproportionate value—reputation, market niche, relationship standard, or artistic integrity. Competition may come from newcomers, critics, or institutional inertia; protection is not paranoia when stakes are real. Passion expressed as conviction can inspire allies if you avoid cruelty. The card asks which battles are worth the cost—some staves should be let through if they do not threaten the core. Challenge clarifies identity: you learn what you will stand for when tired. Courage here is maintenance, not spectacle—showing up again, documenting agreements, resting between repulses. The high ground is earned, not given; defend it with ethics, not only adrenaline. Photons lase under pressure when purpose is clear. Enterprise leaders at this pip model calm defense—sleep, delegation, selective engagement.",
      guidance:
        "Pick battles aligned with your highest stake; concede skirmishes that drain without protecting the summit. Rest between pushes—sleep and food are defensive tools. Ask one ally to cover a flank you cannot hold alone.",
    },
    reversed: {
      summary:
        "Reversed septet: exhaustion, giving up, overwhelmed—perimeter defense collapses from depletion, not necessarily wrong strategy.",
      detail:
        "Reversed Seven of Wands signals exhaustion on the hill (Biddy: exhaustion, giving up, overwhelmed). The high ground remains, but Photons lose coherence—perseverance curdles into siege mentality or collapse. Overwhelm may mean too many fronts, too few allies, or a position that was never worth defending but became identity. Giving up can be wisdom when the hill is sunk cost; reversed asks you to distinguish strategic retreat from shameful quit. Exhaustion breeds misreading threats—every comment feels like an assault, every request like invasion. Enterprise suffers when leaders confuse stubbornness with courage. Protection turns brittle—boundaries without nuance burn bridges you will need. Reversed also flags internal surrender: you stop advocating for the work while still occupying the role. If the body says no louder each week, the battle may be with your pacing, not the market. Surrender with a plan beats heroic depletion. Photons cannot hold coherence without recovery intervals. Ask allies for cover before you abandon a worthy position from fatigue alone.",
      guidance:
        "Delegate or drop one front today; verify whether the hill still matches your values. Sleep before you abandon a position you may regret—fatigue lies. If retreat is right, exit with documentation and dignity, not ghosting.",
    },
    transverse: {
      summary:
        "Transverse Septet: holding the high ground—defense active, competition real, perseverance required, outcome not yet settled.",
      detail:
        "Seven of Wands upright: challenged but standing (Biddy). Transverse crossing is perimeter defense—competition real, perseverance required, outcome not settled. You are asked to hold line without cruelty. Rider–Waite's figure is elevated but alone against many—advantage positional, cost emotional. Transverse Photons cohere under pressure yet fatigue accumulates invisibly. Enterprise at this crossing may feel like endless comment threads, scope creep, or institutional resistance after early wins. Protection is legitimate when core values, safety, or finished work are threatened; distinguish from ego defense. Perseverance here is maintenance—document agreements, rest between repulses, delegate flanks. Challenge clarifies identity when you name what hill you defend and why. Allies can cover angles you cannot; asking is strategic, not weak. The crossing warns against both premature surrender and martyrdom—verify whether the hill still matches values before doubling down. Creative integrity often lives at this septet—saying no to dilution. Courage is mundane repetition, not spectacle.",
      guidance:
        "Pick battles worth the cost; concede skirmishes that drain without protecting core. Rest between pushes; ask one ally to cover a flank. Document why this hill matters.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: exhaustion and overwhelm cross perseverance—depletion threatens to surrender a hill worth keeping.",
      detail:
        "Reversed Seven: exhaustion, giving up, overwhelmed (Biddy). The conjugate crossing is depletion—you may abandon a worthy hill from fatigue, not strategy. Photons lose coherence under sustained overload; every comment reads as assault, every request as theft. Too many fronts, too few allies, or a position that became identity rather than purpose amplifies overwhelm. Giving up can be wisdom when the hill is sunk cost; conjugate demands honest audit before exit. Exhaustion breeds paranoia and brittle boundaries that burn needed bridges. Internal surrender—stopping advocacy while keeping title— wastes remaining heat. Body signals—sleep debt, irritability, illness—are data, not weakness. Strategic retreat with documentation beats ghosting; heroic depletion serves no realm. Delegate one front, sleep before big decisions, verify threat versus habit. Photons recover when recovery is scheduled, not stolen.",
      guidance:
        "Delegate or drop one front; sleep before surrendering a position you may regret. Verify the hill still matches values. If retreat is right, exit with dignity and clear handoff.",
    },
  },
  "wands-08": {
    upright: {
      summary:
        "Photon Octet: staves in flight—movement, fast change, action, alignment, messages and opportunities accelerating toward landing.",
      detail:
        "The Eight of Wands upright is Rider–Waite's eight staves flying parallel through open sky—no figures, pure velocity (Biddy: movement, fast paced change, action, alignment, air travel). Photons arrive in burst: messages, opportunities, creative breakthroughs, travel, or project phases accelerating toward landing. Enterprise moves from planning to arrival; answers en route, signatures pending, inspiration cascading faster than you can file it. Alignment suggests channels cleared—team, tools, and timing synchronized enough that friction drops briefly. Action favors minimal interference: do not over-edit the arrow mid-flight. Passion expresses as momentum; body and schedule must match pace—hydration, sleep, realistic inbox triage. Air travel and digital equivalents compress distance; use the window to close loops, not open new ones without capacity. The card is exhilarating and risky—speed without steering invites crash. Treat acceleration as temporary weather; build buffers before you assume perpetual tailwinds. When staves land, be ready to integrate, not only to celebrate motion. Photons in octet phase favor decisive triage—what must be answered now versus what merely feels urgent.",
      guidance:
        "Clear channels for incoming news—calendar, inbox, and decision authority. Align body with pace: eat, breathe, sleep even in the sprint. Finish one loop before chasing the next shiny arrival.",
    },
    reversed: {
      summary:
        "Reversed octet: delays, frustration, resisting change, internal misalignment—flight jammed, arrows stuck mid-air.",
      detail:
        "Reversed Eight of Wands jams the flight (Biddy: delays, frustration, resisting change, internal alignment). Staves hang or scatter—logistics fail, messages bounce, creative flow stutters. Photons hit medium mismatch: you push fire through wet wood. Delays may be external—approvals, visas, platforms—or internal misalignment where part of you resists the change your life already launched. Frustration compounds when you treat pause as personal failure rather than signal to adjust trajectory. Resisting change often means clinging to an old identity while the new chapter demands different skills. Internal alignment work belongs here: breath, values check, honest conversation with collaborators about realistic timelines. Reversed warns against forcing speed through manipulation or burnout; it also warns against using delay as excuse to never land. Some arrows need re-aiming, not more force. Identify whether the block is fear, infrastructure, or wrong target. Photons scatter when channels are clogged—unclear decision rights, missing tools, unspoken no's.",
      guidance:
        "Find the bottleneck—one person, one tool, one fear—and address it directly. Stop resisting a change that already left the bow; update plans to match reality. If speed is unsafe, communicate slippage early instead of silent frustration.",
    },
    transverse: {
      summary:
        "Transverse Octet: arrows in flight—velocity high, change airborne, targets forming, landing not yet complete.",
      detail:
        "Eight of Wands upright: swift motion, messages, alignment (Biddy). Transverse is acceleration without landing—change airborne, answers en route. Do not mistake speed for completion. Rider–Waite's staves fly parallel—coherent burst—yet no ground contact. You may live in inbox weather: pings, opportunities, travel bookings, creative downloads stacking faster than integration. Transverse Photons exhilarate and overwhelm; body must match pace or crash follows. Alignment crosses as temporary coherence—team, tools, timing briefly synchronized—use it to close loops, not spawn ten new ones. Air travel and digital speed compress distance; respect that human nervous systems lag behind calendars. Enterprise favors decision authority clarified before the burst—who can say yes when messages arrive. Creative breakthroughs at this crossing need capture systems—voice notes, tickets, editors—so flight becomes artifact. The liminal thrill can addict; schedule landing rituals—meals, sleep, debrief—even mid-sprint.",
      guidance:
        "Clear channels for incoming news; clarify who decides. Align body with pace—eat, breathe, sleep. Finish one loop before chasing the next arrival.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: delays and frustration cross momentum—logistics, resistance, or inner misalignment jam flight mid-air.",
      detail:
        "Reversed Eight: delays, frustration, resisting change (Biddy). The conjugate crossing jams flight—logistics fail, inner resistance blocks, arrows stuck mid-air. Photons hit medium mismatch: forcing fire through wet wood. Delays may be external—approvals, visas, platforms—or internal where part of you resists change already launched. Frustration compounds if pause is read as personal failure rather than signal to re-aim. Resisting change often clings to old identity while new chapter demands different skills. Internal alignment work—values check, honest timeline talks—belongs here. Conjugate warns against forcing speed through manipulation or using delay as excuse never to land. Identify bottleneck: fear, infrastructure, wrong target? Communicate slippage early instead of silent rage. Some arrows need re-aiming, not more force. Photons scatter when decision rights unclear or unspoken no's clog channels.",
      guidance:
        "Find the bottleneck—person, tool, fear—and address directly. Stop resisting change that already launched; update plans. Communicate delays early; re-aim if target is wrong.",
    },
  },
  "wands-09": {
    upright: {
      summary:
        "Photon Nonet: bandaged sentinel—resilience, courage, persistence, test of faith, boundaries near completion's final stretch.",
      detail:
        "Rider–Waite's Nine of Wands shows a bandaged figure gripping a wand, eight staves planted behind like a palisade—wounded but still standing (Biddy: resilience, courage, persistence, test of faith, boundaries). Photons near completion wavelength: enterprise in final stretch, creative project almost done, relationship boundary tested and mostly holding. Resilience is not denial—you see the bandage, yet you remain at post. Courage here is mundane: another email, another revision, another night watch. Test of faith asks whether you trust the work without fresh applause. Boundaries protect accumulated effort—do not drop the fence because you are tired and someone calls you paranoid. Persistence differs from the Seven's active defense; this is endurance after prior blows. Ambition matures into stewardship—guarding what you built until it can stand without you. Passion cools into loyalty to the promise. The card acknowledges cost; honor it without romanticizing suffering. One more push may finish the cycle—discern whether the push is strategic or habitual. Photons at nonet hold steady emission despite damage—maintain rest intervals or coherence fails.",
      guidance:
        "Protect the boundary that guards nearly-finished work; say no without long apology. Ask one ally for cover before the final stretch. Rest is tactical—bandage the wound, then return to the post you chose.",
    },
    reversed: {
      summary:
        "Reversed nonet: inner resources strained—struggle, overwhelm, defensive posture, paranoia distorting vigilance at the finish line.",
      detail:
        "Reversed Nine of Wands distorts vigilance (Biddy: inner resources, struggle, overwhelm, defensive, paranoia). The palisade may stand, but interpretation turns hostile—every noise reads as attack, every request as theft of your wands. Photons decoherence under chronic threat perception: enterprise becomes isolation, creativity becomes bunker. Overwhelm suggests the last mile is too heavy for solo carry; struggle may be noble or self-inflicted. Defensive posture can repel help that would finish the work. Paranoia is the shadow—seeing enemies where there is friction, burning bridges to avoid one more conversation. Inner resources are the medicine: therapy, body work, trusted friend who can mirror reality. Reversed also flags quitting at the true finish line because pain became identity. Ask whether the fence protects the garden or imprisons you. Some battles ended already; you are still fighting ghosts. Lower shoulders; verify facts before escalating. Photons recover with rest and reality-testing, not with tighter fences alone.",
      guidance:
        "Test threat versus habit—write evidence for and against before acting. Accept one offer of help that does not steal authorship. Rest without guilt; exhaustion makes paranoia plausible.",
    },
    transverse: {
      summary:
        "Transverse Nonet: wounded guard still standing—courage present, boundary tested, last stretch uncertain before completion lands.",
      detail:
        "Nine of Wands upright: bandaged sentinel, near completion (Biddy). Transverse crossing is fatigue before finish—courage present, boundary tested, last stretch uncertain. Rider–Waite's figure is injured yet posted—eight staves behind as palisade. You may be one deliverable from done yet feel oldest here: prior blows remembered, applause sparse, faith thinning. Transverse Photons hold steady emission despite damage—maintain rest intervals or coherence fails. Enterprise at this crossing is stewardship—protect nearly-finished work from scope creep, needy outsiders, and your own perfectionism. Boundaries are legitimate; explain them briefly without over-apologizing. Test of faith asks whether you trust process without fresh validation. Allies can cover one watch so you sleep; asking is tactical. The crossing distinguishes strategic last push from habitual overextension—body data matters. Creative projects need final protection—say no, ship, rest. Photons near completion wavelength; do not drop fence from fatigue alone.",
      guidance:
        "Protect boundaries guarding nearly-finished work. Ask one ally for cover before final push. Rest tactically—bandage, sleep, return.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: paranoia and overwhelm cross resilience—vigilance distorts, help repelled, finish line threatened by exhaustion.",
      detail:
        "Reversed Nine: struggle, overwhelm, defensive, paranoia (Biddy). The conjugate crossing distorts vigilance—you see attack in noise, or collapse fences from strain. Photons decoherence under chronic threat perception; enterprise becomes bunker, creativity isolated. Overwhelm suggests last mile too heavy solo; help repelled by pride or fear of theft. Paranoia burns bridges needed to finish—verify facts before escalating. Inner resources—therapy, body work, trusted mirror—are medicine. Quitting at true finish line because pain became identity is a shadow here. Ask whether fence protects garden or imprisons. Some battles ended; you fight ghosts. Conjugate honors rest and reality-testing over tighter control. Accept one offer of help that preserves authorship. Photons recover when recovery is scheduled. The bandaged sentinel in Rider–Waite still stands at post; conjugate asks whether your wound is data or destiny—tend it, adjust load, and let allies cover one watch so the work can actually finish.",
      guidance:
        "Test threat versus habit with written evidence. Accept one helpful offer without surrendering authorship. Rest without guilt—exhaustion fuels paranoia.",
    },
  },
  "wands-10": {
    upright: {
      summary:
        "Photon Decet: bent under ten staves—burden, extra responsibility, hard work, completion near with spine dangerously strained.",
      detail:
        "The Ten of Wands upright shows a figure bent under ten staves, walking toward a visible town—completion near, spine strained (Biddy: burden, extra responsibility, hard work, completion). Photons overloaded: enterprise succeeded into obligation mountain—every yes became a staff you alone carry. Hard work is honest; burden asks whether the weight is temporary or structural. Extra responsibility often follows visibility—promotions, caregiving, creative opportunities that multiply deliverables. Rider–Waite's town is close; this is not endless trudge without destination. Completion is possible if you stop collecting wands mid-stride. Ambition without delegation becomes martyrdom; passion without pacing becomes injury. Creativity may feel impossible because logistics consumed the muse. The upright card respects the grind while naming its limit—honor effort, redesign load. Some staves are not yours; some timelines are negotiable. The body is the final accountant. Finishing matters, but arriving broken serves no one. Photons at decet density need redistribution or they extinguish—systems, handoffs, honest nos.",
      guidance:
        "Drop or delegate one staff that is not yours before the last mile. Plan completion with rest built in—sleep, celebration, handoff. Ask which burdens are identity performance versus true obligation.",
    },
    reversed: {
      summary:
        "Reversed decet: doing it all, carrying burden, or needed delegation and release—staves fall or cling from guilt.",
      detail:
        "Reversed Ten of Wands focuses on release or refusal to release (Biddy: doing it all, carrying the burden, delegation, release). The figure may straighten—staves falling—or cling tighter from guilt. Photons scatter when control masquerades as responsibility: you will not hand off because no one else does it right, so enterprise stalls at capacity ceiling. Doing it all wins praise briefly, then erodes craft and health. Delegation is not abandonment; it is how fires scale beyond one pair of hands. Release can mean quitting a role, ending a volunteer spiral, or admitting the project should shrink. Reversed blesses putting down what was never sustainable. It also warns against dumping obligations without communication—ghosting teams, clients, or family. Inner pattern: worth tied to carrying weight. Creative life returns when bandwidth returns. Choose release with integrity—clear handoffs, documented state, kind boundaries. Photons lase again when aperture clears.",
      guidance:
        "Delegate one task today with instructions, not micromanagement. Release guilt about not being the only carrier—competence includes building systems. If you drop a burden, communicate clearly to everyone affected.",
    },
    transverse: {
      summary:
        "Transverse Decet: burden carried toward visible town—hard work honest, finish line near, spine strained under overload crossing the path.",
      detail:
        "Ten of Wands upright: carrying many staffs (Biddy). Transverse is overload crossing the path—work honest, finish line visible, spine strained. Not failure—weight. Rider–Waite's figure moves toward town—destination real—yet bent. You may be completing while accumulating new obligations mid-stride, confusing busyness with progress. Transverse Photons are dense; without redistribution they heat tissue instead of illuminating realm. Enterprise at this crossing asks which staves are yours, borrowed, or stolen from others' hands. Extra responsibility followed visibility—promotions, caregiving, creative opportunity multipliers. Completion possible if you stop collecting mid-walk. Ambition without delegation becomes martyrdom; passion without pacing becomes injury. Creative muse may be suffocated by logistics—schedule handoffs before the last mile. The crossing honors grind while naming limits—body is accountant. Town near means rest soon if you design it; otherwise you arrive broken and call it virtue.",
      guidance:
        "Drop or delegate one staff not yours before last mile. Plan completion with rest and celebration built in. Distinguish identity performance from true obligation.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: refusal to delegate crosses release—martyrdom and control prevent staves from falling before town gates.",
      detail:
        "Reversed Ten: doing it all, carrying burden, or need to delegate/release (Biddy). The conjugate crossing is martyrdom or control—you won't hand off, so completion becomes injury. Photons scatter when worth ties to carrying weight alone. Doing it all wins brief praise then erodes craft and health. Delegation is scaling mechanism, not abandonment—competence includes systems. Release may mean quitting role, shrinking project, ending volunteer spiral—blessed when unsustainable. Dumping obligations without communication is shadow release; choose integrity—handoffs, documentation, kind boundaries. Inner story may equate love with overload; conjugate invites new equation. Creative life returns when bandwidth returns. Straighten by dropping one staff today with clear instructions, not micromanagement. Photons lase when aperture clears. Rider–Waite's town is close; conjugate warns that clinging to every wand guarantees you arrive bent—put one down with clarity and let completion be shared, not solo martyrdom.",
      guidance:
        "Delegate one task with instructions today. Release guilt about not being sole carrier. Communicate clearly if dropping a burden.",
    },
  },
  "wands-page": {
    upright: {
      summary:
        "Photon Initiate: desert messenger— inspiration, ideas, discovery, limitless potential, free spirit carrying fire's first letter.",
      detail:
        "Rider–Waite's Page of Wands shows a youth in desert landscape, holding a sprouting wand, looking at it with curious alertness—message of fire arriving (Biddy: inspiration, ideas, discovery, limitless potential, free spirit). Photons as apprentice pulse: enterprise not yet expert, creativity willing to look foolish, passion expressed as exploration. This is the email before the company, the sketch before the show, the flirtation before the commitment. Discovery favors beginners' mind—follow one thread without pretending mastery. Limitless potential is real and also requires training; the page is invitation, not certificate. Free spirit energy can revitalize stale teams if paired with listening. Intuition arrives as itch—new medium, new genre, new collaboration. Rider–Waite's desert suggests space to experiment; protect margins for play. Ambition here starts small and vivid. Learn before you perform expertise; send the message you drafted; ask the question that reveals you as new. The page blesses honest inexperience over counterfeit authority. Photons at initiate frequency are bright but un collimated—mentorship and practice give direction.",
      guidance:
        "Follow one curiosity thread this week with a tangible output—notes, sample, conversation. Learn publicly where safe; ask mentors one precise question. Send the message or pitch you keep revising without sending.",
    },
    reversed: {
      summary:
        "Reversed initiate: newly-formed ideas redirected—self-limiting beliefs, scattered energy, spiritual bypass blocking the messenger.",
      detail:
        "Reversed Page of Wands blocks the messenger (Biddy: newly-formed ideas, redirecting energy, self-limiting beliefs, a spiritual path). Ideas redirect into doubt—Photons bounce off who am I to try? Creative sparks die in private because sharing feels dangerous. Self-limiting beliefs dress as realism: you need one more course, one more year, one more permission slip before acting. Spiritual path language can become bypass—vision boards without verbs. Newly-formed ideas need protection, not silence; reversed warns against telling everyone too soon, but also against telling no one forever. Energy scattered across hobbies prevents depth. Emotional immaturity may show as moody withdrawal when feedback arrives. Reversed asks you to test beliefs with small experiments rather than debate them abstractly. Redirect energy from self-surveillance to craft. The page reversed is still a page—apprenticeship remains available if you stop disqualifying yourself. Photons return when you send one small true thing.",
      guidance:
        "Write one self-limiting belief and design a week-long test against it. Send a small piece of work to a safe audience. If energy is scattered, choose one thread and pause the others without shame.",
    },
    transverse: {
      summary:
        "Transverse Initiate: message of fire arriving—ideas plentiful, apprenticeship open, role not yet embodied in the world.",
      detail:
        "Page of Wands upright: curious messenger, discovery (Biddy). Transverse is youthful fire crossing as invitation—ideas plentiful, apprenticeship open. Rider–Waite's youth studies the sprouting wand in desert openness—space to experiment, no court yet. You may feel beginner energy in a domain that matters—excited, clumsy, visible if you act. Transverse Photons are bright but uncollimated; mentorship and practice give direction. Enterprise here favors tiny shipments over performance of expertise—notes, samples, questions sent. Discovery crosses as itch for new medium, genre, collaboration; follow one thread with tangible output. Free spirit revitalizes stale teams when paired with listening. Limitless potential requires training; page is invitation not certificate. The crossing protects honest inexperience—better than counterfeit authority. Spiritual curiosity belongs if it touches verbs—walks, drafts, conversations—not only vision boards. Message of fire wants sending, not endless revision in private.",
      guidance:
        "Follow one curiosity thread with tangible output this week. Learn publicly where safe; ask one precise mentor question. Send the drafted message or pitch.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: self-limiting beliefs cross the messenger—ideas redirected into doubt, energy scattered before first send.",
      detail:
        "Reversed Page: redirecting energy, self-limiting beliefs (Biddy). The conjugate crossing is the student who won't believe admission—ideas redirected into doubt. Photons bounce off who am I to try? Creative sparks die private because sharing feels dangerous. Beliefs dress as realism—one more course, year, permission before acting. Spiritual language can bypass into vision boards without verbs. Newly-formed ideas need protection not eternal silence; conjugate warns against telling everyone too soon and telling no one forever. Energy scattered across hobbies prevents depth; moody withdrawal when feedback arrives signals immaturity to heal gently. Test beliefs with small experiments rather than abstract debate. Redirect energy from self-surveillance to craft—one small true send to safe audience. Page reversed remains page; apprenticeship available if you stop disqualifying yourself. The desert in Rider–Waite is wide enough for practice; conjugate asks you to occupy it with one shipped fragment instead of infinite preparation.",
      guidance:
        "Write one limiting belief and run a week-long test against it. Send small work to a safe audience. Choose one thread; pause others without shame.",
    },
  },
  "wands-knight": {
    upright: {
      summary:
        "Photon Propagator: rearing horse charge—energy, passion, inspired action, adventure, impulsiveness riding fire into motion.",
      detail:
        "Rider–Waite's Knight of Wands charges on a rearing horse, desert behind, wand raised—fire in motion (Biddy: energy, passion, inspired action, adventure, impulsiveness). Photons propagate: enterprise as campaign, creativity as pursuit, passion that moves rooms and markets. Inspired action favors bold launches, travel, performances, pitches delivered with heat. Adventure calls—new role, new city, new relationship rhythm—provided you pack repair tools for the horse. Impulsiveness is the shadow named openly; speed excites and can trample. Ambition here is kinetic; planning happens mid-gallop. Leadership by example, not by spreadsheet—people follow heat when it points somewhere. Knight energy suits short intense pushes more than decade maintenance unless paired with queen or king maturity. Romance and creative affairs start fast; verify consent and follow-through. The card celebrates motion after too much waiting. Check gear before speed—legal, financial, relational—but do not use checklists to never ride. Photons at propagator frequency need steering and apology skills when trampling occurs.",
      guidance:
        "Channel passion into one campaign with a finish line, not endless detours. Apologize quickly if speed hurt someone; adjust pace without killing fire. Verify essentials—budget, boundaries, backup plan—then ride.",
    },
    reversed: {
      summary:
        "Reversed propagator: passion project scattered—haste, delays, frustration when charge stalls or tramples without steering.",
      detail:
        "Reversed Knight of Wands stalls or scatters the charge (Biddy: passion project, haste, scattered energy, delays, frustration). The horse rears without road—Photons spark, then dissipate across unfinished quests. Haste produces sloppy work, burned bridges, or promises your calendar cannot keep. Delays frustrate because identity tied to motion; when movement stops, self-worth crashes. Passion project may be valid but unsupported—no structure, no allies, no realistic scope. Scattered energy looks like starting three businesses, three novels, three situationships in one season. Frustration turns outward as blame or inward as shame. Reversed can also mean passion redirected into drama instead of deliverables—arguments as substitute for building. Adventure without ethics becomes extraction. Slow enough to steer: choose one vector, finish a chapter, repair one relationship strained by your velocity. Knight reversed is not never ride; it is ride with reins. Photons need finish lines and repair tools.",
      guidance:
        "Pick one passion project and define done for this month. Slow pace until steering returns—one commitment honored beats five begun. If delays are external, communicate; if internal, examine fear dressed as boredom.",
    },
    transverse: {
      summary:
        "Transverse Propagator: charge begun—adventure in motion, vector strong, destination still clarifying under the hooves.",
      detail:
        "Knight of Wands upright: passionate pursuit (Biddy). Transverse crossing is adventure in motion—vector strong, destination still clarifying. Rider–Waite's horse rears—fire visible, road unfolding—momentum before map fully legible. You may feel pulled into campaign—launch, move, perform, pitch—before all details settle. Transverse Photons propagate; leadership by example energizes others if heat points somewhere ethical. Impulsiveness shadow named: speed excites and tramples—pack repair tools—apology, budget, boundaries. Knight energy suits intense pushes more than decade maintenance unless paired with queen/king maturity. Inspired action favors bold starts with consent and follow-through verified. Adventure calls—role, city, relationship rhythm—check gear before speed but do not use checklists to never ride. Creative affairs and enterprises start fast here; steering mid-gallop is skill. Crossing asks one campaign with finish line, not endless detours. Photons need direction surface—deadline, milestone, ally— or they scatter as drama.",
      guidance:
        "Channel passion into one campaign with a finish line. Apologize quickly if speed hurt someone; adjust pace without killing fire. Verify budget, boundaries, backup—then ride.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: haste and scattered energy cross the ride—flame without steering, passion projects stalling in frustration.",
      detail:
        "Reversed Knight: haste, scattered energy, delays, frustration (Biddy). The conjugate crossing is reckless charge or stalled passion—flame without steering. Horse rears without road; Photons spark then dissipate across unfinished quests. Haste produces sloppy work, burned bridges, promises calendar cannot keep. Delays frustrate when identity ties to motion; stillness crashes self-worth. Passion project may be valid yet unsupported—no structure, allies, realistic scope. Scattered energy starts three ventures in one season; frustration becomes blame or shame. Passion redirected into drama substitutes for deliverables. Adventure without ethics extracts. Conjugate medicine: slow enough to steer—one vector, one chapter finished, one relationship repaired after velocity harm. Define done for this month on one project. Communicate external delays; examine internal fear dressed as boredom. Knight reversed is ride with reins, not never ride.",
      guidance:
        "Pick one passion project; define done for this month. Slow until steering returns—honor one commitment. Communicate delays; repair one relationship strained by speed.",
    },
  },
  "wands-queen": {
    upright: {
      summary:
        "Photon Eigenstate: throne of sunflowers and lions—courage, confidence, independence, social warmth, determination in steady radiance.",
      detail:
        "Rider–Waite's Queen of Wands sits on a throne adorned with lions and sunflowers, black cat at her feet, wand upright—warm authority, confident gaze (Biddy: courage, confidence, independence, social butterfly, determination). Photons in steady emission: enterprise led with encouragement, creativity that invites rather than intimidates, passion integrated with self-possession. Courage here is relational—you hold space while others shine. Independence does not mean isolation; the social butterfly aspect networks with authenticity, not performance alone. Determination shows as follow-through on promises and boundaries alike. The black cat signals intuition and shadow comfort—you know your moods and do not dump them on the court. Ambition mature enough to mentor, delegate, and celebrate. Leadership through radiant competence: you model the ethic you expect. Creativity flourishes in environments you heat without scorching. Confidence is magnetic when rooted in self-respect, not comparison. Queen energy asks you to occupy visibility without shrinking or dominating. Photons at eigenstate frequency are stable enough to entrain others—warmth generous because boundaries exist.",
      guidance:
        "Lead with encouragement—name others' strengths publicly. Protect your flame from envy without paranoia; boundaries keep warmth generous. Take one visible stand aligned with your values this week.",
    },
    reversed: {
      summary:
        "Reversed eigenstate: self-respect and confidence wobble—introverted retreat, charisma eclipsed, sense of self needing re-establishment.",
      detail:
        "Reversed Queen of Wands eclipses the throne's warmth (Biddy: self-respect, self-confidence, introverted, re-establish sense of self). Social butterfly cocooned—Photons dim through burnout, jealousy, or retreat after overgiving. Introverted phase may be healing, not failure: re-establish sense of self away from audience. Self-respect work surfaces when you notice people-pleasing, sexual or creative performance without joy, or controlling heat to avoid vulnerability. Confidence wobbles; you may provoke tests from others or test yourself harshly. Reversed warns against smothering—help that becomes control—or against disappearing when one criticism lands. Inner resources need refill: sleep, solitude, art without agenda. Enterprise suffers when the queen performs strength while depleted. Self-love here is strategic—return to court when body says yes, not when guilt says perform. Shadow: bitterness masked as honesty. Photons return when refill is honored, not performed.",
      guidance:
        "Honor retreat if it restores self-respect; set a gentle re-entry date. Refill before you lead—one day off, one creative act with no audience. Examine where charm became armor; speak one need plainly.",
    },
    transverse: {
      summary:
        "Transverse Eigenstate: warm authority forming—presence radiant yet tested, leadership crossing as becoming in the social field.",
      detail:
        "Queen of Wands upright: magnetic confidence (Biddy). Transverse is leadership crossing as becoming—you radiate, but the room still tests you. Rider–Waite's queen sits forward—sunflowers, lions, black cat—warmth and shadow integrated, yet role not fully settled in every context. You may feel competent yet scrutinized—new title, public platform, relationship where visibility increased. Transverse Photons entrain others when boundaries keep warmth generous; without boundaries, overgiving leads to eclipse. Social butterfly energy networks authentically; performance alone burns out. Courage here is relational—hold space while others shine. Determination shows in follow-through on promises and nos alike. Intuition—black cat—signals moods known, not dumped on court. Enterprise favors encouragement as leadership—name strengths publicly, mentor without smothering. Confidence rooted in self-respect, not comparison, is still forming under pressure. Crossing invites one visible stand aligned with values this week, sized to capacity.",
      guidance:
        "Lead with encouragement; name others' strengths. Protect flame with boundaries—not paranoia. Take one visible stand aligned with values.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: withdrawn self-doubt crosses charisma—social warmth cocooned, confidence rebuilding in private eclipse.",
      detail:
        "Reversed Queen: introverted, re-establish self (Biddy). The conjugate crossing is eclipse—social butterfly cocooned, confidence rebuilding in private. Photons dim through burnout, jealousy, retreat after overgiving. Introverted phase may heal, not fail—re-establish self away from audience. Self-respect work surfaces with people-pleasing, creative performance without joy, control masked as help. Confidence wobbles; criticism lands disproportionately. Smothering help becomes control; disappearing avoids vulnerability. Inner resources need refill—sleep, solitude, art without agenda. Enterprise suffers when queen performs strength depleted. Return to court when body says yes, not guilt. Shadow: bitterness masked as honesty. Conjugate honors retreat with gentle re-entry date; speak one need plainly where charm became armor. The black cat at the queen's feet knows shadow; let it teach you which warmth is genuine and which was performance for an audience you no longer need to impress.",
      guidance:
        "Honor retreat; set gentle re-entry date. Refill before leading—day off, private creative act. Speak one need plainly; examine charm as armor.",
    },
  },
  "wands-king": {
    upright: {
      summary:
        "Photon Sovereign: lion throne command—natural leadership, vision, entrepreneurship, honour channeling fire into legacy-scale enterprise.",
      detail:
        "Rider–Waite's King of Wands sits forward on a throne carved with lions and salamanders, wand in one hand, facing the future—command of fire (Biddy: natural-born leader, vision, entrepreneur, honour). Photons governed: enterprise at scale, creativity institutionalized, passion channeled into legacy. Natural-born leader does not mean born flawless; it means willingness to decide, absorb heat, and stand visible when outcomes land. Vision is the king's primary tool—story that aligns team, market, and values. Entrepreneur energy builds systems beyond personal charisma—succession, standards, ethics. Honour separates king from tyrant: keep promises, credit labor, punish betrayal without cruelty for sport. Ambition serves realm—family, company, community, craft tradition. Salamander symbolizes transformation through fire; you have survived enough cycles to guide others. Leadership invites scrutiny; welcome feedback that improves the realm. Creative kings protect makers while demanding excellence. The card favors bold ethical moves—launch, restructure, public stand—when grounded in long horizon. Photons at sovereign frequency require repair skills and praise before push.",
      guidance:
        "Write vision in one paragraph and share it with those affected. Model the ethic you demand—punctuality, honesty, courage. Praise labor before pushing harder; power lasts when people choose to follow.",
    },
    reversed: {
      summary:
        "Reversed sovereign: impulsiveness, haste, ruthlessness, impossible expectations—command warped into blast that burns the court.",
      detail:
        "Reversed King of Wands warps command (Biddy: impulsiveness, haste, ruthless, high expectations). Photons become blast—vision without mercy, entrepreneurship as extraction, honour traded for control. Impulsiveness at the top multiplies damage—fired messages, reckless pivots, public scapegoating. Haste skips consultation; high expectations become moving goalposts that burn the court. Ruthless may win quarters and lose decades—talent exits, trust erodes, family flinches. Reversed can also mean abdication—throne empty while chaos enters—or leader performing calm while resentful. Tyrant heat punishes vulnerability; makers hide innovation. Expectations unspoken ensure failure; micromanagement masquerades as standards. Shadow king uses charisma to avoid accountability. Reversed asks whether you lead to serve outcome or ego. Lower one impossible standard; repair one relationship damaged by haste. True kingship includes repair, not only decree. Photons regain coherence through pause, consultation, and changed behavior—not only apology words.",
      guidance:
        "Pause major decrees twenty-four hours; consult one dissenting voice. Lower a standard that exists only to prove dominance. If you have been harsh, apologize with changed behavior, not only words.",
    },
    transverse: {
      summary:
        "Transverse Sovereign: vision declared—command forming, standards set, realm aligning but not yet fully in accord.",
      detail:
        "King of Wands upright: entrepreneurial honour (Biddy). Transverse crossing is command forming—standards set, followers not yet all in accord. Rider–Waite's king faces future—wand ready, lions and salamanders carved—transformation through fire acknowledged. You may hold title or influence while culture still calibrates—policies new, team testing, family adjusting. Transverse Photons require vision spoken plainly—one paragraph shared—so alignment can begin. Honour separates sovereign from tyrant: credit labor, keep promises, punish betrayal without sport cruelty. Entrepreneur builds systems beyond charisma—succession, standards, ethics. Leadership invites scrutiny; welcome dissent that improves realm. Bold moves—launch, restructure, public stand—need long horizon grounding. Makers need protection and excellence demands; balance is live negotiation. Crossing asks you model ethic demanded—punctuality, honesty, courage—and praise before push. Power lasts when people choose to follow.",
      guidance:
        "Write vision in one paragraph; share with those affected. Model the ethic you demand daily. Praise labor before pushing harder; power lasts when people choose to follow.",
    },
    conjugate: {
      summary:
        "Conjugate crossing: ruthless haste crosses honourable rule—vision without mercy, expectations that burn court and talent.",
      detail:
        "Reversed King: impulsiveness, haste, ruthless, high expectations (Biddy). The conjugate crossing is tyrant heat—vision without mercy, expectations burning court. Photons become blast—reckless pivots, fired messages, scapegoating. Haste skips consultation; goalposts move silently. Ruthless wins quarters, loses decades—talent exits, trust erodes. Abdication shadow—empty throne, chaos enters—or calm performed while resentful. Makers hide innovation when vulnerability punished. Micromanagement masquerades as standards; charisma avoids accountability. Conjugate asks: lead for outcome or ego? Pause major decrees twenty-four hours; consult dissent. Lower one impossible standard; repair relationship damaged by haste. True kingship includes repair—changed behavior, not only words. Photons regain coherence through pause and praise before push. Rider–Waite's salamander survives fire; conjugate demands you survive your own heat without scorching the realm you claim to serve.",
      guidance:
        "Pause decrees twenty-four hours; consult one dissenting voice. Lower a dominance standard. Apologize with changed behavior if harshness landed.",
    },
  },
};
