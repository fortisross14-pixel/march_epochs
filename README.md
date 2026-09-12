# March of Epochs — Vite + React prototype v0.6.1

This is the React/GitHub Pages version of the current March of Epochs prototype.

## Included in this pass

- Vite + React source project (no standalone monolithic HTML)
- GitHub Pages deployment workflow under `.github/workflows/deploy.yml`
- Real `March of Epochs` logo asset under `src/assets/logo.png`
- Premium front/back card assets for:
  - Cleopatra
  - Hannibal
  - Napoleon
- Front/back card flip inside Collection
- Dynamic in-game level/copy overlay on premium cards
- No procedural historical faces
- Character packs instead of direct character purchases or hidden character lists
- Duplicate leveling thresholds: **1 / 2 / 4 / 6 / 8 / 10**
- Rarity level caps:
  - Common / Uncommon: 3
  - Rare: 4
  - Epic: 5
  - Legend: 6 (purple-star stage)
- Technology prerequisite tree
- 3 → 6 technology slots
- Signature units tied to characters
- Unit stats: Health, Armor, Damage, Attack Speed, Range
- Two 15-battle campaigns
- Persistent army attrition
- Reinforce meter heals a selected surviving formation (never resurrects)
- Enemy reinforcement meter
- Rally, Focus Fire, Reinforce and General Special battle actions
- Milestones after battles 5, 10 and 14: **+1 army capacity** or **full surviving-army recovery**
- Rivers / bridges / mountain blocking and pathing logic
- LocalStorage progression

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm install
npm run build
```

The production output is written to `dist/`.

## GitHub Pages

1. Create a GitHub repository and copy this project into it.
2. Push to the `main` branch.
3. In **Settings → Pages**, choose **GitHub Actions** as the source if GitHub has not selected it automatically.
4. The included workflow installs dependencies, builds with Vite and deploys `dist/`.

`vite.config.js` uses `base: './'`, so the build works under a GitHub Pages repository subpath without hard-coding the repo name.

## Art architecture

The premium cards currently use whole-card PNG assets because this pass is specifically testing how the approved visual language feels inside the actual game. The React UI overlays live character level/copy information on top.

For the full production library, the next art pass should ideally separate **portrait/background illustration** from **dynamic UI frame/text**, so card stars, copy counters and level benefits can always reflect live game state while preserving this same visual style.


## Build note (v0.6.1)

The build scripts invoke Vite through Node (`node ./node_modules/vite/bin/vite.js`) instead of relying on the executable permission of `node_modules/.bin/vite`. The GitHub Pages workflow also deletes any pre-existing `node_modules` before installing, so a dependency folder uploaded from Windows/macOS cannot break the Linux runner.

Fresh local build:

```bash
rm -rf node_modules
npm install
npm run build
```
