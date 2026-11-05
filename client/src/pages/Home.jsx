import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Reveal, Tilt, Head, Typewriter, Counter, CtaBand, Safe, usePageTitle } from "../components/ui.jsx";
import { ProjectCard, useProjects } from "../components/ProjectCard.jsx";
import Launchpad from "../components/Launchpad.jsx";
import { UdyamSeal, CopyBtn } from "../components/Udyam.jsx";
import * as C from "../data/content.js";
const Scene3D = lazy(() => import("../components/Scene3D.jsx"));

const stats = C.statsList;

export default function Home() {
  usePageTitle("");
  const { list } = useProjects();
  const featured = [...list].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3);
  return (
    <>
      <section className="hero">
        <Safe><Suspense fallback={null}><Scene3D /></Suspense></Safe>
        <div className="wrap hero-in">
          <span className="kicker">Driven by Innovation, Defined by Excellence</span>
          <h1>The Intelligence<br /><span className="grad">Behind Innovation.</span></h1>
          <p className="lead"><span>We engineer</span><Typewriter words={C.heroWords} /><span>for startups, MSMEs and growing businesses.</span></p>
          <div className="cta"><Link className="btn" to="/contact">Start Your Project</Link><Link className="btn ghost" to="/services">Explore Services</Link></div>
          <div className="chips"><span className="hot">🏛️ Udyam Registered</span><span>Siwan, Bihar · India</span><span>AI · Web · Mobile · Marketing</span></div>
        </div>
        <div className="float-badges" aria-hidden="true"><span>🏛️ Udyam Registered</span><span>⚡ AI Ready</span><span>☁️ Cloud Native</span></div>
        <div className="scroll-hint"><i /></div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="mtrack">{[...C.marquee, ...C.marquee].map((t, i) => <span key={i}>{t}</span>)}</div></div>


      <section className="trust"><div className="wrap trust-in">
        <Reveal><UdyamSeal size={132} /></Reveal>
        <Reveal delay={80}><div>
          <span className="kicker">Registered · Verifiable · Local</span>
          <h2>An Udyam-Registered MSME, <span className="grad">Built in Bihar</span></h2>
          <p>We are listed on the Udyam portal as a <b>Micro enterprise</b> in the <b>Services</b> sector. We know what it is to run lean, so we build technology that is practical, affordable and made to grow with you.</p>
          <div className="trust-facts">
            <div><small>Udyam Registration No.</small><b>{C.msme.no}</b></div>
            <div><small>Enterprise Type</small><b>{C.msme.type} · {C.msme.major}</b></div>
            <div><small>Registered Activities</small><b>{C.nic.length} NIC codes</b></div>
          </div>
          <div className="cta"><Link className="btn" to="/msme">See Our Credentials</Link><a className="btn ghost" href={C.msme.verify} target="_blank" rel="noreferrer noopener">Verify on Udyam Portal ↗</a><CopyBtn text={C.msme.no} label="Copy number" /></div>
        </div></Reveal>
      </div></section>

      <section className="statband"><div className="wrap grid g4">
        {stats.map(([n, s, l]) => <Reveal key={l}><div className="stat"><Counter to={n} suffix={s} /><span>{l}</span></div></Reveal>)}
      </div></section>

      <section className="sec"><div className="wrap">
        <Head kicker="What We Do" title="Technology That Moves Your Business Forward" sub="Twelve practical services for MSMEs, from intelligent AI to branding, marketing and dependable support." />
        <div className="grid g4">{C.services.slice(0, 8).map((s, i) => (
          <Reveal key={s.t} delay={(i % 4) * 80}><Tilt className="svc"><div className="ico">{s.icon}</div><h3>{s.t}</h3><p>{s.d}</p></Tilt></Reveal>))}</div>
        <Reveal className="center mt-l"><Link className="btn ghost" to="/services">See all 12 services →</Link></Reveal>
      </div></section>

      <section className="sec alt"><div className="wrap"><Launchpad /></div></section>

      <section className="sec"><div className="wrap split2">
        <div>
          <Head left kicker="Why INDICORE" title="Built on Trust, Delivered with Care" sub="Founder-led, customer-first and budget-conscious. We keep technology practical so you can focus on growth." />
          <Reveal><Link className="btn" to="/about">About Us</Link></Reveal>
        </div>
        <div className="checks">{C.why.map(([t, d], i) => (
          <Reveal key={t} delay={(i % 4) * 60}><div className="check"><span>✓</span><div><h4>{t}</h4><p>{d}</p></div></div></Reveal>))}</div>
      </div></section>

      {featured.length > 0 && <section className="sec alt"><div className="wrap">
        <Head kicker="Portfolio" title="Problems We Solve for MSMEs" sub="Concept builds that show how we turn everyday business headaches into working software." />
        <div className="grid g3">{featured.map((p, i) => <ProjectCard key={p._id} p={p} i={i} />)}</div>
        <Reveal className="center mt-l"><Link className="btn ghost" to="/projects">View all projects →</Link></Reveal>
      </div></section>}

      <section className="sec"><div className="wrap">
        <Head kicker="How We Work" title="Our 8-Step Development Approach" sub="A clear, collaborative path from first conversation to long-term support." />
        <div className="mini-steps">{C.process.map(([t], i) => (
          <Reveal key={t} delay={(i % 4) * 60}><Link to="/process" className="mstep tilt"><em>{String(i + 1).padStart(2, "0")}</em><span>{t}</span></Link></Reveal>))}</div>
      </div></section>

      <CtaBand />
    </>
  );
}
