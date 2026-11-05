import { useEffect, useState } from "react";
import { api } from "../../api.js";

export default function Settings() {
  const [f, setF] = useState({ current: "", next: "", again: "" }), [st, setSt] = useState({ m: "", ok: true }), [busy, setBusy] = useState(false), [ready, setReady] = useState(null);
  useEffect(() => { api("/mail/status", { auth: true }).then(r => setReady(r.ready)).catch(() => setReady(false)); }, []);
  const submit = async e => {
    e.preventDefault();
    if (f.next.length < 8) return setSt({ m: "New password must be at least 8 characters.", ok: false });
    if (f.next !== f.again) return setSt({ m: "New passwords do not match.", ok: false });
    setBusy(true);
    try { const r = await api("/auth/change-password", { method: "POST", auth: true, body: { current: f.current, next: f.next } }); setSt({ m: r.message, ok: true }); setF({ current: "", next: "", again: "" }); }
    catch (x) { setSt({ m: x.message, ok: false }); }
    setBusy(false);
  };
  return (
    <div className="grid g2">
      <form className="card form" onSubmit={submit}>
        <h3>Change password</h3>
        <input type="password" placeholder="Current password" required autoComplete="current-password" value={f.current} onChange={e => setF({ ...f, current: e.target.value })} />
        <input type="password" placeholder="New password (min 8 characters)" required autoComplete="new-password" value={f.next} onChange={e => setF({ ...f, next: e.target.value })} />
        <input type="password" placeholder="Repeat new password" required autoComplete="new-password" value={f.again} onChange={e => setF({ ...f, again: e.target.value })} />
        <button className="btn" disabled={busy}>{busy ? "Saving…" : "Update password"}</button>
        {st.m && <p className={"msg " + (st.ok ? "ok" : "err")} role="status">{st.m}</p>}
      </form>
      <div className="card">
        <h3>Email (SMTP) status</h3>
        <p style={{ margin: "12px 0" }}>{ready === null ? "Checking…" : ready ? <span className="badge sent">Configured</span> : <span className="badge failed">Not configured</span>}</p>
        <p className="dim">{ready ? "You can email enquiries from Admin → Enquiries and send tests from Email Templates." : "Add SMTP_HOST, SMTP_USER, SMTP_PASS (and MAIL_FROM) to server/.env, or to your host’s environment variables, then restart the server."}</p>
      </div>
    </div>
  );
}
