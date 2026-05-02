import { getHub } from "@/lib/signaling";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { userId?: string; action?: string } | null;
  if (!body || !body.userId) return Response.json({ error: "missing userId" }, { status: 400 });
  const hub = getHub();
  if (!hub.clients.has(body.userId)) {
    return Response.json({ error: "not connected" }, { status: 404 });
  }
  if (body.action === "next") {
    hub.next(body.userId);
  } else if (body.action === "leave") {
    hub.endSession(body.userId);
    hub.removeFromQueue(body.userId);
  } else {
    hub.enqueueWaiting(body.userId);
  }
  return Response.json({ ok: true, waiting: hub.queue.length, online: hub.clients.size });
}
