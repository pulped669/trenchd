import { ARTICLES } from "@/lib/articles";
import { ArticleHero, ArticleCardMedium, ArticleCardRow } from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  const hero = ARTICLES[0];
  const editorsPicks = ARTICLES.filter((a) => a.featured).slice(0, 3);
  const latest = ARTICLES.filter((a) => !a.featured);
  const mostRead = [...ARTICLES].sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-6">
        <ArticleHero article={hero} />
      </section>

      {/* Editor's Picks */}
      <section className="py-6">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-fg-muted">Editor&apos;s Picks</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editorsPicks.map((a) => (
            <ArticleCardMedium key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* Latest + Sidebar */}
      <section className="flex flex-col gap-8 py-6 lg:flex-row">
        {/* Latest news */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-fg-muted">Latest</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div>
            {latest.map((a, i) => (
              <ArticleCardRow key={a.slug} article={a} index={i} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 space-y-5 lg:w-72">
          {/* Most Read */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-fg-muted">Most Read</h3>
            <div className="mt-3 space-y-4">
              {mostRead.map((a, i) => (
                <a key={a.slug} href={`/article/${a.slug}`} className="group flex items-start gap-3">
                  <span className="mt-0.5 text-[20px] font-extrabold leading-none text-accent/20">
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{a.category}</span>
                    <p className="mt-0.5 text-[13px] font-semibold leading-snug text-fg transition-colors group-hover:text-accent line-clamp-2">
                      {a.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <Newsletter />

          {/* Market Snapshot */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-fg-muted">Market Snapshot</h3>
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Total Market Cap", value: "$3.42T", change: "+1.8%" },
                { label: "24h Volume", value: "$142B", change: "+12.3%" },
                { label: "BTC Dominance", value: "52.4%", change: "-0.3%" },
                { label: "ETH/BTC", value: "0.0387", change: "+0.6%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-[12px]">
                  <span className="text-fg-secondary">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-fg">{item.value}</span>
                    <span className={item.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
