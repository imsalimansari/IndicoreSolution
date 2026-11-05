import { useState } from "react";
import { Reveal, Head, PageHero, CtaBand, usePageTitle } from "../components/ui.jsx";
import * as C from "../data/content.js";
import { faqs } from "../data/seo.js";


function Faq() {
  const [o, setO] = useState(0);
  return faqs.map(([q, a], i) => (
    <Reveal key={q}><div className={"faq" + (o === i ? " open" : "")}>
      <button aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}>{q}<span>+</span></button>
      <div><p>{a}</p></div>
    </div></Reveal>));
}

export default function Process() {
  usePageTitle("Our Process");
  return (
    <>
      <PageHero kicker="How We Work" title={<>Our 8-Step <span className="grad">Development Approach</span></>} sub="A clear, collaborative path from the first conversation to long-term reliability." crumb="Process" />
      <section className="sec"><div className="wrap">
        <div className="timeline">{C.process.map(([t, s], i) => (
          <Reveal key={t} className={i % 2 ? "tl r" : "tl l"}>
            <div className="tl-card card"><em>{String(i + 1).padStart(2, "0")}</em><h4>{t}</h4><p>{s}</p></div>
            <span className="dot" />
          </Reveal>))}</div>
      </div></section>
      <section className="sec alt"><div className="wrap narrow">
        <Head kicker="FAQ" title="Questions? We Have Answers" />
        <Faq />
      </div></section>
      <CtaBand />
    </>
  );
}
