import { getHub, type ServerEvent } from "@/lib/signaling";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeUserId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") || makeUserId();
  const hub = getHub();

  const encoder = new TextEncoder();
  let pingTimer: ReturnType<typeof setInterval> | null = null;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: ServerEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          // controller may have closed; ignore.
        }
      };

      hub.register({
        userId,
        enqueue: send,
        close: () => {
          if (closed) return;
          closed = true;
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        },
        partner: null,
        preferences: { wantsCamera: true },
      });

      send({ type: "ready", userId });
      hub.broadcastStats();

      pingTimer = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          /* ignore */
        }
      }, 20_000);

      const abort = () => {
        if (closed) return;
        closed = true;
        if (pingTimer) clearInterval(pingTimer);
        hub.unregister(userId);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      request.signal.addEventListener("abort", abort);
    },
    cancel() {
      closed = true;
      if (pingTimer) clearInterval(pingTimer);
      hub.unregister(userId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
