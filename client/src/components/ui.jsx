import { Component, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* kept for compatibility: titles / meta tags are now handled centrally by <SeoManager /> (see data/seo.js) */
export function usePageTitle() {}

/* fade / rise in when scrolled into view */
export function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: .12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={"reveal " + className} style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}

/* 3D tilt + cursor-following spotlight (mouse only) */
export function Tilt({ children, className = "" }) {
  const ref = useRef();
  const move = e => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const el = ref.current, r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", px * 100 + "%"); el.style.setProperty("--my", py * 100 + "%");
    el.style.transform = `perspective(900px) rotateX(${(.5 - py) * 9}deg) rotateY(${(px - .5) * 9}deg) translateZ(6px)`;
  };
  const leave = () => { ref.current.style.transform = ""; };
  return <div ref={ref} className={"card tilt " + className} onPointerMove={move} onPointerLeave={leave}>{children}</div>;
}

export const Head = ({ kicker, title, sub, left }) => (
  <Reveal className={"head" + (left ? " left" : "")}>
    <span className="kicker">{kicker}</span><h2>{title}</h2>{sub && <p>{sub}</p>}
  </Reveal>
);

/* banner at the top of every inner page */
export function PageHero({ kicker, title, sub, crumb }) {
  return (
    <section className="phero">
      <div className="phero-orb a" /><div className="phero-orb b" />
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><b>{crumb || kicker}</b></nav>
        <span className="kicker">{kicker}</span>
        <h1 className="ptitle">{title}</h1>
        {sub && <p className="psub">{sub}</p>}
      </div>
    </section>
  );
}

export function Typewriter({ words }) {
  const [i, setI] = useState(0), [txt, setTxt] = useState(""), [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i % words.length];
    const t = setTimeout(() => {
      if (!del) { setTxt(w.slice(0, txt.length + 1)); if (txt.length + 1 === w.length) setTimeout(() => setDel(true), 1300); }
      else { setTxt(w.slice(0, txt.length - 1)); if (txt.length - 1 === 0) { setDel(false); setI(i + 1); } }
    }, del ? 35 : 75);
    return () => clearTimeout(t);
  }, [txt, del, i, words]);
  return <span className="typed grad">{txt}<span className="caret" /></span>;
}

export function Counter({ to, suffix = "" }) {
  const ref = useRef(), [n, setN] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = t => { const p = Math.min(1, (t - t0) / 1400); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: .5 });
    io.observe(ref.current); return () => io.disconnect();
  }, [to]);
  return <b ref={ref}>{n}{suffix}</b>;
}

export const CtaBand = ({ title = <>Ready to build something <span className="grad">intelligent</span>?</>, text = "Share your idea and get a practical, budget-friendly plan from our team." }) => (
  <section className="ctaband"><div className="wrap"><Reveal>
    <h2>{title}</h2><p>{text}</p>
    <div className="cta c"><Link className="btn" to="/contact">Talk to Us</Link><Link className="btn ghost" to="/services">Explore Services</Link></div>
  </Reveal></div></section>
);

/* keeps the site usable if WebGL is unavailable */
export class Safe extends Component {
  state = { bad: false };
  static getDerivedStateFromError() { return { bad: true }; }
  componentDidCatch(e) { console.warn("3D scene disabled:", e?.message); }
  render() { return this.state.bad ? null : this.props.children; }
}
