# trenchd

Crypto news site (Next.js 16) plus **Radar**: a tool that watches pump.fun, DexScreener and crypto Twitter, detects which narratives are live, and has Claude pitch coins to launch into them.

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY at minimum
npm run dev                  # site on :3000, radar at /radar
```

## Radar

```
sources ──► narrative engine ──► Claude ──► ideas + launch kits
pump.fun     terms, clustering,    optional web news scan,
DexScreener  heat, phase           structured idea output
X / CT
your notes
```

**1. Sources** (`src/lib/radar/sources/`). Each one fails on its own without taking the others down.

| Source | Key | What it pulls |
|---|---|---|
| pump.fun | none | newest ~150 launches, most recently traded, live streams, king of the hill |
| DexScreener | none | latest token profiles and boosts (Solana), enriched with mcap/volume |
| X / CT | `X_BEARER_TOKEN` or `TWITTERAPI_IO_KEY` | keyword searches, watched accounts, trends |
| Your notes | none | whatever you paste: one line per thing you're seeing on the timeline |
| News scan | `ANTHROPIC_API_KEY` | Claude web search for what's going viral, run before ideas |

**2. Narrative engine** (`src/lib/radar/signals.ts`) is deterministic, with no LLM. It pulls words, bigrams and tickers out of every item, scores each one by recency-weighted heat (market cap, replies and graduation for launches; engagement for posts), and clusters terms that describe the same items. Each narrative then gets a phase:

| Phase | Meaning | Typical play |
|---|---|---|
| emerging | attention but ≤2 coins | first mover |
| heating | launches accelerating, no winner | sharper name/angle |
| running | $300K+ runner still drawing launches | derivative / sequel |
| saturated | 25+ launches | distinct angle only, or skip |
| cooling | nothing new for a while | skip |

Narratives seen on several kinds of source (launches *and* posts *and* listings) get a score boost.

**3. Ideas** (`src/lib/radar/ideas.ts`): Claude gets the top narratives with their evidence and returns structured ideas. Each one has a name, ticker, play type, why-now with numbers, timing, saturation risk, conviction, and a launch kit (pump.fun description, image prompt, launch post). It also returns a list of narratives to stay away from. Tickers already used by live coins in a narrative are flagged, because exact clones read as fakes.

### Use it

- **Dashboard:** `/radar`. It auto-refreshes every 60s. Click a narrative to see its coins, posts and taken tickers, and use the side panel to generate ideas.
- **API:** `GET /api/radar[?fresh=1]` returns narratives (free). `POST /api/radar/ideas` with `{ notes?, style?, count?, newsScan? }` returns ideas (spends credits).
- **CLI:**
  ```bash
  npm run radar                                   # narratives table
  npm run radar -- --ideas --news --count 6       # + news scan + ideas
  npm run radar -- --ideas --notes "elon posted a hamster in a suit"
  npm run radar -- --json > radar.json
  ```

### Access

`/radar` and `/api/radar/*` sit behind HTTP Basic auth when `RADAR_PASSWORD` is set (`src/proxy.ts`). In production they're disabled without one unless you set `RADAR_PUBLIC=1`, so a public deploy can't burn your Anthropic credits.

### Caveats

- The pump.fun adapter uses the undocumented `frontend-api-v3` API that pump.fun's own site calls. It can change or rate-limit without notice; set `PUMPFUN_API_BASE`, or swap the adapter for an indexer (Moralis, Bitquery, Helius) or the PumpPortal websocket.
- With no X key, CT signal comes only from your pasted notes and the news scan.
- Ideas aren't advice. Most launches go to zero.

### Tests

```bash
npm test
```
