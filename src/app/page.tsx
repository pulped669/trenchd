import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export default function Home() {
  const lead = ARTICLES[0];
  const secondRow = ARTICLES.slice(1, 4);
  const rest = ARTICLES.slice(4);
  const trending = [...ARTICLES].slice(0, 5);

  return (
    <main className="mx-auto max-w-[1200px] px-6">
      {/* ── Lead story ── */}
      <section className="py-8">
        <Link href={`/article/${lead.slug}`} className="group grid gap-7 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[20px]" style={{ boxShadow: "var(--shadow-hero)" }}>
            <img
              src={lead.image}
              alt={lead.title}
              className="aspect-[3/2] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="max-w-lg">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                {lead.category}
              </span>
              <span className="text-[12px] text-fg-muted">{lead.readTime} read</span>
            </div>
            <h2 className="font-editorial mt-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-[1.15] text-fg transition-colors duration-200 group-hover:text-accent">
              {lead.title}
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-fg-secondary line-clamp-3">
              {lead.excerpt}
            </p>
            <div className="mt-4 text-[12px] font-medium text-fg-muted">
              {lead.date}
            </div>
          </div>
        </Link>
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-border" />

      {/* ── Three-up row ── */}
      <section className="py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {secondRow.map((a) => (
            <Link key={a.slug} href={`/article/${a.slug}`} className="group">
              <div className="overflow-hidden rounded-[14px]" style={{ boxShadow: "var(--shadow-md)" }}>
                <img
                  src={a.image}
                  alt={a.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">{a.category}</span>
                  <span className="h-px w-3 bg-border" />
                  <span className="text-[11px] text-fg-muted">{a.readTime}</span>
                </div>
                <h3 className="font-editorial mt-2 text-[17px] font-bold leading-[1.3] text-fg transition-colors duration-200 group-hover:text-accent">
                  {a.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-fg-secondary line-clamp-2">
                  {a.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-border" />

      {/* ── Feed + Sidebar ── */}
      <section className="flex flex-col gap-12 py-8 lg:flex-row">
        {/* Feed */}
        <div className="flex-1 min-w-0">
          <h2 className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.15em] text-fg-muted">
            More Stories
          </h2>

          <div className="divide-y divide-border">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/article/${a.slug}`}
                className="group flex gap-6 py-6 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">{a.category}</span>
                    <span className="h-px w-3 bg-border" />
                    <span className="text-[11px] text-fg-muted">{a.date}</span>
                  </div>
                  <h3 className="font-editorial mt-2 text-[17px] font-bold leading-[1.3] text-fg transition-colors duration-200 group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-fg-secondary line-clamp-2">
                    {a.excerpt}
                  </p>
                </div>
                <div className="hidden h-[100px] w-[150px] shrink-0 overflow-hidden rounded-[12px] sm:block" style={{ boxShadow: "var(--shadow-sm)" }}>
                  <img
                    src={a.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-[300px]">
          <div className="lg:sticky lg:top-[72px] space-y-6">
            {/* Trending */}
            <div>
              <h3 className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-fg-muted">
                Trending
              </h3>
              <div className="divide-y divide-border">
                {trending.map((a, i) => (
                  <Link
                    key={a.slug}
                    href={`/article/${a.slug}`}
                    className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="font-editorial mt-[2px] text-[28px] font-bold leading-none text-accent/10">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">{a.category}</span>
                      <p className="mt-1 text-[13.5px] font-semibold leading-[1.4] text-fg transition-colors duration-200 group-hover:text-accent line-clamp-2">
                        {a.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter inline */}
            <div className="rounded-[16px] border border-accent/15 bg-accent-surface p-6">
              <p className="font-editorial text-[17px] font-bold text-fg">Don&apos;t miss a story</p>
              <p className="mt-1.5 text-[13px] leading-[1.6] text-fg-secondary">The best crypto stories, delivered daily.</p>
              <form className="mt-4 space-y-2.5">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full rounded-[10px] border border-border bg-bg px-3.5 py-2.5 text-[13px] text-fg placeholder-fg-muted outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
                <button className="w-full rounded-[10px] bg-accent py-2.5 text-[13px] font-bold text-white transition-all duration-200 hover:bg-accent-light active:scale-[0.98]">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
