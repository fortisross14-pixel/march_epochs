# March of Epochs — React v0.12.0

This pass stabilizes the early-game UX and establishes the full historical content shell.

## Immediate gameplay fixes
- Muster layout rebuilt for phone screens: compact squad cards, no giant empty panels.
- Rally / Focus / Reinforce can be cancelled by tapping the active command again.
- Rally and Focus command cooldowns reduced substantially (about 6 seconds).
- Command target pause auto-cancels after about 2 seconds if no selection is made.
- Mountain / river routing upgraded to denser A* pathfinding with segment validation and smoothing.
- Battle stats now include a horizontally scrollable **Your Enhancements** strip. It shows cumulative run bonuses, equipped technologies, unit levels and equipped artifacts. These bonuses apply only to the player's army.
- Added melee / spear artifact support and two functional early examples:
  - Hardened Bronze Edges
  - Reinforced Bronze Spearheads

## Full content backbone
The code now defines:
- 15 campaigns
- 225 campaign encounters (15 per campaign)
- 11 historical age groupings
- 55 unit types / unit shells
- complete hero rarity pools by age
- artifact families by age
- technology roadmaps by age

See `CONTENT-SHELL.md` for the complete lists.

## Campaign sequence
1. First Wars
2. Bronze & Iron Empires
3. Greeks, Persia & Macedon
4. Rome, Carthage & Republics
5. Empire in Crisis
6. Kingdoms of the Early Middle Ages
7. Caliphates & Expansion
8. Crusades & Steppe Empires
9. Late Medieval Wars
10. Renaissance Wars
11. Oceans & Empires
12. Kings, Enlightenment & Revolution
13. Industrial Nations
14. World at War
15. The Modern Battlefield

The first two retain the current more-developed historical briefings. Later campaigns are intentionally shell-level content for now: named encounters and representative unit pools exist, while final art, exact balance and bespoke mechanics will come in later passes.

## Save compatibility
The v0.11 localStorage key is intentionally retained so current browser progression is preserved.
