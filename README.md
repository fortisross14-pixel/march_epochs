# March of Epochs — React v0.11.0

Mobile-first stabilization pass focused on early balance, battle controls, Armies UX, Artifacts packs, Achievements, and terrain pathfinding.

## Main changes

- Fresh save starts with **Warriors + Slingers**.
- Every current army now has an explicit permanent unlock route through a starting unlock, technologies, or a named Leader/General.
- Campaign I battles 1–5 were rebalanced around two primitive squads plus a small number of early Artifact/EXP upgrades.
- First Wars now uses a proper illustrated campaign image rather than the previous geometric SVG treatment.
- Re-cropped unit UI art for Warriors, Spearmen, Slingers, Archers, Cavalry and War Elephants to remove neighboring sprite-sheet fragments.
- Army screen is now compact and tappable. Unit detail contains:
  - large clean art
  - Level and stats
  - prominent EXP Level Up button
  - two equipped Artifact slots
  - unlock path
- Artifacts can no longer be purchased directly. The Artifacts screen now has:
  - Army Artifacts
  - Hero Relics
  - Pack Store
- Pack Store includes cheap/advanced Artifact packs and, once People unlocks, standard/premium Hero packs.
- Workshop evolution is integrated directly into owned Artifact cards.
- Achievements now have progression families, including:
  - victories: 1 / 3 / 5 / 10 / 20 / 50 / 100
  - enemy squads destroyed: 1 / 2 / 5 / 10 / 25 / 50 / 100
  - Progression / People / Artifacts / Collection milestones
- Completed and claimable Achievements are shown first.
- Popups stop above the persistent bottom navigation and retain a visible close button.
- Battle command target selection now shows explicit friendly/enemy target chips, which is especially useful when melee units overlap.
- Rally / Focus / Reinforce pause has a short automatic timeout (3 seconds; Rally destination 2.4 seconds).
- Focus duration reduced to 5 seconds. Rally cooldown reduced.
- Ground pathfinding now uses a coarse A* route when direct movement is blocked, so units can route around mountains and through river bridges rather than stopping at the obstacle.

## Early balance target

A new account should normally:

1. Beat around 0–2 encounters on a rough first attempt.
2. Earn enough Gold/EXP/Achievement rewards to open a cheap Artifact pack and train Warriors/Slingers after a couple of attempts.
3. Reach and clear 1-5 realistically with two squads plus a couple of modest permanent improvements.
4. Unlock People at 1-6, creating the next meaningful power jump.
5. Complete Campaign I in roughly 3–4 meaningful progression runs rather than through repetitive grinding.

## Build

```bash
npm ci
npm run build
```

`npm run build` uses the permission-safe Vite invocation through Node.
