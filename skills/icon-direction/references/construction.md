# Construction and finish

## From sketch to authored shape

Start with the large masses and negative space, then refine the contour.
Use a few intentional Bezier spans instead of many small points approximating a smooth curve.
Check tangent continuity where a soft curve should flow, and deliberately break it where the form turns or folds.
Place extrema and inflections for the silhouette you want, rather than accepting a symmetric primitive by default.
Asymmetry should carry direction or weight, not merely make the mark irregular.

Optical balance differs from numerical centering.
A pointed tip, heavy dark lobe or diagonal band can pull the perceived center away from the viewBox center.
Review its breathing room on all sides in an app-sized square.
Do not impose identical padding on different silhouettes.

Make overlaps unambiguous.
Either separate edges clearly, let one visibly pass behind another, or make their contact intentional.
Near-tangencies, tiny slivers and inconsistent occlusion often survive at 1024 px but become dirt at 29 px.
Keep important gaps wide enough to remain visible in the actual small raster, not just the SVG editor.

For relief-like vector work, establish the main plane, one coherent underside or contact shadow and a restrained highlight if justified.
Inspect the cast shadow's direction and contact point.
Do not place a generic offset shadow under every internal piece.
For flat work, tune area, rhythm and contrast instead of adding fake depth to meet a finish quota.

## Source structure

Use meaningful group IDs for genuinely separate parts, so later geometry or palette edits remain understandable.
A standalone SVG with explicit fills and strokes should render without the original application, CSS variables, remote fonts or JavaScript.
Keep SVG source and production notes separate from review-only labels and backgrounds.

The bundled renderer accepts `svg`, `g`, `defs`, paths, basic shapes, gradients, clip paths, masks, titles and descriptions.
It accepts static presentation attributes and local `url(#id)` paint references.
Accessible names and descriptions can use `role`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-hidden` and `focusable`.
Use a finite square viewBox of at most 10000 units and matching square dimensions when dimensions are specified.
Text should be converted to geometry when part of a mark; live fonts, embedded images, style sheets, external resources, scripts and animation are intentionally outside this renderer's format.
Comments are allowed; DTD and XML processing instructions are not.
If adapting a valid user SVG outside that subset, preserve the original and use an appropriate existing renderer or make an explicitly documented geometry-only copy.
Do not silently flatten editable user artwork to make a validator pass.

## Style variants

An expressive drawing needs a decision about gesture, contour pressure and which details survive simplification.
Random jitter around every point is not a drawing direction.
A 3D interpretation needs coherent thickness, materials, lighting and camera framing; a blurred SVG shadow is not a Blender scene.
The bundled helper renders static SVG only.
Each additional expression needs its own source and visual review.
