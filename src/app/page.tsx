import Link from "next/link";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="page">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="trench'd home">
          <span className="brand-mark" aria-hidden />
          <Logo className="brand-text" />
        </Link>
        <nav className="topbar-nav">
          <a href="#how">How it works</a>
        </nav>
        <Link href="/chat" className="topbar-cta">
          Start chatting
        </Link>
      </header>

      <section className="hero">
        <h1 className="hero-title">
          Talk to a <em>stranger</em>.
          <br />
          One tap.
        </h1>
        <div className="hero-cta-row">
          <Link href="/chat" className="cta-primary">
            <span className="cta-dot" /> Start chatting
          </Link>
          <a href="#how" className="cta-secondary">
            How it works
          </a>
        </div>
        <div className="hero-stats">
          <Stat label="Encryption" value="P2P · WebRTC" />
          <Stat label="Median match" value="< 3s" />
          <Stat label="Sign-ups" value="zero" />
        </div>
      </section>

      <section id="how" className="info-grid">
        <InfoCard
          step="01"
          title="Hit start"
          body="We ask for your camera and mic, then drop you into the matchmaking queue."
        />
        <InfoCard
          step="02"
          title="Meet a stranger"
          body="The first person waiting gets paired with you. Video flows peer-to-peer."
        />
        <InfoCard
          step="03"
          title="Skip or stay"
          body="Tap Next to bounce, or open the side chat to keep talking. Vibe = up to you."
        />
      </section>

      <section className="bottom-cta">
        <h2 className="bottom-cta-title">Ready to fall in?</h2>
        <p className="bottom-cta-sub">It takes about three seconds.</p>
        <Link href="/chat" className="cta-primary cta-primary-lg">
          <span className="cta-dot" /> Start chatting
        </Link>
      </section>

      <footer className="site-footer">
        <div className="footer-row">
          <Logo className="footer-brand" />
          <p className="footer-tag">Random video chat. Built fresh.</p>
        </div>
        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} trench&apos;d</span>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function InfoCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="info-card">
      <span className="info-step">{step}</span>
      <p className="info-title">{title}</p>
      <p className="info-body">{body}</p>
    </div>
  );
}
