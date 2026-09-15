# Phase B — Product polish

The current information architecture, navigation, content, progression and combat balance are the baseline. This pass refines presentation and input behavior.

## Initial audit

| Area | Priority | Finding |
| --- | --- | --- |
| Player feedback | Important | People promotions, artifact evolution and equipping have no consistent confirmation. Repeated identical notifications do not restart their lifetime. |
| Player feedback | Important | Victory rewards do not show the objective result or the battle's earned currencies before choosing a reward. |
| Micro-UX | Important | Main-tab navigation always resets scroll position. Some repeated purchase handlers use render-time values; guard rapid duplicate taps. |
| Micro-UX | Important | Artifact replacement identifies only “first equipped Artifact”; show the actual replaced item. Evolving closes the detail view before the new effect can be inspected. |
| Animation / sound | Minor | Pack reveals use a long 3D flourish; reduced-motion rules cover only some controls. No sound playback system or supplied sound assets were found. |
| Combat polish | Important | Battle dialogs lack the menu dialogs' focus handling. Opening Battle info and then pausing can create inconsistent pause state. Escape handling is shared with modal closing. |
| Accessibility / readability | Important | Overview stats rely on icons without names; several labels are 8–10px. Missing selected-state semantics on subtabs. Currency values need compact formatting for large balances. |
| Device / responsiveness | Important | Safe-area handling is inconsistent across ordinary dialogs and toasts. Short landscape windows need a scrollable fallback. Refresh loses menu location. |
| Visual material / typography | Important | Repeated rectangular borders and inset stat boxes flatten the cards. Illustrations read as isolated thumbnails; headings, levels and helper text need a stronger hierarchy. |
| Performance | Minor | Legacy CSS is large; avoid restructuring it in this pass. Use static gradients and short transform/opacity transitions, with no new image downloads or continuous decoration. |
| Save reliability | Critical | Storage write failures can throw from the save effect without explaining that progress is unsaved. |

## Implementation and verification

Implemented a scoped material and typography layer, preserving the existing card groups, menu navigation and battlefield. Navy panels now use soft directional highlights, antique-gold corner accents, grounded illustration shadows and quieter stat separators. Overview stats have readable labels; currency counters compact large values without hiding their exact accessible values. Buttons retain 44px minimum targets.

Feedback now confirms commander selection, unit assignment, equipment changes/replacements, promotions, evolution and purchases. Repeated messages restart cleanly. Rapid duplicate purchases/training are guarded, while normal repeated actions remain available. Artifact evolution keeps its detail panel open to show the result. Insufficient-currency and copy requirements are shown beside affected actions.

Main tabs retain their scroll positions; the active menu and supported detail panels return on refresh through optional session state. Progression saving now reports storage failure and offers a retry without discarding the in-memory game. All dialogs trap keyboard focus, restore focus and handle Escape only at the top layer. Battle briefing correctly returns to the preceding paused/running state.

Victory screens show earned Gold/EXP/TP and the objective outcome. Reward cards are more compact, and healing choices use the existing command's plus motif rather than a miniature card image. Focus, Reinforce and Rally emit consistent feedback hooks. No combat or progression rules were modified.

Short entry, reward and counter animations respect reduced motion. Sound events are prepared without adding an audio engine or unapproved assets; see [PHASE-B-SOUND.md](./PHASE-B-SOUND.md).

## Validation

- `npm.cmd test`: **36 / 36 pass**, including unchanged progression/combat tests and new repeat-tap, compact-currency, failed-save and optional-menu-state checks.
- `node scripts/polish-browser.mjs`: **34 layout checks pass, zero console/runtime errors** in local headless Chrome.
- Viewports: **320×700, 360×800, 393×852, 412×915, 480×960, 768×1024, 844×390**. Checked horizontal overflow, dialog bounds, visible actionable target heights and toast bounds.
- Fresh and equipped saves; training (including an immediate double tap), artifact removal/picker/evolution, pack purchase/reveal, People promotion, achievement claiming, research, campaign preparation, battle deployment/Focus/victory/reinforcement, return and banked rewards, nested Escape/focus handling, refresh of a detail panel, scroll retention, viewport resize, reduced motion, and forced storage failure/retry were exercised.
- Rendered screenshots were inspected for narrow-phone armies, standard-phone armies, achievements, and victory rewards. Inspection caught and fixed a legacy achievement contrast rule and a toast entry transform that displaced long messages.
- The favicon was wired to existing artwork to remove a 404 console error.
- `npm.cmd run build` and `git diff --check`: pass.
- `src/data.js`, `src/game/`, `package.json`, `package-lock.json`, and tracked dependencies have no changes. Temporary dependency-install changes were restored.

The connected Browser runtime was unavailable; these checks used an isolated local headless browser with temporary test saves. Screenshots and reports live under ignored `.artifacts/phase-b/`; browser profiles use temporary directories. No generated test artifacts are staged or committed.

## Files changed

| File | Purpose |
| --- | --- |
| `.gitignore` | Ignore screenshots, browser reports and automation output. |
| `index.html` | Use existing SVG artwork as the favicon. |
| `src/App.jsx` | Feedback, purchase guards, labeled stats, currency display, save warning, menu state, requirements and accessible selection/progress. |
| `src/uiFeedback.js` | Small feedback event, duplicate-action and optional menu-state helpers. |
| `src/polish.css` | Scoped materials, type hierarchy, motion, contrast, toast and safe-area treatment. |
| `src/main.jsx` | Load the scoped polish stylesheet after existing styles. |
| `src/storage.js` | Report save failures safely and preserve active progress. |
| `src/components/Modal.jsx` | Shared focus, stacking, scroll lock and Escape behavior for every dialog. |
| `src/components/CardFlip.jsx` | Promotion requirements, level feedback and keyboard support. |
| `src/components/Battle.jsx` | Victory receipts, reward guard, pause/briefing state and command feedback hooks. |
| `src/components/battle.css` | Readable/compact rewards, safe dialogs and short-landscape fallback. |
| `tests/polish.test.mjs` | Regression checks for the new state/feedback helpers. |
| `scripts/polish-browser.mjs` | Optional reproducible local browser checks, with generated output ignored. |
| `docs/PHASE-B-POLISH.md` | Audit, outcomes, file list and validation record. |
| `docs/PHASE-B-SOUND.md` | Separate missing-sound manifest and cue integration guidance. |

## Remaining checks and assets

- Real Android hardware testing, long-session memory/power profiling, OS safe-area behavior and a physical screen-reader pass remain release checks. Desktop viewport emulation does not establish physical-device performance.
- No authored audio files are available. The sound manifest lists the missing cues separately; playback is intentionally silent.
- No new visual art is needed for this polish. Existing unavailable content/art remains unavailable; no substitute art or new content was added.
- The legacy stylesheet and tracked dependency layout were preserved rather than restructured during product polish.
- No commit or push was performed.
