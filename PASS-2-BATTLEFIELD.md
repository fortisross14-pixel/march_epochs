# Pass 2 — Battlefield production pass

Implemented September 14, 2026. Local review only; no commit or push.

## Result

The battle remains a portrait **Stats → Battlefield → Commander** composition. Cartoon squads now match the existing illustrated unit cards: expressive faces, compact bodies, bold outlines, primitive weapons, and blue/red team clothing. The painterly field has textured earth, paths, vegetation, boundary palisades, rocky outcrops, water, and timber crossings.

[Production build: Nataruk Shore](docs/pass2/battle-river.png) · [Six-squad cartoon and cliff review](docs/pass2/battle-cliffs.png)

The river screenshot was captured in the actual built application through the ordinary campaign setup. The cliff screenshot uses an isolated development fixture with six unit classes/slots and a shortened stage list to inspect artwork and layout. Its `1/13` counter is fixture-specific; production campaign numbering remains unchanged. The fixture and browser profile were removed after verification.

## Initial audit

1. **Architecture:** `Battle.jsx` combined deployment, A* navigation, combat, commands, canvas drawing, HUD, rewards, and campaign advancement. The renderer was separable without replacing the simulation.
2. **Terrain:** Per-frame canvas gradients, repeated grid lines, polygon mountains, triangular trees, and a river illustration that diverged from its movement boundary.
3. **Squads:** One existing miniature above a geometric base and dots. Identical art for both teams; tiny class labels and competing health markers.
4. **Readability:** Overlapping melee positions, no consistent depth sorting, instantaneous projectile lines, and a targeting instruction panel obscuring the battlefield.
5. **Mobile layout:** Multiple legacy CSS overrides; stats followed the canvas in the DOM; tall command cards and enhancement lists consumed space. No timer or dedicated pause control.
6. **Reuse:** Existing commander portraits, squad card illustrations, gold corners, navy/gold visual language, lock/navigation assets, reward artwork, and all gameplay data.
7. **New work needed:** A painted ground layer, river and rock art, complete team-specific battlefield sprites, display-only separation, compact HUD, responsive canvas sizing, and restrained animation. Existing standalone command images proved partially empty/cropped, so the three command symbols use crisp code-native artwork in matching medallions.
8. **Scope:** One existing component, two presentation files, battle-only assets, this report, and review screenshots. No shared menu styles or gameplay data changes.

## Implementation

- `BattlePresentation` handles decoded art, a cached terrain canvas, display anchors, depth ordering, and effects. Canvas resolution follows its actual display size with device pixel ratio capped at 2.
- The field adapts to available portrait height while soldiers retain their proportions. Static scenery is cached rather than regenerated every frame.
- Dedicated friendly/enemy Warrior, Slinger, Spearman, Archer, and Cavalry sprites are packed with explicit frame bounds so weapons and adjacent atlas entries are not clipped together. Squads contain up to five infantry or three riders.
- Numbered standards, team clothing, compact health strips, selection ellipses, and Focus marks carry squad identity. The tray also provides readable names, health, and direct command targeting.
- A deterministic relaxation layer separates display positions. It never writes simulation coordinates or changes attack range, collision, targeting, damage, or movement. Canvas hit testing uses the same displayed anchors.
- River rendering and timber bridges derive from the existing river/crossing dimensions. Painted outcrops use existing obstacle footprints and are sorted against squads for depth.
- Marching bob, attack lunge, hit sparks, traveling arcing projectiles, defeat fade, reinforcement ring/plus, destination marker, contextual messages, and a short victory/defeat transition provide feedback.
- Reinforce remains the existing heal. It does not spawn a new squad or change its numerical effect.
- The compact HUD includes army health, commander artwork, elapsed battle time, menu/pause controls, and battle information. Detailed enhancements live in the paused information panel.
- Rally, Focus, and Reinforce remain the primary commands. Special stays available under its existing commander unlock conditions. Target selection holds the battle until selection or cancellation.
- Pause/resume, tab-background pause, Escape cancellation, and timer cleanup are supported. Starting a battle immediately initializes the HUD, including its existing 35% reinforcement meter.
- All active battle controls measured at least 44 CSS pixels high. The squad tray scrolls horizontally when necessary; it does not shrink all cards to fit six slots.
- The entire battlefield remains visible in normal portrait layouts, so no additional minimap was introduced. The tray represents deployed squads, not a new reserve mechanic.

## Gameplay preservation

Source comparisons against the original revision confirmed these functions unchanged: `unitStats`, `terrainFor`, `blockedGroundPoint`, `findGroundPath`, `chooseTarget`, `moveTowardPoint`, `moveEntity`, `canShoot`, `simSide`, `finishBattle`, `leaderGoldMult`, `openRewards`, `chooseReward`, and `milestone`.

Attack/heal paths gained presentation timestamps and projectile entity references only. No changes were made to `data.js`, `storage.js`, `App.jsx`, shared `styles.css`, campaign progression, unit statistics, economy, unlocks, rewards, or reinforcement balance. Leaving through the battle menu banks already-earned run rewards through the existing completion callback.

## Verification

- `npm.cmd run build`: passed; Vite transformed 173 modules. Final build was also served with `npm.cmd run preview -- --host 127.0.0.1`.
- `node --check src/components/battlePresentation.js`: passed.
- `git diff --check`: passed.
- Actual production app: campaign setup → army selection → Nataruk Shore deployment → combat → victory → reward choice → Talheim Settlement deployment. Next-stage timer reset to `00:00` and the new terrain rendered.
- Rally: unit selection, destination mode, cancellation, valid-ground movement, and rejection of water outside a crossing passed. Invalid destinations keep the command paused and explain the correction.
- Focus: enemy target cards and command confirmation passed.
- Pause and battle information: timer stayed fixed while held, then resumed. Command target selection also held the timer.
- Reinforce: tested during live four-Warrior combat; a damaged squad was selected, healing feedback appeared, and the meter reset from ready to `0%`.
- Defeat: a two-squad finale fixture reached defeat, showed defeated cards and the result modal, and retained the original 6 Gold / 2 EXP defeat payout.
- Crowding: twelve coincident entities, both on open ground and at a single bridge, resolved to at least 91 units in the renderer's separation metric. The input entities remained byte-for-byte unchanged.
- River, single/two-bridge, cliff, and open-ground presentations were inspected. No application runtime exceptions were recorded in the final interaction checks.
- Reduced-motion CSS disabled transitions. Canvas rendering suppresses cosmetic marching, lunging, and river motion when reduced motion is active at battle creation.
- Final four WebP images total **1,519,780 bytes** (about 1.45 MiB). Alpha extraction and sprite packing happen before shipping; there is no per-frame chroma processing.

| CSS viewport | Horizontal overflow | Vertical page overflow | Active controls under 44 px high |
| --- | --- | --- | --- |
| 320 × 740 | None | None | None |
| 360 × 640 | None | None | None |
| 360 × 800 | None | None | None |
| 390 × 844 | None | None | None |
| 412 × 915 | None | None | None |
| 320 × 568 | None | Scrolls | None |
| 844 × 390 | None | Scrolls | None |

## Remaining limits

- **Physical Android QA remains:** these were isolated headless Chrome checks, not measurements of a real Android device, WebView, thermal load, frame pacing, or native safe-area behavior. The in-app browser runtime failed to start with a Windows permission error, so verification used an approved isolated local Chrome instance.
- **Very short screens / landscape:** below 640 CSS pixels of height, the portrait composition permits vertical scrolling to retain usable controls and soldier sizes. A dedicated landscape composition was not introduced.
- **Animation:** units use illustrated poses with restrained transforms, not multi-frame skeletal/walk-cycle animation. Audio and haptics were not added.
- **Art coverage:** Campaign I reuses one frontier backdrop with scenario-specific obstacle/water placement. It does not yet have fifteen bespoke landscape paintings. Later-age units retain the existing artwork/fallback path; they did not receive a new historical sprite catalogue.
- Existing commander portraits are reused. The new cartoon style applies to the battlefield soldiers and mounted characters; shared People screens and their assets were not redrawn.

## Every changed file

| File | Change |
| --- | --- |
| `src/components/Battle.jsx` | Integrate renderer; compact HUD, timer, pause/menu, targeting, squad tray, feedback, and lifecycle cleanup. |
| `src/components/battlePresentation.js` | New canvas presentation and visual separation layer. |
| `src/components/battle.css` | New battle-scoped responsive styling. |
| `src/assets/battle_age1/ground.webp` | Painted frontier ground, scenery, and boundary fortifications. |
| `src/assets/battle_age1/river.webp` | Painted water and shoreline strip. |
| `src/assets/battle_age1/cliff.webp` | Transparent rocky outcrop. |
| `src/assets/battle_age1/soldiers.webp` | Transparent cartoon friendly/enemy battlefield sprite atlas. |
| `src/assets/battle_age1/soldier-frames.json` | Explicit source rectangles for the ten packed sprites. |
| `docs/pass2/battle-river.png` | Actual production-app phone screenshot. |
| `docs/pass2/battle-cliffs.png` | Six-squad cartoon/cliff fixture screenshot. |
| `PASS-2-BATTLEFIELD.md` | Audit, implementation, verification, limits, file inventory, and art provenance. |

No dependencies were added. Superseded draft PNGs and temporary verification files are not part of the change.

## Art provenance and final prompts

Generated using the **built-in imagegen tool**, then prepared as compressed WebP assets in `src/assets/battle_age1/`. The existing Warrior miniature supplied the final character style reference. Soldier silhouettes were isolated and packed into clean cells; `soldier-frames.json` records their bounds. Keyed generation was used because the tool's initial transparency requests did not produce alpha. No CLI/API fallback was used.

### Ground → `ground.webp`

> Use case: historical-scene. Asset type: actual portrait 2.5D battlefield ground background for March of Epochs mobile strategy, 1024x1536. Hand-painted premium cartoon strategy environment, warm ochre worn earth with muted olive grass patches, small stones, lovely brush texture, soft warm sunlight from upper left, top-down three-quarter overhead camera. No horizon, no sky. Keep central 90% of width and y=15% through 91% OPEN FLAT traversable ground, very subdued detail and no large obstacles anywhere in this play area. A winding broad worn footpath runs from bottom middle through centre to upper middle, subtle forks left/right. ONLY along extreme left/right 4% edges sparse bushes and rocks, at very top 8% small distant rough wooden prehistoric palisade and straw-roof watch huts, at bottom 5% cropped foreground leafy branches and rocks. Ancient Neolithic / early Mesopotamian frontier, no medieval stone castle. Illustrated handcrafted detail, mobile readable restrained scenery. Absolutely no soldiers, no characters, no UI, no text, no icons, no grid, no water or bridge, no big rocks in centre. This is a game asset not a screenshot.

### River → `river.webp`

> Use case historical-scene. Asset type: horizontal river terrain texture strip for premium painterly 2.5D strategy game. Landscape 1536x512 (3:1). Overhead view, no horizon. A calm ancient shallow river flows HORIZONTALLY left to right across the full image width. Water fills exactly the central 70 percent of image height (y=15% to85%), top and bottom 15% are narrow warm ochre dirt banks with tiny weathered stones, muted olive grasses and very sparse reed tufts. Shorelines run mostly straight horizontal but gently irregular by a few pixels. Subtle sandy shallows along both banks, deeper desaturated jade / teal / blue-grey central channel. Delicate hand-painted water currents and soft light streaks, translucent depth, rich brush detail, sunlight upper left. Must match a dusty Neolithic frontier battlefield. No bridge, no people, no boats, no fish, no islands, no UI, no text, no big rocks obstructing the channel. Banks and water run off both left and right image edges seamlessly.

### Outcrop → `cliff.webp`

> Use case stylized-concept. Production terrain sprite for an illustrated 2.5D strategy game. One COMPACT roughly SQUARE MASS of rocky high ground, low plateau / massive cluster of weathered sandstone boulders, seen from high overhead 70 degree angle. NOT a diagonal ridge. Rock must fill a broad square footprint including upper left, upper right, lower left and lower right quadrants. Big uneven top surface with angular cracks and cream ochre highlights; short steep shadowed rocky faces along lower edge. A few sparse olive grasses at base. Warm grey beige stone, painterly cartoon game art, light upper left. Natural ragged silhouette with rounded boulders and chips, absolutely no manufactured slab / square backing / geometric platform. Whole object entirely visible with narrow 5% padding all sides. The background is uniform PURE MAGENTA #ff00ff for chroma key, no gradient or ground shadow. No characters, no labels, no UI, no text. Square 1024x1024.

### Cartoon characters → `soldiers.webp`

> Use case stylized-concept. Create a replacement production game sprite atlas. Image 1 is the REQUIRED CARTOON CHARACTER STYLE reference: chunky cute fierce ancient tribal fighters, expressive brows and eyes, broad clear outlines, simplified painted cel shading, warm skin and leather/fur clothing. Image 2 is ONLY the atlas layout/weapon-class reference. REDRAW all characters in Image 1's appealing cartoon style. Much more cartoonish, NOT realistic Age of Empires military humans. Use slightly oversized expressive heads about one third body height, compact strong bodies, oversized clear readable weapons, bold dark brown outlines, 2-3 shades per material, no shiny realistic anatomy. Early tribal / Neolithic historical game. NO Greek/Roman metal crested helmets, use dark hair/headbands/soft leather caps. Produce 1536x1024 landscape with exactly FIVE equal columns and TWO equal rows (ten isolated full body sprites). Row 1 dusty BLUE scarves, wraps and shield paint. Row 2 brick RED variants of same classes. Left to right each row: 1 primitive Warrior with big stone club and small round wood shield, hide tunic; 2 Slinger with leather pouch, clearly swinging long sling, no shield; 3 Spearman with long stone-tipped spear and oval wooden shield; 4 Archer with big curved wood bow and quiver; 5 cartoon cavalry rider on a complete chunky friendly-looking brown horse, short spear. All face three-quarter RIGHT seen slightly from above, same camera. All complete bodies INCLUDING FEET, full weapons and full horses, consistent cartoon scale. Each sprite stays inside its exact cell with at least 8% padding; isolated silhouettes do not touch. Feet baseline 90% of cell. Background is UNIFORM PURE MAGENTA #ff00ff for game chroma key, not a gradient, no floor shadow, no background setting. No text, no labels, no UI, no grid, no plinths. Preserve class order and team colors but fundamentally replace the realistic style with polished cartoon style matching Image 1.
