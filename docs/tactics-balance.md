# Tactical balance update

Implemented on `codex/pass-2-battlefield-production`. Changes are uncommitted; prior workspace changes are preserved.

## Gameplay

- Slingers: range 190 → 260; Archers: 235 → 310; Hunter Bands: 155 → 230. Unfocused ranged squads prefer a clear shot already within range. Water allows fire; cliffs block it.
- Focus persists until the marked squad dies or the player chooses another target. Retargeting has no cooldown. The command displays “Target locked” while an order is active.
- Every ordinary victory reward screen offers Reinforcement when a survivor is wounded, alongside the usual choices. Selecting it opens a squad picker and fully heals that one survivor instead of granting an upgrade. Full-health squads are disabled; the player can return to the reward choices. Milestones retain their existing whole-army recovery / expansion choices.
- World dimensions increase from 520 × 760 to 572 × 836. Terrain and deployment coordinates scale together. Squads occupy approximately 13% less screen width at the same viewport; command controls are more compact to give the field more height. Selected ranged squads show their range boundary. Display separation is limited so squads stay near their real combat positions.
- Bridge navigation now checks complete movement segments against terrain. It retains necessary corner waypoints and validates recalculated steps, preventing both water shortcuts and stalls at bridge edges.

## Progression

- Age I levels 2–9 each add 12% base Health, 8% base Damage, 3% base attack speed and 0.5 Armor, plus the existing rotating level bonus. Upgrade descriptions match these values.
- Victory damage and health upgrades grant 12% per pick, capped at +80%; attack speed grants 10%, capped at +60%; range grants 10%, capped at +40%.
- Age I passive recovery restores 20% of missing health between battles, before technology and People bonuses.
- Training, equipped artifacts, People and victory bonuses multiply together. Enemy encounter data still has fixed strength independent of player progression.

## Verification

- `npm.cmd test`: all 32 tests pass, including bridge firing and eventual melee crossing, blocked line of sight, permanent Focus, target replacement/death, one-squad reinforcement, cumulative bonuses and equipped campaign progression.
- `npm.cmd run build`: passes.
- `git diff --check`: passes.
- `node scripts/tactics-balance.mjs`: 64 deterministic campaign simulations. Full results are in [tactics-balance.json](./tactics-balance.json). These are scripted pilot results, not measured human playtests.

The benchmark uses level-one Sargon, level-one Merchant, two level-one artifacts per combat unit type, and level 4 or 5 units. It compares starts with and without Agriculture. Each row covers eight reward/random seeds.

| Unit level | Starting squads | Pilot | Minimum battles cleared | Average squads lost through battle 13 |
| --- | --- | --- | --- | --- |
| 4 | 3 | Average | 14 | 0.5 |
| 4 | 3 | Skilled | 15 | 0 |
| 5 | 3 | Average | 15 | 0.375 |
| 5 | 3 | Skilled | 15 | 0 |
| 4 | 2 | Average | 11 | 2.625 |
| 4 | 2 | Skilled | 11 | 2.5 |
| 5 | 2 | Average | 13 | 1.25 |
| 5 | 2 | Skilled | 15 | 0.375 |

The intended low-loss progression is achieved by equipped three-squad starts at levels 4–5. Two-squad starts at level 4 remain harder; level 5 reaches at least battle 13 cleared in every sampled seed. No player-specific difficulty scaling is used.

Live visual and click-through verification remains pending: the Browser runtime reported no available browser. Before publishing, check deployment range circles, a bridge battle, persistent Focus highlighting, and the reward squad picker on phone and desktop viewports.
