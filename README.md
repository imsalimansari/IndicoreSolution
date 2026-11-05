# INDICORE SOLUTION – 3D MERN Website

MongoDB · Express · React (Vite, JavaScript) · Node. No Next.js, no TypeScript.
3D: three.js via @react-three/fiber (scroll-reactive scene), CSS 3D tilt cards.

## Run locally
1. `cp .env.example server/.env` and set `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
2. `npm run install:all`
3. `npm run dev` → site http://localhost:5173 · admin http://localhost:5173/admin

The admin user is created automatically from `ADMIN_EMAIL`/`ADMIN_PASSWORD` on first start.

## Deploy (free)
See **DEPLOY.md** for the complete step-by-step guide (MongoDB Atlas + Render API + Vercel/Cloudflare website, email, SEO, troubleshooting).
Single-service hosting still works: `npm run build && npm start` serves `client/dist` and `/api` from one Express server.

## API
`POST /api/leads` (public) · `POST /api/auth/login` · `GET/PATCH/DELETE /api/leads` and `GET /api/leads/stats` (JWT)

## v2 additions
- **Projects**: shown on the landing page, managed in Admin → Projects. Six *concept demo* projects are seeded on first start; edit or delete them and add your real work.
- **Charts** (Admin → Overview): area, donut, bar, radar, bar+line, column and radial charts.
- **Email**: Admin → Enquiries → ✉ Email. Templates live in Admin → Email Templates with variables such as `{{name}}`, `{{service}}`, `{{message}}`. Every send is stored in Admin → Email Log.
- **SMTP setup (Gmail)**: turn on 2-step verification, create an App Password, then fill `SMTP_*` and `MAIL_FROM` in `server/.env` and restart. On Render add the same variables.

## v3 additions
- **Multi-page site**: Home, About, Services, Projects, Industries, Process (with FAQ) and Contact are separate pages (React Router). The navbar, footer, WhatsApp button and back-to-top button are shared by every page. Unknown URLs show a 404 page.
- **Light / Dark mode**: toggle in the navbar, the admin header and the admin login. The choice is saved in the browser; first visit follows the device setting. No flash on load.
- **Animated mouse pointer** (dot + trailing ring + soft glow + click ripple, desktop only), card spotlight and 3D tilt, typing headline, tech marquee, counters, scroll progress bar and page transitions. Everything respects `prefers-reduced-motion`.
- **3D hero** now lives on the Home page only and pauses when scrolled out of view (faster inner pages).
- **Admin**: new Settings tab (change password, SMTP status), session check on load and automatic redirect to login when the token expires, new-enquiry badge, status colours, theme-aware charts.
- **Fixes**: async errors no longer crash the server (central error handler), saving a new email template twice no longer creates duplicates, project links/images only accept http(s) URLs, stricter input validation on enquiries, logo reduced from 1.1 MB to 190 KB.
- **Social links**: LinkedIn, Instagram and Facebook icons in the footer and on the Contact page (edit `social` in `client/src/data/content.js`).
- **Hosting note**: pages such as `/about` need the host to fall back to `index.html`. The Express server already does this. On a pure static host (e.g. Vercel) add a rewrite of all paths to `/index.html` and route `/api` to the backend.
- **Email templates**: 13 professional HTML templates (acknowledgement, meeting, proposal, kick-off, delivery, invoice reminder, support, feedback and more) in `server/utils/seed.js`. Missing defaults are added on server start; templates you edit are never overwritten. Text in [square brackets] must be filled in before sending.
- **Free split hosting**: frontend on a static host, API on Render. Set `VITE_API_URL` at frontend build time and `CLIENT_ORIGIN` on the API. `render.yaml` now deploys the API only.

## v4 additions (deployment + SEO)
- **Server hardening**: starts listening immediately, connects to MongoDB with automatic retries, `/api/health` reports DB and config problems, clear 503 instead of hanging while waking, exact-match CORS with optional wildcard, global rate limit, graceful shutdown, optional self keep-alive on Render.
- **Frontend resilience**: API calls retry while the free host wakes, the page pings the API on load, friendly errors, admin code is lazy-loaded.
- **SEO**: per-page title/description/canonical/Open Graph/Twitter/JSON-LD (`src/data/seo.js`), a real HTML file per page plus `sitemap.xml` and `robots.txt` generated after `vite build` (`scripts/postbuild.mjs`), favicons, manifest, social preview image.
- **Hosting files**: `client/vercel.json`, `client/public/_headers`, `client/public/_redirects`, `netlify.toml`, `render.yaml`.

## v5 additions (Udyam / MSME redesign)
- **New `/msme` page**: Udyam registration number (copy + "Verify on Udyam portal" link), the 7 registered NIC activity codes in plain English and the services behind each, "why a fellow MSME", and the launchpad. Data lives in `client/src/data/content.js` (`msme`, `nic`).
- **Services redesigned (12)**: all original 8 kept; added Digital Marketing & Advertising (NIC 73100), Graphic Design & Branding (74103), Data/Dashboards & Reporting and IT Consultancy & Digital Strategy (62020/62099). Filter by group; each card shows its NIC codes.
- **MSME Launchpad**: Get Online → Run Smarter → Automate → Scale Up (no prices published; quote on request). Shown on Home, Services and MSME.
- **Projects redesigned**: 10 MSME-focused *concept builds* with Sector + Problem → Solution. Two new optional fields (`sector`, `problem`) in Admin → Projects. The badge now reads "Concept build". If the API is unreachable the page shows a built-in copy of the list instead of being empty.
- **Safe project migration**: on server start, the 6 original demo projects are upgraded in place **only if you never edited them**; the 4 new concepts are added once. Your own projects and deletions are never touched or restored.
- **Brand assets**: logo, favicons, app icons and social preview regenerated from `indicore_complete_logo_kit`; clean icon cropped from the main logo (the kit's own icon files were cropped incorrectly).
- **Trust elements**: Udyam seal and tri-colour trust band on Home, credentials card on About, Udyam number in footer and Contact, Udyam facts in JSON-LD (`identifier`, `foundingDate`).
- **Honest copy**: removed "10+ industries served"; registration is described as an MSME classification, never as a government endorsement or quality certificate.
- **Privacy**: the residential address, social category and mobile number printed on the certificate are deliberately NOT published.
- **Email**: every email footer now shows the Udyam registration line (`server/utils/mailer.js`). Two new templates, *Udyam Credentials & Introduction* and *MSME Launchpad Options* (15 total), are added automatically on server start. Your existing 13 templates are never overwritten, so edits you made stay.
- **Email attachments** (Admin → Enquiries → ✉ Email → 📎 Attach files): up to 5 files, 3 MB each, 5 MB total; PDF, Word, Excel, PowerPoint, images, TXT, CSV, ZIP (executables and HTML are refused). Checked in the browser and again on the server (`server/utils/attachments.js`). File names appear in Admin → Email Log; file contents are not stored. No new npm package is needed.
- **Admin hardening**: email preview windows are sandboxed so a template can never run scripts inside the admin.
