// In-memory signaling hub for trench'd random video chat.
// One Node process keeps a registry of connected clients (SSE writers),
// a waiting queue, and active pair sessions.

type ServerEvent =
  | { type: "ready"; userId: string }
  | { type: "matched"; peerId: string; sessionId: string; role: "offerer" | "answerer" }
  | { type: "signal"; from: string; payload: unknown }
  | { type: "chat"; from: string; text: string; ts: number }
  | { type: "peer-left"; peerId: string }
  | { type: "stats"; online: number; waiting: number };

type Client = {
  userId: string;
  enqueue: (event: ServerEvent) => void;
  close: () => void;
  partner: string | null;
  preferences: { wantsCamera: boolean };
};

declare global {
  var __TRENCHD_HUB__: Hub | undefined;
}

class Hub {
  clients = new Map<string, Client>();
  queue: string[] = [];
  sessions = new Map<string, { a: string; b: string }>();

  register(client: Client) {
    this.clients.set(client.userId, client);
    this.broadcastStats();
  }

  unregister(userId: string) {
    const c = this.clients.get(userId);
    if (!c) return;
    this.removeFromQueue(userId);
    if (c.partner) this.endSession(userId);
    this.clients.delete(userId);
    this.broadcastStats();
  }

  enqueueWaiting(userId: string) {
    const me = this.clients.get(userId);
    if (!me) return;
    if (me.partner) this.endSession(userId);
    if (!this.queue.includes(userId)) this.queue.push(userId);
    this.tryMatch();
    this.broadcastStats();
  }

  removeFromQueue(userId: string) {
    const idx = this.queue.indexOf(userId);
    if (idx >= 0) this.queue.splice(idx, 1);
  }

  private tryMatch() {
    while (this.queue.length >= 2) {
      const a = this.queue.shift()!;
      const b = this.queue.shift()!;
      const ca = this.clients.get(a);
      const cb = this.clients.get(b);
      if (!ca || !cb) continue;
      if (ca.partner || cb.partner) continue;
      const sessionId = `${a}-${b}-${Date.now().toString(36)}`;
      this.sessions.set(sessionId, { a, b });
      ca.partner = b;
      cb.partner = a;
      ca.enqueue({ type: "matched", peerId: b, sessionId, role: "offerer" });
      cb.enqueue({ type: "matched", peerId: a, sessionId, role: "answerer" });
    }
  }

  relaySignal(from: string, to: string, payload: unknown) {
    const target = this.clients.get(to);
    const sender = this.clients.get(from);
    if (!target || !sender || sender.partner !== to || target.partner !== from) return;
    target.enqueue({ type: "signal", from, payload });
  }

  relayChat(from: string, to: string, text: string) {
    const target = this.clients.get(to);
    const sender = this.clients.get(from);
    if (!target || !sender || sender.partner !== to || target.partner !== from) return;
    target.enqueue({ type: "chat", from, text, ts: Date.now() });
  }

  endSession(userId: string) {
    const me = this.clients.get(userId);
    if (!me || !me.partner) return;
    const peer = this.clients.get(me.partner);
    if (peer && peer.partner === userId) {
      peer.partner = null;
      peer.enqueue({ type: "peer-left", peerId: userId });
    }
    me.partner = null;
  }

  next(userId: string) {
    this.endSession(userId);
    this.enqueueWaiting(userId);
  }

  broadcastStats() {
    const stats: ServerEvent = {
      type: "stats",
      online: this.clients.size,
      waiting: this.queue.length,
    };
    for (const c of this.clients.values()) c.enqueue(stats);
  }
}

export function getHub(): Hub {
  if (!globalThis.__TRENCHD_HUB__) globalThis.__TRENCHD_HUB__ = new Hub();
  return globalThis.__TRENCHD_HUB__;
}

export type { ServerEvent, Client };
