import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Admin from "../models/Admin.js";
import auth from "../middleware/auth.js";
import { ah } from "../utils/ah.js";
const r = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: "Too many attempts, try later." } });

r.post("/login", limiter, ah(async (req, res) => {
  const { email = "", password = "" } = req.body;
  const admin = await Admin.findOne({ email: String(email).trim().toLowerCase() });
  if (!admin || !(await bcrypt.compare(String(password), admin.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, email: admin.email });
}));

// lets the dashboard verify a stored token on load
r.get("/me", auth, ah(async (req, res) => {
  const a = await Admin.findById(req.admin.id).select("email");
  if (!a) return res.status(401).json({ message: "Unauthorized" });
  res.json({ email: a.email });
}));

r.post("/change-password", auth, limiter, ah(async (req, res) => {
  const { current = "", next = "" } = req.body;
  if (String(next).length < 8) return res.status(400).json({ message: "New password must be at least 8 characters." });
  const a = await Admin.findById(req.admin.id);
  if (!a || !(await bcrypt.compare(String(current), a.password))) return res.status(400).json({ message: "Current password is incorrect." });
  a.password = await bcrypt.hash(String(next), 12);
  await a.save();
  res.json({ message: "Password updated." });
}));
export default r;
