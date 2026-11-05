import express, { Router } from "express";
import Lead from "../models/Lead.js";
import EmailLog from "../models/EmailLog.js";
import auth from "../middleware/auth.js";
import { ah } from "../utils/ah.js";
import { mailReady, render, sendMail } from "../utils/mailer.js";
import { readAttachments } from "../utils/attachments.js";
const r = Router();
r.use(auth);
r.get("/status", (_, res) => res.json({ ready: mailReady() }));
r.get("/logs", ah(async (_, res) => res.json(await EmailLog.find().sort("-createdAt").limit(300))));
r.post("/preview", ah(async (req, res) => {
  const { subject = "", body = "", leadId } = req.body;
  const lead = leadId ? await Lead.findById(leadId) : { name: "Salim Ansari", email: "salim@example.com", phone: "+91 90000 00000", service: "Web & Digital Experience", message: "We need a modern website for our business." };
  res.json(render(subject, body, lead));
}));
r.post("/send", express.json({ limit: "9mb" }), ah(async (req, res) => {
  if (!mailReady()) return res.status(400).json({ message: "SMTP is not configured. Add SMTP_* values to server/.env." });
  const { leadId, subject, body, template = "Custom" } = req.body;
  const lead = await Lead.findById(leadId);
  if (!lead) return res.status(404).json({ message: "Enquiry not found" });
  if (!subject || !body) return res.status(400).json({ message: "Subject and body are required" });
  const { files, error } = readAttachments(req.body.attachments);
  if (error) return res.status(400).json({ message: error });
  const m = render(subject, body, lead);
  const log = { lead: lead._id, to: lead.email, toName: lead.name, subject: m.subject, html: m.html, template, attachments: files.map(f => ({ name: f.filename, size: f.content.length })) };
  try {
    await sendMail({ to: lead.email, ...m, attachments: files });
    if (lead.status === "new") { lead.status = "contacted"; await lead.save(); }
    res.json(await EmailLog.create({ ...log, status: "sent" }));
  } catch (e) {
    await EmailLog.create({ ...log, status: "failed", error: e.message });
    res.status(500).json({ message: "Send failed: " + e.message });
  }
}));
r.post("/test", ah(async (req, res) => {
  if (!mailReady()) return res.status(400).json({ message: "SMTP is not configured." });
  const { to, subject = "", body = "" } = req.body;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to || "")) return res.status(400).json({ message: "Enter a valid email address." });
  try { await sendMail({ to, ...render(subject, body, null) }); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ message: "Send failed: " + e.message }); }
}));
export default r;
