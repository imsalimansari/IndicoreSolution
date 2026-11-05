/* Runs automatically after `vite build` (see package.json "build").
   Turns the single-page build into an SEO-friendly static site, with NO extra dependencies:
     - one real HTML file per page (dist/about/index.html ...) with its own title, description, canonical, Open Graph, JSON-LD
     - sitemap.xml and robots.txt using your real site URL
   It never fails the deployment: if anything goes wrong it prints a warning and leaves the normal build untouched. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import siteUrlFromEnv from "./site-url.js";
import { pages, DEFAULT_SITE, jsonLdFor } from "../src/data/seo.js";
import { services } from "../src/data/content.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const indexFile = path.join(dist, "index.html");

try {
  if (!fs.existsSync(indexFile)) throw new Error("dist/index.html not found (did vite build run?)");
  let site = siteUrlFromEnv();
  if (!site) {
    site = DEFAULT_SITE;
    console.warn(`\n[seo] WARNING: VITE_SITE_URL is not set, using ${site} for canonical links and sitemap.\n[seo] Set VITE_SITE_URL=https://your-real-domain in your hosting environment variables and redeploy.\n`);
  }
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const setMeta = (html, attr, key, val) => {
    const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
    if (!re.test(html)) throw new Error(`template is missing <meta ${attr}="${key}">`);
    return html.replace(re, (_, a, b) => a + esc(val) + b);
  };
  const setLink = (html, rel, extra, href) => {
    const re = new RegExp(`(<link\\s+rel="${rel}"${extra}\\s+href=")[^"]*(")`);
    if (!re.test(html)) throw new Error(`template is missing <link rel="${rel}">`);
    return html.replace(re, (_, a, b) => a + esc(href) + b);
  };

  const base = fs.readFileSync(indexFile, "utf8").replace(/__SITE_URL__/g, site);

  const build = (route, d) => {
    const url = site + (route === "/" ? "/" : route);
    let h = base;
    h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(d.title)}</title>`);
    h = setMeta(h, "name", "description", d.description);
    h = setLink(h, "canonical", "", url);
    h = setLink(h, "alternate", ' hreflang="en-IN"', url);
    for (const [a, k, v] of [["property", "og:title", d.title], ["property", "og:description", d.description], ["property", "og:url", url], ["name", "twitter:title", d.title], ["name", "twitter:description", d.description]]) h = setMeta(h, a, k, v);
    const ld = JSON.stringify(jsonLdFor(route, site)).replace(/</g, "\\u003c");
    h = h.replace("</head>", () => `<script type="application/ld+json" id="ld-page">${ld}</script>\n</head>`);
    const links = Object.entries(pages).map(([p, v]) => `<a href="${p}">${esc(v.label)}</a>`).join(" | ");
    const list = route === "/" || route === "/services" ? `<ul>${services.map(s => `<li><b>${esc(s.t)}</b>: ${esc(s.d)}</li>`).join("")}</ul>` : "";
    const h1 = route === "/" ? "INDICORE SOLUTION - AI, Web & Software Development" : d.label + " | INDICORE SOLUTION";
    const nos = `<noscript><div style="max-width:760px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6"><h1>${esc(h1)}</h1><p>${esc(d.description)}</p>${list}<p>${links}</p><p>Please enable JavaScript to view this website.</p></div></noscript>`;
    return h.replace(/<body[^>]*>/, m => m + nos);
  };

  let n = 0;
  for (const [route, d] of Object.entries(pages)) {
    const html = build(route, d);
    if (route === "/") fs.writeFileSync(indexFile, html);
    else { fs.mkdirSync(path.join(dist, route), { recursive: true }); fs.writeFileSync(path.join(dist, route, "index.html"), html); }
    n++;
  }
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    Object.entries(pages).map(([p, v]) => `  <url><loc>${site}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod><changefreq>${v.changefreq}</changefreq><priority>${v.priority}</priority></url>`).join("\n") + `\n</urlset>\n`);
  fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`);
  console.log(`[seo] OK: ${n} pages, sitemap.xml and robots.txt written for ${site}`);
} catch (e) {
  // last-resort: still make sure no placeholder is left in the deployed HTML
  try { if (fs.existsSync(indexFile)) fs.writeFileSync(indexFile, fs.readFileSync(indexFile, "utf8").replace(/__SITE_URL__/g, siteUrlFromEnv() || DEFAULT_SITE)); } catch { /* ignore */ }
  console.warn("[seo] postbuild skipped:", e.message, "- the site still works, but SEO files were not generated.");
}
