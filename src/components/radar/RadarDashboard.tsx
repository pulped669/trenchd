"use client";

import { useCallback, useEffect, useState } from "react";
import type { Idea } from "@/lib/radar/ideas";
import type { IdeasResponse } from "@/lib/radar/run";
import type { CoinRef, Narrative, Phase, RadarReport, SourceStatus } from "@/lib/radar/types";

// ── formatting ───────────────────────────────────────────────────────────────

function usd(n?: number): string {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
}

function age(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function compact(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

const PHASE: Record<Phase, { label: string; cls: string; hint: string }> = {
  emerging: {
    label: "Emerging",
    cls: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    hint: "Attention but few coins yet: the first-mover window",
  },
  heating: {
    label: "Heating",
    cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    hint: "Launches accelerating, no clear winner yet",
  },
  running: {
    label: "Running",
    cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    hint: "A runner exists and is still pulling launches: derivative window",
  },
  saturated: {
    label: "Saturated",
    cls: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    hint: "25+ launches already: late",
  },
  cooling: { label: "Cooling", cls: "bg-bg-secondary text-fg-muted", hint: "Activity fading" },
};

const PLAY_LABEL: Record<Idea["play"], string> = {
  first_mover: "First mover",
  derivative: "Derivative",
  sequel: "Sequel",
  inverse: "Inverse",
  character: "Character",
  mashup: "Mashup",
  culture: "Culture",
};

const TIMING_LABEL: Record<Idea["timing"], string> = {
  launch_now: "Launch now",
  next_few_hours: "Next few hours",
  today: "Today",
  watch: "Watch",
};

const SECTION_LABEL = "text-[11px] font-extrabold uppercase tracking-[0.15em] text-fg-muted";

// ── small pieces ─────────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="shrink-0 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-fg-secondary transition-colors hover:border-accent/40 hover:text-fg"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function SourceChip({ s }: { s: SourceStatus }) {
  const dot = !s.configured ? "bg-fg-muted" : s.ok ? "bg-emerald-500" : "bg-rose-500";
  const detail = !s.configured ? s.note ?? "Not configured" : s.ok ? s.note : s.error;
  return (
    <span
      title={detail}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] text-fg-secondary"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="font-semibold text-fg">{s.label}</span>
      <span className="text-fg-muted">
        {!s.configured ? "off" : s.ok ? `${s.count} items` : "error"}
      </span>
    </span>
  );
}

function PhaseBadge({ phase }: { phase: Phase }) {
  const p = PHASE[phase];
  return (
    <span title={p.hint} className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${p.cls}`}>
      {p.label}
    </span>
  );
}

function CoinLine({ c }: { c: CoinRef }) {
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-bg-secondary"
    >
      {c.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote token art from arbitrary hosts
        <img src={c.imageUrl} alt="" className="h-7 w-7 shrink-0 rounded-md bg-bg-secondary object-cover" loading="lazy" />
      ) : (
        <span className="h-7 w-7 shrink-0 rounded-md bg-bg-secondary" />
      )}
      <span className="min-w-0 flex-1 truncate text-[13px] text-fg">
        {c.name} <span className="text-fg-muted">${c.symbol}</span>
      </span>
      <span className="shrink-0 text-[12px] tabular-nums text-fg-secondary">{usd(c.marketCapUsd)}</span>
      <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-fg-muted">{age(c.ageMinutes)}</span>
    </a>
  );
}

function NarrativeRow({ n, rank, open, onToggle }: { n: Narrative; rank: number; open: boolean; onToggle: () => void }) {
  const top = n.topCoins[0];
  return (
    <li className="rounded-[14px] border border-border bg-card" style={{ boxShadow: "var(--shadow-sm)" }}>
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-4 p-4 text-left" aria-expanded={open}>
        <span className="font-editorial w-7 shrink-0 pt-0.5 text-[22px] font-bold leading-none text-accent/30">{rank}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-editorial text-[18px] font-bold leading-tight text-fg [overflow-wrap:anywhere]">{n.label}</span>
            <PhaseBadge phase={n.phase} />
          </span>
          <span className="mt-1.5 block text-[12.5px] leading-[1.6] text-fg-secondary">
            {plural(n.launches.total, "launch", "launches")}
            {n.launches.last1h ? ` · ${n.launches.last1h} in last hour` : ""}
            {n.posts.total ? ` · ${plural(n.posts.total, "post")} (${compact(n.posts.engagement)} eng.)` : ""}
            {top ? ` · top $${top.symbol} ${usd(top.marketCapUsd)}` : ""}
          </span>
          <span className="mt-2 flex flex-wrap gap-1.5">
            {n.terms.slice(0, 5).map((t) => (
              <span key={t} className="rounded-md bg-bg-secondary px-2 py-0.5 text-[11px] text-fg-secondary">
                {t}
              </span>
            ))}
            {n.sources.map((s) => (
              <span key={s} className="rounded-md border border-border px-2 py-0.5 text-[11px] text-fg-muted">
                {s}
              </span>
            ))}
          </span>
        </span>
        <span className="flex w-16 shrink-0 flex-col items-end gap-1.5 pt-1">
          <span className="text-[13px] font-bold tabular-nums text-fg">{n.score}</span>
          <span className="h-1 w-full overflow-hidden rounded-full bg-bg-secondary">
            <span className="block h-full rounded-full bg-accent" style={{ width: `${n.score}%` }} />
          </span>
        </span>
      </button>
      {open && (
        <div className="grid gap-5 border-t border-border p-4 sm:grid-cols-2">
          <div>
            <p className={`${SECTION_LABEL} mb-2`}>Top coins</p>
            {n.topCoins.length ? (
              n.topCoins.map((c, i) => <CoinLine key={c.url ?? i} c={c} />)
            ) : (
              <p className="text-[13px] text-fg-muted">No coins yet: nobody has launched this.</p>
            )}
          </div>
          <div>
            <p className={`${SECTION_LABEL} mb-2`}>Chatter</p>
            {n.samplePosts.length ? (
              <ul className="space-y-2">
                {n.samplePosts.map((p, i) => (
                  <li key={i} className="text-[13px] leading-[1.55] text-fg-secondary [overflow-wrap:anywhere]">
                    <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-fg">
                      {p.text}
                    </a>
                    <span className="mt-0.5 block text-[11px] text-fg-muted">
                      {p.author ? `@${p.author} · ` : `${p.source} · `}
                      {compact(p.engagement)} eng. · {age(p.ageMinutes)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-fg-muted">No posts matched. Launch-only signal.</p>
            )}
            {n.takenTickers.length > 0 && (
              <>
                <p className={`${SECTION_LABEL} mb-2 mt-4`}>Taken tickers</p>
                <p className="text-[12px] leading-[1.7] text-fg-muted [overflow-wrap:anywhere]">{n.takenTickers.map((t) => `$${t}`).join("  ")}</p>
              </>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

function KitField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted">{label}</span>
        <CopyButton text={value} />
      </div>
      <p className="whitespace-pre-wrap rounded-lg bg-bg-secondary px-3 py-2 text-[12.5px] leading-[1.55] text-fg-secondary [overflow-wrap:anywhere]">{value}</p>
    </div>
  );
}

function IdeaCard({ idea, rank }: { idea: Idea; rank: number }) {
  return (
    <article className="flex min-w-0 flex-col rounded-[16px] border border-border bg-card p-5 [overflow-wrap:anywhere]" style={{ boxShadow: "var(--shadow-md)" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
            #{rank} · {PLAY_LABEL[idea.play]} · {idea.narrative}
          </p>
          <h3 className="font-editorial mt-1.5 text-[22px] font-bold leading-tight text-fg">{idea.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[14px] font-semibold text-fg-secondary">${idea.ticker}</span>
            <CopyButton text={idea.ticker} label="Copy ticker" />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[22px] font-bold leading-none tabular-nums text-fg">
            {idea.conviction}
            <span className="text-[13px] text-fg-muted">/10</span>
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted">conviction</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-accent-surface px-2.5 py-0.5 text-[11px] font-semibold text-accent">{TIMING_LABEL[idea.timing]}</span>
        <span className="rounded-full bg-bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-fg-secondary">
          {idea.saturationRisk} saturation risk
        </span>
      </div>

      <p className="mt-4 text-[14px] font-semibold leading-[1.5] text-fg">{idea.pitch}</p>
      <p className="mt-2 text-[13px] leading-[1.65] text-fg-secondary">{idea.whyNow}</p>

      {idea.evidence.length > 0 && (
        <ul className="mt-3 space-y-1">
          {idea.evidence.map((e, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] leading-[1.55] text-fg-secondary">
              <span className="text-accent">›</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <KitField label="pump.fun description" value={idea.launchKit.description} />
        <KitField label="Image prompt" value={idea.launchKit.imagePrompt} />
        <KitField label="Launch post" value={idea.launchKit.firstPost} />
      </div>

      {idea.risks.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted">Risks</p>
          <ul className="mt-1.5 space-y-1">
            {idea.risks.map((r, i) => (
              <li key={i} className="text-[12.5px] leading-[1.55] text-fg-muted">
                – {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

type GenState =
  | { status: "idle" }
  | { status: "running"; startedAt: number }
  | { status: "error"; error: string }
  | { status: "done"; data: IdeasResponse };

async function fetchReport(fresh: boolean): Promise<RadarReport> {
  const res = await fetch(`/api/radar${fresh ? "?fresh=1" : ""}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Radar request failed (${res.status})`);
  return (await res.json()) as RadarReport;
}

export default function RadarDashboard() {
  const [report, setReport] = useState<RadarReport | null>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [notes, setNotes] = useState("");
  const [style, setStyle] = useState("");
  const [count, setCount] = useState(6);
  const [newsScan, setNewsScan] = useState(true);
  const [gen, setGen] = useState<GenState>({ status: "idle" });
  const [elapsed, setElapsed] = useState(0);

  const refresh = useCallback((fresh: boolean) => {
    setRefreshing(true);
    fetchReport(fresh)
      .then((r) => {
        setReport(r);
        setLoadError(null);
      })
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchReport(false)
      .then((r) => !cancelled && setReport(r))
      .catch((e: Error) => !cancelled && setLoadError(e.message))
      .finally(() => !cancelled && setRefreshing(false));
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh(false);
    }, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [refresh]);

  const running = gen.status === "running";
  useEffect(() => {
    if (gen.status !== "running") return;
    const startedAt = gen.startedAt;
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [gen]);

  async function generate() {
    setElapsed(0);
    setGen({ status: "running", startedAt: Date.now() });
    try {
      const res = await fetch("/api/radar/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes, style, count, newsScan }),
      });
      const body = await res.json().catch(() => ({ error: `Request failed (${res.status})` }));
      if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
      const data = body as IdeasResponse;
      setReport(data.report);
      setGen({ status: "done", data });
    } catch (e) {
      setGen({ status: "error", error: (e as Error).message });
    }
  }

  const narratives = report?.narratives ?? [];
  const updated = report ? new Date(report.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={SECTION_LABEL}>trenchd radar</p>
          <h1 className="font-editorial mt-2 text-[clamp(1.7rem,3.5vw,2.4rem)] font-bold leading-[1.1] text-fg">
            What the trenches are into right now
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-[1.65] text-fg-secondary">
            Narratives detected across fresh pump.fun launches, DexScreener promos and CT, ranked by heat, with the
            launch window each one is in.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {updated && <span className="text-[12px] text-fg-muted">Updated {updated}</span>}
          <button
            type="button"
            onClick={() => refresh(true)}
            disabled={refreshing}
            className="rounded-[10px] border border-border bg-card px-4 py-2 text-[13px] font-semibold text-fg transition-colors hover:border-accent/40 disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      {report && (
        <div className="mt-5 flex flex-wrap gap-2">
          {report.sources.map((s) => (
            <SourceChip key={s.id} s={s} />
          ))}
        </div>
      )}

      {loadError && (
        <p className="mt-5 rounded-[12px] border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-[13px] text-rose-700 dark:text-rose-300">
          {loadError}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        {/* Narratives */}
        <section className="order-2 min-w-0 flex-1 lg:order-1">
          <h2 className={`${SECTION_LABEL} mb-4`}>Narratives</h2>
          {!report && refreshing && <p className="text-[14px] text-fg-muted">Scanning sources…</p>}
          {report && narratives.length === 0 && (
            <div className="rounded-[14px] border border-dashed border-border p-6 text-[14px] leading-[1.65] text-fg-secondary">
              No narratives detected. {report.itemCount === 0 ? "Every source came back empty or failed. Check the source chips above for errors." : "Not enough overlap between items yet."}{" "}
              Pasting what you&apos;re seeing on the timeline into the panel still lets you generate ideas.
            </div>
          )}
          <ol className="space-y-3">
            {(showAll ? narratives : narratives.slice(0, 12)).map((n, i) => (
              <NarrativeRow
                key={n.key}
                n={n}
                rank={i + 1}
                open={expanded === n.key}
                onToggle={() => setExpanded(expanded === n.key ? null : n.key)}
              />
            ))}
          </ol>
          {narratives.length > 12 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-[13px] font-semibold text-accent hover:text-accent-light"
            >
              {showAll ? "Show top 12" : `Show all ${narratives.length}`}
            </button>
          )}
        </section>

        {/* Sidebar */}
        <aside className="contents lg:order-2 lg:block lg:w-[340px] lg:shrink-0">
          <div className="contents lg:sticky lg:top-[72px] lg:block lg:space-y-8">
            <div className="order-1 rounded-[16px] border border-accent/15 bg-accent-surface p-5">
              <p className="font-editorial text-[18px] font-bold text-fg">Generate launch ideas</p>
              <p className="mt-1 text-[12.5px] leading-[1.6] text-fg-secondary">
                Claude reads the radar and pitches coins to ride what&apos;s live, with a launch kit for each.
              </p>
              <label className="mt-4 block text-[11px] font-bold uppercase tracking-[0.1em] text-fg-muted" htmlFor="radar-notes">
                What you&apos;re seeing on CT
              </label>
              <textarea
                id="radar-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder={"One per line, e.g.\nelon posted a hamster in a suit\neveryone's pfp is a frog today"}
                className="mt-1.5 w-full resize-y rounded-[10px] border border-border bg-bg px-3 py-2.5 text-[13px] text-fg placeholder-fg-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
              <label className="mt-3 block text-[11px] font-bold uppercase tracking-[0.1em] text-fg-muted" htmlFor="radar-style">
                Style steer (optional)
              </label>
              <input
                id="radar-style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="absurdist animals, clean brandable…"
                className="mt-1.5 w-full rounded-[10px] border border-border bg-bg px-3 py-2.5 text-[13px] text-fg placeholder-fg-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-[12.5px] text-fg-secondary">
                  <input type="checkbox" checked={newsScan} onChange={(e) => setNewsScan(e.target.checked)} className="accent-[var(--accent)]" />
                  Scan the web for viral news
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  aria-label="Number of ideas"
                  className="rounded-[8px] border border-border bg-bg px-2 py-1.5 text-[12.5px] text-fg"
                >
                  {[3, 6, 9, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} ideas
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={generate}
                disabled={running}
                className="mt-4 w-full rounded-[10px] bg-accent py-3 text-[13px] font-bold text-white transition-all hover:bg-accent-light active:scale-[0.98] disabled:opacity-60"
              >
                {running ? `Thinking… ${elapsed}s` : "Generate ideas"}
              </button>
              {running && (
                <p className="mt-2 text-[11.5px] leading-[1.5] text-fg-muted">
                  {newsScan ? "Scanning the web, then thinking. " : ""}Usually 30–120 seconds.
                </p>
              )}
              {gen.status === "error" && (
                <p className="mt-3 text-[12.5px] leading-[1.5] text-rose-700 dark:text-rose-300">{gen.error}</p>
              )}
            </div>

            {report && report.freshLaunches.length > 0 && (
              <div className="order-3">
                <h2 className={`${SECTION_LABEL} mb-3`}>Fresh on pump.fun</h2>
                <div className="-mx-2">
                  {report.freshLaunches.map((c, i) => (
                    <CoinLine key={c.url ?? i} c={c} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Ideas */}
      {gen.status === "done" && (
        <section className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-editorial text-[26px] font-bold text-fg">Launch ideas</h2>
            <span className="text-[11px] text-fg-muted">
              {gen.data.model} · {compact(gen.data.usage.inputTokens)} in / {compact(gen.data.usage.outputTokens)} out tokens
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-[15px] leading-[1.7] text-fg-secondary">{gen.data.ideas.marketRead}</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {gen.data.ideas.ideas.map((idea, i) => (
              <IdeaCard key={`${idea.ticker}:${i}`} idea={idea} rank={i + 1} />
            ))}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {gen.data.ideas.avoid.length > 0 && (
              <div>
                <h3 className={`${SECTION_LABEL} mb-3`}>Stay away from</h3>
                <ul className="space-y-2.5">
                  {gen.data.ideas.avoid.map((a, i) => (
                    <li key={i} className="text-[13px] leading-[1.6] text-fg-secondary">
                      <span className="font-semibold text-fg">{a.narrative}</span> — {a.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(gen.data.news.length > 0 || gen.data.newsError) && (
              <div>
                <h3 className={`${SECTION_LABEL} mb-3`}>News scan</h3>
                {gen.data.newsError && <p className="text-[13px] text-fg-muted">News scan failed: {gen.data.newsError}</p>}
                <ul className="space-y-2.5 [overflow-wrap:anywhere]">
                  {gen.data.news.map((n, i) => (
                    <li key={i} className="text-[13px] leading-[1.6] text-fg-secondary">
                      {n.url ? (
                        <a href={n.url} target="_blank" rel="noreferrer" className="hover:text-fg">
                          {n.topic}
                        </a>
                      ) : (
                        n.topic
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="mt-10 text-[11.5px] leading-[1.6] text-fg-muted">
            Ideas, not advice. Most launches go to zero; size accordingly.
          </p>
        </section>
      )}
    </main>
  );
}
