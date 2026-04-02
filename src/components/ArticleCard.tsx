import Link from "next/link";
import { Article } from "@/lib/articles";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="aspect-[2/1] sm:aspect-[2.5/1]">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          {article.category}
        </span>
        <h2 className="mt-3 max-w-2xl text-[clamp(1.25rem,3vw,1.75rem)] font-bold leading-tight text-white">
          {article.title}
        </h2>
        <p className="mt-2 hidden max-w-xl text-[14px] leading-relaxed text-white/70 sm:block line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-3 text-[12px] text-white/50">
          <span>{article.date}</span>
          <span>&middot;</span>
          <span>{article.readTime} read</span>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCardMedium({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-accent/20">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-accent">
              {article.category}
            </span>
            <span className="text-[11px] text-fg-muted">{article.readTime}</span>
          </div>
          <h3 className="mt-2 text-[15px] font-bold leading-snug text-fg transition-colors group-hover:text-accent line-clamp-2">
            {article.title}
          </h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-fg-secondary line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCardRow({ article, index }: { article: Article; index: number }) {
  return (
    <Link href={`/article/${article.slug}`} className="group flex gap-4 py-4 border-b border-border last:border-0">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-bg-secondary text-[12px] font-bold text-fg-muted">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-accent">{article.category}</span>
          <span className="text-[11px] text-fg-muted">{article.date}</span>
        </div>
        <h4 className="mt-1 text-[14px] font-semibold leading-snug text-fg transition-colors group-hover:text-accent line-clamp-2">
          {article.title}
        </h4>
      </div>
      <div className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
        <img src={article.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
    </Link>
  );
}
