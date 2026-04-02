import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { ArticleHero, SecondaryCard, ArticleRow } from "@/components/ArticleCard";

export default function Home() {
  const hero = ARTICLES[0];
  const secondary = ARTICLES.slice(1, 3);
  const rest = ARTICLES.slice(3);
  const trending = [...ARTICLES].slice(0, 5);

  return (
    <main className="mx-auto max-w-[1120px] px-5">
      {/* Hero grid */}
      <section className="grid gap-3.5 py-7 lg:grid-cols-5 lg:grid-rows-2" style={{ minHeight: 420 }}>
        <div className="lg:col-span-3 lg:row-span-2" style={{ boxShadow: "var(--shadow-hero)" }}>
          <ArticleHero article={hero} />
        </div>
        {secondary.map((a) => (
          <div key={a.slug} className="lg:col-span-2" style={{ boxShadow: "var(--shadow-md)" }}>
            <SecondaryCard article={a} />
          </div>
        ))}
      </section>

      {/* Feed + Sidebar */}
      <section className="flex flex-col gap-12 pb-12 pt-4 lg:flex-row">
        {/* Feed */}
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-4">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-fg-muted">
              Latest
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="divide-y divide-border">
            {rest.map((a) => (
              <ArticleRow key={a.slug} article={a} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-[280px]">
          <div className="lg:sticky lg:top-[68px]">
            {/* Trending */}
            <div className="rounded-[16px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-fg-muted">
                Trending
              </h3>
              <div className="mt-5 space-y-0 divide-y divide-border">
                {trending.map((a, i) => (
                  <Link
                    key={a.slug}
                    href={`/article/${a.slug}`}
                    className="group flex items-start gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <span className="mt-[1px] text-[22px] font-extrabold leading-none tabular-nums text-accent/[0.12]">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-accent">{a.category}</span>
                      <p className="mt-0.5 text-[13px] font-semibold leading-[1.4] text-fg transition-colors duration-200 group-hover:text-accent line-clamp-2">
                        {a.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
