import { use } from "react";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

function ShareBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-bg-secondary text-fg-muted transition-all duration-200 hover:bg-accent-surface hover:text-accent">
      {children}
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
  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 4);

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
    <main className="mx-auto max-w-[720px] px-5 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] font-medium text-fg-muted">
        <Link href="/" className="transition-colors hover:text-accent">Home</Link>
        <svg viewBox="0 0 16 16" className="h-3 w-3 text-fg-muted/40"><path fill="currentColor" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"/></svg>
        <Link href={`/?cat=${article.category}`} className="transition-colors hover:text-accent">{article.category}</Link>
      </nav>

      {/* Hero image */}
      <div className="mt-6 overflow-hidden rounded-[16px]" style={{ boxShadow: "var(--shadow-lg)" }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover"
          style={{ aspectRatio: "16/9" }}
        />
      </div>

      {/* Title */}
      <h1 className="mt-7 text-[clamp(1.5rem,4.5vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.025em] text-fg">
        {article.title}
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-[15px] leading-[1.7] text-fg-secondary">
        {article.excerpt}
      </p>

      {/* Meta + Share */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-border pb-6">
        <span className="rounded-full bg-accent-surface px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.06em] text-accent">
          {article.category}
        </span>
        <span className="text-[12px] font-medium text-fg-muted">trenchd Staff</span>
        <span className="text-[12px] text-fg-muted">{article.date}</span>
        <span className="text-fg-muted/30">&bull;</span>
        <span className="text-[12px] text-fg-muted">{article.readTime} read</span>

        <div className="ml-auto flex items-center gap-1.5">
          <ShareBtn>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </ShareBtn>
          <ShareBtn>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614.028.18.042.36.042.52 0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25s.561 1.248 1.25 1.248 1.248-.561 1.248-1.249S9.938 12 9.25 12zm5.5 0c-.687 0-1.248.561-1.248 1.25s.561 1.248 1.249 1.248 1.249-.561 1.249-1.249S15.437 12 14.75 12zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913s2.105-.056 2.961-.913a.361.361 0 000-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73s-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/></svg>
          </ShareBtn>
        </div>
      </div>

      {/* Article body */}
      <article className="mt-8 space-y-5 text-[15.5px] leading-[1.85] text-fg-secondary">
        {article.body ? (
          article.body.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>{article.excerpt}</p>
        )}
      </article>

      {/* Related */}
      <section className="mt-14 border-t border-border pt-8">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-fg-muted">Related Stories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/article/${a.slug}`}
              className="group overflow-hidden rounded-[14px] border border-border bg-card transition-all duration-200 hover:border-accent/15"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-accent">{a.category}</span>
                <h3 className="mt-1.5 text-[13.5px] font-bold leading-[1.35] text-fg transition-colors duration-200 group-hover:text-accent line-clamp-2">
                  {a.title}
                </h3>
                <span className="mt-2 block text-[11px] text-fg-muted">{a.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
