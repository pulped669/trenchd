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
          <a href="#rules">Rules</a>
          <a href="#faq">FAQ</a>
        </nav>
        <Link href="/chat" className="topbar-cta">
          Start chatting
        </Link>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">
          <span className="eyebrow-dot" /> Live now · No sign-up
        </p>
        <h1 className="hero-title">
          Talk to a <em>stranger</em>.
          <br />
          One tap.
        </h1>
        <p className="hero-sub">
          Random video chat with someone, somewhere. Skip when you&apos;re done. No accounts, no
          followers, no algorithm — just two people on a call.
        </p>
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

      <section id="rules" className="rules">
        <h2 className="section-title">House rules</h2>
        <ul className="rules-list">
          <li>Be 18+. No exceptions.</li>
          <li>Wear clothes. Stay decent.</li>
          <li>No harassment, no hate. Skip if you don&apos;t vibe.</li>
          <li>Don&apos;t share personal info you wouldn&apos;t shout in a bar.</li>
          <li>Recording without consent is gross. Don&apos;t.</li>
        </ul>
      </section>

      <section id="faq" className="faq">
        <h2 className="section-title">Quick answers</h2>
        <div className="faq-grid">
          <Faq q="Is it free?" a="Yes. No account, no paywall, no ads (yet)." />
          <Faq
            q="Where does the video go?"
            a="Straight to the other person. Video and audio are negotiated peer-to-peer with WebRTC. Our server only relays the handshake."
          />
          <Faq
            q="Can I use my phone?"
            a="Yes. trench'd works on any modern Chrome, Edge, Firefox, or Safari (16.4+) with a camera."
          />
          <Faq
            q="Someone broke the rules?"
            a="Hit Next to drop the connection. Reporting is shipping next."
          />
        </div>
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
          <span className="footer-dot">·</span>
          <a href="#rules">Rules</a>
          <span className="footer-dot">·</span>
          <a href="#faq">FAQ</a>
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

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="faq-item">
      <p className="faq-q">{q}</p>
      <p className="faq-a">{a}</p>
    </div>
  );
}
