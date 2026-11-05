import { Link } from "react-router-dom";
import { Reveal, Tilt, Head } from "./ui.jsx";
import { launchpad } from "../data/content.js";

/* "Choose your stage": the MSME-first way to browse what we offer */
export default function Launchpad({ id = "launchpad", title = "Start Where Your Business Is Today", sub = "Four simple stages, built for how MSMEs actually grow. Begin anywhere. Every plan is quoted to fit your budget." }) {
  return (
    <div id={id}>
      <Head kicker="MSME Launchpad" title={title} sub={sub} />
      <div className="lp">{launchpad.map((s, i) => (
        <Reveal key={s.t} delay={i * 90}>
          <Tilt className="lp-card">
            <span className="lp-num">{s.k}</span>
            <div className="ico">{s.icon}</div>
            <small className="lp-tag">{s.tag}</small>
            <h3>{s.t}</h3><p>{s.d}</p>
            <ul>{s.l.map(x => <li key={x}>{x}</li>)}</ul>
            <Link className="lp-go" to={s.to}>Discuss this stage →</Link>
          </Tilt>
        </Reveal>))}</div>
    </div>
  );
}
