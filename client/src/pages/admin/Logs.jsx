import { useEffect, useState } from "react";
import { api } from "../../api.js";
import Modal from "./Modal.jsx";
export default function Logs() {
  const [logs, setLogs] = useState(null), [v, setV] = useState(null);
  const load = () => api("/mail/logs", { auth: true }).then(setLogs).catch(() => setLogs([]));
  useEffect(() => { load(); }, []);
  return (
    <>
      <div className="toolbar"><h3 style={{ flex: 1 }}>Sent emails ({logs?.length || 0})</h3><button className="btn sm ghost" onClick={load}>↻ Refresh</button></div>
      <div className="card tbl"><table>
        <thead><tr><th>Date</th><th>To</th><th>Subject</th><th>Template</th><th>Status</th></tr></thead>
        <tbody>{(logs || []).map(l => <tr key={l._id} onClick={() => setV(l)}><td>{new Date(l.createdAt).toLocaleString()}</td><td>{l.toName}<br /><small>{l.to}</small></td><td>{l.subject}{l.attachments?.length > 0 && <small className="dim"><br />📎 {l.attachments.map(a => a.name).join(", ")}</small>}</td><td>{l.template}</td>
          <td><span className={"badge " + l.status}>{l.status}</span>{l.error && <small className="msg err"><br />{l.error}</small>}</td></tr>)}
          {logs && !logs.length && <tr><td colSpan="5" className="dim">No emails sent yet.</td></tr>}
          {!logs && <tr><td colSpan="5" className="dim">Loading…</td></tr>}</tbody></table></div>
      {v && <Modal title={v.subject} onClose={() => setV(null)} wide><iframe title="mail" className="preview big" sandbox="" srcDoc={v.html} /></Modal>}
    </>
  );
}
