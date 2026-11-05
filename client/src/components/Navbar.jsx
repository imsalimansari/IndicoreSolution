import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "../theme.jsx";
import { nav } from "../data/content.js";

export default function Navbar() {
  const [open, setOpen] = useState(false), [solid, setSolid] = useState(false), [prog, setProg] = useState(0);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const f = () => {
      setSolid(scrollY > 20);
      const h = document.documentElement.scrollHeight - innerHeight;
      setProg(h > 0 ? Math.min(100, (scrollY / h) * 100) : 0);
    };
    f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return (
    <header className={"nav" + (solid || open ? " solid" : "")}>
      <div className="progress" style={{ width: prog + "%" }} />
      <div className="nav-in">
        <Link className="brand" to="/" aria-label="INDICORE SOLUTION home"><img src="/logo.png" alt="INDICORE SOLUTION" /></Link>
        <nav className={"links" + (open ? " open" : "")} aria-label="Main">
          {nav.map(([l, to]) => <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => "nl" + (isActive ? " active" : "")}>{l}</NavLink>)}
          <Link className="btn sm mob-only" to="/contact">Get a Quote</Link>
        </nav>
        <div className="nav-act">
          <ThemeToggle />
          <Link className="btn sm desk-only" to="/contact">Get a Quote</Link>
          <button className={"burger" + (open ? " x" : "")} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  );
}
