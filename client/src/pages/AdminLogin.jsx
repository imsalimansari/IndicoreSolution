import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getToken, clearToken } from "../api.js";
import { ThemeToggle } from "../theme.jsx";

export default function AdminLogin() {
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" }), [err, setErr] = useState(""), [busy, setBusy] = useState(false), [show, setShow] = useState(false);
  useEffect(() => {
    if (getToken()) api("/auth/me", { auth: true }).then(() => nav("/admin/dashboard", { replace: true })).catch(() => clearToken());
  }, []);
  const submit = async e => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { const r = await api("/auth/login", { method: "POST", body: f }); localStorage.setItem("ic_token", r.token); nav("/admin/dashboard"); }
    catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <div className="login">
      <div className="login-top"><ThemeToggle /></div>
      <form className="card form" onSubmit={submit}>
        <img src="/logo.png" alt="INDICORE" /><h3>Admin Sign In</h3>
        <input type="email" placeholder="Email" required autoComplete="username" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
        <div className="pw">
          <input type={show ? "text" : "password"} placeholder="Password" required autoComplete="current-password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
          <button type="button" className="x" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? "🙈" : "👁"}</button>
        </div>
        <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
        {err && <p className="msg err" role="alert">{err}</p>}
        <Link to="/" className="dim">← Back to website</Link>
      </form>
    </div>
  );
}
