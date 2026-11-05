import { useState } from "react";
import { msme } from "../data/content.js";

/* Rotating text-ring seal. Drawn from scratch, deliberately NOT using any government emblem or logo. */
export function UdyamSeal({ size = 120 }) {
  const id = "ring" + size;
  return (
    <div className="seal" style={{ width: size, height: size }} role="img" aria-label="Udyam registered Micro enterprise">
      <svg viewBox="0 0 200 200" className="seal-ring" aria-hidden="true">
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <text><textPath href={"#" + id} startOffset="0" textLength="486" lengthAdjust="spacing">UDYAM REGISTERED  ·  MICRO ENTERPRISE  ·  SIWAN  ·  </textPath></text>
      </svg>
      <div className="seal-core"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
    </div>
  );
}

export function CopyBtn({ text, label = "Copy" }) {
  const [ok, setOk] = useState(false);
  const go = async () => {
    try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard blocked: ignore */ }
  };
  return <button type="button" className="copy" onClick={go} aria-live="polite">{ok ? "Copied ✓" : label}</button>;
}

/* certificate-style credentials card (public facts only) */
export default function UdyamCard({ compact = false }) {
  const rows = [["Enterprise", msme.name], ["Type", msme.type + " Enterprise"], ["Major activity", msme.major], ["Classification year", msme.year], ["Registered on", msme.registered], ["Location", msme.place]];
  return (
    <div className="ucard">
      <div className="ucard-top"><UdyamSeal size={compact ? 92 : 110} /><div>
        <small>Udyam Registration Number</small>
        <b className="unum">{msme.no}</b>
        <div className="ucard-act"><CopyBtn text={msme.no} label="Copy number" /><a className="copy" href={msme.verify} target="_blank" rel="noreferrer noopener">Verify on Udyam portal ↗</a></div>
      </div></div>
      <dl className={"ucard-rows" + (compact ? " compact" : "")}>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </div>
  );
}
