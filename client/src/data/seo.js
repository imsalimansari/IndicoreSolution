/* Single source of truth for SEO. Used by the React app (src/components/SeoManager.jsx)
   AND by scripts/postbuild.mjs (which writes a real HTML file per page + sitemap.xml + robots.txt). */
import { contact, social, services, msme, nic } from "./content.js";

export const SITE_NAME = "INDICORE SOLUTION";
export const DEFAULT_SITE = "https://indicoresolution.indicore.workers.dev";
export const OG_IMAGE = "/og-image.png";           // 1200 x 630

export const pages = {
  "/": {
    title: "INDICORE SOLUTION | Udyam-Registered AI, Web & Software Company, Siwan, Bihar",
    description: "Udyam-registered MSME in Siwan, Bihar building AI solutions, automation, custom software, websites, mobile apps, branding and digital marketing for startups and MSMEs across India.",
    priority: "1.0", changefreq: "weekly", label: "Home"
  },
  "/about": {
    title: "About Us | INDICORE SOLUTION",
    description: "Meet INDICORE SOLUTION, a Udyam-registered Micro enterprise from Siwan, Bihar delivering practical, affordable digital solutions with a founder-led, customer-first approach.",
    priority: "0.8", changefreq: "monthly", label: "About"
  },
  "/services": {
    title: "Services: Software, AI, Web, Marketing & Design for MSMEs | INDICORE SOLUTION",
    description: "Twelve services for MSMEs: custom software, AI and automation, websites and apps, digital marketing, graphic design, dashboards, IT consultancy and managed support, all matched to our registered Udyam activities.",
    priority: "0.9", changefreq: "monthly", label: "Services"
  },
  "/projects": {
    title: "Projects & Concept Builds for MSMEs | INDICORE SOLUTION",
    description: "Explore concept builds that show how INDICORE SOLUTION solves real MSME problems: GST billing, AI assistants, clinic booking, online stores, delivery tracking, automation and branding.",
    priority: "0.7", changefreq: "weekly", label: "Projects"
  },
  "/msme": {
    title: "Udyam Registered MSME | Trust & Credentials | INDICORE SOLUTION",
    description: "INDICORE SOLUTION is a Udyam-registered Micro enterprise (Services) in Siwan, Bihar. See our registration details, NIC activity codes and how we help MSMEs go digital.",
    priority: "0.8", changefreq: "monthly", label: "MSME"
  },
  "/industries": {
    title: "Industries We Serve | INDICORE SOLUTION",
    description: "Technology for retail, education, healthcare, logistics, manufacturing and more. See the industries INDICORE SOLUTION builds software and AI solutions for.",
    priority: "0.6", changefreq: "monthly", label: "Industries"
  },
  "/process": {
    title: "Our 8-Step Development Process & FAQ | INDICORE SOLUTION",
    description: "From discovery to long-term support, see our clear 8-step development approach and answers to common questions about working with INDICORE SOLUTION.",
    priority: "0.6", changefreq: "monthly", label: "Process"
  },
  "/contact": {
    title: "Contact Us & Get a Quote | INDICORE SOLUTION",
    description: "Tell us about your project and get a reply within one business day. Call or WhatsApp +91 81784 74271 or email indicore.solution@gmail.com. Siwan, Bihar, India.",
    priority: "0.9", changefreq: "monthly", label: "Contact"
  }
};
export const NOT_FOUND = { title: "Page not found | INDICORE SOLUTION", description: "This page does not exist." };
export const ADMIN = { title: "Admin | INDICORE SOLUTION", description: "Private area." };

export const faqs = [
  ["How do we get started?", "Send us your enquiry through the contact form. We listen first, understand your business and goals, then recommend the right solution before any work begins."],
  ["Do you work with startups and small businesses?", "Yes. We focus on startups, MSMEs and growing organizations, with practical, budget-friendly solutions and no unnecessary complexity."],
  ["Which technologies do you use?", "React, Node.js, MongoDB, Flutter, React Native, Python, cloud platforms such as AWS, Azure and GCP, and modern AI and LLM tooling, chosen to fit your project."],
  ["Do you provide support after launch?", "Yes. We offer maintenance, monitoring, updates and ongoing IT support plans so your solution stays secure and reliable."],
  ["Is INDICORE SOLUTION a registered business?", `Yes. We are registered on the Government of India Udyam portal as a Micro enterprise in the Services sector (${msme.no}). You can verify it on the official Udyam website. Registration confirms our MSME classification; it is not a government endorsement of our work.`],
  ["Can you build GST-ready billing and UPI payment features?", "Yes. We build invoicing and inventory tools with GST-ready invoice formats, and add UPI QR codes, payment links and gateway integrations where your business needs them. Please confirm tax rules with your accountant."],
  ["Do you offer support in Hindi?", "Yes. We communicate in Hindi and English, and can build customer-facing tools such as chatbots and reminders in both languages."],
  ["Do you also help with logo, branding and marketing?", "Yes. Graphic design, branding, Google Business Profile setup, social media creatives and ad campaigns are part of our registered activities, so your website, brand and marketing can be handled together."],
  ["Do I have to buy a big package?", "No. Every project is scoped to what you actually need and quoted to fit your budget. Many clients begin with one small, high-impact piece and add more later."],
  ["Can you add AI to our existing software?", "Yes. We integrate chatbots, AI agents, document processing and automation into existing business systems and workflows."]
];

export const normPath = p => { const s = ("/" + String(p || "").split(/[?#]/)[0]).replace(/\/+/g, "/").replace(/\/$/, ""); return s || "/"; };
export const routeKind = p => { const n = normPath(p); return pages[n] ? "page" : n === "/admin" || n.startsWith("/admin/") ? "admin" : "404"; };

/* structured data (JSON-LD): business on every page + breadcrumbs / FAQ / service list where relevant */
export function jsonLdFor(path, site) {
  const p = normPath(path), url = site + (p === "/" ? "/" : p);
  const org = {
    "@context": "https://schema.org", "@type": "ProfessionalService", "@id": site + "/#organization",
    name: SITE_NAME, url: site + "/", logo: site + "/logo.png", image: site + OG_IMAGE,
    description: pages["/"].description, slogan: "Driven by Innovation, Defined by Excellence", foundingDate: "2026-11-01", legalName: msme.name,
    identifier: { "@type": "PropertyValue", propertyID: "Udyam Registration Number", value: msme.no },
    knowsAbout: nic.map(n => n[1]).concat(["MSME digital transformation"]),
    email: contact.email, telephone: contact.phone, priceRange: "$$",
    address: { "@type": "PostalAddress", addressLocality: "Siwan", addressRegion: "Bihar", postalCode: msme.pin, addressCountry: "IN" },
    areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" }
    ],
    contactPoint: { "@type": "ContactPoint", telephone: contact.phone, email: contact.email, contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Hindi"] },
    sameAs: social.map(s => s[1]),
    makesOffer: services.map(s => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.t, description: s.d } }))
  };
  const site_ = { "@context": "https://schema.org", "@type": "WebSite", "@id": site + "/#website", url: site + "/", name: SITE_NAME, publisher: { "@id": site + "/#organization" }, inLanguage: "en-IN" };
  const out = [org, site_];
  if (p !== "/" && pages[p]) out.push({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site + "/" }, { "@type": "ListItem", position: 2, name: pages[p].label, item: url }]
  });
  if (p === "/process") out.push({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
  });
  return out;
}
