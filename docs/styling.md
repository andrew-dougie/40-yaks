# Face color, edging, and depth

The TTF and WOFF2 contain the **silhouette** of each letter, including its holes. They are ordinary monochrome outline fonts. You can set their text color in any application. Gold edging, gradient fills, highlights, and shadows must be supplied by the app rendering the text.

## A 3D rendering recipe

For exact dimensions, both material presets, source code, lighting, animation, and pixel presentation, use the **[3D cookbook](3d-cookbook.md)**. The overview below shows the bright title palette; generic headings use a separate gold preset.

Construct several solid meshes from each glyph contour:

| Layer | Role | Example palette / settings |
| --- | --- | --- |
| Front face | The colored interior of the letter | Bottom `#A51D13` → top `#FF5D3D` |
| Bevel and rim | Broad gold edge surrounding the face and its counters | Gold base `#FFD51A`, emissive `#FFB900`, pale specular highlights |
| Extruded body | Darker thickness visible along the sides | Brown `#71401B` with warm ambient/emissive shading |
| Candle core | Small unlit flame highlight in the title fixture | Cream `#FFF4C2` |
| Placement | The jumbled title arrangement | Individual letter rotations, offsets, and animation |

The face gradient follows a fixed authored Y range (normally 0–1) and uses a nonlinear blend (`height^0.65`) in the renderer's linear color space. Bevel width, camera angle, lights, and emissive materials affect the visible result. A CSS stroke is a flat border; it does not reproduce the real bevel's angled faces and changing highlights.

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

For physical extrusion and exact source parity, use the **[copy/paste 3D installation prompt](3d-cookbook.md#8-copypaste-exact-3d-installation-prompt)** and the bundled [Three.js implementation](../examples/three/lettering.js). The cookbook distinguishes title and heading palettes, preserves authored contour coordinates, and specifies the separate gold counter lining.

For 2D web or native rendering, use the **[layered and colored installation prompt in the README](../README.md#layered-and-colored-lettering)**. Those approaches approximate the appearance without reproducing physical bevels.

The two reference images were rendered by the original lettering implementation: `game-treatment.png` uses the corrected 40 Yaks contours and coral face palette; `game-new-high-score.png` is its blue-face heading asset. The technical source revision is recorded in the source geometry notes.
