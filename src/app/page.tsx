"use client";

import { useState } from "react";
import { ARTICLES, CATEGORIES } from "@/lib/articles";
import { ArticleCardLarge, ArticleCardSmall } from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = ARTICLES.filter((a) => a.featured);
  const filtered =
    activeCategory === "All"
      ? ARTICLES.filter((a) => !a.featured)
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Crypto news & intelligence
        </h1>
        <p className="mt-2 text-[15px] text-fg-secondary">
          Market moves, protocol updates, and alpha — curated by{" "}
          <a
            href="https://resellcalendar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Resell Calendar
          </a>
          .
        </p>
      </section>

      {/* Featured */}
      <section className="mb-12">
        <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-wider text-fg-muted">
          Top Picks
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((article) => (
            <ArticleCardLarge key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Category filter + articles */}
      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex-1">
          {/* Category pills */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-accent text-white"
                    : "bg-bg-secondary text-fg-secondary hover:text-fg"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Article list */}
          <div className="space-y-5">
            {filtered.length === 0 && (
              <p className="py-12 text-center text-[14px] text-fg-muted">
                No articles in this category yet.
              </p>
            )}
            {filtered.map((article) => (
              <ArticleCardSmall key={article.slug} article={article} />
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-full shrink-0 space-y-5 lg:w-72">
          <Newsletter />

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-[15px] font-semibold text-fg">Trending</h3>
            <div className="mt-3 space-y-3">
              {ARTICLES.slice(0, 4).map((a, i) => (
                <a
                  key={a.slug}
                  href={`/article/${a.slug}`}
                  className="flex items-start gap-3 group"
                >
                  <span className="mt-0.5 text-[18px] font-bold text-fg-muted/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] font-medium leading-snug text-fg-secondary transition-colors group-hover:text-accent line-clamp-2">
                    {a.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-accent/15 bg-accent/5 p-6">
            <p className="text-[13px] font-semibold text-accent">From Resell Calendar</p>
            <p className="mt-2 text-[13px] leading-relaxed text-fg-secondary">
              Track sneaker drops, electronics restocks, and reselling opportunities.
            </p>
            <a
              href="https://resellcalendar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[12px] font-semibold text-accent hover:underline"
            >
              Visit resellcalendar.com &rarr;
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
