import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pages, NOT_FOUND, ADMIN, OG_IMAGE, DEFAULT_SITE, normPath, routeKind, jsonLdFor } from "../data/seo.js";

/* Public site URL: fixed at build time when known, otherwise whatever the visitor is on. */
const BUILT = typeof __SITE_URL__ !== "undefined" ? __SITE_URL__ : "";
export const siteUrl = () => (BUILT || (typeof location !== "undefined" ? location.origin : DEFAULT_SITE)).replace(/\/+$/, "");

const head = document.head;
function meta(attr, key, content) {
  let el = head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); head.appendChild(el); }
  el.setAttribute("content", content);
}
function link(rel, href) {
  let el = head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); head.appendChild(el); }
  el.setAttribute("href", href);
}

/* Updates <title>, description, canonical, robots, Open Graph, Twitter and JSON-LD on every route change. */
export default function SeoManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const kind = routeKind(pathname), path = normPath(pathname), site = siteUrl();
    const d = kind === "page" ? pages[path] : kind === "admin" ? ADMIN : NOT_FOUND;
    const url = site + (path === "/" ? "/" : path);
    document.title = d.title;
    meta("name", "description", d.description);
    meta("name", "robots", kind === "page" ? "index,follow,max-image-preview:large" : "noindex,nofollow");
    link("canonical", kind === "page" ? url : site + "/");
    meta("property", "og:title", d.title);
    meta("property", "og:description", d.description);
    meta("property", "og:url", url);
    meta("property", "og:image", site + OG_IMAGE);
    meta("name", "twitter:title", d.title);
    meta("name", "twitter:description", d.description);
    meta("name", "twitter:image", site + OG_IMAGE);
    let ld = document.getElementById("ld-page");
    if (kind !== "page") { ld?.remove(); return; }
    if (!ld) { ld = document.createElement("script"); ld.type = "application/ld+json"; ld.id = "ld-page"; head.appendChild(ld); }
    ld.textContent = JSON.stringify(jsonLdFor(path, site));
  }, [pathname]);
  return null;
}
