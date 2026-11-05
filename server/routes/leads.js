import { Router } from "express";
import rateLimit from "express-rate-limit";
import Lead from "../models/Lead.js";
import auth from "../middleware/auth.js";
import { ah } from "../utils/ah.js";
const r = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: "Too many requests, try later." } });
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const STATUS = ["new", "contacted", "in-progress", "closed"];
const str = (v, n) => String(v ?? "").trim().slice(0, n);

r.post("/", limiter, ah(async (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 100), email = str(b.email, 200).toLowerCase(), message = str(b.message, 2000);
  if (!name || !emailRx.test(email) || !message) return res.status(400).json({ message: "Name, valid email and message are required." });
  await Lead.create({ name, email, phone: str(b.phone, 30), service: str(b.service, 100) || "General", message });
  res.status(201).json({ message: "Thank you! We will get back to you shortly." });
}));

r.get("/", auth, ah(async (req, res) => {
  const { status, q } = req.query;
  const f = {};
  if (status) f.status = String(status);
  if (q) f.$or = ["name", "email", "message", "service"].map(k => ({ [k]: new RegExp(esc(q), "i") }));
  res.json(await Lead.find(f).sort("-createdAt").limit(500));
}));

r.get("/stats", auth, ah(async (req, res) => {
  const [total, byStatus, byService] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: "$service", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }])
  ]);
  res.json({ total, byStatus, byService });
}));

r.patch("/:id", auth, ah(async (req, res) => {
  if (!STATUS.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  lead ? res.json(lead) : res.status(404).json({ message: "Not found" });
}));

r.delete("/:id", auth, ah(async (req, res) => { await Lead.findByIdAndDelete(req.params.id); res.json({ ok: true }); }));
export default r;
