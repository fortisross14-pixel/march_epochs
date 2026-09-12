# March of Epochs — React v0.10.0

Mobile-first visual redesign matching the approved imperial navy/gold art direction.

## This pass
- Keeps the current battle implementation unchanged.
- Reworks the rest of the game around a dark navy + antique gold visual system.
- Uses image-backed PNG controls for primary actions and tabs.
- Adds selected-state gold highlights, blue active navigation, ornate panel framing, and stronger card hierarchy.
- Restyles Campaign, Artifacts, People, Armies, Technology, modals, pickers, pack flow, and bottom navigation.
- Adds lightweight UI assets under `src/assets/ui/`.
- Responsive phone-first layout with larger tablet/landscape breakpoints.

## Build
```bash
npm install
npm run build
```

The project keeps the GitHub Pages-compatible relative Vite base and the permission-safe Vite command used in prior versions.
