# Icon skills

Create distinctive application icons with your own agent, as editable SVG geometry.
The skill guides product meaning, composition, color exploration and review at real icon sizes.
It includes a local renderer and four worked examples.

[Browse the collection](https://icons.kevinbarfleur.dev/) · [Read the skill](skills/icon-direction/SKILL.md)

## Install

Run from the project where you want to work:

```sh
npx skills add kevinbarfleur/icon-skills --skill icon-direction
```

The installer lets you choose your agent.
The skills CLI requires Node.js 22.20 or newer.
The skill needs an agent that can write files, run commands and inspect images.
Your agent subscription or API usage is separate.

## Start

Ask your agent:

> Use icon-direction. My app helps people [useful outcome]. Explore three distinct icon concepts, then refine the strongest. Keep the SVG editable and show the small-size previews. Follow my brand guidelines if I provide them.

The skill resolves its resources relative to its installation folder.
The default project installation is `.agents/skills/icon-direction`.
If you choose a different location, substitute that path below.

```sh
npm ci --prefix .agents/skills/icon-direction/scripts --no-audit --no-fund
node .agents/skills/icon-direction/scripts/render.mjs --doctor
node .agents/skills/icon-direction/scripts/render.mjs artwork.svg --out output/r01
```

The renderer saves the source, PNGs at 1024, 288, 120, 60 and 29 pixels, a review sheet and a technical manifest.
Use a new output folder for each revision.
The helper does not generate artwork or certify artistic quality; your agent authors the SVG and inspects the actual images.

## Skills

| Skill | Purpose | Status |
| --- | --- | --- |
| `icon-direction` | Product-led static SVG icon creation and refinement | Available |

Motion design is a planned, separate skill in this same repository.
It is not included in the current release.
No collection checkout or additional server is required to use the creation skill.

## License

The instructions, reference text and renderer code use the [MIT License](LICENSE).
The [example artwork has separate terms](skills/icon-direction/examples/LICENSE.txt): personal and commercial end-product use and modification are allowed, but redistribution as a competing stock library or artwork pack is not.
These terms do not change the rights on the rest of the online collection.
Third-party dependencies retain their own licenses.

## Feedback

Report installation problems or share a reproducible issue through this repository's Issues tab.
Include your Node.js version, operating system and the failing command, without credentials or private artwork.
