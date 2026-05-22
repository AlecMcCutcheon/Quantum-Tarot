# Dual (entangled) reading synthesis

We do **not** pre-write 78×78 pair texts. Synthesis is procedural via a **tag + decision tree** engine in `src/data/resonance/`.

## Combinatorics (matches the app)

| Quantity | Formula | Count |
|----------|---------|------:|
| Unordered card pairs (two different cards) | 78×77÷2 | **3,003** |
| Orientation layouts per pair | Primary: 4 choices; partner **must** invert (`invertOrientation`) | **4** |
| Unordered dual states | 3,003×4 | **12,012** |

Going from 72 to 78 cards: C(72,2)×4 = 10,224 → 12,012 (**+1,788** states).

**Ordered draws** (primary vs partner matter): 78×77×4 = **24,024** distinct sequences. The partner draw also skips the same card as the primary (`performPartnerDraw`).

If both cards had **independent** orientations (4×4), unordered pairs would be 3,003×16 = 48,048 — but entanglement fixes the partner pole, which is why **4** per matchup is correct here.

## Per-card semantics (`cardSemantics.ts`)

Each card carries:

| Field | Purpose |
|-------|---------|
| `themes[]` | Keywords (e.g. `justice`, `leap`, `bond`) for overlap detection |
| `energy` | expansive · contractive · liminal · disruptive · integrative · illuminating · binding |
| `role` | initiator · stabilizer · revealer · transformer · connector · challenger · healer |
| `contributes` | Phrase: what entangling this card brings |
| `stitch` | Verb for relation sentences (`opens`, `weighs`, `binds`, …) |

Majors: full profiles. Minors: per-pip profiles in `minorSemantics.ts` with suit composition fallback.

## Decision tree (`dualSynthesis.ts`)

1. **Shared themes** — intersection of `themes[]` → relation hint  
2. **Theme relation** — resonance · friction · crosscurrent · catalysis · veil · grounding  
3. **Energy pair** — lookup table (`expansive+contractive`, etc.) → narrative clause  
4. **Arcana chemistry** — major-major / major-minor / …  
5. **Rank / suit notes** — same suit, same rank different suit, cross-suit minors  
6. **Orientation frame** — primary pole sets entanglement frame; partner is always opposite  
7. **Synthesis archetype** — harmonic_field · productive_tension · rupture_line · threshold_gate · emblem_story · pole_inversion · lateral_braid  

## Output structure

- **Summary** — archetype template + card names + shared theme words  
- **Detail** — eight labeled sections (frame, arcana/roles, poles, energy, primary voice, partner voice, stitch, interference)  
- **Primary/partner voice** — solo summary **plus** excerpt from solo `detail` (not truncated mash)  
- **Guidance** — archetype-specific merge of both cards’ solo guidance  
- **Meta** (`DualSynthesisMeta`) — chips for UI: archetype, relation, axis, shared themes, `sections[]`  

## API

```ts
buildDualReading(input) → { reading, meta }
```

Constants: `ENTANGLED_STATE_COUNT` in `dualSynthesis.ts`.

## Variation without 12k hand-writes (`pairVariation.ts`)

Each pair gets a stable `pairSeed` from sorted card ids + primary orientation. That seed picks:

- Summary opener + bridge (per archetype)  
- Major-specific voice lines (`MAJOR_PAIR_VOICE`, 2+ lines per major per role)  
- Minor pip templates (4 variants) using `stitch` + `contributes`  
- Frame, pole, interference, and guidance variants  
- Arcana chemistry variants  

Same two cards at the same primary pole always get the same variant set; different pairs diverge without a 3,003-row table.

## Extending

- Add lines to `MAJOR_PAIR_VOICE` for a major  
- Add rows to `ENERGY_PAIR_NARRATIVE` for rare energy pairs  
- Add variants in `SUMMARY_OPENERS`, `GUIDANCE_VARIANTS`, etc.  
- Tune per-pip hooks in `minorSemantics.ts`
