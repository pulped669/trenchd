import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pb-20 pt-24 text-center">
        <span className="inline-block rounded-full bg-green-light px-4 py-1.5 text-sm font-medium text-green-dark">
          Solana Token Launcher
        </span>
        <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
          Launch your token
          <br />
          in the <span className="text-green">trenches</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-gray-text">
          Create and launch fair tokens on Solana with automatic bonding curves.
          No presale. No team allocation. Just launch.
        </p>
        <Link
          href="/create"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-green-dark px-8 text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start a Launch
        </Link>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-border bg-gray-bg">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-foreground">
            How it works
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-light text-lg font-bold text-green-dark">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Create your token
              </h3>
              <p className="mt-2 text-sm text-gray-text">
                Pick a name, ticker, and description. Your token launches
                instantly on a bonding curve.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-light text-lg font-bold text-green-dark">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                People buy in
              </h3>
              <p className="mt-2 text-sm text-gray-text">
                Anyone can buy tokens along the bonding curve. Price rises as
                more tokens are sold.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-light text-lg font-bold text-green-dark">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Graduates to DEX
              </h3>
              <p className="mt-2 text-sm text-gray-text">
                At ~69 SOL market cap, liquidity is automatically deposited to
                Raydium and the token trades freely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground">Ready to launch?</h2>
        <p className="mt-3 text-gray-text">
          It takes less than a minute. Connect your wallet and go.
        </p>
        <Link
          href="/create"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-green-dark px-8 text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          Launch a Token
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-border py-8 text-center text-sm text-gray-text">
        <p>&copy; {new Date().getFullYear()} trenchd. All rights reserved.</p>
      </footer>
    </main>
  );
}
