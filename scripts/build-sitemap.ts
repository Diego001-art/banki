/**
 * Проверка готовой сборки (out/): sitemap, robots, canonical, noindex, заголовки.
 * Запуск: после next build (npm run build делает это автоматически).
 */
import fs from "node:fs";
import path from "node:path";
import { sitemapPaths } from "../src/lib/sitemap-urls";
import { site } from "../src/lib/content";

const OUT = "out";
const errors: string[] = [];
function walk(d: string): string[] {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".html") ? [path.join(d, e.name)] : []));
}
const files = walk(OUT).filter((f) => !f.includes(path.sep + "admin" + path.sep) && !f.includes("_next"));
const titles = new Map<string, string>();
for (const f of files) {
  const h = fs.readFileSync(f, "utf8");
  const rel = "/" + path.relative(OUT, f).replace(/index\.html$/, "").replace(/\\/g, "/");
  const isRedirect = h.includes('http-equiv="refresh"');
  const robots = (h.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || "";
  if (!site.indexing && !/noindex/.test(robots)) errors.push(`${rel}: нет noindex при выключенной индексации`);
  if (f.endsWith("404.html") || rel.startsWith("/404/") || rel.startsWith("/_not-found")) continue;
  if (!/<link rel="canonical"/.test(h)) errors.push(`${rel}: нет canonical`);
  if (isRedirect) continue;
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${rel}: h1 — ${h1}`);
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  if (!title) errors.push(`${rel}: нет title`);
  else if (titles.has(title)) errors.push(`${rel}: title совпадает с ${titles.get(title)}`);
  else titles.set(title, rel);
}
const sm = fs.existsSync(path.join(OUT, "sitemap.xml")) ? fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8") : "";
const inMap = (sm.match(/<loc>([^<]+)<\/loc>/g) || []).length;
if (inMap !== sitemapPaths().length) errors.push(`sitemap: ${inMap} адресов, ожидалось ${sitemapPaths().length}`);
const robotsTxt = fs.existsSync(path.join(OUT, "robots.txt")) ? fs.readFileSync(path.join(OUT, "robots.txt"), "utf8") : "";
if (!site.indexing && !/Disallow: \/\s/.test(robotsTxt + "\n")) errors.push("robots.txt: при выключенной индексации должен быть Disallow: /");

console.log(`Проверено страниц: ${files.length}, в sitemap: ${inMap}`);
if (errors.length) {
  console.error("Ошибки SEO-проверки (" + errors.length + "):");
  errors.forEach((e) => console.error("  ✗ " + e));
  process.exit(1);
}
console.log("SEO-проверка пройдена.");
