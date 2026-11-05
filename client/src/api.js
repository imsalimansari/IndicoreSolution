// Leave VITE_API_URL empty when the site and API share one host (or in local dev, where Vite proxies /api).
// Set it (e.g. https://your-api.onrender.com) when the frontend is hosted separately, such as Vercel + Render.
let BASE = String(import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
if (BASE && !/^https?:\/\//i.test(BASE)) BASE = "https://" + BASE;         // forgiving if the scheme was left out
BASE = BASE.replace(/\/api$/i, "");                                           // ...or "/api" was added by mistake

export const getToken = () => localStorage.getItem("ic_token");
export const clearToken = () => localStorage.removeItem("ic_token");

const sleep = ms => new Promise(r => setTimeout(r, ms));
const WAKING = "Our server is waking up (free hosting sleeps when idle). Please try again in about a minute.";

/* Free API hosts sleep after inactivity. Ping once on page load so it is awake by the time someone submits the form. */
export const warmUp = () => { if (BASE) fetch(BASE + "/api/health", { cache: "no-store" }).catch(() => {}); };

export async function api(path, { method = "GET", body, auth } = {}) {
  const safe = method === "GET";
  let res, last;
  for (let attempt = 0; attempt < 4; attempt++) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 60000);   // a cold start can take ~50 s
    try {
      res = await fetch(BASE + "/api" + path, {
        method, signal: ctl.signal,
        headers: { "Content-Type": "application/json", ...(auth ? { Authorization: "Bearer " + getToken() } : {}) },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (e) {
      clearTimeout(timer); last = e;
      if (safe && attempt < 3) { await sleep(2500); continue; }                         // network error while waking: retry reads
      const err = new Error(e.name === "AbortError" ? WAKING : "Could not reach the server. Check your internet connection and try again."); err.status = 0; throw err;
    }
    clearTimeout(timer);
    const retryable = res.status === 503 || (safe && (res.status === 502 || res.status === 504));
    if (retryable && attempt < 3) { await sleep(3000); continue; }                       // host/DB still starting: never processed, safe to retry
    break;
  }
  const isJson = (res.headers.get("content-type") || "").includes("json");
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok || !isJson) {
    // expired / invalid admin session -> back to login
    if (res.status === 401 && auth) { clearToken(); if (location.pathname.startsWith("/admin") && location.pathname !== "/admin") location.assign("/admin"); }
    const msg = !isJson && res.ok ? "The API is not configured. Set VITE_API_URL to your backend address and redeploy."
      : [502, 503, 504].includes(res.status) ? WAKING
      : data.message || "Request failed";
    const e = new Error(msg); e.status = res.status; throw e;
  }
  return data;
}
