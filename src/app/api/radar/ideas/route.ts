import { errorMessage } from "@/lib/radar/http";
import { RadarError, runIdeas, type IdeasRequest } from "@/lib/radar/run";

// Thinking + an optional web search pass can take a couple of minutes.
export const maxDuration = 300;

// POST /api/radar/ideas  { notes?, style?, count?, newsScan?, fresh? }
export async function POST(request: Request) {
  let body: IdeasRequest;
  try {
    body = (await request.json()) as IdeasRequest;
  } catch {
    return Response.json({ error: "Body must be JSON." }, { status: 400 });
  }
  const req: IdeasRequest = {
    notes: typeof body.notes === "string" ? body.notes.slice(0, 5_000) : undefined,
    style: typeof body.style === "string" ? body.style.slice(0, 200) : undefined,
    count: typeof body.count === "number" ? body.count : undefined,
    newsScan: body.newsScan === true,
    fresh: body.fresh === true,
  };
  try {
    return Response.json(await runIdeas(req), { headers: { "cache-control": "no-store" } });
  } catch (err) {
    const status = err instanceof RadarError ? err.status : 500;
    if (status === 500) console.error("[radar] idea generation failed", err);
    return Response.json({ error: errorMessage(err) }, { status });
  }
}
