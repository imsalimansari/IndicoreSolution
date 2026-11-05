import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, Tilt, Head, PageHero, CtaBand, usePageTitle } from "../components/ui.jsx";
import Launchpad from "../components/Launchpad.jsx";
import * as C from "../data/content.js";

export default function Services() {
  usePageTitle("Services");
  const [g, setG] = useState("all");
  const shown = g === "all" ? C.services : C.services.filter(s => s.g === g);
  return (
    <>
      <PageHero kicker="What We Do" title={<>Services Built for <span className="grad">MSMEs</span></>}
        sub="Twelve practical services across software, AI, web, branding and marketing, each tied to an activity on our Udyam registration." />
      <section className="sec"><div className="wrap">
        <div className="tabs" role="tablist" aria-label="Filter services">{C.groups.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={g === k} className={g === k ? "on" : ""} onClick={() => setG(k)}>{l}{k === "all" ? ` (${C.services.length})` : ""}</button>))}</div>
        <div className="grid g4">{shown.map((s, i) => (
          <Reveal key={g + s.t} delay={(i % 4) * 80}>
            <Tilt className="svc-full">
              <div className="ico">{s.icon}</div><h3>{s.t}</h3><p>{s.d}</p>
              <ul>{s.l.map(x => <li key={x}>{x}</li>)}</ul>
              <div className="nics" title="Registered NIC activity codes">{s.n.map(c => <Link key={c} to="/msme" className="nic-chip">NIC {c}</Link>)}</div>
            </Tilt>
          </Reveal>))}</div>
        <Reveal className="note center">NIC codes are the activity classifications on our Udyam registration. <Link to="/msme">See our credentials →</Link></Reveal>
      </div></section>

      <section className="sec alt"><div className="wrap"><Launchpad /></div></section>

      <section className="sec"><div className="wrap">
        <Head kicker="Technology" title="The Stack We Work With" sub="We choose tools to fit your project, not the other way around." />
        <Reveal className="tech">{Object.entries(C.tech).map(([k, v]) => <div key={k}><b>{k}</b><span>{v}</span></div>)}</Reveal>
        <Reveal className="center mt-l"><Link className="btn" to="/contact">Discuss Your Requirement</Link></Reveal>
      </div></section>
      <CtaBand />
    </>
  );
}
