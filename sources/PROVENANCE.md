# Source contours

`game-glyphs.json` contains the 43 authored polygon glyphs from `Games/LilMinersRuin/src/title-logo.js` in Andrew White's Lil Miner's Ruin repository, commit `e1c40050a825ecc752eeb8ad468e01bb387aa376` (September 15, 2026).

The font builder retains their contours, including counters and detached shapes, while normalizing left side bearings and scaling coordinates into font units. Added punctuation is defined in `tools/build-font.py`; `punctuation.json` is its generated geometry reference. No outlines are extracted from another font or a reference sprite sheet.

The source game's comment describes the chunky title silhouettes as inspired by the 40 Winks title. The font family name, Yak's Bad Fur Day, was selected by Andrew White. This is not a font extracted from Conker's Bad Fur Day.

The original renderer adds extrusion, bevels, enamel gradients, lighting, candle geometry, per-letter rotations and animation. Those effects are not glyph contours and are not stored in the monochrome font files. The styled browser example approximates a layered title treatment with CSS; the game renderer remains unchanged.

Font software and these source contours are distributed under the included SIL Open Font License 1.1.
