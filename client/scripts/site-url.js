/* Works out the public URL of the site at BUILD time (canonical links, sitemap, social previews).
   Order: VITE_SITE_URL (set this yourself, exact address, no trailing slash) -> Vercel -> Netlify -> Cloudflare Pages -> "" (unknown). */
export default function siteUrl(env = process.env) {
  const pick = env.VITE_SITE_URL
    || (env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + env.VERCEL_PROJECT_PRODUCTION_URL : "")
    || (env.NETLIFY && env.URL ? env.URL : "")
    || (env.CF_PAGES_URL || "");
  let u = String(pick || "").trim().replace(/\/+$/, "");
  if (u && !/^https?:\/\//i.test(u)) u = "https://" + u;
  return u;
}
