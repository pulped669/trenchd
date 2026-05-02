import { getHub } from "@/lib/signaling";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  from?: string;
  to?: string;
  kind?: "signal" | "chat";
  payload?: unknown;
  text?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body || !body.from || !body.to || !body.kind) {
    return Response.json({ error: "missing fields" }, { status: 400 });
  }
  const hub = getHub();
  if (body.kind === "signal") {
    hub.relaySignal(body.from, body.to, body.payload);
  } else if (body.kind === "chat") {
    const text = (body.text || "").toString().slice(0, 500);
    if (text) hub.relayChat(body.from, body.to, text);
  } else {
    return Response.json({ error: "unknown kind" }, { status: 400 });
  }
  return Response.json({ ok: true });
}
