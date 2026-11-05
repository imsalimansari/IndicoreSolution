import { useState } from "react";
import { Link } from "react-router-dom";
import { Head, PageHero, CtaBand, Reveal, usePageTitle } from "../components/ui.jsx";
import { ProjectCard, useProjects } from "../components/ProjectCard.jsx";

export default function Projects() {
  usePageTitle("Projects");
  const { list, loading } = useProjects(), [cat, setCat] = useState("All");
  const cats = ["All", ...new Set(list.map(p => p.category))];
  const shown = cat === "All" ? list : list.filter(p => p.category === cat);
  const demos = list.some(p => p.isDemo);
  return (
    <>
      <PageHero kicker="Portfolio" title={<>Problems We Love <span className="grad">Solving for MSMEs</span></>}
        sub="Every build starts with a real business problem. These concept builds show how we would solve the most common ones, from billing to branding." />
      <section className="sec"><div className="wrap">
        {loading ? <p className="center dim">Loading projects…</p> : !list.length ? <Head kicker="Coming soon" title="Our portfolio is being updated" sub="Please check back shortly, or get in touch to discuss your project." /> : <>
          <div className="tabs">{cats.map(c => <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>{c}</button>)}</div>
          <div className="grid g3">{shown.map((p, i) => <ProjectCard key={p._id} p={p} i={i} />)}</div>
          {demos && <Reveal className="note center">Projects marked “Concept build” are our own demonstrations of the kind of work we deliver, not client case studies. We add real, named projects here as we complete them. <Link to="/contact">Have a problem like these? Tell us →</Link></Reveal>}
        </>}
      </div></section>
      <CtaBand />
    </>
  );
}
