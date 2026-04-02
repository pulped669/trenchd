import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { ArticleHero } from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  const hero = ARTICLES[0];
  const secondary = ARTICLES.slice(1, 3);
  const rest = ARTICLES.slice(3);

  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* Hero + Secondary grid */}
      <section className="grid gap-4 py-6 lg:grid-cols-5">
        {/* Main hero — takes 3 cols */}
        <div className="lg:col-span-3">
          <ArticleHero article={hero} />
        </div>

        {/* Secondary stack — takes 2 cols */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {secondary.map((a) => (
            <Link
              key={a.slug}
              href={`/article/${a.slug}`}
              className="group relative flex-1 overflow-hidden rounded-2xl"
            >
              <img
                src={a.image}
                alt={a.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ minHeight: 180 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-light">
                  {a.category}
                </span>
                <h3 className="mt-1.5 text-[15px] font-bold leading-snug text-white line-clamp-2">
                  {a.title}
                </h3>
                <span className="mt-2 block text-[11px] text-white/40">
                  {a.date} &middot; {a.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Feed + Sidebar */}
      <section className="flex flex-col gap-10 py-8 lg:flex-row">
        {/* Feed */}
        <div className="flex-1 min-w-0">
          <h2 className="mb-6 text-[12px] font-bold uppercase tracking-widest text-fg-muted">
            Latest Stories
          </h2>

          <div className="space-y-0">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/article/${a.slug}`}
                className="group flex gap-5 border-b border-border py-5 first:pt-0 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      {a.category}
                    </span>
                    <span className="text-[11px] text-fg-muted">{a.readTime}</span>
                  </div>
                  <h3 className="mt-1.5 text-[16px] font-bold leading-snug text-fg transition-colors group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg-secondary line-clamp-2">
                    {a.excerpt}
                  </p>
                  <span className="mt-2 block text-[11px] text-fg-muted">{a.date}</span>
                </div>
                <div className="hidden h-24 w-36 shrink-0 overflow-hidden rounded-xl sm:block">
                  <img
                    src={a.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 space-y-5 lg:w-64">
          <Newsletter />

          {/* Trending */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-fg-muted">
              Trending
            </h3>
            <div className="mt-4 space-y-4">
              {ARTICLES.slice(0, 5).map((a, i) => (
                <Link
                  key={a.slug}
                  href={`/article/${a.slug}`}
                  className="group flex items-start gap-3"
                >
                  <span className="mt-px text-[18px] font-extrabold leading-none text-accent/15">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-snug text-fg transition-colors group-hover:text-accent line-clamp-2">
                      {a.title}
                    </p>
                    <span className="mt-1 block text-[11px] text-fg-muted">{a.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
