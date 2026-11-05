import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getToken, clearToken } from "../api.js";
import { ThemeToggle } from "../theme.jsx";
import Overview from "./admin/Overview.jsx";
import Leads from "./admin/Leads.jsx";
import Projects from "./admin/Projects.jsx";
import Templates from "./admin/Templates.jsx";
import Logs from "./admin/Logs.jsx";
import Settings from "./admin/Settings.jsx";

const TABS = [["overview", "📊", "Overview", Overview], ["leads", "📥", "Enquiries", Leads], ["projects", "🗂️", "Projects", Projects], ["templates", "✉️", "Email Templates", Templates], ["logs", "📜", "Email Log", Logs], ["settings", "⚙️", "Settings", Settings]];

export default function Dashboard() {
  const nav = useNavigate(), [tab, setTab] = useState("overview"), [menu, setMenu] = useState(false);
  const [me, setMe] = useState(null), [fresh, setFresh] = useState(0);
  useEffect(() => {
    if (!getToken()) { nav("/admin", { replace: true }); return; }
    api("/auth/me", { auth: true }).then(r => setMe(r.email)).catch(() => { clearToken(); nav("/admin", { replace: true }); });
  }, []);
  useEffect(() => {          // count of new enquiries for the sidebar badge
    if (!me) return;
    api("/leads/stats", { auth: true }).then(s => setFresh(s.byStatus.find(x => x._id === "new")?.count || 0)).catch(() => {});
  }, [me, tab]);
  const logout = () => { clearToken(); nav("/admin"); };
  if (!me) return <div className="login"><p className="dim">Checking session…</p></div>;
  const [, , title, Cur] = TABS.find(t => t[0] === tab);
  return (
    <div className="adm">
      {menu && <div className="scrim" onClick={() => setMenu(false)} />}
      <aside className={menu ? "open" : ""}>
        <img src="/logo.png" alt="INDICORE" />
        {TABS.map(([k, i, l]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => { setTab(k); setMenu(false); }}>
            {i} {l}{k === "leads" && fresh > 0 && <b className="pill">{fresh}</b>}
          </button>))}
        <a href="/" target="_blank" rel="noreferrer">🌐 View website</a>
        <button onClick={logout}>🚪 Logout</button>
      </aside>
      <section>
        <header>
          <button className="burger" aria-label="Menu" onClick={() => setMenu(!menu)}><span /><span /><span /></button>
          <h2>{title}</h2>
          <div className="hdr-r"><small className="dim hide-sm">{me}</small><ThemeToggle /></div>
        </header>
        <div className="body"><Cur key={tab} /></div>
      </section>
    </div>
  );
}
