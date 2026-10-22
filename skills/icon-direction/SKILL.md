---
name: icon-direction
description: Create or refine distinctive application icons as editable SVG geometry, with product-led art direction and real small-size image review. Includes a standalone renderer and worked examples. Use for a new app identity or a requested adaptation of an existing icon.
---

# Icon direction

Create an identity for this product, not another member of a house style.
The deliverable is editable geometry, not a flattened generated image.
This folder contains the method, examples and rendering helper; no collection checkout, MCP server, Blender or API key is needed for static SVG work.
An agent capable of writing files and inspecting images is still required.

## Start from the actual request

For a new identity, establish the useful change the product makes, the feeling it should leave and where the icon will appear.
Reuse the user's brief; ask only when a missing decision would materially change the direction.
Treat a narrow edit as a narrow edit: preserve an accepted shape when asked only to change its palette.
For an existing source, keep an untouched copy and identify what must survive before editing.

Resolve all resource paths below relative to this `SKILL.md` file, not the user's working directory.
For a new direction, read [art direction](references/art-direction.md) and look at the four bundled `examples/*/preview.png` images.
Read the matching example source and `examples/index.md` when a construction principle is useful.
The examples demonstrate different decisions, not interchangeable subjects or a palette to reproduce.
Do not fetch the full collection to start working.

Explore a few genuinely different visual hypotheses before polishing one, unless the user already selected a direction.
A hypothesis should connect product meaning to a specific composition, not just name an object and a color.
A simple abstract mark is valid; relationships and subject substitution are optional.
Choose the direction by its silhouette, emotional fit and distinguishing event, rather than by how many details it contains.

## Give each direction its own color logic

Color research is part of every new icon with an open palette, even when the user does not mention color.
Read [color direction](references/color-direction.md), define the visual hierarchy and compare palette treatments on the actual composition before selecting one.
Work on value, chroma, color area and important adjacent edges, including the background; do not stop at attractive swatches or a familiar preset.
When the user asks for several concepts, explore distinct color structures where appropriate, so unrelated ideas do not all look like one brand.
Judge the chosen treatment at large and small sizes and record what it improves and what it sacrifices.

Honor supplied brand colors and accepted identity constraints first.
Research the allocation, proportions and contrast of those colors within the permitted range instead of inventing an unrelated palette.
Variants of one accepted identity should remain coherent unless alternative identities were requested.
A requested exact color substitution stays an exact substitution, without unsolicited concept exploration.

## Draw and inspect

Author self-contained SVG paths, shapes, groups and gradients.
Read [construction and finish](references/construction.md) for optical corrections, layering and the supported SVG subset.
Keep the master square; rounded app corners are a presentation choice, not a reason to permanently crop the source.
Do not derive all expressions automatically and imply they received equal artistic review.

Use the bundled renderer when the project has no established equivalent.
Run commands from the user's project, substituting the real skill path if installed elsewhere.
Node.js 22 or newer and npm are required for this helper.

```sh
npm ci --prefix ".agents/skills/icon-direction/scripts" --no-audit --no-fund
node .agents/skills/icon-direction/scripts/render.mjs --doctor
node .agents/skills/icon-direction/scripts/render.mjs artwork.svg --out output/r01
```

The dependency installation is local to the skill's scripts folder; it does not change the user's application dependencies.
The output directory must not already exist.
Each render saves the unchanged SVG, PNGs at 1024, 288, 120, 60 and 29 pixels, `review.png` and a technical manifest.
The review sheet's columns are 288, 120, 60 and 29 px, at native pixel size, on light and dark surroundings.
Open the actual generated images with the host's image viewer; successful rendering is not visual approval.
If installation or image viewing is unavailable, disclose that limitation and do not claim the result has been visually reviewed.
A project-native renderer is fine if it produces equivalent observable proofs.

Read [image review](references/review.md) when judging candidates and before final delivery.
Inspect the large image and the small proofs, name concrete defects, then change the source where useful.
Render a new revision after each correction that changes the artwork.
Keep prior candidates and rejected revisions; do not add a token change just to pretend iteration happened.
Compare the candidates with one another and the examples so unrelated ideas do not silently converge on the same silhouette or palette.

## Deliver honestly

Deliver the chosen SVG, full-size PNG, small-size proofs and a short decision note with the product intention, palette, alternatives considered, observed corrections and remaining risks.
Distinguish your own visual assessment from actual user validation.
Do not promise trademark clearance, exclusivity or consistent success from one example.
A technique that worked for a flower can be irrelevant to a financial product.

The renderer supports a deliberately limited, static geometry format.
It does not execute SVG scripts, load external assets, generate art, recolor automatically or validate taste.
Read [optional integrations](references/integrations.md) only when using an existing collection MCP, Drawn interpretation, Blender relief or motion workflow.
Those integrations are not prerequisites for this skill.
