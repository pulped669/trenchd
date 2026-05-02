"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Logo from "./Logo";

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
  const [statusText, setStatusText] = useState("Ready when you are.");
  const [stats, setStats] = useState({ online: 0, waiting: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [unread, setUnread] = useState(0);

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
  const chatOpenRef = useRef(false);

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
    if (m.from === "them" && !chatOpenRef.current) {
      setUnread((u) => u + 1);
    }
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
        setStatusText("Connected.");
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
    setStatusText("Searching…");
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
      setStatusText("Matched. Connecting…");
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
    setChatOpen(false);
    setStatus("idle");
    setStatusText("Ready when you are.");
  }, [teardownPeer]);

  const start = useCallback(async () => {
    setStatus("requesting-media");
    setStatusText("Asking for camera & mic…");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      setStatus("error");
      setStatusText("Camera & mic access is required to chat.");
      return;
    }
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    setStatus("connecting");
    setStatusText("Connecting…");

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

  const toggleChat = useCallback(() => {
    setChatOpen((v) => {
      const next = !v;
      chatOpenRef.current = next;
      if (next) setUnread(0);
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
  }, [messages, chatOpen]);

  const live = status !== "idle" && status !== "error";
  const showStartScreen = !live;

  const overlayHeadline = useMemo(() => {
    switch (status) {
      case "requesting-media":
        return "Checking your camera…";
      case "connecting":
        return "Hooking into the network…";
      case "waiting":
        return "Searching the trench…";
      case "matched":
        return "Match found.";
      case "in-call":
        return "";
      default:
        return "";
    }
  }, [status]);

  return (
    <div className="chat-root">
      <header className="chat-top">
        <Link href="/" className="brand chat-brand" aria-label="trench'd home">
          <span className="brand-mark" aria-hidden />
          <Logo className="brand-text" />
        </Link>
        <div className="chat-stats" aria-live="polite">
          <span className="stats-pulse" />
          <span>
            <strong>{stats.online.toLocaleString()}</strong> online
          </span>
          <span className="stats-sep">·</span>
          <span>
            <strong>{stats.waiting.toLocaleString()}</strong> waiting
          </span>
        </div>
        <Link href="/" onClick={stop} className="chat-exit" aria-label="Exit">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
      </header>

      <div className="stage">
        {showStartScreen ? (
          <StartScreen status={status} statusText={statusText} onStart={start} />
        ) : (
          <>
            <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            {status !== "in-call" && (
              <div className="searching">
                <div className="searching-pulse" />
                <p className="searching-headline">{overlayHeadline}</p>
                <p className="searching-sub">{statusText}</p>
              </div>
            )}
            <div className="local-pip">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`local-video ${cameraOff ? "is-off" : ""}`}
              />
              {cameraOff && <div className="local-off">camera off</div>}
            </div>
          </>
        )}
      </div>

      {live && (
        <div className="dock" role="toolbar" aria-label="Call controls">
          <DockButton
            label={muted ? "Unmute" : "Mute"}
            pressed={muted}
            onClick={toggleMute}
            icon={muted ? <IconMicOff /> : <IconMic />}
          />
          <DockButton
            label={cameraOff ? "Camera on" : "Camera off"}
            pressed={cameraOff}
            onClick={toggleCamera}
            icon={cameraOff ? <IconCamOff /> : <IconCam />}
          />
          <button className="dock-next" onClick={skip} aria-label="Next stranger">
            <IconSkip />
            <span>Next</span>
          </button>
          <DockButton
            label={chatOpen ? "Close chat" : "Open chat"}
            pressed={chatOpen}
            onClick={toggleChat}
            icon={
              <span className="dock-chat-icon">
                <IconChat />
                {unread > 0 && !chatOpen && <span className="dock-badge">{Math.min(unread, 9)}</span>}
              </span>
            }
          />
          <DockButton label="End" onClick={stop} icon={<IconHang />} variant="danger" />
        </div>
      )}

      <aside className={`drawer ${chatOpen ? "is-open" : ""}`} aria-hidden={!chatOpen}>
        <div className="drawer-head">
          <div>
            <p className="drawer-title">Side chat</p>
            <p className="drawer-sub">Messages stay between you two.</p>
          </div>
          <button className="drawer-close" onClick={toggleChat} aria-label="Close">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="drawer-messages" ref={chatScrollRef}>
          {messages.length === 0 && (
            <div className="drawer-empty">
              <p>{status === "in-call" ? "Type below to break the ice." : "Match first, then chat."}</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`bubble from-${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form
          className="drawer-input"
          onSubmit={(e) => {
            e.preventDefault();
            sendChat(draft);
          }}
        >
          <input
            type="text"
            placeholder={status === "in-call" ? "Say something…" : "Waiting for match…"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={status !== "in-call"}
            maxLength={500}
          />
          <button type="submit" disabled={status !== "in-call" || !draft.trim()} aria-label="Send">
            <IconSend />
          </button>
        </form>
      </aside>
      {chatOpen && <button className="drawer-scrim" onClick={toggleChat} aria-label="Close chat" />}
    </div>
  );
}

function DockButton({
  label,
  icon,
  onClick,
  pressed,
  variant,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  variant?: "danger";
}) {
  return (
    <button
      className={`dock-btn ${variant ? `dock-btn-${variant}` : ""}`}
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

function StartScreen({
  status,
  statusText,
  onStart,
}: {
  status: Status;
  statusText: string;
  onStart: () => void;
}) {
  return (
    <div className="start-card">
      <div className="start-orb" aria-hidden />
      <p className="start-eyebrow">
        <span /> No sign-up · Stranger video
      </p>
      <h1 className="start-title">Drop into the trench.</h1>
      <p className="start-sub">
        Hit start to share your camera and get matched with a random stranger. Skip anytime.
      </p>
      <button className="start-btn" onClick={onStart} disabled={status === "requesting-media"}>
        {status === "requesting-media" ? "Asking permission…" : "Start chatting"}
      </button>
      {status === "error" && <p className="start-error">{statusText}</p>}
      <p className="start-fine">By starting you agree to the house rules. Be 18+. Be decent.</p>
    </div>
  );
}

function IconMic() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M12 4a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Zm7 9a7 7 0 0 1-14 0M12 20v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function IconMicOff() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M9 9v4a3 3 0 0 0 5 2.2M15 11.2V7a3 3 0 0 0-5.7-1.3M19 13a7 7 0 0 1-11.5 5.4M12 20v3M4 4l16 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function IconCam() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M3 7.5A1.5 1.5 0 0 1 4.5 6h11A1.5 1.5 0 0 1 17 7.5v9A1.5 1.5 0 0 1 15.5 18h-11A1.5 1.5 0 0 1 3 16.5v-9Zm14 2 4-2.5v11l-4-2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function IconCamOff() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M17 9.5 21 7v10l-4-2.5M3 7.5A1.5 1.5 0 0 1 4.5 6H10M17 12v4.5A1.5 1.5 0 0 1 15.5 18h-11A1.5 1.5 0 0 1 3 16.5V11M4 4l16 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function IconSkip() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M5 5l9 7-9 7V5Zm12 0v14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function IconChat() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function IconHang() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M3 14c4-4 14-4 18 0l-2 2-3-1.5V12c-2.5-1-5.5-1-8 0v2.5L5 16l-2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  );
}
function IconSend() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        d="M4 12 21 4l-4 17-4-7-9-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
