# Face color, edging, and depth

The TTF and WOFF2 contain the **silhouette** of each letter, including its holes. They are ordinary monochrome outline fonts. You can set their text color in any application. Gold edging, gradient fills, highlights, and shadows must be supplied by the app rendering the text.

## A 3D rendering recipe

Construct several solid meshes from each glyph contour:

| Layer | Role | Example palette / settings |
| --- | --- | --- |
| Front face | The colored interior of the letter | Bottom `#A51D13` → top `#FF5D3D` |
| Bevel and rim | Broad gold edge surrounding the face and its counters | Gold base `#FFD51A`, emissive `#FFB900`, pale specular highlights |
| Extruded body | Darker thickness visible along the sides | Brown `#71401B` with warm ambient/emissive shading |
| Glints | Small highlight geometry | Cream `#FFF4C2` |
| Placement | The jumbled title arrangement | Individual letter rotations, offsets, and animation |

The face gradient follows glyph height and uses a nonlinear blend (`height^0.65`) in the renderer's linear color space. Bevel width, camera angle, lights, and emissive materials affect the visible result. A CSS stroke is a flat border; it does not reproduce the real bevel's angled faces and changing highlights.

The standalone font preserves the same contours, but has no meshes, palette, lighting, candle, or animation baked into it. This lets the same typeface work in plain text, native applications, print, and custom renderers.

## Reusable web treatment

Load the font normally, then include [`examples/yak-title.css`](../examples/yak-title.css):

```html
<link rel="stylesheet" href="yak-title.css">
<h1 class="yak-title">40 Yaks</h1>
```

```css
@font-face {
  font-family: "40 Yaks";
  src: url("FortyYaks-Regular.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
}

.yak-title {
  font-size: 64px;
  --yak-face-top: #ff5d3d;
  --yak-face-bottom: #a51d13;
  --yak-rim: #ffd51a;
  --yak-side: #71401b;
  --yak-stroke: 2px;
  --yak-depth: 5px;
}
```

Change `--yak-face-top` and `--yak-face-bottom` for a different interior color. Set both to the same value for a solid fill. `--yak-rim` controls the border, while `--yak-stroke` changes its thickness. `--yak-side` and `--yak-depth` control the offset silhouette underneath. Scale the stroke and depth down for smaller text to keep the counters open.

The gradient is applied across the element's box. For consistent gradients in a multi-line heading, wrap each line in its own styled element. A per-glyph gradient requires separate glyph rendering. Avoid splitting accessible text into individually announced letters.

This is a lightweight CSS approximation of this layered look. The actual 3D result requires extrusion, bevel geometry, and lighting. The stylesheet includes a readable solid-color fallback and removes decorative effects in forced-colors mode.

## UIKit

A solid interior and outline can be drawn with an attributed string. A **negative** stroke width draws both fill and stroke; a positive value draws only the outline. UIKit's `strokeWidth` is a percentage of the font size, not a pixel width.

```swift
let font = UIFont(name: "FortyYaks-Regular", size: 48)!
label.attributedText = NSAttributedString(
    string: "40 Yaks",
    attributes: [
        .font: font,
        .foregroundColor: UIColor(red: 1, green: 0.365, blue: 0.239, alpha: 1),
        .strokeColor: UIColor(red: 1, green: 0.835, blue: 0.102, alpha: 1),
        .strokeWidth: -3
    ]
)
```

For a gradient interior, draw a gradient through a glyph-path mask and stroke those paths separately. For physical depth and responsive highlights, extrude the paths in a 3D renderer. Neither technique requires modifying or recoloring the font file.


## Replicate the layered treatment with a coding assistant

Copy this prompt:

```text
Install 40 Yaks from https://github.com/andrew-dougie/40-yaks and recreate the layered lettering shown in docs/game-treatment.png. Use the existing renderer and UI conventions in this project.

Use the original vector glyph paths, including counters. The repository provides normalized contours in sources/game-glyphs.json and generated punctuation in sources/punctuation.json, as well as TTF and WOFF2. Do not redraw the typeface or substitute a different font.

For a full 3D treatment, normalize capital height to approximately 1 unit and build three meshes per glyph:
1. Dark body: extrusion depth 0.25, bevel size 0.11, bevel thickness 0.045, one bevel segment. Translate depth by -0.25. Brown base #71401B, emissive #301505 at 0.35, flat shading.
2. Gold rim: extrusion depth 0.028, bevel size 0.09, bevel thickness 0.036, one bevel segment. Translate depth by +0.012. Gold base #FFC51C, emissive #D48200 at 0.55, specular #FFEF88, shininess 65. Preserve the letter holes and use gold lining inside them.
3. Front face: extrusion depth 0.01, bevel size 0.003, bevel thickness 0.005. Translate depth by +0.083. Use an unlit vertex-color fill that blends from #A51D13 at the bottom to #FF5D3D at the top. Interpolate in linear color space using clamped normalized glyph height raised to 0.65, then output sRGB.

Keep the lettering readable with mild, fixed per-letter variation: rotation Z = sin(index * 2.1) * 0.065 radians, vertical offset = sin(index * 1.8) * 0.025, depth offset = sin(index * 2) * 0.012. Do not randomize these every frame. Preserve proportional advances with roughly 0.20 units of tracking in the normalized contour scale.

For the specimen lighting, use a warm hemisphere light (#FFF4D3 sky / #301528 ground, intensity 2), a directional light (#FFEDC4, intensity 2.2) at (-3, 5, 8), and an orthographic camera. View the text with a slight tilt. Keep the counters open when tuning bevel widths. Render at a modest resolution without antialiasing for pixel edges, and scale using nearest-neighbor sampling if magnifying it.

If the project only supports standard HTML/CSS text, use examples/yak-title.css and document that it approximates the gradient, border, and depth but does not provide a physical bevel or lighting. Its custom properties control the two face colors, rim color/thickness, and side color/depth.

Keep the original text available to accessibility APIs. Honor reduced-motion preferences. Show plain and styled samples, check punctuation and the capital I against numeral 1, and verify no clipped bevels or closed counters. Include a screenshot and explain how to adjust the colors, edge width, depth, and rendering resolution.
```

The two reference images were rendered by the original lettering implementation: `game-treatment.png` uses the corrected 40 Yaks contours and coral face palette; `game-new-high-score.png` is its blue-face heading asset. The technical source revision is recorded in the source geometry notes.
