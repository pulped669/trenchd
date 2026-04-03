"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

function CopyCA({ ca }: { ca: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-[10px] border border-border bg-bg-secondary px-3 py-2 text-[12px] font-mono text-fg-secondary transition-all duration-200 hover:border-accent/30 hover:text-fg"
    >
      <span className="truncate max-w-[180px] sm:max-w-[320px]">{ca}</span>
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0 text-green-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const article = ARTICLES.find((a) => a.slug === slug);
  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-[15px] text-fg-muted">Article not found.</p>
          <Link href="/" className="mt-3 inline-block text-[13px] font-medium text-accent hover:underline">
            &larr; Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[740px] px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] font-medium text-fg-muted">
        <Link href="/" className="transition-colors hover:text-accent">Home</Link>
        <svg viewBox="0 0 16 16" className="h-3 w-3 text-fg-muted/30"><path fill="currentColor" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"/></svg>
        <Link href={`/?cat=${article.category}`} className="transition-colors hover:text-accent">{article.category}</Link>
      </nav>

      {/* Category + Meta */}
      <div className="mt-8 flex items-center gap-3">
        <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
          {article.category}
        </span>
        <span className="text-[12px] text-fg-muted">{article.date}</span>
        <span className="text-fg-muted/30">&bull;</span>
        <span className="text-[12px] text-fg-muted">{article.readTime} read</span>
      </div>

      {/* Title */}
      <h1 className="font-editorial mt-5 text-[clamp(1.7rem,5vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.02em] text-fg">
        {article.title}
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-[16px] leading-[1.7] text-fg-secondary">
        {article.excerpt}
      </p>

      {/* CA + Share */}
      <div className="mt-6 flex items-center justify-between border-y border-border py-4 gap-4">
        {article.ca ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-fg-muted shrink-0">CA</span>
            <CopyCA ca={article.ca} />
          </div>
        ) : (
          <span className="text-[12px] font-medium text-fg-muted">By trenchd Staff</span>
        )}
        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(`https://trenchd.com/article/${article.slug}`)}&text=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-secondary text-fg-muted transition-all duration-200 hover:bg-accent-surface hover:text-accent"
          aria-label="Share on X"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </a>
      </div>

      {/* Hero image */}
      <div className="mt-6 sm:mt-8 overflow-hidden rounded-[12px] sm:rounded-[16px]" style={{ boxShadow: "var(--shadow-lg)" }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover"
          style={{ aspectRatio: "16/9" }}
        />
      </div>

      {/* Body */}
      <article className="mt-8 sm:mt-10 space-y-5 sm:space-y-6 text-[15px] sm:text-[16px] leading-[1.8] sm:leading-[1.9] text-fg-secondary">
        {article.body ? (
          article.body.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>{article.excerpt}</p>
        )}
      </article>

      {/* Related */}
      <section className="mt-12 sm:mt-16 border-t border-border pt-8 sm:pt-10">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-fg-muted">Keep Reading</h2>
        <div className="mt-5 sm:mt-6 grid gap-5 sm:gap-6 grid-cols-2 sm:grid-cols-3">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/article/${a.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-[12px]" style={{ boxShadow: "var(--shadow-sm)" }}>
                <img
                  src={a.image}
                  alt={a.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">{a.category}</span>
                <h3 className="font-editorial mt-1.5 text-[13px] sm:text-[14.5px] font-bold leading-[1.3] text-fg transition-colors duration-200 group-hover:text-accent line-clamp-2">
                  {a.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
