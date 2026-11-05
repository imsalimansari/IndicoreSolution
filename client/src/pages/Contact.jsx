import { useState } from "react";
import { Reveal, Head, PageHero, usePageTitle } from "../components/ui.jsx";
import { api } from "../api.js";
import * as C from "../data/content.js";
import Social from "../components/Social.jsx";

const blank = { name: "", email: "", phone: "", service: "General", message: "" };

function Form() {
  const [f, setF] = useState(blank), [st, setSt] = useState({ s: "idle", m: "" });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setSt({ s: "load", m: "" });
    try { const r = await api("/leads", { method: "POST", body: f }); setSt({ s: "ok", m: r.message }); setF(blank); }
    catch (err) { setSt({ s: "err", m: err.message }); }
  };
  return (
    <form className="card form" onSubmit={submit}>
      <h3>Send us a message</h3>
      <div className="two">
        <input placeholder="Your name *" required maxLength={100} value={f.name} onChange={set("name")} aria-label="Your name" />
        <input type="email" placeholder="Email *" required maxLength={200} value={f.email} onChange={set("email")} aria-label="Email" />
      </div>
      <div className="two">
        <input placeholder="Phone / WhatsApp" maxLength={30} value={f.phone} onChange={set("phone")} aria-label="Phone" />
        <select value={f.service} onChange={set("service")} aria-label="Service"><option>General</option>{C.services.map(s => <option key={s.t}>{s.t}</option>)}</select>
      </div>
      <textarea rows="6" placeholder="Tell us about your project *" required maxLength={2000} value={f.message} onChange={set("message")} aria-label="Message" />
      <button className="btn" disabled={st.s === "load"}>{st.s === "load" ? "Sending…" : "Send Message"}</button>
      {st.m && <p className={"msg " + st.s} role="status">{st.s === "ok" ? "✔ " : ""}{st.m}</p>}
    </form>
  );
}

export default function Contact() {
  usePageTitle("Contact");
  const tel = C.contact.phone.replace(/\s/g, "");
  return (
    <>
      <PageHero kicker="Contact" title={<>Let’s Build Something <span className="grad">Intelligent</span></>} sub="Tell us about your idea. We reply within one business day." />
      <section className="sec"><div className="wrap grid g2 contact">
        <Reveal><div className="card info">
          <h3>Get in touch</h3>
          <a className="crow" href={"mailto:" + C.contact.email}><span>✉️</span><div><small>Email</small>{C.contact.email}</div></a>
          <a className="crow" href={"tel:" + tel}><span>📞</span><div><small>Phone</small>{C.contact.phone}</div></a>
          <a className="crow" href={"https://wa.me/" + C.contact.wa} target="_blank" rel="noreferrer"><span>💬</span><div><small>WhatsApp</small>Chat with us</div></a>
          <div className="crow"><span>📍</span><div><small>Location</small>{C.contact.address}</div></div>
          <div className="crow"><span>🏛️</span><div><small>Udyam Registration</small>{C.msme.no}</div></div>
          <h4>Business Hours</h4>{C.contact.hours.map(h => <p key={h} className="dim">{h}</p>)}
          <h4>Follow Us</h4><Social />
        </div></Reveal>
        <Reveal delay={100}><Form /></Reveal>
      </div></section>
      <section className="sec alt"><div className="wrap">
        <Head kicker="Find Us" title="Visit Us in Siwan, Bihar" />
        <Reveal><div className="map card"><iframe title="Map of Siwan, Bihar" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Siwan,+Bihar,+India&output=embed" /></div></Reveal>
      </div></section>
    </>
  );
}
