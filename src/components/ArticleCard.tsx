import Link from "next/link";
import { Article } from "@/lib/articles";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group relative block h-full overflow-hidden rounded-[20px]">
      <div className="h-full min-h-[320px] sm:min-h-[400px]">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 transition-opacity duration-500 group-hover:from-black/90" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
        <span className="inline-block rounded-full bg-white/15 px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm">
          {article.category}
        </span>
        <h2 className="mt-3.5 max-w-lg text-[clamp(1.35rem,2.8vw,1.85rem)] font-extrabold leading-[1.18] tracking-[-0.025em] text-white">
          {article.title}
        </h2>
        <p className="mt-2.5 hidden max-w-md text-[14px] leading-[1.65] text-white/55 sm:block line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-3.5 flex items-center gap-2 text-[11px] font-medium text-white/35">
          <span>{article.date}</span>
          <span className="text-white/20">&bull;</span>
          <span>{article.readTime} read</span>
        </div>
      </div>
    </Link>
  );
}

export function SecondaryCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group relative block h-full overflow-hidden rounded-[16px]">
      <div className="h-full min-h-[190px]">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="inline-block rounded-full bg-white/15 px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm">
          {article.category}
        </span>
        <h3 className="mt-2.5 text-[15px] font-bold leading-[1.25] tracking-[-0.01em] text-white line-clamp-2">
          {article.title}
        </h3>
        <div className="mt-2 text-[11px] font-medium text-white/35">
          {article.date}
        </div>
      </div>
    </Link>
  );
}

export function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-5 py-5 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-accent-surface px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] text-accent">
            {article.category}
          </span>
          <span className="text-[11px] text-fg-muted">{article.readTime}</span>
        </div>
        <h3 className="mt-2 text-[15px] font-bold leading-[1.35] tracking-[-0.01em] text-fg transition-colors duration-200 group-hover:text-accent">
          {article.title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-[1.6] text-fg-secondary line-clamp-2">
          {article.excerpt}
        </p>
        <span className="mt-2.5 block text-[11px] font-medium text-fg-muted">{article.date}</span>
      </div>
      <div className="hidden h-[88px] w-[132px] shrink-0 overflow-hidden rounded-[12px] sm:block" style={{ boxShadow: "var(--shadow-sm)" }}>
        <img
          src={article.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
      </div>
    </Link>
  );
}
