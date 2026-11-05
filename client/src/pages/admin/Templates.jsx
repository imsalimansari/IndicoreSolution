import { useEffect, useState } from "react";
import { api } from "../../api.js";
const VARS = ["name", "email", "phone", "service", "message", "company", "company_phone", "company_email"];
const blank = { name: "", category: "General", subject: "", body: "" };
export default function Templates() {
  const [list, setList] = useState([]), [ed, setEd] = useState(null), [html, setHtml] = useState(""), [to, setTo] = useState(""), [msg, setMsg] = useState({ m: "", ok: true });
  const load = () => api("/templates", { auth: true }).then(setList);
  useEffect(() => { load(); }, []);
  useEffect(() => { if (!ed) return; const t = setTimeout(() => api("/mail/preview", { method: "POST", auth: true, body: ed }).then(r => setHtml(r.html)).catch(() => {}), 300); return () => clearTimeout(t); }, [ed?.subject, ed?.body]);
  const save = async () => {
    try { const saved = await api(ed._id ? "/templates/" + ed._id : "/templates", { method: ed._id ? "PUT" : "POST", auth: true, body: ed }); setEd(saved); setMsg({ m: "Saved ✔", ok: true }); load(); }   // keep the saved _id so the next Save updates instead of duplicating
    catch (e) { setMsg({ m: e.message, ok: false }); }
  };
  const del = async () => { if (confirm("Delete template?")) { try { await api("/templates/" + ed._id, { method: "DELETE", auth: true }); setEd(null); load(); } catch (e) { setMsg({ m: e.message, ok: false }); } } };
  const test = async () => {
    try { await api("/mail/test", { method: "POST", auth: true, body: { to, subject: ed.subject, body: ed.body } }); setMsg({ m: "Test email sent ✔", ok: true }); }
    catch (e) { setMsg({ m: e.message, ok: false }); }
  };
  return (
    <div className="tsplit">
      <div className="card tlist"><button className="btn sm" onClick={() => { setEd(blank); setMsg({ m: "" }); }}>+ New Template</button>
        {list.map(t => <button key={t._id} className={"titem" + (ed?._id === t._id ? " on" : "")} onClick={() => { setEd(t); setMsg({ m: "" }); }}><b>{t.name}</b><small>{t.category}</small></button>)}</div>
      {ed ? <div className="card form tedit">
        <div className="two"><input placeholder="Template name" value={ed.name} onChange={e => setEd({ ...ed, name: e.target.value })} /><input placeholder="Category" value={ed.category} onChange={e => setEd({ ...ed, category: e.target.value })} /></div>
        <input placeholder="Subject" value={ed.subject} onChange={e => setEd({ ...ed, subject: e.target.value })} />
        <div className="chips2">{VARS.map(v => <button type="button" key={v} onClick={() => setEd({ ...ed, body: ed.body + `{{${v}}}` })}>{`{{${v}}}`}</button>)}</div>
        <textarea rows="10" placeholder="Email body (plain text or HTML)" value={ed.body} onChange={e => setEd({ ...ed, body: e.target.value })} />
        <div className="row"><button className="btn sm" onClick={save}>Save Template</button>{ed._id && <button className="btn sm ghost" onClick={del}>Delete</button>}</div>
        <div className="row"><input placeholder="Send test to (email)" value={to} onChange={e => setTo(e.target.value)} /><button className="btn sm ghost" disabled={!to} onClick={test}>Send Test</button></div>
        {msg.m && <p className={"msg " + (msg.ok ? "ok" : "err")}>{msg.m}</p>}
        <iframe title="preview" className="preview" sandbox="" srcDoc={html} />
      </div> : <div className="card"><p className="dim">Select or create a template. Variables like {"{{name}}"} are replaced with the enquiry details when sending.</p></div>}
    </div>
  );
}
