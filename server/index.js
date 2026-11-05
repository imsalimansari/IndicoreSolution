import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "./models/Admin.js";
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/leads.js";
import projectRoutes from "./routes/projects.js";
import templateRoutes from "./routes/templates.js";
import mailRoutes from "./routes/mail.js";
import analyticsRoutes from "./routes/analytics.js";
import seed from "./utils/seed.js";

/* ------------------------------------------------------------------ *
 * Environment: clean up the usual copy/paste mistakes (spaces, quotes)
 * and collect problems instead of crashing, so the host's health check
 * still passes and /api/health tells you exactly what to fix.
 * ------------------------------------------------------------------ */
const clean = v => String(v ?? "").trim().replace(/^["']|["']$/g, "").trim();
const MONGO_URI = clean(process.env.MONGO_URI);
const JWT_SECRET = clean(process.env.JWT_SECRET);
if (JWT_SECRET) process.env.JWT_SECRET = JWT_SECRET;

const problems = [];
if (!MONGO_URI) problems.push("MONGO_URI is not set.");
else if (!/^mongodb(\+srv)?:\/\//.test(MONGO_URI)) problems.push("MONGO_URI must start with mongodb+srv:// or mongodb://");
else if (/[<>]/.test(MONGO_URI)) problems.push("MONGO_URI still contains <placeholders>. Replace <password> with your real database password (without the < >).");
if (!JWT_SECRET) problems.push("JWT_SECRET is not set.");
else if (JWT_SECRET.length < 16) problems.push("JWT_SECRET is too short (use at least 16 random characters).");
problems.forEach(p => console.error("CONFIG PROBLEM:", p));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

/* ---- CORS: exact origins, trailing slashes ignored, optional wildcard like https://*.vercel.app ---- */
const norm = s => s.trim().replace(/\/+$/, "").toLowerCase();
const allowed = clean(process.env.CLIENT_ORIGIN).split(",").map(norm).filter(Boolean);
const originOk = origin => {
  if (!allowed.length || allowed.includes("*")) return true;           // not configured -> open (API uses Bearer tokens, not cookies)
  const o = norm(origin);
  return allowed.some(a => a === o || (a.includes("*") && new RegExp("^" + a.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[a-z0-9-]+") + "$").test(o)));
};
if (!allowed.length) console.warn("CLIENT_ORIGIN is not set - API accepts requests from any website. Set it to your frontend URL.");
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: (origin, cb) => cb(null, !origin || originOk(origin)), maxAge: 86400 }));
// normal API calls are small; only the authenticated "send email" call may carry attachments (it sets its own larger limit)
app.use((req, res, next) => req.path === "/api/mail/send" ? next() : express.json({ limit: "200kb" })(req, res, next));
app.use(morgan("tiny", { skip: req => req.path === "/api/health" }));

/* ---- health: always answers 200 so Render keeps the service; shows DB state ---- */
const dbState = () => ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown";
app.get("/api/health", (_, res) => res.set("Cache-Control", "no-store").json({ ok: problems.length === 0 && mongoose.connection.readyState === 1, db: dbState(), problems }));
app.head("/api/health", (_, res) => res.sendStatus(200));            // some uptime monitors use HEAD

/* ---- everything else under /api needs config + DB; answer 503 (client retries) instead of hanging 10s ---- */
app.use("/api", (req, res, next) => {
  res.set("X-Robots-Tag", "noindex");
  if (problems.length) return res.status(503).json({ message: "Server is not configured yet.", problems });
  if (mongoose.connection.readyState !== 1) return res.status(503).set("Retry-After", "5").json({ message: "Server is waking up, please retry in a few seconds." });
  next();
});
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false, message: { message: "Too many requests, try later." } }));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", (_, res) => res.status(404).json({ message: "Not found" }));

/* ---- optional: serve the built React app (single-service hosting). In split hosting dist/ does not exist. ---- */
const dist = path.join(__dirname, "../client/dist");
if (fs.existsSync(path.join(dist, "index.html"))) {
  app.use(express.static(dist, { maxAge: "7d", setHeaders: (res, p) => { if (p.endsWith(".html")) res.setHeader("Cache-Control", "no-cache"); } }));
  app.get("*", (_, res) => res.sendFile(path.join(dist, "index.html")));
} else {
  app.get("/", (_, res) => res.set("X-Robots-Tag", "noindex").json({ service: "INDICORE SOLUTION API", status: "running", health: "/api/health" }));
  app.use((_, res) => res.status(404).set("X-Robots-Tag", "noindex").json({ message: "Not found" }));
}

// central error handler (also receives rejected async handlers via utils/ah.js)
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(", ") });
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id or value" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON" });
  if (err.type === "entity.too.large") return res.status(413).json({ message: "Request too large" });
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

async function seedAdmin() {
  const e = clean(process.env.ADMIN_EMAIL), p = clean(process.env.ADMIN_PASSWORD);
  if (!e || !p) { console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set - no admin user will be created."); return; }
  if (p.length < 8) console.warn("ADMIN_PASSWORD is shorter than 8 characters - please use a stronger one.");
  if (!(await Admin.findOne({ email: e.toLowerCase() }))) {
    await Admin.create({ email: e, password: await bcrypt.hash(p, 12) });
    console.log("Admin seeded:", e);
  }
}

/* ---- start listening FIRST (Render needs an open port quickly), then connect to MongoDB with retries ---- */
process.on("unhandledRejection", e => console.error("Unhandled rejection:", e));
process.on("uncaughtException", e => console.error("Uncaught exception:", e));
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => console.log("API listening on port", PORT));
server.keepAliveTimeout = 65000;     // longer than the proxy's idle timeout -> no random 502s
server.headersTimeout = 66000;

async function connectDb(attempt = 1) {
  if (problems.length) return;
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000, maxPoolSize: 5 });
    console.log("MongoDB connected");
    try { await seedAdmin(); await seed(); } catch (e) { console.error("Seeding failed (site still works):", e.message); }
  } catch (err) {
    const hint = /ENOTFOUND|querySrv/i.test(err.message) ? " (check the cluster host name in MONGO_URI)"
      : /auth/i.test(err.message) ? " (wrong database user or password - special characters in the password must be URL-encoded)"
      : /whitelist|IP|ECONNREFUSED|timed out|selection/i.test(err.message) ? " (in Atlas > Network Access allow 0.0.0.0/0)" : "";
    const wait = Math.min(5000 * attempt, 30000);
    console.error(`DB connection failed (attempt ${attempt}): ${err.message}${hint}. Retrying in ${wait / 1000}s`);
    setTimeout(() => connectDb(attempt + 1), wait);
  }
}
mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected - driver will reconnect automatically"));
connectDb();

/* ---- keep the free Render instance awake (it sleeps after 15 min without traffic) ----
 * Pings its own public URL every 10 min. Turn off with KEEP_AWAKE=false. A free external monitor (UptimeRobot) is the second guard. */
const self = process.env.RENDER_EXTERNAL_URL;
if (self && process.env.KEEP_AWAKE !== "false") {
  setInterval(() => { fetch(self.replace(/\/$/, "") + "/api/health").catch(() => {}); }, 10 * 60 * 1000).unref();
}

const stop = () => { server.close(() => mongoose.connection.close(false).finally(() => process.exit(0))); setTimeout(() => process.exit(0), 8000).unref(); };
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
