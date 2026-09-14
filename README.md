# March of Epochs React v0.18.0

## Pass 1 — Age I visual asset consistency

This pass is deliberately visual rather than mechanical. Campaign I logic and battlefield systems remain for the later passes.

### Replaced / upgraded
- New illustrated Age I portraits for Tribal Elder, Merchant Prince, Veteran Commander, Hunter Captain, Narmer and Sargon.
- Dynamic collectible card fronts/backs now use the same navy/gold/rarity language for these Age I people.
- Illustrated collectible art cards for the full early Artifact pool.
- Technology cards no longer rely on emoji glyphs for the Age I / early research set.
- Illustrated Rally, Focus, Reinforce and Special command cards replace text-symbol command art.
- Consistent HP, Damage, Armor, Attack Speed and Range icons.
- Pack Store / reveal now uses chest art and collectible Artifact cards.
- Achievement trophy and locked-state art moved toward the shared UI kit instead of emoji.
- Army summaries and Muster stats now use the same visual icon family.

### Validation
- Non-JSX modules passed `node --check`.
- App / Battle / CardFlip JSX passed a TypeScript syntax parse (`tsc --noEmit --noResolve`).
- Full Vite production build was not run because external npm dependency installation is unavailable in this environment.

This pass focuses on a cleaner collectible UI, better landscape responsiveness, and a more logical campaign-start flow.

## Key changes in this pass
- **Campaign start flow rebuilt** into a 2-step preparation wizard:
  1. Select People and Technologies (or see them locked)
  2. Select Armies and begin the run
- **Artifact inventory redesigned** into compact collectible tiles with rarity frames, centered transparent item art, level badges, quantity count, and an animated upgrade-ready marker.
- **Artifact detail modal added** with a larger framed presentation, effect summary, inventory counts, evolve requirements and direct equip CTA.
- **Landscape tablet / laptop pass**: wider modal widths, denser responsive grids, cleaner campaign showcase layout, more efficient muster layout, and tighter content spacing.
- **Modal chrome improved** with asset-backed close control.
- Existing inventory logic is preserved: equipped artifacts remain hidden from the inventory list and are managed from unit equipment views.

## Existing prototype foundations retained
- 15 campaigns in the progression shell
- full age / unit / artifact / hero content backbone
- early progression systems for Artifacts, People, Technology and Army training
- current battle system preserved for now

## Notes
This pass is focused on shell / UI / UX improvements rather than deep rebalance. Battle scene visuals remain intentionally unchanged for the later dedicated battle pass.