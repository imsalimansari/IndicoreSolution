import { Router } from "express";
import Lead from "../models/Lead.js";
import EmailLog from "../models/EmailLog.js";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";
import { ah } from "../utils/ah.js";
const r = Router();
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const grp = f => [{ $group: { _id: { $dateToString: { format: f, date: "$createdAt" } }, c: { $sum: 1 } } }];
r.get("/", auth, ah(async (_, res) => {
  const d30 = new Date(Date.now() - 29 * 864e5); d30.setUTCHours(0, 0, 0, 0);
  const m6 = new Date(); m6.setUTCMonth(m6.getUTCMonth() - 5, 1); m6.setUTCHours(0, 0, 0, 0);
  const sent = { status: "sent" };
  const [total, byStatus, byService, ld, ed, lm, em, dow, sentN, failedN, projects] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: "$service", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
    Lead.aggregate([{ $match: { createdAt: { $gte: d30 } } }, ...grp("%Y-%m-%d")]),
    EmailLog.aggregate([{ $match: { createdAt: { $gte: d30 }, ...sent } }, ...grp("%Y-%m-%d")]),
    Lead.aggregate([{ $match: { createdAt: { $gte: m6 } } }, ...grp("%Y-%m")]),
    EmailLog.aggregate([{ $match: { createdAt: { $gte: m6 }, ...sent } }, ...grp("%Y-%m")]),
    Lead.aggregate([{ $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }]),
    EmailLog.countDocuments(sent), EmailLog.countDocuments({ status: "failed" }), Project.countDocuments()
  ]);
  const m = a => Object.fromEntries(a.map(x => [x._id, x.c]));
  const [L, E, LM, EM] = [m(ld), m(ed), m(lm), m(em)];
  const daily = Array.from({ length: 30 }, (_, i) => { const k = new Date(d30.getTime() + i * 864e5).toISOString().slice(0, 10); return { date: k.slice(5), leads: L[k] || 0, emails: E[k] || 0 }; });
  const monthly = Array.from({ length: 6 }, (_, i) => { const t = new Date(m6); t.setUTCMonth(m6.getUTCMonth() + i); const k = t.toISOString().slice(0, 7); return { month: k, leads: LM[k] || 0, emails: EM[k] || 0 }; });
  const weekday = DAYS.map((day, i) => ({ day, count: dow.find(x => x._id === i + 1)?.count || 0 }));
  res.json({ total, byStatus, byService, daily, monthly, weekday, emails: { sent: sentN, failed: failedN }, projects });
}));
export default r;
