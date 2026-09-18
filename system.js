"use strict";

/* ==========================================================
   CONFIG: fill these in later. Empty values are handled safely.
   ========================================================== */
const CONFIG = {
  logo: "",                       // e.g. "assets/logo.svg" (replaces the text logo in the nav)
  links: {
    instagram: "",                // full URL, e.g. "https://instagram.com/DA_StudiosX"
    whatsapp: "",                 // full URL, e.g. "https://wa.me/91XXXXXXXXXX"
    email: "",                    // address only, e.g. "hello@example.com"
    phone: ""                     // number only, e.g. "+911234567890"
  },
  formEndpoint: "",               // future backend / email service URL (POST, JSON)
  // { title, category: "Social|Branding|Content|Campaigns|Video", type: "image|video|case",
  //   media: "assets/file.jpg or .mp4", alt: "", description: "", url: "" }
  projects: [],
  // { quote, name, role }
  testimonials: [],
  // { name, role, photo, alt, instagram }
  team: []
};

/* Site copy lives here so it is easy to edit */
const DATA = {
  categories: ["Social", "Branding", "Content", "Campaigns", "Video"],
  services: [
    ["Social Media Management", "End-to-end management of social platforms, planning, publishing and optimization."],
    ["Instagram Management", "Strategic Instagram presence including content planning, profile management and audience engagement."],
    ["Content Strategy", "Content systems designed around brand identity, audience and goals."],
    ["Reels & Video Editing", "Short-form video and reels designed for retention and attention."],
    ["Graphic & Post Design", "Premium social creatives, campaigns and visual assets."],
    ["Branding", "Visual identity, brand direction and digital brand systems."],
    ["Ads", "Creative advertising campaigns and social media ad strategy."],
    ["Influencer Marketing", "Creator collaborations and influencer-led campaigns."]
  ],
  steps: [
    ["Discover", "Understand the brand, audience and objectives."],
    ["Strategize", "Build the content and digital strategy."],
    ["Create", "Design, shoot, edit and produce content."],
    ["Launch", "Publish and execute campaigns."],
    ["Optimize", "Review performance and continuously improve."]
  ],
  principles: [
    "Strategy before posting.", "Creativity with direction.", "Consistency without repetition.",
    "Design with intention.", "Content that communicates.", "Data-informed decisions."
  ],
  faq: [
    ["What does DA StudiosX do?", "We are a creative studio for social media management, content strategy and digital branding."],
    ["Which platforms do you manage?", "Instagram is our core focus. Tell us which other platforms you use and we will plan around them."],
    ["Do you create reels and short-form videos?", "Yes. Reels and short-form video are part of our content offering, built for retention."],
    ["Do you provide branding services?", "Yes. We shape visual identity, brand direction and digital brand systems."],
    ["Can you manage an existing social media account?", "Yes. We review what you have, then build a plan to improve it."],
    ["Do you work with startups and small businesses?", "Yes. Every package is custom, so we can scale it to your stage."],
    ["How does the onboarding process work?", "You send an inquiry, we talk through your goals, then we follow our process: discover, strategize, create, launch, optimize."],
    ["How can I get started?", "Fill in the contact form below or message us on Instagram."]
  ]
};

/* Extension points for later: analytics, Instagram feed, CMS, booking */
const hooks = {
  track(event, detail) { /* e.g. gtag("event", event, detail) */ },
  async loadInstagramFeed() { /* fetch posts, then fill the .insta grid */ }
};

/* ==========================================================
   Helpers
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* Links: empty value = inert link, filled value = working link */
function setLink(a, url, kind) {
  if (!url) { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.title = "Link coming soon"; return; }
  a.href = kind === "email" ? "mailto:" + url : kind === "phone" ? "tel:" + url : url;
  if (kind !== "email" && kind !== "phone") { a.target = "_blank"; a.rel = "noopener"; }
}

const isVideo = f => /\.(mp4|webm|mov)$/i.test(f || "");

/* ==========================================================
   Content rendering
   ========================================================== */
function renderServices() {
  const box = $("#serviceList");
  DATA.services.forEach(([title, text], i) => {
    const card = el("article", "svc reveal", `<span class="idx" data-n="0${i + 1}"></span><div><h3>${title}</h3><p>${text}</p></div>`);
    card.style.transitionDelay = (i % 4) * 60 + "ms";
    if (fine) card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
    box.append(card);
  });
}

function renderWork() {
  const list = CONFIG.projects.length ? CONFIG.projects
    : ["Social", "Branding", "Content"].map((c, i) => ({ title: "PROJECT 0" + (i + 1), category: c, description: "Coming Soon", placeholder: true }));
  const grid = $("#workGrid"), bar = $("#filters");

  const draw = cat => {
    grid.innerHTML = "";
    const shown = list.filter(p => cat === "All" || p.category === cat);
    if (!shown.length) grid.append(el("p", "empty", "No projects in this category yet."));
    shown.forEach(p => {
      const media = p.placeholder ? `<span class="ph">${esc(p.title)}</span>`
        : isVideo(p.media) ? `<video src="${esc(p.media)}" muted loop playsinline preload="metadata" aria-label="${esc(p.alt || p.title)}"></video>`
        : `<img src="${esc(p.media)}" alt="${esc(p.alt || p.title)}" loading="lazy">`;
      const card = el(p.url ? "a" : "article", "work reveal in",
        `<div class="media">${media}</div><div class="work-meta"><div><h3>${esc(p.placeholder ? p.description : p.title)}</h3>${p.placeholder ? "" : `<p>${esc(p.description || "")}</p>`}</div><small>${esc(p.category)}</small></div>`);
      if (p.url) card.href = p.url;
      const v = $("video", card);
      if (v) { card.addEventListener("mouseenter", () => v.play()); card.addEventListener("mouseleave", () => v.pause()); }
      grid.append(card);
    });
    hooks.track("filter_work", { category: cat });
  };

  ["All", ...DATA.categories].forEach((cat, i) => {
    const b = el("button", "", cat);
    b.type = "button"; b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", () => {
      $$("button", bar).forEach(x => x.setAttribute("aria-pressed", x === b));
      draw(cat);
    });
    bar.append(b);
  });
  draw("All");
}

function renderSteps() {
  DATA.steps.forEach(([t, d], i) => $("#steps").append(el("li", "reveal", `<b>0${i + 1}</b><h3>${t}</h3><p>${d}</p>`)));
}

function renderPrinciples() {
  DATA.principles.forEach(t => $("#principles").append(el("li", "reveal", t)));
}

function renderFaq() {
  DATA.faq.forEach(([q, a]) => $("#faqList").append(el("details", "reveal", `<summary>${q}</summary><p>${a}</p>`)));
}

function renderTeam() {
  const people = CONFIG.team.length ? CONFIG.team : [
    { name: "Founder / Creative Director", role: "DA StudiosX" },
    { name: "Creative Team", role: "Coming Soon" }
  ];
  people.forEach(p => {
    const photo = p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.alt || p.name)}" loading="lazy">` : `<span class="ph">PHOTO</span>`;
    const ig = p.instagram ? `<a href="${esc(p.instagram)}" target="_blank" rel="noopener">Instagram</a>` : "";
    $("#teamGrid").append(el("article", "member reveal", `<div class="media">${photo}</div><h3>${esc(p.name)}</h3><p>${esc(p.role)}</p>${ig}`));
  });
}

function renderTestimonials() {
  const items = CONFIG.testimonials.length ? CONFIG.testimonials
    : [{ quote: "Client testimonial coming soon.", name: "", role: "Placeholder" }];
  const track = $("#quotes"), count = $("#quoteCount");
  let i = 0;
  items.forEach(t => track.append(el("figure", "slide",
    `<blockquote>“${esc(t.quote)}”</blockquote><cite>${esc([t.name, t.role].filter(Boolean).join(", "))}</cite>`)));
  const go = n => {
    i = (n + items.length) % items.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    count.textContent = `${i + 1} / ${items.length}`;
    $$(".slide", track).forEach((s, k) => s.setAttribute("aria-hidden", k !== i));
  };
  $("#prevQuote").addEventListener("click", () => go(i - 1));
  $("#nextQuote").addEventListener("click", () => go(i + 1));
  if (items.length < 2) $("#quoteCtrl").hidden = true;
  go(0);
}

/* ==========================================================
   Interactions
   ========================================================== */
function initNav() {
  const nav = $("#nav"), burger = $("#burger");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const setMenu = open => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  // Active section indicator
  const links = $$("#menu a[href^='#']");
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id && !a.classList.contains("btn")));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => io.observe(s));
}

function initReveal() {
  const items = $$(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) return items.forEach(e => e.classList.add("in"));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  items.forEach(e => io.observe(e));
}

function initCursor() {
  if (!fine || calm) return;
  const c = $("#cursor");
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; c.classList.add("on"); });
  document.addEventListener("mouseleave", () => c.classList.remove("on"));
  document.addEventListener("pointerover", e => c.classList.toggle("hot", !!e.target.closest("a,button,summary,select,.svc,.work")));
  (function loop() { cx += (x - cx) * .18; cy += (y - cy) * .18; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
}

function initMagnetic() {
  if (!fine || calm) return;
  $$(".magnetic").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
}

function initScrollEffects() {
  const parallax = $$("[data-speed]"), steps = $("#steps");
  let ticking = false;
  const update = () => {
    ticking = false;
    if (!calm && scrollY < innerHeight * 1.5) parallax.forEach(p => { p.style.transform = `translate3d(0,${scrollY * p.dataset.speed}px,0)`; });
    const r = steps.getBoundingClientRect();
    steps.style.setProperty("--p", Math.min(1, Math.max(0, (innerHeight * .65 - r.top) / r.height)));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* Contact form: frontend-only. Connect a backend by setting CONFIG.formEndpoint. */
async function sendInquiry(data) {
  if (!CONFIG.formEndpoint) return { ok: false, connected: false };
  try {
    const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return { ok: res.ok, connected: true };
  } catch { return { ok: false, connected: true }; }
}

function initForm() {
  const form = $("#inquiry"), status = $("#formStatus");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) { status.textContent = "Please complete the required fields (name, email, service, message)."; form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form));
    status.textContent = "Sending…";
    const r = await sendInquiry(data);
    hooks.track("inquiry_submit", { service: data.service });
    if (r.ok) { status.textContent = "Inquiry sent. We'll be in touch soon."; form.reset(); }
    else if (!r.connected) status.textContent = "Sending isn't connected yet. Please reach us through Instagram for now.";
    else status.textContent = "Something went wrong. Please try again or contact us directly.";
  });
}

/* ==========================================================
   Boot
   ========================================================== */
function init() {
  if (CONFIG.logo) $("#brand").innerHTML = `<img src="${esc(CONFIG.logo)}" alt="DA StudiosX">`;
  $$("[data-link]").forEach(a => setLink(a, CONFIG.links[a.dataset.link], a.dataset.link));
  $$("a[aria-disabled='true']").forEach(a => a.addEventListener("click", e => e.preventDefault()));

  renderServices(); renderWork(); renderSteps(); renderPrinciples();
  renderFaq(); renderTeam(); renderTestimonials();

  initNav(); initReveal(); initCursor(); initMagnetic(); initScrollEffects(); initForm();
  // Re-run setLink for links inside rendered content is not needed; only static links use data-link.

  setTimeout(() => {
    document.body.classList.add("ready");
    setTimeout(() => $("#loader")?.remove(), 1100);
  }, calm ? 0 : 900);
}

document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();