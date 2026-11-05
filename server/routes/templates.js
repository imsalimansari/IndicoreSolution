import { Router } from "express";
import EmailTemplate from "../models/EmailTemplate.js";
import auth from "../middleware/auth.js";
import { ah } from "../utils/ah.js";
const r = Router(); r.use(auth);
const pick = ({ name = "", category = "General", subject = "", body = "" }) => ({ name: String(name).trim(), category: String(category).trim() || "General", subject: String(subject).trim(), body: String(body) });
const bad = d => (!d.name ? "Template name is required." : !d.subject ? "Subject is required." : !d.body.trim() ? "Body is required." : "");
r.get("/", ah(async (_, res) => res.json(await EmailTemplate.find().sort({ order: 1, name: 1 }))));
r.post("/", ah(async (req, res) => { const d = pick(req.body), e = bad(d); if (e) return res.status(400).json({ message: e }); res.status(201).json(await EmailTemplate.create(d)); }));
r.put("/:id", ah(async (req, res) => {
  const d = pick(req.body), e = bad(d); if (e) return res.status(400).json({ message: e });
  const t = await EmailTemplate.findByIdAndUpdate(req.params.id, d, { new: true, runValidators: true });
  t ? res.json(t) : res.status(404).json({ message: "Not found" });
}));
r.delete("/:id", ah(async (req, res) => { await EmailTemplate.findByIdAndDelete(req.params.id); res.json({ ok: true }); }));
export default r;
