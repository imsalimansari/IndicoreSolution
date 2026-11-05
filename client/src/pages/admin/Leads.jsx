import { Fragment, useEffect, useState, useCallback } from "react";
import { api } from "../../api.js";
import Modal from "./Modal.jsx";
export const STATUS = ["new", "contacted", "in-progress", "closed"];

/* attachment limits: keep in step with server/utils/attachments.js */
const MAX_FILES = 5, MAX_EACH = 3 * 1024 * 1024, MAX_TOTAL = 5 * 1024 * 1024;
const OK_EXT = /\.(pdf|docx?|xlsx?|pptx?|png|jpe?g|webp|gif|txt|csv|zip)$/i;
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.gif,.txt,.csv,.zip";
const size = n => n >= 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
const toB64 = f => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1] || ""); r.onerror = () => no(new Error("Could not read " + f.name)); r.readAsDataURL(f); });

function EmailModal({ lead, onClose, onSent }) {
  const [tpls, setTpls] = useState([]), [f, setF] = useState({ subject: "", body: "", template: "Custom" });
  const [files, setFiles] = useState([]), [html, setHtml] = useState(""), [st, setSt] = useState({ m: "", ok: false, busy: false }), [ready, setReady] = useState(true);
  useEffect(() => { api("/templates", { auth: true }).then(setTpls); api("/mail/status", { auth: true }).then(r => setReady(r.ready)); }, []);
  useEffect(() => { const t = setTimeout(() => api("/mail/preview", { method: "POST", auth: true, body: { ...f, leadId: lead._id } }).then(r => setHtml(r.html)).catch(() => {}), 300); return () => clearTimeout(t); }, [f.subject, f.body]);
  const pick = id => { const t = tpls.find(x => x._id === id); if (t) setF({ subject: t.subject, body: t.body, template: t.name }); };
  const addFiles = e => {
    const picked = [...e.target.files]; e.target.value = "";            // reset so the same file can be chosen again
    let next = [...files], problem = "";
    for (const x of picked) {
      if (!OK_EXT.test(x.name)) problem = `"${x.name}" is not an allowed type (PDF, Word, Excel, PowerPoint, images, TXT, CSV, ZIP).`;
      else if (x.size > MAX_EACH) problem = `"${x.name}" is ${size(x.size)}. Each file must be under 3 MB.`;
      else if (next.length >= MAX_FILES) problem = "You can attach up to 5 files.";
      else if (next.reduce((a, y) => a + y.size, x.size) > MAX_TOTAL) problem = "Attachments together must be under 5 MB.";
      else if (next.some(y => y.name === x.name && y.size === x.size)) problem = `"${x.name}" is already attached.`;
      else next.push(x);
    }
    setFiles(next); setSt({ m: problem, ok: false, busy: false });
  };
  const send = async () => {
    setSt({ m: "", ok: false, busy: true });
    try {
      const attachments = await Promise.all(files.map(async x => ({ name: x.name, data: await toB64(x) })));
      await api("/mail/send", { method: "POST", auth: true, body: { ...f, leadId: lead._id, attachments } }); setSt({ m: files.length ? `Email sent with ${files.length} attachment${files.length > 1 ? "s" : ""} ✔` : "Email sent ✔", ok: true, busy: false }); onSent(); setTimeout(onClose, 900); }
    catch (e) { setSt({ m: e.message, ok: false, busy: false }); }
  };
  return (
    <Modal title={`Email ${lead.name} <${lead.email}>`} onClose={onClose} wide>
      {!ready && <p className="msg err">SMTP not configured. Add SMTP_* values to server/.env and restart the server.</p>}
      <div className="split">
        <div className="form">
          <select onChange={e => pick(e.target.value)} defaultValue=""><option value="" disabled>Choose a template…</option>{tpls.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}</select>
          <input placeholder="Subject" value={f.subject} onChange={e => setF({ ...f, subject: e.target.value })} />
          <textarea rows="12" placeholder="Message… use {{name}}, {{service}}, {{message}}" value={f.body} onChange={e => setF({ ...f, body: e.target.value })} />
          <div className="attach">
            <label className="btn sm ghost">📎 Attach files<input type="file" multiple hidden accept={ACCEPT} onChange={addFiles} disabled={st.busy} /></label>
            <small className="dim">Up to 5 files · 3 MB each · 5 MB total · PDF, Word, Excel, PowerPoint, images, ZIP</small>
            {files.length > 0 && <ul className="alist">{files.map(x => <li key={x.name + x.size}><span>📄 {x.name}</span><em>{size(x.size)}</em><button type="button" className="x" aria-label={"Remove " + x.name} disabled={st.busy} onClick={() => setFiles(files.filter(y => y !== x))}>✕</button></li>)}</ul>}
          </div>
          <button className="btn" disabled={st.busy || !f.subject || !f.body} onClick={send}>{st.busy ? "Sending…" : files.length ? `Send Email + ${files.length} file${files.length > 1 ? "s" : ""}` : "Send Email"}</button>
          {st.m && <p className={"msg " + (st.ok ? "ok" : "err")}>{st.m}</p>}
        </div>
        <iframe title="preview" className="preview" sandbox="" srcDoc={html || "<p style='font-family:sans-serif;color:#888;padding:20px'>Preview appears here</p>"} />
      </div>
    </Modal>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]), [q, setQ] = useState(""), [status, setStatus] = useState(""), [open, setOpen] = useState(null), [mail, setMail] = useState(null);
  const load = useCallback(() => api(`/leads?q=${encodeURIComponent(q)}&status=${status}`, { auth: true }).then(setLeads).catch(() => {}), [q, status]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  const setSt = async (id, s) => { try { await api("/leads/" + id, { method: "PATCH", body: { status: s }, auth: true }); load(); } catch (e) { alert(e.message); } };
  const del = async id => { if (confirm("Delete this enquiry?")) { try { await api("/leads/" + id, { method: "DELETE", auth: true }); load(); } catch (e) { alert(e.message); } } };
  const csv = () => {
    const rows = [["Date", "Name", "Email", "Phone", "Service", "Status", "Message"], ...leads.map(l => [new Date(l.createdAt).toISOString(), l.name, l.email, l.phone, l.service, l.status, l.message])];
    const b = new Blob([rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(b), download: "enquiries.csv" }).click();
  };
  return (
    <>
      <div className="toolbar"><input placeholder="Search name, email, message…" value={q} onChange={e => setQ(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
        <button className="btn sm ghost" disabled={!leads.length} onClick={csv}>Export CSV</button></div>
      <div className="card tbl"><table>
        <thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Service</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{leads.map(l => (
          <Fragment key={l._id}>
            <tr className={l.status === "new" ? "isnew" : ""} onClick={() => setOpen(open === l._id ? null : l._id)}>
              <td>{new Date(l.createdAt).toLocaleDateString()}</td><td>{l.name}</td><td>{l.email}<br /><small>{l.phone}</small></td><td>{l.service}</td>
              <td onClick={e => e.stopPropagation()}><select className={"st st-" + l.status} value={l.status} onChange={e => setSt(l._id, e.target.value)}>{STATUS.map(s => <option key={s}>{s}</option>)}</select></td>
              <td onClick={e => e.stopPropagation()}><button className="btn sm" onClick={() => setMail(l)}>✉ Email</button> <button className="x" onClick={() => del(l._id)}>🗑</button></td>
            </tr>
            {open === l._id && <tr className="msgrow"><td colSpan="6">{l.message}</td></tr>}
          </Fragment>))}
          {!leads.length && <tr><td colSpan="6" className="dim">No enquiries found.</td></tr>}</tbody>
      </table></div>
      {mail && <EmailModal lead={mail} onClose={() => setMail(null)} onSent={load} />}
    </>
  );
}
