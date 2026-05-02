# trench'd

Random 1-on-1 video chat with strangers. Drop in, get matched, skip when you're done. Inspired by Omegle and Monkey, built fresh on Next.js 16 + WebRTC.

## How it works

- **WebRTC peer-to-peer** for video and audio. The server only handles the handshake.
- **Server-Sent Events** stream signaling messages from server to each client.
- **HTTP POST** from client to server to enqueue, send signals, and chat.
- **In-memory match queue** pairs the next two waiting users. First match wins.

```
Client A --SSE-- /api/signal ---+
                                |   getHub() - queue + sessions
Client B --SSE-- /api/signal ---+
   |                          ^
   +-POST /api/match-----------+
   +-POST /api/send  (relays SDP / ICE / chat to peer)
```

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000> in two browser windows (or two devices on your LAN). Hit **Start chatting** in each — you'll be matched.

## Production note

The signaling hub keeps state in `globalThis` so it works inside one Node process. To run multiple replicas, swap `src/lib/signaling.ts` for a Redis pub/sub or similar. WebRTC media still flows peer-to-peer, so the only shared state is the match queue and signal relay.

For production also point at a TURN server in `ICE_SERVERS` (`src/components/VideoChat.tsx`) for users behind symmetric NATs.

## House rules

See `/#rules` on the live site. Be 18+, stay decent, no recording without consent.
