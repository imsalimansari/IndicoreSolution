import nodemailer from "nodemailer";
let tx;

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "indicore.solution@gmail.com";

export const mailReady = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const transport = () => tx ||= nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const fill = (s = "", v = {}, escape = false) => s.replace(/{{\s*(\w+)\s*}}/g, (_, k) => (escape ? esc(v[k]) : (v[k] ?? "")));
export const leadVars = l => ({
  name: l?.name || "Customer", email: l?.email || "", phone: l?.phone || "", service: l?.service || "your project",
  message: l?.message || "", company: "INDICORE SOLUTION",
  company_phone: "+91 81784 74271", company_email: CONTACT_EMAIL
});
const isHtml = b => /<\w+[^>]*>/.test(b);
export const wrap = html => {
  const site = process.env.SITE_URL || "https://indicoresolution.indicore.workers.dev";
  return `<div style="background:#eef2fb;padding:24px 12px;font-family:Segoe UI,Arial,sans-serif"><table align="center" width="600" style="max-width:100%;background:#fff;border-radius:14px;overflow:hidden"><tr><td style="background:linear-gradient(135deg,#0b1437,#0a4fd6);padding:22px 28px;text-align:center"><img src="${site}/logo.png" alt="INDICORE SOLUTION" height="46" style="background:#fff;border-radius:8px;padding:4px 10px"></td></tr><tr><td style="padding:28px;color:#1b2440;font-size:15px;line-height:1.7">${html}</td></tr><tr><td style="background:#0b1437;color:#b9c4e6;padding:18px 28px;font-size:12px;text-align:center">INDICORE SOLUTION · Siwan, Bihar, India<br>Udyam Registered Micro Enterprise · UDYAM-BR-35-0059732<br>+91 81784 74271 · ${esc(CONTACT_EMAIL)}<br><a href="${site}" style="color:#ff9d2e">${site.replace("https://", "")}</a><br><i>Driven by Innovation, Defined by Excellence.</i></td></tr></table></div>`;
};
export const render = (subject, body, lead) => {
  const v = leadVars(lead);
  // Decide HTML vs plain text from the template itself (before values go in), so lead input can never switch modes.
  // Each value is escaped exactly once: HTML templates escape the values; plain-text templates escape the whole text.
  const html = isHtml(body) ? fill(body, v, true) : esc(fill(body, v)).replace(/\n/g, "<br>");
  return { subject: fill(subject, v), html: wrap(html) };
};
export const sendMail = ({ to, subject, html, attachments }) =>
transport().sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, replyTo: CONTACT_EMAIL, to, subject, html, attachments: attachments?.length ? attachments : undefined, text: html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ") });
