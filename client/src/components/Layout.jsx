import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Cursor from "./Cursor.jsx";
import { contact } from "../data/content.js";

function Floating() {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(scrollY > 500); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  return (
    <div className="floaters">
      <button className={"totop" + (show ? " on" : "")} aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      <a className="wa" href={"https://wa.me/" + contact.wa} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z" /><path d="M9 9c0 3 3 6 6 6l1.2-1.500-2-1-.8.800c-1-.4-2-1.400-2.400-2.400l.8-.8-1-2z" /></svg>
      </a>
    </div>
  );
}

/* shared shell for every public page: navbar + animated content + footer */
export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return (
    <div className="site" id="top">
      <div className="ambient" aria-hidden="true"><i /><i /><i /></div>
      <Cursor />
      <Navbar />
      <main key={pathname} className="page"><Outlet /></main>
      <Footer />
      <Floating />
    </div>
  );
}
