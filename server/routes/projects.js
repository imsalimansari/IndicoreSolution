import { Router } from "express";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";
import { ah } from "../utils/ah.js";
const r = Router();
const okUrl = s => !s || /^(https?:\/\/|\/)[^\s"'()<>]*$/i.test(s);   // blocks javascript: and CSS-injection characters
const pick = b => ({
  title: String(b.title || "").trim(), category: String(b.category || "Web").trim(), summary: String(b.summary || "").trim(),
  problem: String(b.problem || "").trim().slice(0, 300), sector: String(b.sector || "").trim().slice(0, 80),
  tech: Array.isArray(b.tech) ? b.tech.map(s => String(s).trim()).filter(Boolean) : String(b.tech || "").split(",").map(s => s.trim()).filter(Boolean),
  image: String(b.image || "").trim(), link: String(b.link || "").trim(), icon: String(b.icon || "🚀").trim() || "🚀",
  featured: !!b.featured, published: b.published !== false, isDemo: !!b.isDemo, order: Number(b.order) || 0
});
const check = d => !d.title ? "Title is required." : !okUrl(d.image) ? "Image must be a valid http(s) URL." : !okUrl(d.link) ? "Link must be a valid http(s) URL." : "";

r.get("/", ah(async (_, res) => res.json(await Project.find({ published: true }).sort("order -createdAt"))));
r.get("/all", auth, ah(async (_, res) => res.json(await Project.find().sort("order -createdAt"))));
r.post("/", auth, ah(async (req, res) => {
  const d = pick(req.body), e = check(d); if (e) return res.status(400).json({ message: e });
  res.status(201).json(await Project.create(d));
}));
r.put("/:id", auth, ah(async (req, res) => {
  const d = pick(req.body), e = check(d); if (e) return res.status(400).json({ message: e });
  const p = await Project.findByIdAndUpdate(req.params.id, d, { new: true, runValidators: true });
  p ? res.json(p) : res.status(404).json({ message: "Not found" });
}));
r.delete("/:id", auth, ah(async (req, res) => { await Project.findByIdAndDelete(req.params.id); res.json({ ok: true }); }));
export default r;
