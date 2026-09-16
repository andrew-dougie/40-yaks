# Rendering source and scope

The enamel rendering recipe is adapted from Andrew White's Lil Miner’s Ruin, commit [`afcc45905d486b94ae336a7464059bdc8af097ce`](https://github.com/andrew-dougie/lil-miners-ruin/tree/afcc45905d486b94ae336a7464059bdc8af097ce):

- `Games/LilMinersRuin/src/title-logo.js`: `lettering.js` meshes, palettes, layout, candle, and title animation.
- `Scripts/render-result-headings.mjs`: `studio.js` transparent bake lights and camera framing.
- `Scripts/render-popup-artwork.mjs` and `Games/LilMinersRuin/src/popup-glyph-layout.js`: documented atlas and popup presentation.
- `Games/LilMinersRuin/src/scene.js`: documented live scene lighting.

`floating-scene-title.js` is copied from BFMiniGameKit commit [`3baa893b87b404d042b3906716f52f6aa82d54b1`](https://github.com/andrew-dougie/BFMiniGameKit/tree/3baa893b87b404d042b3906716f52f6aa82d54b1), `Rendering/Web/floating-scene-title.js`. That revision's `Rendering/Web/pixel-presentation.js` and `Sources/MiniGameCore/Resources/PixelRenderingProfile.json` specify the documented pixel pipeline.

All use **Three.js 0.180.0**. These are pinned historical recipes, not automatic mirrors of future changes.

Changes made when extracting the example:

- Read the identical authored contours from `sources/game-glyphs.json` instead of duplicating them inline.
- Remove host-font substitution. `TitleLogo(scene)` always uses the authored contours.
- Remove the optional pizza-cheese texture branch; passing `surface` throws. This recipe covers enamel lettering.
- Export the existing face palette values and expose studio/framing helpers.
- Retain the original title words and candle in `TitleLogo` as a reference fixture. Use `createSculptedHeading` for your own strings.

No shape, bevel, counter lining, material, spacing, or title motion constants were changed. Font conversion-only punctuation from `sources/punctuation.json` is not part of this mesh renderer; it rejects unsupported text instead of silently substituting a glyph. The TTF has wider coverage.

Copyright © 2026 Andrew White. These rendering examples are distributed with the font source under the repository's [OFL.txt](../../OFL.txt). Three.js remains subject to its own MIT license.
