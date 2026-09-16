# Collectible cards and chibi People

This revision supersedes the first nine People replacements. Hannibal and the approved Warrior miniature now define the proportions directly: oversized heads, huge expressive eyes, short compact bodies, simple rounded faces and clean cartoon rendering. Portraits include bright historical scene backgrounds instead of dark studio-style busts. Identity, role, gameplay rarity and progression remain intact. Veteran Commander retains his uncovered topknot rather than Hannibal's helmet.

All six Age I People and Thutmose, Ramesses and Cyrus were regenerated using built-in image_gen. Cleopatra, Hannibal and Napoleon remain unchanged. Active files and updated version-2 prompts are in `src/assets/ages/<ageId>/people/`. The age ZIPs are rebuilt from these final files, not the superseded first pass.

## Layered card

`PersonCard.jsx` is shared by the opened People menu and discovery reveals. It renders, back to front:

1. Character illustration and historical scene.
2. A generated neutral silver, enamel and laurel frame with an actual transparent portrait window.
3. Rarity coloring through an alpha-masked CSS color blend: silver-white Common, green Uncommon, blue Rare, purple Epic and gold Legend.
4. Live SVG role crest, star progression, copy count, laurel-framed name, role, current-level ability and rarity label.
5. A reveal-only light sweep.

The master frame lives in `src/assets/ui-kit/cards/person-frame.png`, with its built-in generation prompt in the adjacent manifest. No text, star counts or statistics are baked into it. This keeps promotions, rarity and localization independent from the art. Biography, all unlocked abilities and promotion controls remain below the card.

## Discoveries

People packs reveal one collectible at a time with a perspective entrance, brief glow and light sweep. New discoveries and duplicate copies have distinct headings. The player advances with **Reveal next**, then **Continue**; the close action can dismiss the presentation. The first People unlock also unveils Tribal Elder and Veteran Commander after the unlock notice.

The entrance waits for the illustration and frame to load. Reduced-motion mode uses the same card without the turn, sweep or rotating rays. Rewards remain banked by the existing purchase/unlock transaction; the reveal never awards copies or spends currency again.

## Technology consistency

Research, campaign loadout and technology picker all render `TechnologyArtwork`. Each atlas cell has an explicit SVG clip path so a wide loadout slot cannot show neighboring icons. Whole SVG fallback art is retained for technologies outside the atlas.

## Validation

`scripts/cards-browser.mjs` checks all five rarities at 320, 393 and 600px, text bounds, the frame's actual alpha window, loadout/picker artwork, new-versus-duplicate reveals, banked rewards and reduced-motion behavior. Screenshots and reports are saved under `.artifacts/cards/`.

The existing collection, progression, battle and menu smoke checks remain applicable. Packages include the shared frame, renderer, reveal component and stylesheet alongside their age-specific art and prompt manifest. Application integration is already wired in the repository.
