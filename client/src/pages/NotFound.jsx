import { Link } from "react-router-dom";
import { usePageTitle } from "../components/ui.jsx";
export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="sec nf"><div className="wrap center">
      <h1 className="big404 grad">404</h1><h2>This page took a wrong turn.</h2>
      <p className="dim">The page you are looking for does not exist or has moved.</p>
      <div className="cta c"><Link className="btn" to="/">Back to Home</Link><Link className="btn ghost" to="/contact">Contact Us</Link></div>
    </div></section>
  );
}
