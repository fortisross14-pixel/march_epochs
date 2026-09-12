# March of Epochs — React v0.7.1

This pass restores the earlier procedural battle feel and only changes the interaction/layout around it.

## Battle
- Procedural moving squads are retained on the battlefield.
- Rivers again force ground units through bridges; mountains block movement and line-of-sight.
- Deployment is direct on the battlefield:
  1. all available squads start visible in the deployment zone;
  2. click a squad to select it (green ring);
  3. click anywhere valid in the deployment zone to move it there.
- Rally pauses combat, asks you to select one allied squad, then pauses until you choose its new destination. The squad then moves there using terrain-aware pathing.
- Focus pauses combat until you click an enemy. Every allied squad focuses that target; ranged units move until they have range and line-of-sight.
- Reinforce pauses combat until you click one surviving allied squad, then heals that squad by the current replacement percentage.
- Special remains general-specific and disabled until unlocked.

## Responsive combat layout
- Mobile: battlefield is the main screen, army stats overlay the top, and the general miniature + four actions overlay the bottom.
- Desktop/tablet landscape: battlefield stays on the left; stats are top-right and commander/actions bottom-right.

## Character art
Premium characters now have three asset roles:
- full front card;
- full back card;
- dedicated transparent miniature.

Dedicated miniatures are currently included for Cleopatra, Hannibal and Napoleon.

## Unit selection art
The muster/selection UI now includes dedicated art miniatures for:
- Warriors
- Spearmen
- Slingers
- Archers
- Horsemen
- War Elephants

Battlefield units themselves intentionally remain procedural.

## Campaign flow
- One campaign is shown at a time with left/right arrows.
- Campaign II remains blocked until Campaign I is completed.
- Each campaign persists highest battle reached and best star result.
- 1★: complete the campaign.
- 2★: complete with at least 65% final army condition.
- 3★: complete without losing a squad.

## GitHub Pages
The included Action installs dependencies and builds the Vite project from `main`.

Build command:
```bash
npm run build
```
