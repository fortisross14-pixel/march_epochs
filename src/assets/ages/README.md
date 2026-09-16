# Age-based game art

Use canonical `AGES[*].id` values from `src/data.js` as folder names. Age numbers are display/order metadata, not keys: `origins`, `bronzeIron`, `classical`, …, `industrialAge`, `worldWars`, `modernAge`.

```text
ages/<ageId>/
  people/                 Portraits, existing card variants, index.js, manifest.json, preview.html
  units/<unitId>.png       Approved battlefield miniatures
  technology/             Illustration atlas and cell manifest
  artifacts/              Equipment illustrations (for subsequent migrations)
  campaigns/<campaignId>/
    cover.png             Campaign-specific artwork
```

`people.js` assembles age-specific People registries. `src/assets.js` remains the public asset interface. Register future People in their age module and add their `ageId` to the content definition; filters then work without a new switch or screen. Add new ages to `AGES`, and new campaigns to their age's `campaigns` directory. Shared UI remains outside age folders.

The active People assets, approved unit PNGs and campaign covers are organized here. Existing shared SVG technology/item icons, artifact cutouts, battlefield textures and UI art retain their current paths. New work should use this structure; avoid another `people_age2`/`cards_age3` directory parallel to it.

People images contain character art, not baked progression text or rarity badges. Existing UI renders live rarity, stars, level and copies. The three retained premium characters also retain their original front/back card variants.

Superseded People images are preserved under `art-source/retired/people/` for comparison, outside runtime assets. Do not import those files into the game.

The Age I technology atlas uses a regular four-column, two-row grid. `TechnologyArtwork.jsx` selects one complete cell with an SVG viewBox. No guessed CSS scaling of old card screenshots is required.

See `docs/PEOPLE-ART-AND-COLLECTIONS.md` for the audit and `scripts/package-people.ps1` for reproducible age packages.
