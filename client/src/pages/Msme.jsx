import { Link } from "react-router-dom";
import { Reveal, Tilt, Head, PageHero, CtaBand, usePageTitle } from "../components/ui.jsx";
import UdyamCard from "../components/Udyam.jsx";
import Launchpad from "../components/Launchpad.jsx";
import * as C from "../data/content.js";

/* which of our services deliver each registered NIC activity */
const svcFor = code => C.services.filter(s => s.n.includes(code));

export default function Msme() {
  usePageTitle("MSME");
  return (
    <>
      <PageHero kicker="Registered & Verifiable" crumb="MSME" title={<>Udyam-Registered. <span className="grad">Verifiable.</span></>}
        sub="INDICORE SOLUTION is a Micro enterprise in the Services sector, registered on the Government of India's Udyam portal. Here are the facts, in the open." />

      <section className="sec"><div className="wrap split2 credit">
        <Reveal><UdyamCard /></Reveal>
        <div>
          <Head left kicker="Our Credentials" title="Transparent by Design" sub="We believe a small business earns trust by showing its paperwork, not hiding it." />
          <Reveal><ul className="ticks">
            <li><b>Verify it yourself.</b> Open the official Udyam portal, choose “Verify Udyam Registration” and enter the number. It takes under a minute.</li>
            <li><b>Micro enterprise, Services sector.</b> Classified for {C.msme.year}; registration dated {C.msme.registered}.</li>
            <li><b>Based in {C.msme.place}.</b> District Industries Centre: {C.msme.dic}. MSME-DFO: {C.msme.dfo}.</li>
            <li><b>Seven registered activities</b> covering software, web, support, consultancy, advertising and design (below).</li>
          </ul></Reveal>
          <Reveal className="mt-l"><div className="cta"><a className="btn" href={C.msme.verify} target="_blank" rel="noreferrer noopener">Verify on Udyam Portal ↗</a><Link className="btn ghost" to="/contact">Ask Us Anything</Link></div></Reveal>
          <Reveal><p className="note left">Udyam registration confirms our MSME classification. It is not a quality certification or a government endorsement of our work, and we never claim otherwise.</p></Reveal>
        </div>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head kicker="Registered Activities" title="Seven NIC Codes, Twelve Services" sub="Each activity on our registration maps directly to the services we deliver." />
        <div className="nic-grid">{C.nic.map(([code, official, plain], i) => (
          <Reveal key={code} delay={(i % 3) * 70}>
            <Tilt className="nic-card">
              <span className="nic-code">{code}</span>
              <h4>{plain}</h4>
              <p className="nic-off">{official}</p>
              <div className="nics">{svcFor(code).map(s => <Link key={s.t} to="/services" className="nic-svc">{s.icon} {s.t}</Link>)}</div>
            </Tilt>
          </Reveal>))}
          <Reveal delay={210}><div className="card nic-cta"><div className="ico">💬</div><h4>Need something not listed?</h4><p>Tell us the problem. If it is within our registered activities we will scope it, and if it is not, we will say so honestly.</p><Link className="btn sm" to="/contact">Ask Us</Link></div></Reveal>
        </div>
      </div></section>

      <section className="sec"><div className="wrap">
        <Head kicker="Why Work With a Fellow MSME" title="Technology Partners Who Think Like You" />
        <div className="grid g4">{C.msmeValues.map(([i, t, d], k) => <Reveal key={t} delay={k * 80}><Tilt><div className="ico">{i}</div><h4>{t}</h4><p>{d}</p></Tilt></Reveal>)}</div>
      </div></section>

      <section className="sec alt"><div className="wrap"><Launchpad /></div></section>
      <CtaBand title={<>Let’s take your business <span className="grad">digital</span>, step by step.</>} text="Tell us where you are today. We will suggest the smallest, smartest next step." />
    </>
  );
}
