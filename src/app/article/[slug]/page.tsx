import { use } from "react";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

function ShareButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button className="flex items-center gap-1.5 rounded-md bg-bg-secondary px-3 py-1.5 text-[11px] font-medium text-fg-secondary transition-colors hover:text-fg">
      {children}
      {label}
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
          <p className="text-fg-muted">Article not found.</p>
          <Link href="/" className="mt-2 inline-block text-[13px] text-accent hover:underline">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-fg-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href={`/?cat=${article.category}`} className="hover:text-accent">{article.category}</Link>
      </nav>

      {/* Hero image */}
      <div className="mt-5 overflow-hidden rounded-2xl">
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover"
          style={{ aspectRatio: "16/9" }}
        />
      </div>

      {/* Title */}
      <h1 className="mt-6 text-[clamp(1.5rem,4vw,2.2rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-fg">
        {article.title}
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-[16px] text-fg-secondary">
        {article.excerpt}
      </p>

      {/* Meta + Share */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-border pb-5">
        <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
          {article.category}
        </span>
        <span className="text-[12px] text-fg-muted">By trenchd Staff</span>
        <span className="text-[12px] text-fg-muted">{article.date}</span>
        <span className="text-[12px] text-fg-muted">&middot; {article.readTime} read</span>

        <div className="ml-auto flex items-center gap-2">
          <ShareButton label="Twitter">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </ShareButton>
          <ShareButton label="Reddit">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 0-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
            </svg>
          </ShareButton>
          <ShareButton label="Facebook">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </ShareButton>
        </div>
      </div>

      {/* Article body */}
      <article className="mt-8 space-y-5 text-[16px] leading-[1.85] text-fg-secondary">
        <p>
          {article.excerpt}
        </p>
        <h2 className="text-[20px] font-bold text-fg">Key Points</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Market conditions are shifting rapidly as institutional interest grows</li>
          <li>On-chain data supports the thesis, with accumulation patterns emerging</li>
          <li>Traders should watch key support and resistance levels over the coming days</li>
        </ul>
        <p>
          This is a developing story and will be updated as more information becomes available. Full article content coming soon as the trenchd platform expands.
        </p>
      </article>

      {/* Newsletter */}
      <div className="mt-10 rounded-2xl border border-border bg-bg-secondary/50 p-6 text-center">
        <p className="text-[15px] font-semibold text-fg">Enjoy this article?</p>
        <p className="mt-1 text-[13px] text-fg-secondary">Get stories like this delivered to your inbox.</p>
        <form className="mx-auto mt-4 flex max-w-sm gap-2">
          <input
            type="email"
            placeholder="you@email.com"
            className="flex-1 rounded-lg border border-border bg-bg px-3 py-2.5 text-[13px] text-fg placeholder-fg-muted outline-none focus:border-accent"
          />
          <button className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90">
            Subscribe
          </button>
        </form>
      </div>

      {/* Related Articles */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-fg-muted">Related Articles</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/article/${a.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/20"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{a.category}</span>
                <h3 className="mt-1.5 text-[14px] font-bold leading-snug text-fg transition-colors group-hover:text-accent line-clamp-2">
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
