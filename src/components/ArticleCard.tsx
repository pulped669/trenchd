import Link from "next/link";
import { Article } from "@/lib/articles";

export function ArticleCardLarge({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
              {article.category}
            </span>
            <span className="text-[11px] text-fg-muted">{article.readTime} read</span>
          </div>
          <h3 className="mt-3 text-[17px] font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
            {article.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-fg-secondary line-clamp-2">
            {article.excerpt}
          </p>
          <p className="mt-3 text-[11px] text-fg-muted">{article.date}</p>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCardSmall({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group flex gap-4">
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-accent">{article.category}</span>
          <span className="text-[11px] text-fg-muted">{article.readTime}</span>
        </div>
        <h4 className="mt-1 text-[14px] font-semibold leading-snug text-fg transition-colors group-hover:text-accent line-clamp-2">
          {article.title}
        </h4>
        <p className="mt-1 text-[11px] text-fg-muted">{article.date}</p>
      </div>
    </Link>
  );
}
