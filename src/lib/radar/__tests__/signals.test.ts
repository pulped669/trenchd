// Unit tests for the narrative engine. Inputs here are synthetic fixtures built
// to exercise specific behaviours; they are not real market data.
// Run: npm test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { read } from "../http";
import { analyze, classifyPhase, extractTerms } from "../signals";
import { notesToItems } from "../sources";
import type { SignalItem, Snapshot } from "../types";

const NOW = Date.parse("2026-11-02T12:00:00Z");
const min = (m: number) => NOW - m * 60_000;

let seq = 0;
function launch(name: string, symbol: string, ageMin: number, mcap = 6_000, description = ""): SignalItem {
  seq++;
  return {
    id: `pumpfun:${seq}`,
    source: "pumpfun",
    kind: "launch",
    name,
    symbol,
    text: [name, symbol, description].filter(Boolean).join(" \n "),
    createdAt: min(ageMin),
    marketCapUsd: mcap,
    url: `https://pump.fun/coin/${seq}`,
  };
}

function post(text: string, ageMin: number, engagement: number): SignalItem {
  seq++;
  return { id: `x:${seq}`, source: "x", kind: "post", text, createdAt: min(ageMin), engagement, author: `user${seq}` };
}

function snapshot(items: SignalItem[]): Snapshot {
  return { generatedAt: NOW, items, sources: [] };
}

// Background noise: unrelated one-off launches full of boilerplate.
function noise(n: number): SignalItem[] {
  const words = ["alpha", "zeta", "orbit", "nova", "quartz", "ember", "lumen", "tundra", "vortex", "pixel", "drift", "echo"];
  return Array.from({ length: n }, (_, i) =>
    launch(`${words[i % words.length]}${i}`, `N${i}`, 5 + i, 4_000, "the best community token on solana, join telegram"),
  );
}

describe("extractTerms", () => {
  it("pulls tickers, singularises words, and drops urls, mentions and boilerplate", () => {
    const terms = extractTerms(post("@someone $PENGU penguins are taking over https://t.co/abc join the community", 1, 10));
    assert.ok(terms.has("pengu"), "cashtag");
    assert.equal(terms.get("pengu"), "$PENGU");
    assert.ok(terms.has("penguin"), "plural → singular");
    assert.ok(!terms.has("someone"), "mention stripped");
    assert.ok(!terms.has("community"), "boilerplate stopword");
    assert.ok(![...terms.keys()].some((t) => t.includes("t.co") || t === "abc"), "url stripped");
  });

  it("builds bigrams from adjacent content words", () => {
    const terms = extractTerms(launch("Baby Pengu", "BPENGU", 1));
    assert.ok(terms.has("baby pengu"));
  });
});

describe("analyze", () => {
  it("ranks a cross-source narrative first and links launches with CT posts", () => {
    const items = [
      ...noise(30),
      launch("Pengu", "PENGU", 300, 2_400_000),
      launch("Baby Pengu", "BPENGU", 20, 40_000),
      launch("Pengu Wife", "PWIFE", 12, 9_000),
      launch("Pengu Inu", "PINU", 8, 7_000),
      launch("Pengu Cat", "PCAT", 3, 5_000),
      post("$PENGU is the only chart that matters today", 30, 4_000),
      post("pengu szn. every penguin coin is sending", 10, 1_500),
    ];
    const report = analyze(snapshot(items));
    const top = report.narratives[0];
    assert.match(top.label.toLowerCase(), /pengu/);
    assert.deepEqual(new Set(top.sources), new Set(["pumpfun", "x"]));
    assert.equal(top.score, 100);
    assert.ok(top.launches.total >= 4);
    assert.ok(top.launches.last1h >= 3);
    assert.ok(top.takenTickers.includes("PENGU"));
    assert.equal(top.topCoins[0].symbol, "PENGU", "top coin sorted by market cap");
    assert.equal(top.phase, "running");
  });

  it("surfaces a single pasted note with no launches as an emerging narrative", () => {
    const items = [...noise(20), ...notesToItems("- the pope's cat Leo is all over my timeline", NOW)];
    const report = analyze(snapshot(items));
    const n = report.narratives.find((x) => x.terms.includes("pope"));
    assert.ok(n, `expected a pope narrative, got ${report.narratives.map((x) => x.label).join(", ")}`);
    assert.equal(n.launches.total, 0);
    assert.equal(n.phase, "emerging");
  });

  it("does not turn launch boilerplate into a narrative", () => {
    const report = analyze(snapshot(noise(60)));
    const labels = report.narratives.map((n) => n.label.toLowerCase());
    for (const word of ["community", "solana", "telegram", "best"]) {
      assert.ok(!labels.some((l) => l.includes(word)), `${word} should not be a narrative: ${labels.join(", ")}`);
    }
  });

  it("lists the newest launches first", () => {
    const report = analyze(snapshot([launch("Old", "OLD", 90), launch("Fresh", "FRSH", 1)]));
    assert.equal(report.freshLaunches[0].symbol, "FRSH");
    assert.equal(report.freshLaunches[0].ageMinutes, 1);
  });
});

describe("classifyPhase", () => {
  const base = { launches: { total: 5, last15m: 1, last1h: 3 }, posts: { total: 2, last1h: 1, engagement: 100 }, maxMarketCapUsd: 20_000, lastSeen: NOW };
  it("saturated once 25+ launches pile in", () => {
    assert.equal(classifyPhase({ ...base, launches: { total: 30, last15m: 4, last1h: 12 } }, NOW), "saturated");
  });
  it("cooling when nothing new for 3h", () => {
    assert.equal(classifyPhase({ ...base, lastSeen: NOW - 4 * 3_600_000 }, NOW), "cooling");
  });
  it("running when a 300k+ coin is still drawing launches", () => {
    assert.equal(classifyPhase({ ...base, maxMarketCapUsd: 500_000 }, NOW), "running");
  });
  it("heating on launch velocity without a runner", () => {
    assert.equal(classifyPhase(base, NOW), "heating");
  });
});

describe("read.time", () => {
  it("parses ms, s, ISO and Twitter-style dates", () => {
    assert.equal(read.time(1_700_000_000_000), 1_700_000_000_000);
    assert.equal(read.time(1_700_000_000), 1_700_000_000_000);
    assert.equal(read.time("2024-12-10T07:00:30.000Z"), Date.parse("2024-12-10T07:00:30Z"));
    assert.equal(read.time("Tue Dec 10 07:00:30 +0000 2024"), Date.parse("2024-12-10T07:00:30Z"));
  });
});
