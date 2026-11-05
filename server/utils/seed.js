import Project from "../models/Project.js";
import EmailTemplate from "../models/EmailTemplate.js";

/* ---------- small HTML helpers: keeps every template consistent and professional ----------
   The mailer wraps the body in the branded INDICORE header/footer (logo, address, phone, email, website),
   so templates only need the message itself. Variables: {{name}} {{email}} {{phone}} {{service}} {{message}}
   {{company}} {{company_phone}} {{company_email}}. Text in [square brackets] is a field to fill in before sending. */
const P = (t, s = "") => `<p style="margin:0 0 14px;${s}">${t}</p>`;
const H = t => `<p style="margin:22px 0 8px;font-weight:700;font-size:16px;color:#0b1437">${t}</p>`;
const LIST = (items, tag = "ul") => `<${tag} style="margin:0 0 16px;padding-left:22px">${items.map(i => `<li style="margin:0 0 7px">${i}</li>`).join("")}</${tag}>`;
const BOX = t => `<div style="background:#f3f6ff;border-left:4px solid #0a84ff;border-radius:6px;padding:14px 18px;margin:0 0 18px;color:#33406b;white-space:pre-wrap">${t}</div>`;
const FACTS = rows => `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 18px;border:1px solid #dfe6f7;border-radius:8px;border-collapse:separate;overflow:hidden">${rows.map(([k, v], i) => `<tr><td style="padding:10px 14px;width:36%;background:#f3f6ff;font-weight:600;color:#0b1437;${i ? "border-top:1px solid #dfe6f7;" : ""}">${k}</td><td style="padding:10px 14px;${i ? "border-top:1px solid #dfe6f7;" : ""}">${v}</td></tr>`).join("")}</table>`;
const BTN = (label, href) => `<p style="margin:22px 0"><a href="${href}" style="display:inline-block;background:#0a4fd6;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 28px;border-radius:999px">${label}</a></p>`;
const WA = "https://wa.me/918178474271";
const URGENT = P(`For anything urgent, call or WhatsApp us on <b>{{company_phone}}</b>.`);
const SIGN = `<p style="margin:26px 0 0">Warm regards,<br><b>Team {{company}}</b><br><span style="color:#5b6890">The Intelligence Behind Innovation</span></p>
<p style="margin:18px 0 0;padding-top:14px;border-top:1px solid #e3e9f8;font-size:13px;color:#5b6890">Connect with us:
<a href="https://www.linkedin.com/company/indicoresolution" style="color:#0a4fd6;text-decoration:none;font-weight:600">LinkedIn</a> &nbsp;·&nbsp;
<a href="https://www.instagram.com/indicoresolution/" style="color:#0a4fd6;text-decoration:none;font-weight:600">Instagram</a> &nbsp;·&nbsp;
<a href="https://www.facebook.com/indicoresolution01/" style="color:#0a4fd6;text-decoration:none;font-weight:600">Facebook</a></p>`;
const mail = (...parts) => parts.join("\n") + "\n" + SIGN;

/* Customer-journey order: acknowledge fast -> qualify -> meet -> propose -> deliver -> support -> close.
   This is the order shown in Admin -> Email Templates and in the "Choose a template" list on each enquiry. */
export const ORDER = [
  "Enquiry Acknowledgement", "Requirement Discussion", "Udyam Credentials & Introduction", "MSME Launchpad Options", "Gentle Follow-up", "Meeting Confirmation",
  "Proposal & Quotation", "Proposal Follow-up", "Project Kick-off", "Project Progress Update",
  "Delivery & Handover", "Invoice & Payment Reminder", "Support & Maintenance Plans", "Feedback Request",
  "Thank You & Staying in Touch"
];
const rank = name => { const i = ORDER.indexOf(name); return i < 0 ? 1000 : (i + 1) * 10; };   // gaps of 10 leave room to insert later

export const templates = [
  {
    name: "Enquiry Acknowledgement", category: "Welcome",
    subject: "We've received your enquiry | INDICORE SOLUTION",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for contacting <b>{{company}}</b>. We appreciate your interest and confirm that we have received your enquiry regarding <b>{{service}}</b>."),
      P("Our team is reviewing the details you shared and will contact you within <b>one business day</b> to understand your requirements and agree the next steps."),
      P("For your reference, this is the message you submitted:"),
      BOX("{{message}}"),
      H("What happens next"),
      LIST(["Our team reviews your requirements.", "We contact you to discuss your goals, timeline and budget.", "We share a clear, practical recommendation before any work begins."], "ol"),
      URGENT,
      P("We look forward to learning more about your vision and helping you bring it to life through technology and innovation.")
    )
  },
  {
    name: "Requirement Discussion", category: "Follow-up",
    subject: "Let's discuss your {{service}} requirements",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for your interest in <b>{{service}}</b>. We would like to understand your vision in more detail so that we can recommend the right solution."),
      P("Could you please suggest a convenient time for a short call this week? Our business hours are <b>Monday to Friday, 10:00 AM – 6:00 PM</b> and <b>Saturday, 10:00 AM – 2:00 PM</b> (IST)."),
      H("To make the call productive, it helps if you can share"),
      LIST(["Your business goals and the problem you want to solve", "Your preferred timeline", "An approximate budget range", "Any existing systems, websites or tools we should consider"]),
      P("Simply reply to this email or message us on WhatsApp and we will confirm the slot."),
      BTN("Chat on WhatsApp", WA)
    )
  },
  {
    name: "Udyam Credentials & Introduction", category: "Sales",
    subject: "About INDICORE SOLUTION | Udyam-registered MSME, Siwan, Bihar",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for your interest in <b>{{company}}</b>. Since you may want to know who you would be working with, here is a short introduction."),
      FACTS([["Business", "INDICORE SOLUTION, Siwan, Bihar"], ["Registration", "Udyam Registered Micro Enterprise (Services)"], ["Udyam number", "UDYAM-BR-35-0059732"], ["Verify online", "udyamregistration.gov.in, then Verify Udyam Registration"]]),
      P("Our registered activities cover custom software, web design, software support, IT consultancy, advertising and graphic design. Registration confirms our MSME classification. It is not a quality certificate, so we would rather earn your trust through clear scope, honest advice and good work."),
      P("You can see our full credentials and services on our website, or reply here with a few lines about your business and we will suggest the smallest useful first step."),
      BTN("Chat on WhatsApp", WA)
    )
  },
  {
    name: "MSME Launchpad Options", category: "Sales",
    subject: "Where to start with {{service}}? Four simple stages",
    body: mail(
      P("Dear {{name}},"),
      P("Most small businesses do not need everything at once. We usually suggest starting at the stage that matches your business today, and adding more later."),
      LIST(["<b>Get Online:</b> business website, Google Business Profile, logo and brand kit, WhatsApp enquiries", "<b>Run Smarter:</b> GST-ready billing and inventory, customer and lead CRM, UPI payment links, sales dashboard", "<b>Automate:</b> invoice and payment reminders, WhatsApp and email automation, a Hindi and English AI assistant", "<b>Scale Up:</b> web and mobile apps, online store, ad campaigns and analytics, managed IT support"], "ol"),
      P("Based on your enquiry about <b>{{service}}</b>, which stage sounds closest to where you are? Reply with a number and a line or two about your business, and we will send a tailored, budget-friendly plan."),
      URGENT
    )
  },
  {
    name: "Meeting Confirmation", category: "Meeting",
    subject: "Your meeting with INDICORE SOLUTION is confirmed",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for your time. This email confirms our meeting to discuss <b>{{service}}</b>."),
      FACTS([["Date", "[Date]"], ["Time", "[Time] IST"], ["Mode", "[Google Meet / Phone call / In person]"], ["Link / Location", "[Meeting link or address]"]]),
      P("If you would like to share anything beforehand, such as documents, references or examples you like, please reply to this email."),
      P("Need to reschedule? Let us know on <b>{{company_phone}}</b> or by replying here and we will find another time that suits you."),
      P("We look forward to speaking with you.")
    )
  },
  {
    name: "Proposal & Quotation", category: "Sales",
    subject: "Your proposal from INDICORE SOLUTION",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for taking the time to discuss your requirements with us. Based on our conversation, we have prepared a tailored proposal for <b>{{service}}</b>."),
      H("The proposal covers"),
      LIST(["Project scope and deliverables", "Timeline and milestones", "Technology approach", "A clear, budget-friendly quotation", "Support after launch"]),
      P("[Please find the proposal attached. / We will share the proposal shortly.] Kindly review it and let us know if you would like any changes. We are happy to walk you through it on a call."),
      P("Please reply to this email with any questions or additions. We will be glad to refine the proposal until it fits your needs."),
      BTN("Reply to this email", "mailto:{{company_email}}")
    )
  },
  {
    name: "Proposal Follow-up", category: "Sales",
    subject: "Checking in on our proposal for {{service}}",
    body: mail(
      P("Dear {{name}},"),
      P("I hope you are doing well. We recently shared our proposal for <b>{{service}}</b> and wanted to check whether you have had a chance to review it."),
      P("If you have questions about the scope, timeline or pricing, or would like us to adjust anything, we would be happy to discuss it on a short call at your convenience."),
      P("If your priorities have changed, that is perfectly fine too. Just let us know and we will keep the door open."),
      URGENT
    )
  },
  {
    name: "Gentle Follow-up", category: "Follow-up",
    subject: "Following up on your enquiry",
    body: mail(
      P("Dear {{name}},"),
      P("We are following up on your enquiry about <b>{{service}}</b>. If you are still interested, we would be glad to help and can arrange a short call whenever suits you."),
      P("You can simply reply to this email, or reach us on <b>{{company_phone}}</b>."),
      P("If now is not the right time, no problem at all. We are here whenever you are ready.")
    )
  },
  {
    name: "Project Kick-off", category: "Onboarding",
    subject: "Welcome aboard! Kicking off your {{service}} project",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for choosing <b>{{company}}</b>. We are delighted to begin work on your <b>{{service}}</b> project and look forward to a successful partnership."),
      H("Our next steps"),
      LIST(["<b>Discovery:</b> we confirm goals, scope and priorities with you.", "<b>Planning:</b> we share the timeline, milestones and design direction.", "<b>Build &amp; review:</b> we develop in stages and share progress for your feedback.", "<b>Launch &amp; support:</b> we deploy, test and support you after go-live."], "ol"),
      H("To get started, please share"),
      LIST(["Brand assets such as logo, colours and fonts", "Content, documents or reference material", "Access details for any existing systems (shared securely)", "The main person we should coordinate with"]),
      P("Your point of contact will keep you updated at every stage. Questions are always welcome.")
    )
  },
  {
    name: "Project Progress Update", category: "Delivery",
    subject: "Progress update on your {{service}} project",
    body: mail(
      P("Dear {{name}},"),
      P("Here is a quick update on your <b>{{service}}</b> project."),
      FACTS([["Status", "[On track / Ahead / Needs your input]"], ["Completed", "[What has been completed]"], ["In progress", "[What we are working on now]"], ["Next milestone", "[Milestone and expected date]"]]),
      P("[Anything we need from you, for example feedback, content or approvals.]"),
      P("Thank you for your continued trust and collaboration. If you would like to discuss anything, simply reply to this email.")
    )
  },
  {
    name: "Delivery & Handover", category: "Delivery",
    subject: "Your {{service}} project is ready",
    body: mail(
      P("Dear {{name}},"),
      P("We are pleased to let you know that your <b>{{service}}</b> project is complete and ready for handover."),
      H("Handover details"),
      FACTS([["Live link / files", "[Link or attachment]"], ["Login details", "[Shared separately and securely]"], ["Documentation", "[Guide / user manual link]"]]),
      P("We recommend reviewing everything and sharing any final feedback. We will be happy to make reasonable adjustments, and to walk your team through the system if helpful."),
      P("It has been a pleasure working with you. We would be glad to continue supporting your growth."),
      BTN("Talk to our team", WA)
    )
  },
  {
    name: "Invoice & Payment Reminder", category: "Billing",
    subject: "Payment reminder | INDICORE SOLUTION",
    body: mail(
      P("Dear {{name}},"),
      P("This is a friendly reminder regarding the payment for your <b>{{service}}</b> project."),
      FACTS([["Invoice no.", "[Invoice number]"], ["Amount", "[Amount]"], ["Due date", "[Due date]"]]),
      P("Payment details are included on the invoice. If you have already made the payment, please share the reference and ignore this reminder, with our thanks."),
      P("For any question about the invoice, reply to this email or call <b>{{company_phone}}</b>. We are happy to help.")
    )
  },
  {
    name: "Support & Maintenance Plans", category: "Support",
    subject: "Keep your solution secure and reliable | INDICORE SOLUTION",
    body: mail(
      P("Dear {{name}},"),
      P("Technology works best when it is looked after. Following your <b>{{service}}</b> project, we would like to offer you an ongoing support plan."),
      H("What our support covers"),
      LIST(["Maintenance, monitoring and regular updates", "Cloud and server support", "Backup and recovery", "Bug fixes and small improvements", "Quick help from a team that knows your system"]),
      P("We can tailor a plan to your needs and budget. Reply to this email and we will be glad to share the options."),
      BTN("Ask about support plans", "mailto:{{company_email}}")
    )
  },
  {
    name: "Feedback Request", category: "After-sales",
    subject: "How did we do? Your feedback matters",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for working with <b>{{company}}</b> on your <b>{{service}}</b> project. Your experience matters to us, and we would value a few minutes of your feedback."),
      LIST(["What did you like most about working with us?", "Is there anything we could have done better?", "Would you be comfortable recommending us to others?"]),
      P("Simply reply to this email with your thoughts. Every response helps us improve, and we read each one personally."),
      P("Thank you once again for your trust.")
    )
  },
  {
    name: "Thank You & Staying in Touch", category: "Closure",
    subject: "Thank you for considering INDICORE SOLUTION",
    body: mail(
      P("Dear {{name}},"),
      P("Thank you for considering <b>{{company}}</b> for your <b>{{service}}</b> requirement. We appreciate the time you spent with us."),
      P("We understand that timing and priorities change. Whenever you are ready to revisit your project, or if you need advice, we would be glad to help."),
      P("We wish you every success and hope to work together in the future.")
    )
  }
];

export default async function seed() {
  // adds any default template that is missing (matched by name); never overwrites templates you have edited
  const have = new Set((await EmailTemplate.find().select("name")).map(t => t.name));
  const missing = templates.filter(t => !have.has(t.name)).map(t => ({ ...t, order: rank(t.name) }));
  if (missing.length) await EmailTemplate.insertMany(missing);
  // one-time backfill: existing templates that have no position yet get their journey position (content is never touched)
  const unordered = await EmailTemplate.find({ order: { $exists: false } }).select("name");
  if (unordered.length) await EmailTemplate.bulkWrite(unordered.map(t => ({ updateOne: { filter: { _id: t._id }, update: { $set: { order: rank(t.name) } } } })));
  await seedProjects();
}

/* ---- Projects: MSME-focused concept builds (v5) ----
   Fresh database: all concepts are inserted.
   Existing database: the six ORIGINAL demo projects are upgraded in place ONLY if you have not edited them
   (same title + same original summary + still marked demo), and the four new concepts are added once.
   Projects you added or edited yourself are never touched, and nothing you deleted is brought back later. */
const LEGACY = {
  "Smart Inventory & Billing": "Stock, billing and order management with live sales dashboards for retail businesses.",
  "AI Support Assistant": "RAG-powered chatbot that answers customer questions from a company knowledge base.",
  "Clinic Appointment Platform": "Online booking, reminders and patient enquiry workflows for clinics.",
  "E-Commerce Storefront": "Fast, mobile-first online store with catalogue, cart and payment gateway integration.",
  "Delivery & Fleet Tracker": "Mobile app and dashboard for dispatch, delivery status and customer notifications.",
  "HR Onboarding Automation": "Automated approvals, document collection and notifications for employee onboarding."
};
const CONCEPTS = [
  {"title":"GST Billing & Inventory Suite","category":"Software","icon":"🧾","sector":"Retail & Wholesale","problem":"Handwritten bills and stock registers cause errors and lost sales.","summary":"GST-ready invoices, live stock alerts, UPI QR collection and one-tap invoice sharing on WhatsApp, with a daily sales dashboard.","tech":["MongoDB","Express","React","Node.js"],"featured":true,"isDemo":true,"order":1,"from":"Smart Inventory & Billing"},
  {"title":"AI Customer Assistant (Hindi + English)","category":"AI","icon":"🤖","sector":"Any customer-facing business","problem":"Owners answer the same customer questions all day on call and WhatsApp.","summary":"A RAG-powered assistant trained on your own catalogue and FAQs. It replies instantly in Hindi or English and hands over to a human when needed.","tech":["LLM","RAG","WhatsApp API","Node.js"],"featured":true,"isDemo":true,"order":2,"from":"AI Support Assistant"},
  {"title":"Udyam-Ready Business Website","category":"Web","icon":"🌐","sector":"Shops, clinics, institutes, service firms","problem":"No website, or a slow one, means customers choose a competitor.","summary":"A fast, mobile-first site with Google Business setup, local SEO, enquiry-to-WhatsApp and a trust page for your registrations.","tech":["React","SEO","Google Business"],"featured":true,"isDemo":true,"order":3},
  {"title":"Clinic Appointment Platform","category":"Web","icon":"🏥","sector":"Healthcare & Wellness","problem":"Phone-only bookings lead to missed visits and crowded waiting rooms.","summary":"Online booking, automatic reminders and patient enquiry workflows for clinics, labs and diagnostic centres.","tech":["React","Node.js","WhatsApp API"],"isDemo":true,"order":4,"from":"Clinic Appointment Platform"},
  {"title":"Local Business Online Store","category":"Web","icon":"🛒","sector":"Retail & Local Brands","problem":"Great products, but customers can only buy by walking in.","summary":"A fast storefront with catalogue, cart, UPI and card payments, and order updates sent straight to the customer's phone.","tech":["React","Express","Payments"],"isDemo":true,"order":5,"from":"E-Commerce Storefront"},
  {"title":"Delivery & Field-Staff Tracker","category":"Mobile","icon":"🚚","sector":"Logistics & Transport","problem":"No idea where deliveries or field staff are until someone calls.","summary":"A mobile app and dashboard for dispatch, live delivery status, proof of delivery and customer notifications.","tech":["Flutter","Node.js","MongoDB"],"isDemo":true,"order":6,"from":"Delivery & Fleet Tracker"},
  {"title":"Invoice & Payment-Reminder Automation","category":"Automation","icon":"⏰","sector":"B2B suppliers & service firms","problem":"Payments arrive late because nobody has time to follow up politely.","summary":"Invoices go out automatically, and friendly reminders follow by email and WhatsApp until payment is marked received.","tech":["Workflow","APIs","Email","WhatsApp"],"isDemo":true,"order":7},
  {"title":"HR Onboarding Automation","category":"Automation","icon":"⚙️","sector":"Growing teams & manufacturers","problem":"Joining formalities eat days of paperwork and follow-ups.","summary":"Automated approvals, document collection and notifications that get a new hire productive from day one.","tech":["Workflow","APIs","Email"],"isDemo":true,"order":8,"from":"HR Onboarding Automation"},
  {"title":"Brand Identity & Social Media Kit","category":"Design","icon":"🎨","sector":"New & rebranding businesses","problem":"Inconsistent logos and posts make a good business look small.","summary":"Logo, colour and type guide, invoice and letterhead templates, and ready-to-post social creatives in a consistent style.","tech":["Figma","Illustrator","Photoshop"],"isDemo":true,"order":9},
  {"title":"Marketing & Lead Tracking Dashboard","category":"Marketing","icon":"📣","sector":"Any business running ads","problem":"Ad money is spent, but nobody knows which enquiries became sales.","summary":"One dashboard tying ad campaigns, calls, WhatsApp chats and form enquiries to actual leads and conversions.","tech":["Analytics","React","Node.js"],"isDemo":true,"order":10}
];
async function seedProjects() {
  if (!(await Project.countDocuments())) { await Project.insertMany(CONCEPTS.map(({ from, ...p }) => p)); return; }
  let upgraded = 0;
  for (const c of CONCEPTS.filter(c => c.from)) {
    const { from, ...fresh } = c;
    const r = await Project.updateOne({ title: from, summary: LEGACY[from], isDemo: true }, { $set: fresh });
    upgraded += r.modifiedCount || 0;
  }
  if (upgraded) {
    const add = CONCEPTS.filter(c => !c.from);
    for (const { from, ...p } of add) if (!(await Project.exists({ title: p.title }))) await Project.create(p);
  }
}
