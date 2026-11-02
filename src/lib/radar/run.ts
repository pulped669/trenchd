// One entry point shared by the API routes and the CLI.

import Anthropic from "@anthropic-ai/sdk";
import { radarConfig } from "./config";
import { errorMessage } from "./http";
import { generateIdeas, IdeaGenerationError, newsToItems, scanNews, type IdeasResult, type NewsLine } from "./ideas";
import { analyze } from "./signals";
import { collectSnapshot, notesToItems } from "./sources";
import type { RadarReport } from "./types";

export async function getReport(opts: { fresh?: boolean; notes?: string; news?: NewsLine[] } = {}): Promise<RadarReport> {
  const snapshot = await collectSnapshot({ fresh: opts.fresh });
  const now = Date.now();
  const extraItems = [...notesToItems(opts.notes ?? "", now), ...newsToItems(opts.news ?? [], now)];
  return analyze(snapshot, { now, extraItems });
}

export interface IdeasRequest {
  notes?: string;
  style?: string;
  count?: number;
  newsScan?: boolean;
  fresh?: boolean;
}

export interface IdeasResponse {
  report: RadarReport;
  ideas: IdeasResult;
  news: NewsLine[];
  newsError?: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
}

export class RadarError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function runIdeas(req: IdeasRequest): Promise<IdeasResponse> {
  if (!radarConfig().claude.configured) {
    throw new RadarError("Set ANTHROPIC_API_KEY to generate ideas.", 400);
  }
  try {
    let news: NewsLine[] = [];
    let newsError: string | undefined;
    if (req.newsScan) {
      // A failed news scan shouldn't block ideas from the rest of the radar.
      try {
        news = await scanNews();
      } catch (err) {
        newsError = errorMessage(err);
      }
    }
    const report = await getReport({ fresh: req.fresh, notes: req.notes, news });
    const { result, model, usage } = await generateIdeas(report, {
      count: req.count,
      style: req.style,
      notes: req.notes,
      news,
    });
    return { report, ideas: result, news, newsError, model, usage };
  } catch (err) {
    if (err instanceof IdeaGenerationError) throw new RadarError(err.message, 422);
    if (err instanceof Anthropic.AuthenticationError) throw new RadarError("Anthropic rejected the API key.", 401);
    if (err instanceof Anthropic.RateLimitError) throw new RadarError("Anthropic rate limit hit; try again shortly.", 429);
    if (err instanceof Anthropic.APIError) throw new RadarError(`Anthropic API error ${err.status ?? ""}: ${err.message}`, 502);
    throw err;
  }
}
