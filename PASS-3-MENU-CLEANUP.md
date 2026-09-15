# Pass 3 — UX / Menu Cleanup

Implemented September 14, 2026. No commit or push was made.

## Screen audit and resulting composition

| Screen | Original problem | Implemented composition | Files | Classification |
|---|---|---|---|---|
| Campaign | Full-height side arrows compressed the artwork; duplicate star progress; oversized roadmap and prototype copy. | Full-width campaign card, compact arrow controls, one Start Campaign action, compact battle chronicle, collapsed world catalogue. Development reset is absent from production and requires confirmation in development. | `src/App.jsx`, `src/menu.css` | Structural, CSS, navigation |
| Campaign Loadout | Desktop-wide modal, oversized locked cards, overlapping setup steps. | Dedicated portrait step with one back control, illustrated context, two commander cards or a compact unlock notice, optional technology slots, sticky Next action. | `src/App.jsx`, `src/components/Modal.jsx`, `src/menu.css` | Structural, CSS, navigation |
| Muster Army | Two setup dialogs open together; underlying navigation visible; small units and horizontal dead space. | Two-column framed squad cards, ready/empty/active-slot states, compact available-unit buttons, selection count, one sticky full-width Start Campaign action. Handles two through six squads. | Same files | Structural, CSS, framing, navigation |
| Armies | Dense rows, competing frames, duplicate equipment controls. | Single-column army list, vertical training detail, readable stats, one control per equipment slot. Equipment picker replaces its parent; its store link closes both layers. | Same files; `src/components/MenuArtwork.jsx` | Structural, CSS, framing, navigation |
| Technology | Tiny descriptions and stretched card images; unavailable or owned nodes looked actionable. | Vertical research cards, framed illustrations, explicit prerequisites/costs/researched state, visible expansion cost, collapsed age catalogue. | `src/App.jsx`, `src/menu.css` | CSS, framing, states |
| People | Variable crops and tiny card-back abilities repeated in a second detail column. | Consistent portrait grid, rarity and copy framing, a single portrait/progression/abilities detail view with readable text. Selected commanders are marked in pickers. | `src/App.jsx`, `src/components/CardFlip.jsx`, `src/menu.css` | Structural, framing, states |
| Artifacts / Inventory | Stretched, incomplete source-card labels and neighboring card fragments; inconsistent inventory/detail/reward treatment. | Two-column cards with live labels and rarity borders. Existing item cutouts are centered and enlarged; two unusable cutouts use illustration crops from existing cards. Shared art presentation across inventory, equipment, details and rewards. | `src/App.jsx`, `src/components/MenuArtwork.jsx`, `src/menu.css` | Structural, asset framing |
| Store / Rewards / Unlocks | Competing pack art, small reveal layouts, clickable chest div, transient unlock toast. | Compact pack rows, affordability states, keyboard-operable chest, two-column reveals, full-width Continue action, persistent milestone dialog. Paid sealed packs cannot be dismissed before opening. | `src/App.jsx`, `src/components/Modal.jsx`, `src/menu.css` | Structural, navigation, accessibility |
| Shared overlays | Bottom navigation remained visible, dialogs exceeded phone width, back icon rendered as close, no focus or scroll isolation. | Menu-only dialog variant, inert background, hidden bottom nav, focus containment, Escape/back behavior, scroll restoration, 44px minimum active targets. | `src/components/Modal.jsx`, `src/menu.css` | Navigation, CSS, accessibility |

## Scope preserved

Menu CSS is scoped under `.app-shell.menu-shell`. Battlefield rendering and its three Pass 2 source files are unchanged from the start of this pass. `src/data.js` and `src/storage.js` are also unchanged. SHA-256 fingerprints are recorded in [verification.json](docs/pass3/verification.json).

Reward, purchase, equipment, research and training rule functions were compared with the pre-pass source and remain unchanged. No changes to Campaign I balance, enemy scaling, Gold/XP costs, artifact effects, or unlock thresholds were made.

Setup navigation now clears selected squads that become ineligible after changing commanders or technologies, using the existing eligibility rules. Required-choice dialogs no longer show a close button that has no action. Battlefield composition and controls otherwise retain Pass 2 behavior.

## Verification

- `npm.cmd run build`: passed; final production output generated successfully.
- `git diff --check`: passed.
- Ran the development app and production preview in isolated headless Chrome.
- 100 menu state/layout checks across 320×640, 360×800, 390×844, 412×915 and 1024×900: no detected horizontal content overflow, missing images, undersized enabled targets, or simultaneously visible menu dialogs after fixes.
- Visually inspected Campaign, loadout, Muster, Armies, army details, People, People details, Technology, Inventory, artifact details, store, rewards, achievements and unlock presentation.
- Eleven interaction checks passed: training, People upgrade, artifact evolution, equipment add/remove, pack purchase/reveal, research, slot expansion, achievement rewards, focus/Escape/scroll restoration, empty equipment-to-store navigation, and incomplete Muster/back behavior.
- Checked all six loadout slots and six starting squads at 320px; the Start Campaign button remains in the viewport while cards scroll.
- Triggered the existing campaign result handler in a temporary isolated fixture to verify People and Technology milestone dialogs. This fixture used a copy of App with a test-only callback; no test entry point was added to production.
- Production preview smoke test passed for campaign, store, rewards, army details and battle launch at 320px. The battle canvas rendered with no menu shell applied.
- No browser runtime exceptions were observed in the completed checks. Temporary fixtures, browser profile and automation scripts were removed afterward.

## Every Pass 3 file changed or added

Source files:

- `src/App.jsx` — screen markup, setup/picker navigation, selection states and milestone presentation.
- `src/components/Modal.jsx` — opt-in menu layout, focus/scroll handling, back control and required-choice close behavior.
- `src/components/CardFlip.jsx` — readable menu portrait and abilities presentation; existing flip presentation remains available.
- `src/components/MenuArtwork.jsx` — new shared menu artifact framing using existing assets.
- `src/menu.css` — new scoped portrait menu system and asset crops.
- `src/main.jsx` — loads the scoped menu styles after the legacy stylesheet.

Report and evidence:

- `PASS-3-MENU-CLEANUP.md`
- `docs/pass3/verification.json`
- `docs/pass3/campaign.png`
- `docs/pass3/loadout.png`
- `docs/pass3/muster.png`
- `docs/pass3/muster-empty-320.png`
- `docs/pass3/muster-six-320.png`
- `docs/pass3/armies.png`
- `docs/pass3/army-detail.png`
- `docs/pass3/people.png`
- `docs/pass3/person.png`
- `docs/pass3/technology.png`
- `docs/pass3/inventory.png`
- `docs/pass3/store.png`
- `docs/pass3/rewards.png`
- `docs/pass3/achievements.png`
- `docs/pass3/unlock.png`

Existing uncommitted Pass 2 files were retained. They are not additional Pass 3 changes. Screenshots of unlocked collections use isolated test progression; campaign and final reward screenshots also exercise the production build.

## Remaining limitations

- Physical Android device/WebView validation, system back gestures, display cutouts and device font scaling were not available in this environment. These need a device acceptance check.
- Some existing artifact/technology illustrations are low resolution or incomplete source crops, and later-age People still use older artwork. Framing and readable labels are repaired, but a consistent high-resolution art replacement remains a separate asset task.
- The old global stylesheet remains in place to protect Pass 2 and other existing screens. The scoped menu stylesheet deliberately overrides it; a future stylesheet consolidation would reduce this maintenance overhead.
- No unresolved horizontal layout or modal layering defect was found in the tested Pass 3 flows. This is browser validation, not a claim of complete Android device coverage.
