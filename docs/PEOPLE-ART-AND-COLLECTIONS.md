# People artwork and collection polish

The latest chibi/card revision is documented in [COLLECTIBLE-CARDS.md](COLLECTIBLE-CARDS.md). All age packages contain that final revision.

People now have a dedicated store, rarity/age filters and rarity/age/level/name sorting. Artifacts have their own store and a compact three-column inventory (four columns from 440px), with age filtering and level/age/rarity/name sorting. Fully equipped stacks are greyed out and labelled Equipped, but remain inspectable and eligible for Workshop upgrades. Stacks with spare copies show both available and equipped counts. Equipped Hero Relics no longer disappear from inventory. Pack prices, pools, purchases and progression rules are unchanged.

Collection age describes historical content, not its unlock or pack availability. For example, Bronze Armor belongs to Age II while existing rules can still award it in Age I. New content can declare `ageId` directly. Empty filter results have a clear reset action.

## People audit

| Age | Person | Decision | Original issue / retained identity |
| --- | --- | --- | --- |
| I | Tribal Elder | Replaced | Harsh painted brow, heavily modelled face, embedded frame. Kept elderly white hair/beard, fur robe, staff and turquoise charm. |
| I | Merchant Prince | Replaced | Painterly face and embedded card fragments. Preserved the existing female character, blue/gold dress, jewellery and gold ingots. |
| I | Veteran Commander | Replaced | Grim face and realistic dark beard. Kept mature commander, topknot, bronze armour and red cloak. |
| I | Hunter Captain | Replaced | Serious painted face and mismatched linework. Kept female hunter, brown braids, feathers, bow, leather/fur and turquoise necklace. |
| I | Narmer | Replaced | Severe proportions and painted skin. Kept clean-shaven Egyptian ruler, dark skin, gold/blue headdress and royal collar. |
| I | Sargon of Akkad | Replaced | Grim realistic beard/face and baked purple card ornament. Kept black beard, Mesopotamian helmet, bronze armour and blue cloak. |
| II | Thutmose III | Replaced | Basic vector placeholder lacked the approved units' illustrated finish. Retained military king, bronze/gold helmet with red crest and Egyptian identity. |
| II | Ramesses II | Replaced | Basic vector placeholder. Retained blue royal crown and gold Egyptian regalia; rendered as a composed adult ruler. |
| II | Cyrus the Great | Replaced | Basic vector placeholder. Retained Persian royal identity, maroon headwear and robe; added readable designed beard/cloth detail. |
| III | Cleopatra | Kept | Expressive, clearly outlined, appealing chibi-adjacent illustration already matches the approved unit direction. Mini and card variants unchanged. |
| III | Hannibal | Kept | Strong cartoon silhouette, readable face and armour; already consistent with unit art. Mini and card variants unchanged. |
| VIII | Napoleon | Kept | Large expressive eyes, clear bicorne/coat silhouette and playful heroic proportions. Mini and card variants unchanged. |

All nine replacements were generated with the built-in `image_gen` tool, using the approved Warrior miniature and Hannibal card as style references. The new chibi Sargon anchored the batch; the Veteran correction also used his original topknot portrait for identity. Full prompts are stored in each age's `people/manifest.json`.

The corrections use stronger outlines, larger expressive eyes, softer stylized adult features, warm simplified shading and cleaner hair/armour shapes. Characters remain competent and historical rather than infantile or comic caricatures. Bright historical scene backgrounds now match the approved Hannibal card. Live rarity, card structure, roles and abilities are preserved.

No current People portrait remains on the superseded serious painting or simple placeholder treatment. All nine replacements now follow Hannibal's oversized-head, compact-body chibi direction. Later catalogue-only characters have no runtime portrait yet and require future age batches. Retired originals are comparison sources, not remaining active outliers.

## Technology crop correction

The old thumbnail files included empty transparent images, while the rendered alternatives were cropped card screenshots. A new Age I illustration atlas contains complete fire, bow, wheel, wheat, ox, tablet, copper and bronze images without card borders or labels. Each component displays exactly one cell. Existing technology availability is preserved: Bronze remains gated to its existing progression; Age I Irrigation uses its existing complete SVG icon. Later technologies keep their existing whole SVG icons.

## Folder structure and packaged delivery

- `src/assets/ages/origins/people/`: six new portraits, registry, manifest and preview.
- `src/assets/ages/bronzeIron/people/`: three new portraits, registry, manifest and preview.
- `src/assets/ages/classical/people/`: Cleopatra and Hannibal, including unchanged card variants.
- `src/assets/ages/revolution/people/`: Napoleon, including unchanged card variants.
- `src/assets/ages/origins/technology/`: new atlas and generation/cell manifest.
- `art-source/retired/people/`: superseded portraits/cards/placeholders, retained for comparison.
- `art-packs/`: age-based ZIPs with repository-relative paths, prompts, manifests and contact-sheet HTML previews.

Approved unit PNGs and existing campaign covers were also moved into their canonical age directories. Shared UI and remaining legacy equipment/technology SVGs keep their current paths. `src/assets/ages/README.md` defines the convention for later ages and campaigns.

Rebuild the packages with `powershell -ExecutionPolicy Bypass -File scripts/package-people.ps1`. No image generator or external dependency is needed to package the checked-in files.

## Validation

- `npm.cmd test`: 40 progression, tactics, polish and collection tests passed.
- `npm.cmd run build`: production asset/import compilation passed.
- `node scripts/collections-browser.mjs`: 10 grouped checks passed, no console/runtime errors. Covers combined filters, ordering, all 12 portrait paths, equipped/relic visibility, both purchase/reveal flows, all eight technology cells and inventory layouts at 320, 393, 480, 768 and 844px.
- `node scripts/polish-browser.mjs`: 34 existing layout/flow checks passed across seven viewports, including progression/menu/battle flows, with no console/runtime errors.

Browser scripts use isolated temporary save data, preserve the player's save, and write screenshots/reports to ignored `.artifacts/`. Physical-device performance has not been measured. The new full-resolution PNG sources are retained; image transfer optimisation remains a separate release task.
