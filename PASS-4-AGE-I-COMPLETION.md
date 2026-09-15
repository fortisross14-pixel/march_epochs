# Phase A, Pass 4 — Age I progression and completion

Implemented and validated on 2026-09-14. No commit or push.

The playable Age I slice now connects research, training, artifacts, People, objectives and campaign settlement. The intended run curve is substantially represented by deterministic pilots and a real fresh-save browser run. **This is not a claim that all planned Age I content is shipped:** War Carts and twelve catalog People remain unavailable; the Sargon/Bronze Guard art dependency is also documented in [the missing-art manifest](docs/pass4/MISSING-ART.md).

## Initial audit

Read `CONTENT-SHELL.md`, `DESIGN-ROADMAP.md`, `AGE1_PASS_NOTES.txt`, `PASS-1-AGE-I-VISUAL.md`, and the actual implementation. The source was newer than several planning documents. The audit was reported before implementation; raw starting data and baseline pilot results are preserved in [before.json](docs/pass4/before.json).

| Area | Before this pass | Implementation files |
|---|---|---|
| Fresh economy | 120 Gold, 20 EXP, two unequipped artifacts; early victories paid too little relative to purchases | `src/data.js`, `src/game/progression.js` |
| Run progression | Baseline seed-1 pilots reached Battles 4–8 depending on equipment and reward decisions; not a measured human distribution | `src/components/Battle.jsx`, extracted `src/game/combat.js`, `scripts/balance.mjs` |
| Permanent training | One tiny stat increase per level, easily overshadowed by temporary +10 Armor or compounded +12% upgrades | `src/data.js`, `src/game/battleRules.js` |
| Research | Locked until Campaign I was already complete, blocking most of its own units | `src/App.jsx`, `src/data.js`, `src/game/progression.js` |
| Unit roster | Warriors/Slingers worked; Spears/Archers/Horsemen were gated out; Hunter Bands and War Carts were shell entries | Same files, `src/assets.js`, `src/components/battlePresentation.js` |
| Artifacts | Hardened Spear Shaft absent; direct purchase handler had no UI; random packs could contain unusable spear gear | `src/App.jsx`, `src/data.js`, `src/components/MenuArtwork.jsx` |
| Equipment | Equipping an item removed every matching equipped copy elsewhere; fully equipped collections hid Workshop access | `src/App.jsx`, `src/game/progression.js` |
| People | Six implemented out of eighteen catalog entries; several described bonuses did nothing or disagreed with combat | `src/data.js`, `src/components/CardFlip.jsx`, shared gameplay rules |
| Encounters | Fifteen battles existed; no operational optional objectives/time limit/distinct finale; one enemy deployment intersected a mountain | `src/data.js`, `src/game/combat.js`, `src/components/Battle.jsx` |
| Settlement | Reached battle displayed as cleared; repeated conquest incremented completion achievements; research TP was unavailable early | `src/App.jsx`, `src/storage.js`, `src/game/progression.js` |

## Final run model

Run `npm run balance -- 16`. This produces 16 seeds for each of three purchase/play policies, **48 fresh-save paths and 192 runs**, using production combat, reward, equipment and settlement functions. No developer account or stored browser progression is used. Enemy data never depends on account power or run number.

| Pilot | Run 1 reached | Run 2 reached | Run 3 reached | Run 4 reached | Run 3 clears | Run 4 clears |
|---|---|---|---|---|---|---|
| Average | 3 | 5–9, median 6 | 9–14, median 11 | 12–15, median 15 | 0/16 | 10/16 |
| Skilled | 3 | 7 | 10–15, median 14 | 15 | 5/16 | 12/16 |
| Inefficient purchaser | 3 | 4–6, median 4 | 9–11, median 9 | 14–15, median 15 | 0/16 | 5/16 |

“Reached 15” can mean defeat there; the clear columns distinguish completion. These are repeatable heuristic estimates, **not human playtest completion probabilities**. Full encounters, purchases, banks, equipment and unit levels are in [after.json](docs/pass4/after.json); the compact output is [run-summary.json](docs/pass4/run-summary.json).

Average uses auto deployment, health-based Reinforce, practical reward choices, Archery-first research, balanced training and targeted gear. Skilled uses a protected rear line, Focus, Agriculture-first research and a different commander/research route. Inefficient uses ordinary combat decisions but buys random packs, spreads EXP over reserves and follows Copper-first research. Pilots can recruit different units from actual random reward choices. No policy checks the run number to decide whether enemies should win.

An exploratory Wheel-first path delayed Agriculture and repeatedly stalled around Battles 5–8 by Run 4. Wheel now has an actual Age I movement bonus, but deliberately postponing army capacity and training the wrong reserves remains costly. Agriculture is a particularly strong foundational purchase; further human testing should assess whether its value crowds out too many alternatives.

## Economy before / after

Values below mean **defeat at the named battle** (previous battles cleared), except Battle 15, which means full conquest. These are run earnings, excluding starting funds, achievements, People multipliers, Writing, objectives and first-clear/star bonuses.

| Milestone | Before Gold / EXP / TP | After Gold / EXP / TP | Optional objective Gold available |
|---|---|---|---|
| Reach Battle 3 | 32 / 19 / 0 | 52 / 24 / 1 | +12 |
| Reach Battle 6 | 86 / 55 / 0 | 148 / 79 / 2 | +34 |
| Reach Battle 10 | — | 332 / 194 / 3 | +72 |
| Reach Battle 11 | 216 / 137 / 0 | 390 / 232 / 3 | +84 |
| Clear Battle 15 | 441 / 271 / 0 | 794 / 492 / 5 | +150 |

First research unlock adds 2 TP once. First conquest adds 60 Gold / 30 EXP once. Each newly earned campaign star adds 15 Gold once (maximum 45). Optional objective figures are ceilings, not assumed guaranteed income. [Economy and isolated power comparisons](docs/pass4/economy-power.json) retain the exact inputs/results.

| Source / sink | Before | After |
|---|---|---|
| Fresh save | 120 Gold, 20 EXP, Leather + Sling Pouch | 20 Gold, 0 EXP, no artifacts |
| First two wins then defeat | 32 Gold / 19 EXP base | 52 Gold / 24 EXP base; typically 64 Gold with both objectives |
| Artifact packs | 45 for 1 / 95 for 2 | 35 for 1 / 65 for 2; every item has a discovered eligible unit |
| Guaranteed early supplies | Handler inaccessible | Leather/Bone 30, Axe/Spear Shaft 32, Sling Pouch 38 |
| People packs | 100 for 2 / 220 for 3; 15–30 Gold return | 65 for 2 / 140 for 3; 8–16 return; larger pack guarantees Rare+ |
| Age I People promotion | 150 / 250 / 500 / 1000 / 2000 Gold | 55 / 95 / 160 / 260 / 400; maximum depends on rarity |
| Artifact evolution | 20 / 45 / 80 / 130 Gold | Same; 2 / 4 / 6 / 8 collection copies, not consumed |
| EXP cost | Existing increasing cost, first level 10 | Same cost; first eight Age I levels now improve all four combat stats |
| Research | Only after conquest | Win Battle 2; Fire granted; other Age I research costs 2–3 TP |
| Extra technology slots | 180 / 360 / 650 Gold | Unchanged; three starting slots are sufficient for the tested paths |
| Early achievements | Several large stacked awards | Wins 1/3/5: 12/15/25; first two kills 6 each; first run/train/pack/equip 5 each; first flawless 10 |

A normal first browser run banked 64 Gold and 24 EXP, leaving **84 Gold including the initial 20** before achievement claims: enough for two useful chosen supplies and two first training levels. Claiming the five ready early achievements adds 39 Gold and can fund an additional modest purchase. Later achievement rewards still provide catch-up income. Claims, first-clear rewards and star improvements cannot be repeatedly awarded for the same achievement.

## Content and gameplay changes

**Units:** six of the seven specified Age I formations are playable. Warriors and Slingers start available. Hunter Bands unlock after winning Battle 3 or obtaining Hunter Captain; they reuse the approved bow-unit miniature and battlefield sprite. Archers require selected Archery, Spearmen selected Copper Working, Horsemen selected Domestication. War Carts remain unavailable for missing art. Bronze Guard is a later-Age Sargon signature and is excluded from Age I; its existing later-Age behavior is preserved.

Age I training adds 5.5% base HP, 3.5% base Damage, 1.2% base attack speed and 0.3 Armor per level through Level 9, plus the existing rotating stat increment. The next-level UI reports the combined increment. Subsequent levels retain the old small growth. Permanent equipment/levels make fixed early encounters easier; temporary rewards are limited to +42% HP/Damage, +36% attack speed, +25% range, +15 Armor, +60% reinforcement speed and +12 percentage points of healing.

**Artifacts:** all five specified Origins artifacts work, including the new Hardened Spear Shaft. Four existing bronze/ranged supplies remain in the early pool to preserve usable existing content. Level-1 effects: Leather +14% HP; Sling Pouch +13% attack speed (Slingers); Axe Grip +12% melee Damage; Spear Shaft +8% HP/+6% attack speed (Spears); Bone Charm +7% HP/+2 Armor; Bronze Armor +6 Armor; Bronze Edges +10% Damage/+3% attack speed; Spearheads +10% Damage/+2 Armor; Edged Projectiles +11% ranged Damage. Each effect is tested on an eligible unit. Copies equip independently, a unit type cannot equip the same artifact twice, replacement returns the old copy, and equipped collections remain accessible for evolution.

**People:** Elder and Veteran enter after the fifth win, ready for the next run. The six available cards have cumulative effects matching their live descriptions: Elder economy/recovery, Merchant economy/discounts, Veteran army Damage/Armor, Hunter ranged specialization/signature Hunter Bands, Narmer army endurance, Sargon melee/capacity/momentum. Sargon's momentum uses battles won and a 10% attack-speed cap. His final level provides army HP even while the Age I signature art is unavailable. Later-Age People promotion prices and unlock pools remain separate. [Missing-art manifest](docs/pass4/MISSING-ART.md) lists the twelve unshipped catalog entries.

**Technology:** all eight specified Age I technologies are available after the research unlock. Fire + Archery provides the existing +12% ranged Damage combo. Agriculture adds a squad and recovery; Domestication and Copper unlock units; Irrigation improves reinforcement/recovery. Wheel now provides +8% Age I movement, Writing +15% victory EXP. Later technologies require completing Campaign I. Units must meet both permanent research and selected-loadout requirements.

**Encounters:** fifteen historical briefings and terrain layouts retained. Later formations introduce Spears, Horsemen and Archers. Battle 15 has six enemy squads including a Coalition Guard with +18% HP, +10% Damage and +3 Armor beyond its encounter stats. Its general enemy multiplier is 1.46 versus Battle 14's 1.35. Optional objectives rotate between no squad losses, at least 50% surviving army condition, and a 12/14/18-second victory target. Every objective is achievable with a developed formation. Each Age I battle has a disclosed 180-second limit to end pathological stalemates; exceeding it ends the run. Reinforcement controls are unchanged.

Milestones after wins 5, 10 and 14 retain expansion/recruitment versus full recovery. Expansion cannot exceed six squads or dead-end when recruitment is full. Victory stars retain their three conditions: conquest, at least 65% final army condition, and no squads lost over the run. Stars and first-clear bonuses are explained in Battle Info.

**Persistence:** old currency, inventory, levels and unlocks are preserved. Reached/cleared records are migrated conservatively, and qualifying older saves receive early research/People access once. Pack payment and contents are saved together before the cosmetic reveal; duplicate results mark only the first actual new discovery.

## Validation

- `npm test`: 25 passing tests covering fresh state, every legal starter composition, unlock gates, all artifact effects, all available People, research, equipment copy conservation/replacement, promotion/evolution costs, pack fulfillment, achievements, star/first-clear grants, legacy migration, deterministic paths, timeout boundaries, recruitment caps and all 15 encounter objectives.
- `npm run build`: production build passes.
- All fifteen encounters tested with reachable deployments and a developed formation; all fifteen optional objectives achieved in that validation fixture. This fixture proves reachability, not fresh-save balance.
- Additional [starter formation probes](docs/pass4/starter-formations.json): two Warriors reach Battle 4; mixed or two-Slinger armies reach Battle 3 across the sampled seeds. No starter composition clears the campaign.
- All fourteen future campaigns' complete encounter data match the captured pre-pass SHA-256 fingerprint.
- Real isolated production-browser fresh run: wins Battles 1–2, loses Battle 3, banks the expected rewards, receives research notice, buys/equips an artifact, and trains a Warrior. The user's existing save was not read or reset.
- Campaign, People, Armies, Technology and Artifacts checked at 360, 390 and 430px. No horizontal overflow, offscreen buttons or broken visible images in [browser-checks.json](docs/pass4/browser-checks.json). Derived progression fixture used for unlocked-menu checks; distinct from the genuine fresh-run test.
- Screenshots in `docs/pass4/` record muster/loadout, deployment, defeat/settlement, research, equipment/training, People and pack rewards.

## Remaining limits

1. Bespoke art still blocks War Carts and the twelve additional People entries; Bronze Guard needs approved art before an Age I signature treatment. No emoji/procedural substitutions were added. This prevents claiming the entire planned content catalog is production complete.
2. Automated pilots simplify human decisions. Human Android playtests should confirm the run distribution, Agriculture's strong value, optional-objective timing and touch comfort. Poor research detours can still delay progression beyond four runs.
3. No physical Android-device performance, suspension/resume, packaging or App Store submission test was performed in this pass. Browser emulation does not replace those checks.
4. Future campaigns remain the existing content shell. This pass does not certify their balance or missing art.

## Files changed in this pass

Existing source edited: `package.json`, `src/App.jsx`, `src/assets.js`, `src/data.js`, `src/storage.js`, `src/components/Battle.jsx`, `src/components/CardFlip.jsx`, `src/components/MenuArtwork.jsx`, `src/components/battlePresentation.js`, `src/menu.css`.

Added: `src/game/combat.js`, `src/game/battleRules.js`, `src/game/progression.js`, `scripts/balance.mjs`, `tests/age1.test.mjs`, this report, and the evidence/manifest files enumerated in [FILES.txt](docs/pass4/FILES.txt).

Existing uncommitted Pass 2/3 work is retained. `src/components/Modal.jsx`, `src/main.jsx`, `src/components/battle.css` and the battlefield raster assets were not changed by Pass 4.
