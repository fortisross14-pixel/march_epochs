# March of Epochs React v0.7.0

Refinement pass focused on campaign flow, card presentation, army selection clarity, and battle UX.

## Included in this pass
- Build script already uses `node ./node_modules/vite/bin/vite.js build` to avoid the earlier `vite: Permission denied` issue.
- Premium card PNGs trimmed and near-white backgrounds removed for cleaner transparent presentation.
- Premium card / loadout / collection miniatures now show a single dynamic stars + copies overlay.
- Campaign browser redesigned as a one-campaign-at-a-time carousel with left/right arrows.
- Campaign progress now tracks:
  - highest level reached
  - best star result (up to 3)
- Start button moved into the active campaign panel.
- Muster flow redesigned around empty army slots with explicit unit picking.
- Battle screen updated with:
  - commander bubble at the bottom-left
  - actions docked beside the commander
  - finish deployment control next to the commander area
  - battle pause while Focus Fire / Reinforce target selection is active
- Campaign stars logic:
  - 1 star = complete campaign
  - 2 stars = finish with at least 65% total army condition
  - 3 stars = finish without losing a squad

## Notes
This is still a prototype pass, but the structure now matches the requested direction much more closely and is set up for further content expansion (more campaign art, more unit art, richer battle presentation, etc.).
