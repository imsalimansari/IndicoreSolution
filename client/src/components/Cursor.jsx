import { useEffect, useRef } from "react";

const HOVER = "a,button,select,label,summary,[role=button],[role=switch],.tilt,.magnetic,.tabs button";
const TEXT = "input,textarea";

/* Animated mouse pointer: dot + trailing ring + soft glow + click ripple. Mouse devices only. */
export default function Cursor() {
  const dot = useRef(), ring = useRef(), glow = useRef();
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const html = document.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    html.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, gx = x, gy = y, raf = 0, shown = false;
    const show = v => { [dot, ring, glow].forEach(r => r.current && r.current.classList.toggle("on", v)); shown = v; };
    const move = e => {
      x = e.clientX; y = e.clientY;
      if (!shown) { rx = gx = x; ry = gy = y; show(true); }
      dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      const t = e.target instanceof Element ? e.target : null;
      ring.current.classList.toggle("hover", !!t?.closest(HOVER));
      ring.current.classList.toggle("text", !!t?.closest(TEXT));
    };
    const loop = () => {
      const k = reduce ? 1 : .18, g = reduce ? 1 : .07;
      rx += (x - rx) * k; ry += (y - ry) * k; gx += (x - gx) * g; gy += (y - gy) * g;
      ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      glow.current.style.transform = `translate3d(${gx}px,${gy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    const down = e => {
      ring.current.classList.add("down");
      const s = document.createElement("span"); s.className = "cur-ripple";
      s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
      document.body.appendChild(s); s.addEventListener("animationend", () => s.remove());
    };
    const up = () => ring.current.classList.remove("down");
    const out = e => { if (!e.relatedTarget) show(false); };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down); addEventListener("pointerup", up);
    document.addEventListener("pointerout", out);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); html.classList.remove("has-cursor");
      removeEventListener("pointermove", move); removeEventListener("pointerdown", down); removeEventListener("pointerup", up);
      document.removeEventListener("pointerout", out);
    };
  }, []);
  return (<><div ref={glow} className="cur-glow" aria-hidden="true" /><div ref={ring} className="cur-ring" aria-hidden="true" /><div ref={dot} className="cur-dot" aria-hidden="true" /></>);
}
