import { useEffect, useState } from "react";
import { api } from "../../api.js";
import Modal from "./Modal.jsx";
const empty = { title: "", category: "Web", summary: "", problem: "", sector: "", tech: "", image: "", link: "", icon: "🚀", featured: false, published: true, isDemo: false, order: 0 };
export default function Projects() {
  const [list, setList] = useState([]), [ed, setEd] = useState(null), [err, setErr] = useState("");
  const load = () => api("/projects/all", { auth: true }).then(setList).catch(() => {});
  useEffect(() => { load(); }, []);
  const save = async e => {
    e.preventDefault(); setErr("");
    try { await api(ed._id ? "/projects/" + ed._id : "/projects", { method: ed._id ? "PUT" : "POST", auth: true, body: ed }); setEd(null); load(); }
    catch (x) { setErr(x.message); }
  };
  const del = async id => { if (confirm("Delete this project?")) { try { await api("/projects/" + id, { method: "DELETE", auth: true }); load(); } catch (x) { alert(x.message); } } };
  const set = k => e => setEd({ ...ed, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <>
      <div className="toolbar"><h3 style={{ flex: 1 }}>Projects ({list.length})</h3><button className="btn sm" onClick={() => setEd(empty)}>+ New Project</button></div>
      <div className="grid g3">{list.map(p => (
        <div className="card proj" key={p._id}>
          <div className="thumb sm" style={p.image ? { backgroundImage: `url(${p.image})` } : {}}>{!p.image && <span>{p.icon}</span>}</div>
          <small>{p.category} {!p.published && "· Hidden"} {p.isDemo && "· Demo"}</small><h4>{p.title}</h4><p>{p.summary}</p>
          <div className="row" style={{ marginTop: "auto" }}><button className="btn sm ghost" onClick={() => setEd({ ...p, tech: (p.tech || []).join(", ") })}>Edit</button><button className="btn sm ghost" onClick={() => del(p._id)}>Delete</button></div>
        </div>))}</div>
      {ed && <Modal title={ed._id ? "Edit Project" : "New Project"} onClose={() => setEd(null)}>
        <form className="form" onSubmit={save}>
          <input placeholder="Title *" required value={ed.title} onChange={set("title")} />
          <div className="two"><select value={ed.category} onChange={set("category")}>{[...new Set(["Web", "AI", "Software", "Mobile", "Automation", "Design", "Marketing", ed.category])].map(c => <option key={c}>{c}</option>)}</select><input placeholder="Emoji icon" value={ed.icon} onChange={set("icon")} /></div>
          <input placeholder="Sector / who it is for (e.g. Retail & Wholesale)" maxLength={80} value={ed.sector || ""} onChange={set("sector")} />
          <textarea rows="2" placeholder="The problem (one line, optional)" maxLength={300} value={ed.problem || ""} onChange={set("problem")} />
          <textarea rows="3" placeholder="Solution summary" value={ed.summary} onChange={set("summary")} />
          <input placeholder="Tech (comma separated)" value={ed.tech} onChange={set("tech")} />
          <input placeholder="Image URL, https://… (optional)" value={ed.image} onChange={set("image")} />
          <input placeholder="Project link, https://… (optional)" value={ed.link} onChange={set("link")} />
          <label className="fld">Display order (lower shows first)<input type="number" placeholder="Order" value={ed.order} onChange={set("order")} /></label>
          <label className="chk"><input type="checkbox" checked={ed.published} onChange={set("published")} /> Published</label>
          <label className="chk"><input type="checkbox" checked={ed.featured} onChange={set("featured")} /> Featured</label>
          <label className="chk"><input type="checkbox" checked={ed.isDemo} onChange={set("isDemo")} /> Show "Concept build" badge</label>
          <button className="btn">Save</button>{err && <p className="msg err">{err}</p>}
        </form></Modal>}
    </>
  );
}
