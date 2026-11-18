import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";
import { homepageChapters, timelineChapters } from "@/lib/timeline-data";
import { blogPosts } from "@/lib/blog-posts";
import { mediumPostsQueryOptions, formatPostDate } from "@/lib/medium";
import { HERO_STATS, SITE } from "@/lib/site";
import { Footer, Nav, SectionHeader } from "@/components/site-chrome";
import { CountUp } from "@/components/motion";
import { IntroGate } from "@/components/intro-gate";
import { WorkList } from "@/components/work-list";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { property: "og:title", content: SITE.title },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: SITE.title },
      { name: "twitter:description", content: SITE.description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: SITE.name,
          jobTitle: "AI Product Engineer",
          url: "/",
          email: `mailto:${SITE.email}`,
          address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
          alumniOf: "Atria University",
          sameAs: [SITE.links.github, SITE.links.linkedin, SITE.links.medium],
        }),
      },
    ],
  }),
  component: Portfolio,
});

/** Fade/slide-up headings, rows and cards as they scroll into view (staggered by sibling index). */
function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    const sel = [
      "section:not(#top):not(#work) h2",
      "section:not(#top) li",
      "section:not(#top):not(#work) dl > div",
      "section:not(#top):not(#work) .sr-block",
      "footer > div > *",
    ].join(",");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sr-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      if (
        el.closest("#work") ||
        el.closest("nav") ||
        el.getBoundingClientRect().top < window.innerHeight
      )
        return;
      const idx = Array.from(el.parentElement?.children ?? []).indexOf(el);
      el.style.setProperty("--sr-delay", `${Math.min(idx, 6) * 80}ms`);
      el.classList.add("sr");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

function Portfolio() {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-bg font-body text-primary">
      <IntroGate />
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Recognition />
        <Capabilities />
        <Journey />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="grain relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="hero-glow pointer-events-none absolute -inset-[20%]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #050504 100%)",
        }}
      />

      <div className="container-x relative flex flex-1 flex-col items-center justify-center pt-28 text-center">
        <p className="font-mono-label reveal text-secondary" style={{ animationDelay: "0.2s" }}>
          Product Manager &amp; Entrepreneur
        </p>
        <h1
          className="font-serif-italic reveal mt-8 leading-[0.92]"
          style={{ fontSize: "clamp(60px, 13vw, 200px)", animationDelay: "0.4s" }}
        >
          Kshitiz
          <br />
          Trigunayat
        </h1>
        <p
          className="reveal mt-10 max-w-xl text-xl leading-snug text-secondary md:text-2xl"
          style={{ animationDelay: "0.8s" }}
        >
          I build AI products and the distribution to scale them.
        </p>
        <div className="reveal mt-10 flex items-center gap-8" style={{ animationDelay: "1.1s" }}>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("replay-intro"))}
            className="font-mono-label border-b border-primary pb-1 transition-colors hover:border-accent hover:text-accent"
          >
            Watch the intro
          </button>
          <a
            href="#work"
            className="font-mono-label border-b border-transparent pb-1 text-secondary transition-colors hover:border-accent hover:text-primary"
          >
            View work
          </a>
        </div>
      </div>

      <div className="container-x reveal relative mt-12 pb-10" style={{ animationDelay: "1.5s" }}>
        <dl className="grid grid-cols-2 gap-y-6 border-t border-rule/50 pt-6 text-center lg:grid-cols-4">
          {HERO_STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl md:text-4xl">
                <CountUp value={s.value} />
              </dd>
              <dd className="font-mono-label mt-2 text-[11px] text-secondary">{s.label}</dd>
            </div>
          ))}
        </dl>
        <div aria-hidden className="mx-auto mt-8 h-10 w-px overflow-hidden bg-border">
          <div className="scroll-line h-full w-full bg-primary" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Work ---------------- */
function Work() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="work" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="01"
          label="Selected Work"
          title={
            <>
              Things I&apos;ve <span className="font-serif-italic">shipped.</span>
            </>
          }
          aside={<p className="font-mono-label text-secondary">{featured.length} projects</p>}
        />
        <WorkList projects={featured} />
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */
const SPEC: { k: string; v: string }[] = [
  { k: "Based in", v: "Bengaluru, India" },
  { k: "Now", v: "Associate Product Manager, Ctruh Technologies" },
  { k: "Building", v: "Planiva · DnC Ventures" },
  {
    k: "Studied",
    v: "B.Tech, Digital Transformations (AI/ML), minor in Business, Atria University",
  },
  { k: "Off the clock", v: "Music, cricket, badminton" },
];

function About() {
  const [more, setMore] = useState(false);
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="02"
          label="Biography"
          title={
            <>
              Engineer by training. <span className="font-serif-italic">Operator</span> by habit.
            </>
          }
        />
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-display text-2xl leading-snug md:text-4xl md:leading-[1.2]">
              I work where AI engineering meets commercial strategy: building LLM systems that ship,
              and distribution that actually converts.
            </p>
            <div
              className="grid transition-all duration-700 ease-out"
              style={{ gridTemplateRows: more ? "1fr" : "0fr", opacity: more ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <div className="space-y-5 pt-8 text-lg leading-relaxed text-secondary">
                  <p>
                    I co-founded DnC Ventures with no outside funding. We ran campus and esports
                    campaigns for brands like Jio Games, Infinix, MSI, Krafton, STAN, Strike World
                    and Swish, and built a ground network of 300+ campus ambassadors. Our flagship,
                    Campus Clash India, drew 13,456 players with Grand Finals at IIT Kharagpur.
                  </p>
                  <p>
                    On the product side, I&apos;ve taken Ctruh Academy, the Ctruh CMS, Studio v1 and
                    IRIS end to end, and built Zordie AI&apos;s resume intelligence system. I&apos;m
                    also building Planiva, an agentic platform for event planning that was a TiE
                    Global University Accelerator finalist.
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMore((m) => !m)}
              className="font-mono-label mt-8 border-b border-primary pb-1 transition-colors hover:border-accent hover:text-accent"
            >
              {more ? "Close" : "Expand for more info"}
            </button>
          </div>

          <dl className="border-t border-rule/50 lg:col-span-5">
            {SPEC.map((row) => (
              <div
                key={row.k}
                className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-4"
              >
                <dt className="font-mono-label pt-1 text-secondary">{row.k}</dt>
                <dd className="text-base">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Recognition ---------------- */
const RECOGNITION = [
  { name: "TiE Global University Accelerator", note: "Finalist" },
  { name: "Tavastra Startup Village", note: "Top 3% of 5,000+" },
  { name: "Campus Clash India", note: "Grand Finals at IIT Kharagpur" },
  { name: "NASSCOM FutureSkills Prime", note: "AI in Manufacturing, 4 modules, live" },
];

function Recognition() {
  return (
    <section id="recognition" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="03"
          label="Recognition"
          title={
            <>
              Moments that <span className="font-serif-italic">counted.</span>
            </>
          }
        />
        <ul>
          {RECOGNITION.map((r) => (
            <li
              key={r.name}
              className="flex flex-col gap-1 border-t border-border py-6 md:flex-row md:items-baseline md:justify-between"
            >
              <span className="font-display text-2xl md:text-4xl">{r.name}</span>
              <span className="font-mono-label text-secondary">{r.note}</span>
            </li>
          ))}
          <li className="border-t border-border" />
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Capabilities ---------------- */
const CAPABILITIES = [
  { label: "AI / ML", items: ["LLMs", "RAG pipelines", "Agentic systems", "NLP", "Python"] },
  { label: "Backend & data", items: ["FastAPI", "Postgres + pgvector", "MCP servers", "Docker"] },
  { label: "Web", items: ["React", "Next.js", "Tailwind", "Vercel"] },
  { label: "Product", items: ["0-to-1 building", "PRDs", "Figma", "QA", "User research"] },
  {
    label: "Growth",
    items: ["Zero-CAC distribution", "Campus outreach", "Brand activation", "Partnerships"],
  },
];
const LOOP = ["Problem", "Research", "PRD", "Architecture", "Prototype", "Launch"];

function Capabilities() {
  return (
    <section id="capabilities" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Capabilities"
          title={
            <>
              What I <span className="font-serif-italic">do.</span>
            </>
          }
        />
        <ul>
          {CAPABILITIES.map((g) => (
            <li
              key={g.label}
              className="grid gap-3 border-t border-border py-6 md:grid-cols-12 md:gap-10"
            >
              <p className="font-mono-label pt-2 text-accent md:col-span-3">{g.label}</p>
              <p className="font-display flex flex-wrap items-center gap-y-1 text-2xl leading-snug md:col-span-9 md:text-3xl">
                {g.items.map((item, i) => (
                  <span key={item} className="mr-4 whitespace-nowrap md:mr-0">
                    {item}
                    {i < g.items.length - 1 && <span className="mx-3 hidden text-rule md:inline">·</span>}
                  </span>
                ))}
              </p>
            </li>
          ))}
          <li className="grid gap-3 border-y border-border py-6 md:grid-cols-12 md:gap-10">
            <p className="font-mono-label pt-1 text-accent md:col-span-3">How I work</p>
            <p className="font-mono-label flex flex-wrap items-center gap-y-2 whitespace-normal leading-loose text-secondary md:col-span-9">
              {LOOP.map((step, i) => (
                <span key={step} className="whitespace-nowrap">
                  <span className="text-primary">{step}</span>
                  {i < LOOP.length - 1 && <span className="mx-2 text-rule md:mx-3">→</span>}
                </span>
              ))}
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Journey ---------------- */
function JourneyItem({ year, place, title, body, tag }: (typeof homepageChapters)[number]) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-t border-border py-6 md:py-8">
      <div className="grid gap-2 md:grid-cols-12 md:gap-8">
        <p className="font-mono-label pt-2 text-secondary md:col-span-3">{year}</p>
        <div className="md:col-span-9">
          <p className="font-display text-2xl leading-tight md:text-4xl">{title}</p>
          <p className="font-mono-label mt-2 text-[11px] text-secondary">
            {place} · {tag}
          </p>
          <div
            className="grid transition-all duration-700 ease-out"
            style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
          >
            <div className="overflow-hidden">
              <p className="max-w-2xl pt-4 text-lg leading-relaxed text-secondary">{body}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="font-mono-label mt-4 border-b border-transparent pb-0.5 text-secondary transition-colors hover:border-accent hover:text-primary"
          >
            {open ? "Close" : "Expand for more info"}
          </button>
        </div>
      </div>
    </li>
  );
}

function Journey() {
  return (
    <section id="timeline" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="05"
          label="Journey"
          title={
            <>
              Kasganj to <span className="font-serif-italic">Bengaluru.</span>
            </>
          }
        />
        <ul>
          {homepageChapters.map((c) => (
            <JourneyItem key={c.year + c.title} {...c} />
          ))}
          <li className="border-t border-border" />
        </ul>
        <Link
          to="/timeline"
          className="font-mono-label mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 transition-colors hover:border-accent hover:text-accent"
        >
          The full journey, {timelineChapters.length} chapters <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Writing ---------------- */
function Writing() {
  const { data } = useQuery(mediumPostsQueryOptions);
  const live = data?.posts ?? [];
  const posts =
    live.length > 0
      ? live.map((p) => ({ title: p.title, link: p.link, date: formatPostDate(p.pubDate) }))
      : blogPosts;

  return (
    <section id="writing" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHeader
          index="06"
          label="Writing"
          title={
            <>
              Notes from the <span className="font-serif-italic">build.</span>
            </>
          }
          aside={
            <a
              href={SITE.links.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-label inline-flex items-center gap-1.5 text-secondary transition-colors hover:text-primary"
            >
              Medium <ArrowUpRight size={13} />
            </a>
          }
        />
        <ul>
          {posts.slice(0, 4).map((post) => (
            <li key={post.link}>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-2 border-t border-border py-6 md:grid-cols-12 md:items-baseline md:gap-8 md:py-7"
              >
                <span className="font-mono-label text-secondary md:col-span-2">{post.date}</span>
                <span className="font-display text-2xl leading-tight transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent md:col-span-9 md:text-3xl">
                  {post.title}
                </span>
                <ArrowUpRight
                  size={20}
                  aria-hidden
                  className="hidden justify-self-end text-secondary transition-colors group-hover:text-accent md:col-span-1 md:block"
                />
              </a>
            </li>
          ))}
          <li className="border-t border-border" />
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const links = [
    { label: "LinkedIn", href: SITE.links.linkedin },
    { label: "GitHub", href: SITE.links.github },
    { label: "Medium", href: SITE.links.medium },
    { label: "Resume", href: SITE.links.resume },
  ];
  return (
    <section id="contact" className="py-24 text-center md:py-40">
      <div className="container-x">
        <p className="font-mono-label text-secondary">Contact</p>
        <h2
          className="font-display mt-8"
          style={{ fontSize: "clamp(40px, 7vw, 104px)", lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          Let&apos;s build <span className="font-serif-italic">something.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-xl text-secondary">
          Open to AI product roles, LLM contracts and GTM consulting.
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="font-serif-italic group mt-12 inline-flex max-w-full items-center gap-3 break-all border-b border-rule pb-2 transition-colors hover:border-accent hover:text-accent"
          style={{ fontSize: "clamp(24px, 4.2vw, 56px)", lineHeight: 1.1 }}
        >
          {SITE.email}
          <ArrowUpRight
            className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            size={28}
            aria-hidden
          />
        </a>
        <ul className="font-mono-label mt-14 flex flex-wrap justify-center gap-x-10 gap-y-3 text-secondary">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
