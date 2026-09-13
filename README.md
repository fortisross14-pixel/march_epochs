# March of Epochs — React v0.14.0

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
