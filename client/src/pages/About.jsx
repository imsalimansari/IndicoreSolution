import { Reveal, Tilt, Head, PageHero, CtaBand, usePageTitle } from "../components/ui.jsx";
import { Link } from "react-router-dom";
import UdyamCard from "../components/Udyam.jsx";
import * as C from "../data/content.js";

export default function About() {
  usePageTitle("About Us");
  return (
    <>
      <PageHero kicker="About Us" title={<>Transforming Ideas into <span className="grad">Intelligent Solutions</span></>}
        sub="INDICORE SOLUTION is an India-based, Udyam-registered Micro enterprise delivering modern, practical and affordable digital solutions for startups, SMEs and growing organizations." />

      <section className="sec"><div className="wrap split2 credit">
        <div>
          <Head left kicker="Who We Are" title="A Young Company with Registered Roots" sub={`Incorporated on ${C.msme.incorporated} and registered on the Udyam portal on ${C.msme.registered}, INDICORE SOLUTION is founder-led and based in ${C.msme.place}. We are at the start of our journey, and we would rather earn your trust with honest work than with big claims.`} />
          <Reveal><Link className="btn ghost" to="/msme">All credentials &amp; registered activities →</Link></Reveal>
        </div>
        <Reveal delay={100}><UdyamCard compact /></Reveal>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head kicker="Our Name" title="What INDICORE Stands For" sub="Eight values, one word. They guide every project we take on." />
        <div className="grid g4">{C.brand.map(([l, t, d], i) => <Reveal key={i} delay={(i % 4) * 70}><Tilt className="letter"><b>{l}</b><h4>{t}</h4><p>{d}</p></Tilt></Reveal>)}</div>
      </div></section>

      <section className="sec"><div className="wrap grid g2">
        <Reveal><Tilt className="mv"><span className="ico">🔭</span><h3>Our Vision</h3><p><b>Shaping a Smarter, More Connected Digital Future.</b> A trusted, globally recognized technology brand known for innovation, engineering excellence and customer trust.</p></Tilt></Reveal>
        <Reveal delay={100}><Tilt className="mv"><span className="ico">🎯</span><h3>Our Mission</h3><p><b>Transforming Ideas into Intelligent Solutions.</b> Empowering businesses through innovative, reliable and affordable technology that simplifies complexity and creates lasting value.</p></Tilt></Reveal>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head kicker="Why INDICORE" title="Built on Trust, Delivered with Care" />
        <div className="grid g4">{C.why.map(([t, d], i) => <Reveal key={t} delay={(i % 4) * 80}><Tilt><h4>{t}</h4><p>{d}</p></Tilt></Reveal>)}</div>
      </div></section>

      <section className="sec"><div className="wrap">
        <Head kicker="Future Roadmap" title="From a Bold Beginning to a Global Vision" />
        <div className="road">{C.roadmap.map(([y, t, f], i) => <Reveal key={y} delay={i * 100}><div className="rp"><em>{y}</em><h4>{t}</h4><p>{f}</p></div></Reveal>)}</div>
      </div></section>
      <CtaBand />
    </>
  );
}
