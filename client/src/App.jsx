import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import SeoManager from "./components/SeoManager.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import Msme from "./pages/Msme.jsx";
import Industries from "./pages/Industries.jsx";
import Process from "./pages/Process.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

/* admin (and its charts library) is loaded only when /admin is opened, so public pages stay light and fast */
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

export default function App() {
  return (
    <>
      <SeoManager />
      <Suspense fallback={<div className="login"><p className="dim">Loading…</p></div>}>
        <Routes>
          {/* public site: every page shares the navbar + footer */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="msme" element={<Msme />} />
            <Route path="industries" element={<Industries />} />
            <Route path="process" element={<Process />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </>
  );
}
