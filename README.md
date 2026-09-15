# 40 Yaks

A chunky, capitals-only display font with polygon outlines. It has broad strokes, uneven edges, splayed letterforms, and open counters. Available as installable TTF and WOFF2.

![40 Yaks specimen using an excerpt from Blood Meridian](docs/specimen.svg?v=1.002)

## Download

- **[FortyYaks-Regular.ttf](fonts/ttf/FortyYaks-Regular.ttf)** — desktop and native app font.
- **[FortyYaks-Regular.woff2](fonts/woff2/FortyYaks-Regular.woff2)** — compressed webfont.
- **[Latest release](https://github.com/andrew-dougie/40-yaks/releases/latest)** — font files, source, license, and examples.

On macOS, open the TTF in Font Book and select **Install**. On Windows, right-click it and select **Install**. The family appears as **40 Yaks**.

## Font details

| Detail | Included |
| --- | --- |
| Family | 40 Yaks |
| PostScript name | `FortyYaks-Regular` |
| Version | 1.002 |
| Weight | 900 |
| Glyphs | 76, including the missing-character glyph |
| Mapped code points | 110 |
| Coverage | Printable ASCII; selected typographic punctuation and math symbols |
| Kerning | 17 pairs |
| Formats | TTF and WOFF2 |

Lowercase input displays as uppercase shapes; there are no distinct lowercase drawings. The underlying text keeps its original spelling for copying, searching, and accessibility. Accented letters and unsupported scripts need a fallback font. See the [complete character map](fonts/characters.json).

The files contain monochrome vector outlines. Colored fills, outlines, bevels, shadows, and animation are applied by the rendering application. The editable [browser specimen](examples/index.html) includes both plain type and an optional layered CSS treatment.

## Color and layered lettering

The font supplies shapes; your app supplies the fill and outline. A layered rendering can combine a coral gradient face, a gold bevel, darker extruded sides, and cream highlights.

See **[Face color, edging, and depth](docs/styling.md)** for a coral-and-gold palette, adjustable CSS variables, a reusable [title stylesheet](examples/yak-title.css), and a UIKit fill-and-stroke example. Colors and 3D effects are not embedded in the font file.

### Layered rendering examples

![Coral faces, gold bevels, and darker extruded sides](docs/game-treatment.png?v=1.002)

![Blue faces with gold bevels](docs/game-new-high-score.png?v=1.002)

These examples use extruded glyph meshes, bevels, and lighting. They are rendered images, not color information embedded in the font. See the **[copy/paste replication prompt](docs/styling.md#replicate-the-layered-treatment-with-a-coding-assistant)** for reproducing the treatment in your application.

## Install with a coding assistant

Copy this prompt into your coding assistant:

```text
Install 40 Yaks in this project using its existing framework and typography conventions.

Download and bundle the appropriate font from release v1.002:
- Native/desktop TTF: https://github.com/andrew-dougie/40-yaks/releases/download/v1.002/FortyYaks-Regular.ttf
- Web WOFF2: https://github.com/andrew-dougie/40-yaks/releases/download/v1.002/FortyYaks-Regular.woff2
- License: https://raw.githubusercontent.com/andrew-dougie/40-yaks/v1.002/OFL.txt

Register the family as "40 Yaks", normal style, weight 900. Use WOFF2 for web projects and TTF for native apps. For iOS, add FortyYaks-Regular.ttf to UIAppFonts and use PostScript name FortyYaks-Regular. Include OFL.txt with the font assets.

Use this capitals-only display font for short headings rather than body copy. Lowercase characters already map to uppercase outlines; keep the original source text for accessibility. Add fallback fonts for unsupported characters. Apply any color or 3D effects separately in the rendering application.

Add a reusable font definition and a preview. Verify that the bundled font loads and renders letters, numbers, punctuation, and lowercase input correctly. Explain the changed files and how to apply the font.
```

## Web usage

```css
@font-face {
  font-family: "40 Yaks";
  src: url("FortyYaks-Regular.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

.title {
  font-family: "40 Yaks", sans-serif;
  font-weight: 900;
  font-size: 3rem;
  line-height: 1.3;
}
```

Open `examples/index.html` after cloning, or run `python3 -m http.server` from the repo and open `/examples/`.

## iOS usage

Add the TTF to your target's resources and list its filename under `UIAppFonts` in Info.plist:

```swift
label.font = UIFont(name: "FortyYaks-Regular", size: 32)
label.text = "His feet are light and nimble."
```

## Build and verify

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python tools/build-font.py
python tools/render-specimen.py
python tools/verify-font.py
```

The builder reads `sources/game-glyphs.json`, adds punctuation, constructs TrueType outlines, assigns character mappings and metrics, and exports both formats. Fixed timestamps and pinned dependencies make builds reproducible. The README specimen contains paths from the actual packaged font, so GitHub does not need to load a webfont.

The [source geometry notes](sources/PROVENANCE.md) describe the contours and version history.

## License

Copyright © 2026 Andrew White. Font software is licensed under the **[SIL Open Font License 1.1](OFL.txt)**. Personal and commercial use, embedding, modification, and redistribution are permitted under that license. No Reserved Font Names are declared.
