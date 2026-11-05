import { Link } from "react-router-dom";
import * as C from "../data/content.js";
import Social from "./Social.jsx";

export default function Footer() {
  return (
    <footer className="foot"><div className="wrap">
      <div className="fgrid">
        <div>
          <Link to="/"><img src="/logo.png" alt="INDICORE SOLUTION" /></Link>
          <p>Empowering MSMEs through technology and innovation. A Udyam-registered Micro enterprise from Siwan, Bihar.</p>
          <Link to="/msme" className="ftrust"><span>🏛️</span><div><small>Udyam Reg. No.</small><b>{C.msme.no}</b></div></Link>
          <div className="tags"><i>AI</i><i>Web</i><i>Mobile</i><i>Automation</i></div>
          <Social />
        </div>
        <div><h5>Explore</h5>{C.nav.map(([l, to]) => <Link key={to} to={to}>{l}</Link>)}</div>
        <div><h5>Services</h5>{C.services.slice(0, 8).map(s => <Link key={s.t} to="/services">{s.t}</Link>)}</div>
        <div>
          <h5>Contact</h5>
          <p>📍 {C.contact.address}</p>
          <a href={"mailto:" + C.contact.email}>✉️ {C.contact.email}</a>
          <a href={"tel:" + C.contact.phone.replace(/\s/g, "")}>📞 {C.contact.phone}</a>
          <a href={"https://wa.me/" + C.contact.wa} target="_blank" rel="noreferrer">💬 WhatsApp</a>
          <h5 className="mt">Hours</h5>{C.contact.hours.map(h => <p key={h}>{h}</p>)}
        </div>
      </div>
      <div className="fbar">
        <span>© {new Date().getFullYear()} INDICORE SOLUTION · Udyam Registered MSME. All rights reserved.</span>
        <span>Driven by Innovation, Defined by Excellence.</span>
        <span><Link to="/admin">Admin</Link> · <a href="#top" onClick={e => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top ↑</a></span>
      </div>
    </div></footer>
  );
}
