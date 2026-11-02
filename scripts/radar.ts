// trenchd radar CLI
//
//   npm run radar                         narratives table
//   npm run radar -- --ideas              + Claude launch ideas
//   npm run radar -- --ideas --news       + web news scan first
//   npm run radar -- --ideas --notes "elon posted a hamster" --count 4 --style "absurdist"
//   npm run radar -- --notes-file notes.txt --json > radar.json
//
// Reads .env.local / .env like the Next.js app does.

import { readFileSync } from "node:fs";
import { getReport, RadarError, runIdeas } from "../src/lib/radar/run";
import type { Narrative, RadarReport } from "../src/lib/radar/types";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // missing file is fine
  }
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

const usd = (n: number) =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : n > 0 ? `$${Math.round(n)}` : "-";

function printReport(r: RadarReport) {
  console.log(`\ntrenchd radar · ${new Date(r.generatedAt).toLocaleString()} · ${r.itemCount} items\n`);
  for (const s of r.sources) {
    const state = !s.configured ? `off (${s.note ?? "not configured"})` : s.ok ? `${s.count} items${s.note ? ` · ${s.note}` : ""}` : `ERROR ${s.error}`;
    console.log(`  ${s.label.padEnd(12)} ${state}`);
  }
  console.log("");
  if (!r.narratives.length) {
    console.log("  No narratives detected.\n");
    return;
  }
  console.log(`  ${"#".padEnd(3)}${"narrative".padEnd(24)}${"phase".padEnd(11)}${"score".padStart(5)}${"launch/1h".padStart(11)}${"posts".padStart(7)}${"top mc".padStart(9)}  top coin`);
  r.narratives.forEach((n: Narrative, i) => {
    const top = n.topCoins[0];
    console.log(
      `  ${String(i + 1).padEnd(3)}${n.label.slice(0, 23).padEnd(24)}${n.phase.padEnd(11)}${String(n.score).padStart(5)}` +
        `${`${n.launches.total}/${n.launches.last1h}`.padStart(11)}${String(n.posts.total).padStart(7)}` +
        `${usd(n.maxMarketCapUsd).padStart(9)}  ${top ? `${top.name} $${top.symbol}` : "-"}`,
    );
  });
  console.log("");
}

async function main() {
  const notesFile = arg("notes-file");
  const notes = [arg("notes"), notesFile ? readFileSync(notesFile, "utf8") : undefined].filter(Boolean).join("\n");
  const json = flag("json");

  if (!flag("ideas")) {
    const report = await getReport({ fresh: true, notes });
    if (json) console.log(JSON.stringify(report, null, 2));
    else printReport(report);
    return;
  }

  if (!json) console.error("Generating ideas… (30–120s)");
  const out = await runIdeas({
    notes,
    style: arg("style"),
    count: arg("count") ? Number(arg("count")) : undefined,
    newsScan: flag("news"),
    fresh: true,
  });
  if (json) {
    console.log(JSON.stringify(out, null, 2));
    return;
  }
  printReport(out.report);
  if (out.news.length) {
    console.log("News scan:");
    for (const n of out.news) console.log(`  · ${n.topic}${n.url ? ` (${n.url})` : ""}`);
    console.log("");
  }
  if (out.newsError) console.log(`News scan failed: ${out.newsError}\n`);
  console.log(`Market read: ${out.ideas.marketRead}\n`);
  out.ideas.ideas.forEach((idea, i) => {
    console.log(`${i + 1}. ${idea.name} ($${idea.ticker})  [${idea.play} · ${idea.timing} · ${idea.conviction}/10 · ${idea.saturationRisk} saturation]`);
    console.log(`   rides: ${idea.narrative}`);
    console.log(`   ${idea.pitch}`);
    console.log(`   why now: ${idea.whyNow}`);
    for (const e of idea.evidence) console.log(`     › ${e}`);
    console.log(`   description: ${idea.launchKit.description}`);
    console.log(`   image: ${idea.launchKit.imagePrompt}`);
    console.log(`   post: ${idea.launchKit.firstPost}`);
    if (idea.risks.length) console.log(`   risks: ${idea.risks.join("; ")}`);
    console.log("");
  });
  if (out.ideas.avoid.length) {
    console.log("Avoid:");
    for (const a of out.ideas.avoid) console.log(`  · ${a.narrative}: ${a.reason}`);
  }
  console.log(`\n${out.model} · ${out.usage.inputTokens} in / ${out.usage.outputTokens} out tokens`);
}

main().catch((err) => {
  console.error(err instanceof RadarError ? `Error: ${err.message}` : err);
  process.exit(1);
});
