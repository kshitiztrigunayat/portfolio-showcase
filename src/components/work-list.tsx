import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";

const FILTERS = ["All", "AI & Product", "Growth & GTM", "Ops & Education"] as const;
type Filter = (typeof FILTERS)[number];

const GROUP: Record<string, Exclude<Filter, "All">> = {
  planiva: "AI & Product",
  ctruh: "AI & Product",
  "zordie-ai": "AI & Product",
  "dnc-ventures": "Growth & GTM",
  "campus-clash": "Growth & GTM",
  wrestlefan: "Growth & GTM",
  "nasscom-ai-curriculum": "Ops & Education",
  "jio-games": "Ops & Education",
  desportz: "Ops & Education",
};
const groupOf = (p: Project) => GROUP[p.slug] ?? "Growth & GTM";

/** Titles in large type; hovering one dims the rest and shows its story beside the list. */
export function WorkList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  const visible = useMemo(
    () => projects.filter((p) => filter === "All" || groupOf(p) === filter),
    [projects, filter],
  );
  const current = visible[Math.min(active, visible.length - 1)];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3" role="tablist" aria-label="Filter work">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={f === filter}
            onClick={() => {
              setFilter(f);
              setActive(0);
            }}
            className={`font-mono-label border-b pb-1.5 transition-colors duration-300 ${
              f === filter
                ? "border-accent text-primary"
                : "border-transparent text-secondary hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        <ul
          className="lg:col-span-7"
          onMouseLeave={() => {
            setActive(0);
            setHovering(false);
          }}
        >
          {visible.map((p, i) => (
            <li key={p.slug} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Link
                to="/work/$slug"
                params={{ slug: p.slug }}
                onMouseEnter={() => {
                  setActive(i);
                  setHovering(true);
                }}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[1.75rem_1fr] items-baseline gap-3 md:grid-cols-[2.25rem_1fr_auto] border-t border-border py-5 transition-opacity duration-500 md:py-6"
                style={{ opacity: hovering && current && current.slug !== p.slug ? 0.38 : 1 }}
              >
                <span className="font-mono-label text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="font-mono-label mb-2 block text-secondary md:hidden">{p.year}</span>
                  <span className="block text-3xl leading-[1.05] transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                    {p.title.split(" — ")[0]}
                  </span>
                  <span className="font-mono-label mt-2 block text-secondary">{p.category}</span>
                  <span className="mt-3 block text-base leading-snug text-secondary lg:hidden">
                    {p.metric}
                  </span>
                </span>
                <span className="font-mono-label hidden text-secondary md:block">{p.year}</span>
              </Link>
            </li>
          ))}
          <li className="border-t border-border" />
        </ul>

        {current && (
          <aside className="hidden lg:col-span-5 lg:block">
            <div
              key={current.slug}
              className="sticky top-28"
              style={{ animation: "fadeIn .6s ease" }}
            >
              <p className="font-mono-label text-secondary">{current.role}</p>
              <p className="font-serif-italic mt-6 text-4xl leading-[1.1] xl:text-5xl">
                {current.metric}
              </p>
              <p className="mt-6 max-w-md text-base leading-relaxed text-secondary">
                {current.description}
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {current.stack.slice(0, 5).map((s) => (
                  <li key={s} className="font-mono-label text-secondary">
                    {s}
                  </li>
                ))}
              </ul>
              <Link
                to="/work/$slug"
                params={{ slug: current.slug }}
                className="font-mono-label mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 transition-colors hover:border-accent hover:text-accent"
              >
                Read the case study <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
