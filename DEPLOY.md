# Free deployment guide: INDICORE SOLUTION

Total cost: **₹0**. Three free services, each doing one job.

| Part | Service | Free plan |
|---|---|---|
| Database | MongoDB Atlas | M0 cluster (512 MB) |
| API (`server/`) | Render | Free web service |
| Website (`client/`) | Vercel *(or Cloudflare Pages / Netlify)* | Free |
| Email sending | Brevo | 300 emails/day |

Do the steps **in this order**. Allow about 30 minutes.

> **Vercel note:** Vercel's free *Hobby* plan is meant for personal, non-commercial use. For a company website use **Cloudflare Pages** or **Netlify** instead (see step 4, option B). Everything else is identical.

---

## 1. MongoDB Atlas (database)
1. Sign up at <https://cloud.mongodb.com> → **Create** → **M0 Free** → pick the region nearest you (Mumbai, `ap-south-1`) → Create.
2. **Database Access** → Add New Database User → username `indicore`, password with **letters and numbers only** (symbols must be URL-encoded and are the #1 cause of "auth failed") → role *Read and write to any database*.
3. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`). Render's free IPs change, so this is required.
4. **Database** → Connect → Drivers → copy the string and edit it into this exact shape (note `/indicore` before the `?`):
   ```
   mongodb+srv://indicore:YOURPASSWORD@cluster0.xxxxx.mongodb.net/indicore?retryWrites=true&w=majority
   ```
   Remove the `<` `>` around the password.

## 2. Put the code on GitHub
Create a **private** repository and push the contents of the `indicore` folder (the folder that contains `client/`, `server/`, `render.yaml`). Never commit a `.env` file (already in `.gitignore`).

## 3. Render (API)
1. <https://render.com> → **New → Blueprint** → choose your repo. Render reads `render.yaml`.
   *(Manual alternative: New → Web Service, Root Directory `server`, Build `npm install --omit=dev`, Start `npm start`, Health Check Path `/api/health`, Instance type Free.)*
2. Fill the prompted variables:

   | Variable | Value |
   |---|---|
   | `MONGO_URI` | the string from step 1 |
   | `ADMIN_EMAIL` | your admin login email |
   | `ADMIN_PASSWORD` | a strong password (8+ chars) — this creates the admin on first start |
   | `CLIENT_ORIGIN` | leave blank for now (step 5) |
   | `SITE_URL` | leave blank for now (step 5) |
   | `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | from step 6 (can be added later) |

   `JWT_SECRET` is generated automatically.
3. Wait for **Live**, then open `https://YOUR-API.onrender.com/api/health`.
   You must see `{"ok":true,"db":"connected","problems":[]}`.
   If not, the `problems` list or the Render **Logs** tell you exactly what to fix (see the table at the end).

## 4. Website
### Option A: Vercel
1. <https://vercel.com> → **Add New → Project** → import the repo.
2. **Root Directory: `client`** (important). Framework preset: Vite (auto).
3. **Environment Variables** (both are required):
   - `VITE_API_URL` = `https://YOUR-API.onrender.com` (no trailing slash, no `/api`)
   - `VITE_SITE_URL` = the website address, e.g. `https://indicoresolution.vercel.app`
4. Deploy. `client/vercel.json` already contains the page-refresh rewrite, caching and security headers.

### Option B: Cloudflare Pages (free, commercial use allowed)
Workers & Pages → Create → Pages → connect repo → Root directory `client`, build command `npm run build`, output `dist`. Add the same two variables **plus** `NODE_VERSION=20`. `_redirects` and `_headers` are already in `client/public`.

### Option B2: Netlify
Import the repo; `netlify.toml` at the root does the rest. Add `VITE_API_URL` and `VITE_SITE_URL`.

## 5. Connect the two (do not skip, this prevents the "CORS" error)
In Render → your service → **Environment**:
- `CLIENT_ORIGIN` = your website address, e.g. `https://indicoresolution.vercel.app` (exact, no trailing slash; several allowed, comma separated)
- `SITE_URL` = same address (used for the logo in emails)

Save. Render restarts by itself. Open the website → Contact → send a test message → check **/admin → Enquiries**.

## 6. Email (Brevo)
Render's free plan **blocks** the normal SMTP ports (25/465/587), so use Brevo on port 2525 (already set in `render.yaml`).
1. Sign up at <https://brevo.com> → **SMTP & API → SMTP** → copy the login (`SMTP_USER`) and generate a key (`SMTP_PASS`).
2. **Senders & IP → Senders** → add and verify `indicore.solution@gmail.com`.
3. In Render set `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM` = `INDICORE SOLUTION <indicore.solution@gmail.com>` (the address must be the verified sender).
4. Admin → Settings should now show email as ready; use the test-send there.

## 7. Keep the free API awake
Render free services sleep after 15 minutes without visitors (first request then takes ~50 s). Two guards are already in place:
- The API pings itself every 10 minutes (switch off with `KEEP_AWAKE=false`).
- The website wakes the API the moment a visitor opens any page, and the contact form automatically retries while it wakes.

Add one more free layer: <https://uptimerobot.com> → New monitor → HTTP(s) → `https://YOUR-API.onrender.com/api/health` → every 5 minutes.

## 8. SEO: what is built in, and what you do once
Already done in the code: unique title and description for every page, canonical links, Open Graph and Twitter previews (`og-image.png`), JSON-LD (business, breadcrumbs, FAQ), a real HTML file per page, `sitemap.xml`, `robots.txt`, favicons and web manifest, admin pages set to `noindex`, and the admin code split out so public pages load fast.

Do this once after the site is live:
1. <https://search.google.com/search-console> → add your site → verify (the HTML-tag or DNS method) → **Sitemaps** → submit `sitemap.xml`. Then URL Inspection → *Request indexing* for the home page.
2. Same on <https://www.bing.com/webmasters> (you can import from Search Console).
3. Create a free **Google Business Profile** for "INDICORE SOLUTION, Siwan, Bihar". This matters more for local searches than anything on the page.
4. Add the website link to your LinkedIn, Instagram and Facebook pages.
5. Check previews: <https://search.google.com/test/rich-results> and a LinkedIn/WhatsApp share of the link.
6. Later, buy a custom domain (e.g. `indicoresolution.in`), add it in Vercel/Cloudflare, and change `VITE_SITE_URL` and Render's `CLIENT_ORIGIN` to it. Google ranks a proper domain far better than `*.vercel.app`.

## 9. Final guard: check before you announce
- [ ] `/api/health` shows `"ok":true,"db":"connected","problems":[]`
- [ ] Website opens; refresh on `/about` and `/contact` works (no 404)
- [ ] Contact form submits and the enquiry appears in `/admin`
- [ ] `/admin` login works with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] `https://YOUR-SITE/sitemap.xml` and `/robots.txt` open and show your real address, not a placeholder
- [ ] View source of `/about`: `<title>` and `<link rel="canonical">` are for that page
- [ ] Test email sent from Admin → Enquiries → ✉ Email
- [ ] Admin password is strong; `.env` is not in GitHub
- [ ] UptimeRobot monitor is green

## Troubleshooting

| What you see | Cause and fix |
|---|---|
| Browser console: *blocked by CORS policy* | `CLIENT_ORIGIN` on Render does not exactly match the website address (check `https`, no trailing slash). Save and wait for restart. |
| Form says *server is waking up* | Normal after idle on the free plan. Wait a minute. UptimeRobot prevents it. |
| `/api/health` → `"db":"disconnected"` | Logs say why: wrong password (use letters/numbers only), or Atlas Network Access is missing `0.0.0.0/0`. The server keeps retrying by itself. |
| `problems`: *MONGO_URI still contains placeholders* | Remove `<` `>` and use the real password. |
| Site loads but projects and forms fail, console shows a request to the Vercel address | `VITE_API_URL` was missing at build time. Add it and **Redeploy** (these variables are read during the build). |
| 404 when refreshing `/about` | Root Directory is not `client`, so `vercel.json` was not used. Fix it and redeploy. |
| Vercel build fails: *vite: not found* / *package.json not found* | Same cause: Root Directory must be `client`. |
| Email fails with *connection timeout* | You are on Gmail SMTP. Use Brevo (step 6) on Render. |
| Email fails with *sender not valid* | `MAIL_FROM` address is not the verified Brevo sender. |
| Sitemap/canonical shows the wrong address | `VITE_SITE_URL` not set. Set it and Redeploy. The build log prints a `[seo] WARNING` when this happens. |
| Cannot log in to admin | The admin is created only if no user with that email exists. Changing `ADMIN_PASSWORD` later does not change it; use Admin → Settings → Change password. |
