import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';

const tags = new Set(['svg', 'g', 'defs', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask', 'title', 'desc']);
const attributes = new Set(['xmlns', 'id', 'viewBox', 'width', 'height', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'fx', 'fy', 'd', 'points', 'fill', 'fill-rule', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity', 'opacity', 'transform', 'gradientTransform', 'gradientUnits', 'spreadMethod', 'offset', 'stop-color', 'stop-opacity', 'clip-path', 'clip-rule', 'clipPathUnits', 'mask', 'maskUnits', 'maskContentUnits', 'preserveAspectRatio', 'vector-effect']);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

async function runtime() {
  try {
    const [{ Resvg }, { DOMParser }] = await Promise.all([import('@resvg/resvg-js'), import('@xmldom/xmldom')]);
    return { Resvg, DOMParser };
  } catch (error) {
    throw new Error(`Renderer dependencies unavailable. Run npm ci --prefix "${dirname(fileURLToPath(import.meta.url))}" --no-audit --no-fund. Original error: ${error.message}`);
  }
}

export function validate(svg, DOMParser) {
  if (Buffer.byteLength(svg) > 200000) throw new Error('Keep the SVG below 200 KB.');
  if (/<!DOCTYPE|<!ENTITY|<\?/i.test(svg)) throw new Error('DTD, entities and processing instructions are not supported.');
  const issues = [];
  const document = new DOMParser({ onError: (level, message) => issues.push(`${level}: ${message}`) }).parseFromString(svg, 'image/svg+xml');
  const root = document.documentElement;
  if (issues.length || root?.tagName !== 'svg' || root.namespaceURI !== 'http://www.w3.org/2000/svg') throw new Error('Provide a well-formed SVG document with the SVG namespace.');
  const nodes = Array.from(document.getElementsByTagName('*'));
  if (nodes.length > 1500) throw new Error('Keep the SVG below 1500 elements.');
  const ids = new Set(), references = [];
  for (const node of nodes) {
    if (!tags.has(node.tagName)) throw new Error(`Unsupported element: ${node.tagName}. Use static editable geometry or another renderer.`);
    for (const attr of Array.from(node.attributes)) {
      if (!attributes.has(attr.name) && !['role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden', 'focusable'].includes(attr.name)) throw new Error(`Unsupported attribute: ${attr.name}. Use explicit static presentation attributes.`);
      if (attr.name === 'xmlns' && attr.value !== 'http://www.w3.org/2000/svg') throw new Error('Invalid SVG namespace.');
      if (attr.name !== 'xmlns' && /https?:|data:|file:|javascript:|\\/i.test(attr.value)) throw new Error('External resources are not supported.');
      if (attr.name === 'id') {
        if (ids.has(attr.value)) throw new Error(`Duplicate SVG id: ${attr.value}`);
        ids.add(attr.value);
      }
      if (/url\s*\(/i.test(attr.value)) {
        const match = /^url\(#[a-z_][a-z0-9_.-]*\)$/i.exec(attr.value);
        if (!match) throw new Error('Paint references must use url(#local-id).');
        references.push(attr.value.slice(5, -1));
      }
    }
  }
  for (const id of references) if (!ids.has(id)) throw new Error(`Missing local paint reference: ${id}`);
  const box = root.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
  if (!box || box.length !== 4 || !box.every(Number.isFinite) || box[2] <= 0 || box[2] > 10000 || box[2] !== box[3]) throw new Error('Use a finite square viewBox no larger than 10000 units.');
  const width = root.getAttribute('width'), height = root.getAttribute('height');
  if ((width || height) && (!width || !height || !/^(?:\d+(?:\.\d+)?|\.\d+)(?:px)?$/.test(width) || !/^(?:\d+(?:\.\d+)?|\.\d+)(?:px)?$/.test(height) || parseFloat(width) !== parseFloat(height) || !Number.isFinite(parseFloat(width)) || parseFloat(width) <= 0)) throw new Error('Specify matching positive square width and height, or omit both.');
  return { viewBox: box, elements: nodes.length, sourceSha256: hash(svg) };
}

export async function render(svg) {
  const { Resvg, DOMParser } = await runtime();
  const checks = validate(svg, DOMParser);
  const png = (source, size) => new Resvg(source, { fitTo: { mode: 'width', value: size }, font: { loadSystemFonts: false } }).render();
  const trial = png(svg, 29);
  const pixels = trial.pixels;
  const colors = new Set();
  for (let i = 0; i < pixels.length; i += 4) colors.add(Buffer.from(pixels.subarray(i, i + 4)).toString('hex'));
  if (colors.size < 2) throw new Error('The small render contains no visible structure.');
  const files = new Map([['master.svg', Buffer.from(svg)]]);
  for (const size of [1024, 288, 120, 60, 29]) {
    const raster = png(svg, size);
    if (raster.width !== size || raster.height !== size) throw new Error('The rendered master is not square.');
    files.set(`preview-${size}.png`, raster.asPng());
  }
  let body = '';
  for (const [row, ground] of ['#F4F1E8', '#18211E'].entries()) {
    body += `<rect y="${row * 344}" width="690" height="344" fill="${ground}"/>`;
    for (const [column, size] of [288, 120, 60, 29].entries()) {
      body += `<image x="${[24, 338, 490, 600][column]}" y="${row * 344 + (344 - size) / 2}" width="${size}" height="${size}" href="data:image/png;base64,${files.get(`preview-${size}.png`).toString('base64')}"/>`;
    }
  }
  files.set('review.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="690" height="688">${body}</svg>`, 690).asPng());
  files.set('manifest.json', Buffer.from(JSON.stringify({ ...checks, renderer: 'icon-direction-renderer/0.1.0', status: 'Technical validation only; actual image review is still required.', proofColumnsPx: [288, 120, 60, 29], files: Object.fromEntries([...files].map(([name, bytes]) => [name, hash(bytes)])) }, null, 2) + '\n'));
  return files;
}

function preserveDirectories(target) {
  let path = resolve(target);
  while (true) {
    if (existsSync(path) && !statSync(path).isDirectory()) throw new Error(`Output ancestor is not a directory: ${path}`);
    if (path === dirname(path)) break;
    path = dirname(path);
  }
}

async function main(args) {
  if (args.length === 1 && args[0] === '--doctor') {
    await render('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#eeeeee"/><circle cx="50" cy="50" r="30" fill="#224466"/></svg>');
    console.log(`Renderer ready: Node ${process.versions.node}, ${process.platform}/${process.arch}. No MCP or collection required.`);
    return;
  }
  if (args.length !== 3 || args[1] !== '--out') throw new Error('Usage: node render.mjs input.svg --out output/r01, or node render.mjs --doctor');
  const input = resolve(args[0]), output = resolve(args[2]);
  if (existsSync(output)) throw new Error('Output already exists. Choose a new revision directory.');
  preserveDirectories(dirname(output));
  const files = await render(readFileSync(input, 'utf8'));
  mkdirSync(dirname(output), { recursive: true });
  mkdirSync(output);
  for (const [name, bytes] of files) writeFileSync(resolve(output, name), bytes, { flag: 'wx' });
  console.log(JSON.stringify({ output, files: [...files.keys()], next: 'Open review.png and preview-1024.png. Inspect all sizes; record observations before claiming quality.' }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
