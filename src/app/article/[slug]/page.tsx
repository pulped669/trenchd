import { use } from "react";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const article = ARTICLES.find((a) => a.slug === slug);

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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-[13px] text-fg-muted hover:text-accent">
        &larr; Back
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
          {article.category}
        </span>
        <span className="text-[12px] text-fg-muted">{article.date}</span>
        <span className="text-[12px] text-fg-muted">&middot; {article.readTime} read</span>
      </div>

      <h1 className="mt-4 text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-[-0.02em] text-fg">
        {article.title}
      </h1>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover"
          style={{ aspectRatio: "16/9" }}
        />
      </div>

      <div className="mt-8 text-[15px] leading-[1.8] text-fg-secondary">
        <p>{article.excerpt}</p>
        <p className="mt-6 text-fg-muted">
          Full article content coming soon. This is a preview of the trenchd news platform.
        </p>
      </div>
    </main>
  );
}
