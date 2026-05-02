"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Status =
  | "idle"
  | "requesting-media"
  | "connecting"
  | "waiting"
  | "matched"
  | "in-call"
  | "ended"
  | "error";

type ChatMessage = {
  id: string;
  from: "me" | "them" | "system";
  text: string;
  ts: number;
};

type ServerEvent =
  | { type: "ready"; userId: string }
  | { type: "matched"; peerId: string; sessionId: string; role: "offerer" | "answerer" }
  | { type: "signal"; from: string; payload: SignalPayload }
  | { type: "chat"; from: string; text: string; ts: number }
  | { type: "peer-left"; peerId: string }
  | { type: "stats"; online: number; waiting: number };

type SignalPayload =
  | { kind: "offer"; sdp: RTCSessionDescriptionInit }
  | { kind: "answer"; sdp: RTCSessionDescriptionInit }
  | { kind: "ice"; candidate: RTCIceCandidateInit };

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun.cloudflare.com:3478" },
];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function VideoChat() {
  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState("Tap start to find someone.");
  const [stats, setStats] = useState({ online: 0, waiting: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const userIdRef = useRef<string | null>(null);
  const peerIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const roleRef = useRef<"offerer" | "answerer" | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const nextPeerFnRef = useRef<() => void>(() => {});

  const send = useCallback(async (kind: "signal" | "chat", payload: unknown) => {
    const from = userIdRef.current;
    const to = peerIdRef.current;
    if (!from || !to) return;
    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, kind, ...(kind === "chat" ? { text: payload } : { payload }) }),
    }).catch(() => {});
  }, []);

  const addMessage = useCallback((m: Omit<ChatMessage, "id">) => {
    setMessages((prev) => [...prev, { ...m, id: makeId() }]);
  }, []);

  const teardownPeer = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    pendingIceRef.current = [];
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }, []);

  const setupPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    const local = localStreamRef.current;
    if (local) for (const track of local.getTracks()) pc.addTrack(track, local);

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        send("signal", { kind: "ice", candidate: ev.candidate.toJSON() });
      }
    };

    pc.ontrack = (ev) => {
      const [stream] = ev.streams;
      if (remoteVideoRef.current && stream) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    pc.onconnectionstatechange = () => {
      const st = pc.connectionState;
      if (st === "connected") {
        setStatus("in-call");
        setStatusText("Connected. Say hi.");
      } else if (st === "failed") {
        setStatusText("Connection lost. Skipping…");
        nextPeerFnRef.current();
      } else if (st === "disconnected") {
        setStatusText("Reconnecting…");
      }
    };

    return pc;
  }, [send]);

  const handleSignal = useCallback(
    async (payload: SignalPayload) => {
      let pc = pcRef.current;
      if (!pc) pc = setupPeerConnection();
      if (payload.kind === "offer") {
        await pc.setRemoteDescription(payload.sdp);
        const flushed = pendingIceRef.current.splice(0);
        for (const c of flushed) {
          try {
            await pc.addIceCandidate(c);
          } catch {
            /* ignore */
          }
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await send("signal", { kind: "answer", sdp: answer });
      } else if (payload.kind === "answer") {
        await pc.setRemoteDescription(payload.sdp);
        const flushed = pendingIceRef.current.splice(0);
        for (const c of flushed) {
          try {
            await pc.addIceCandidate(c);
          } catch {
            /* ignore */
          }
        }
      } else if (payload.kind === "ice") {
        if (!pc.remoteDescription) {
          pendingIceRef.current.push(payload.candidate);
        } else {
          try {
            await pc.addIceCandidate(payload.candidate);
          } catch {
            /* ignore */
          }
        }
      }
    },
    [send, setupPeerConnection],
  );

  const startMatching = useCallback(async () => {
    if (!userIdRef.current) return;
    setStatus("waiting");
    setStatusText("Searching for a stranger…");
    setMessages([]);
    await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userIdRef.current }),
    }).catch(() => {});
  }, []);

  const handleMatched = useCallback(
    async (ev: Extract<ServerEvent, { type: "matched" }>) => {
      peerIdRef.current = ev.peerId;
      sessionIdRef.current = ev.sessionId;
      roleRef.current = ev.role;
      setStatus("matched");
      setStatusText("Matched. Connecting video…");
      teardownPeer();
      const pc = setupPeerConnection();
      if (ev.role === "offerer") {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await send("signal", { kind: "offer", sdp: offer });
      }
    },
    [send, setupPeerConnection, teardownPeer],
  );

  const nextPeerInternal = useCallback(() => {
    teardownPeer();
    peerIdRef.current = null;
    sessionIdRef.current = null;
    roleRef.current = null;
    setMessages([]);
    setStatus("waiting");
    setStatusText("Searching for the next stranger…");
    if (userIdRef.current) {
      fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdRef.current, action: "next" }),
      }).catch(() => {});
    }
  }, [teardownPeer]);

  useEffect(() => {
    nextPeerFnRef.current = nextPeerInternal;
  }, [nextPeerInternal]);

  const handlePeerLeft = useCallback(() => {
    addMessage({ from: "system", text: "Stranger disconnected.", ts: Date.now() });
    nextPeerInternal();
  }, [addMessage, nextPeerInternal]);

  const stop = useCallback(() => {
    teardownPeer();
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getTracks()) t.stop();
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    userIdRef.current = null;
    peerIdRef.current = null;
    sessionIdRef.current = null;
    setMessages([]);
    setStatus("idle");
    setStatusText("Tap start to find someone.");
  }, [teardownPeer]);

  const start = useCallback(async () => {
    setStatus("requesting-media");
    setStatusText("Asking for camera & microphone…");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      setStatus("error");
      setStatusText("Camera and microphone access is required.");
      return;
    }
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    setStatus("connecting");
    setStatusText("Connecting to the trench…");

    const es = new EventSource("/api/signal");
    eventSourceRef.current = es;

    es.onmessage = (msgEv) => {
      let event: ServerEvent | null = null;
      try {
        event = JSON.parse(msgEv.data);
      } catch {
        return;
      }
      if (!event) return;
      switch (event.type) {
        case "ready":
          userIdRef.current = event.userId;
          startMatching();
          break;
        case "matched":
          handleMatched(event);
          break;
        case "signal":
          handleSignal(event.payload);
          break;
        case "chat":
          addMessage({ from: "them", text: event.text, ts: event.ts });
          break;
        case "peer-left":
          handlePeerLeft();
          break;
        case "stats":
          setStats({ online: event.online, waiting: event.waiting });
          break;
      }
    };

    es.onerror = () => {
      setStatusText("Connection interrupted. Retrying…");
    };
  }, [addMessage, handleMatched, handlePeerLeft, handleSignal, startMatching]);

  const skip = useCallback(() => {
    if (!userIdRef.current) return;
    nextPeerInternal();
  }, [nextPeerInternal]);

  const sendChat = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !peerIdRef.current) return;
      addMessage({ from: "me", text: trimmed, ts: Date.now() });
      send("chat", trimmed);
      setDraft("");
    },
    [addMessage, send],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      const stream = localStreamRef.current;
      if (stream) for (const t of stream.getAudioTracks()) t.enabled = !next;
      return next;
    });
  }, []);

  const toggleCamera = useCallback(() => {
    setCameraOff((c) => {
      const next = !c;
      const stream = localStreamRef.current;
      if (stream) for (const t of stream.getVideoTracks()) t.enabled = !next;
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (localStreamRef.current) for (const t of localStreamRef.current.getTracks()) t.stop();
      if (pcRef.current) pcRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const live = status !== "idle" && status !== "ended" && status !== "error";

  const headline = useMemo(() => {
    switch (status) {
      case "idle":
        return "Drop in. Meet a stranger.";
      case "requesting-media":
        return "Hold tight — checking your camera.";
      case "connecting":
        return "Hooking you into the network…";
      case "waiting":
        return "Searching the trench…";
      case "matched":
        return "Match found.";
      case "in-call":
        return "You’re live with a stranger.";
      case "ended":
        return "Session ended.";
      case "error":
        return "Something went sideways.";
    }
  }, [status]);

  return (
    <div className="chat-shell">
      <div className="chat-stage">
        <div className="video-grid">
          <div className={`video-tile remote ${status === "in-call" ? "is-live" : ""}`}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="video-el"
            />
            {status !== "in-call" && (
              <div className="video-overlay">
                <div className="overlay-pulse" />
                <p className="overlay-headline">{headline}</p>
                <p className="overlay-sub">{statusText}</p>
              </div>
            )}
            <div className="video-tag">stranger</div>
          </div>
          <div className="video-tile local">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`video-el ${cameraOff ? "is-off" : ""}`}
            />
            {cameraOff && (
              <div className="video-off-pill">camera off</div>
            )}
            <div className="video-tag">you</div>
          </div>
        </div>

        <div className="control-bar">
          {!live && (
            <button className="btn btn-primary" onClick={start}>
              <span className="btn-dot" />
              Start chatting
            </button>
          )}
          {live && (
            <>
              <button className="btn btn-ghost" onClick={toggleMute} aria-pressed={muted}>
                {muted ? "Unmute" : "Mute"}
              </button>
              <button className="btn btn-ghost" onClick={toggleCamera} aria-pressed={cameraOff}>
                {cameraOff ? "Camera on" : "Camera off"}
              </button>
              <button className="btn btn-primary" onClick={skip}>
                Next stranger →
              </button>
              <button className="btn btn-danger" onClick={stop}>
                End
              </button>
              <button
                className="btn btn-ghost mobile-chat-toggle"
                onClick={() => setChatOpen((v) => !v)}
                aria-pressed={chatOpen}
              >
                {chatOpen ? "Hide chat" : "Show chat"}
              </button>
            </>
          )}
        </div>
        <div className="status-line">
          <span className="status-dot" data-state={status} />
          <span>{statusText}</span>
          <span className="status-stats">
            {stats.online.toLocaleString()} online · {stats.waiting.toLocaleString()} waiting
          </span>
        </div>
      </div>

      <aside className={`chat-side ${chatOpen ? "is-open" : ""}`}>
        <div className="chat-header">
          <div>
            <p className="chat-title">Side chat</p>
            <p className="chat-sub">Text the stranger you&apos;re with.</p>
          </div>
        </div>
        <div className="chat-messages" ref={chatScrollRef}>
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Messages stay between the two of you.</p>
              <p className="chat-empty-sub">Once you&apos;re matched, type below.</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble from-${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            sendChat(draft);
          }}
        >
          <input
            type="text"
            placeholder={status === "in-call" ? "Say something…" : "Match first…"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={status !== "in-call"}
            maxLength={500}
          />
          <button type="submit" disabled={status !== "in-call" || !draft.trim()}>
            Send
          </button>
        </form>
      </aside>
    </div>
  );
}
