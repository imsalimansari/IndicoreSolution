import { Reveal, Tilt, PageHero, CtaBand, usePageTitle } from "../components/ui.jsx";
import * as C from "../data/content.js";

export default function Industries() {
  usePageTitle("Industries");
  return (
    <>
      <PageHero kicker="Industries" title={<>Solutions for <span className="grad">Every Business</span></>} sub="From local retailers to ambitious startups, we shape technology around how your industry actually works." />
      <section className="sec"><div className="wrap">
        <div className="grid g5">{C.industries.map(([i, n, d], k) => (
          <Reveal key={n} delay={(k % 5) * 50}><Tilt className="ind"><span>{i}</span><h4>{n}</h4><p>{d}</p></Tilt></Reveal>))}</div>
      </div></section>
      <CtaBand title={<>Don’t see your <span className="grad">industry</span>?</>} text="We work across sectors. Tell us about your business and we will suggest the right solution." />
    </>
  );
}
