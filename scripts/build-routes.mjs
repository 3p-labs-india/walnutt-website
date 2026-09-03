/**
 * GitHub Pages has no rewrite rule: it serves a literal file or 404.html.
 * Without a real file per route, /engineers and friends answer 404 to crawlers
 * even though public/404.html makes them render fine for people.
 *
 * So after `vite build`, write dist/<route>/index.html for each known route,
 * with that route's title, description and canonical baked in. Pages then
 * answers 200, and crawlers that never run JS still get correct per-page meta.
 * 404.html goes back to meaning a genuine 404.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const site = JSON.parse(readFileSync(join(root, "src/lib/routes-meta.json"), "utf8"));
const shell = readFileSync(join(dist, "index.html"), "utf8");

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(route) {
  const canonical = site.origin + (route.canonical ?? route.path);
  let html = shell;

  // Fail loudly rather than silently shipping the wrong meta if index.html is
  // restructured and one of these tags stops matching.
  const sub = (pattern, replacement) => {
    if (!pattern.test(html)) {
      throw new Error(`build-routes: no match for ${pattern} in index.html — has the <head> changed?`);
    }
    html = html.replace(pattern, replacement);
  };

  sub(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`);
  sub(/(<meta name="description" content=")[^"]*(")/, `$1${esc(route.description)}$2`);
  sub(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
  sub(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`);
  sub(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(route.description)}$2`);
  sub(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);
  sub(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`);
  sub(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(route.description)}$2`);

  return html;
}

console.log("build-routes: emitting one HTML file per route");
for (const route of site.routes) {
  const html = render(route);
  const out = route.path === "/" ? "index.html" : `${route.path.slice(1)}/index.html`;
  const target = join(dist, out);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  console.log(`  ${route.path.padEnd(12)} -> dist/${out}`);
}
