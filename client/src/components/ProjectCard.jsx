import { useEffect, useState } from "react";
import { api } from "../api.js";
import { Reveal, Tilt } from "./ui.jsx";
import { projectsFallback } from "../data/content.js";

/* Live list from the API. Only if the API is unreachable (e.g. free server waking) do we show the built-in concept builds,
   so the page is never empty. An empty list from a working API stays empty (you control it in Admin → Projects). */
export function useProjects() {
  const [list, setList] = useState([]), [loading, setLoading] = useState(true);
  useEffect(() => { api("/projects").then(setList).catch(() => setList(projectsFallback)).finally(() => setLoading(false)); }, []);
  return { list, loading };
}

export const ProjectCard = ({ p, i = 0 }) => (
  <Reveal delay={(i % 3) * 80}>
    <Tilt className="proj">
      <div className="thumb" style={p.image ? { backgroundImage: `url("${p.image}")` } : {}}>
        {!p.image && <span>{p.icon}</span>}{p.isDemo && <em>Concept build</em>}{p.featured && <strong>★ Featured</strong>}
      </div>
      <small>{p.category}{p.sector ? <> · <b className="sect">{p.sector}</b></> : null}</small>
      <h3>{p.title}</h3>
      {p.problem && <p className="prob"><b>Problem</b>{p.problem}</p>}
      <p className="sol"><b>Solution</b>{p.summary}</p>
      <div className="tags">{p.tech?.map(t => <i key={t}>{t}</i>)}</div>
      {p.link && <a href={p.link} target="_blank" rel="noreferrer noopener">View project →</a>}
    </Tilt>
  </Reveal>
);
