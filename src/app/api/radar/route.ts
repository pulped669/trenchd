import type { NextRequest } from "next/server";
import { getReport } from "@/lib/radar/run";

// GET /api/radar[?fresh=1] — current narratives. Hits only free data sources, no LLM.
export async function GET(request: NextRequest) {
  const fresh = request.nextUrl.searchParams.get("fresh") === "1";
  const report = await getReport({ fresh });
  return Response.json(report, { headers: { "cache-control": "no-store" } });
}
