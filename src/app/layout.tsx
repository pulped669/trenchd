import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "trenchd — crypto news & market intelligence",
  description:
    "Breaking crypto news, market analysis, DeFi updates, and trading intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("theme"),d=window.matchMedia("(prefers-color-scheme:dark)").matches;if(t==="dark"||(!t&&d))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        {/* Newsletter */}
        <div className="border-t border-border bg-bg-secondary/50">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center">
            <p className="text-[17px] font-bold text-fg">Stay ahead of the market</p>
            <p className="mt-1 text-[13px] text-fg-secondary">Top crypto stories delivered to your inbox daily. No spam.</p>
            <form className="mx-auto mt-5 flex max-w-sm gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-lg border border-border bg-bg px-3 py-2.5 text-[13px] text-fg placeholder-fg-muted outline-none transition-colors focus:border-accent"
              />
              <button className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <footer className="border-t border-border bg-bg-secondary/50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[17px] font-extrabold text-fg">trenchd</p>
                <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-fg-muted">
                  Crypto news and market intelligence. Breaking stories, deep analysis, and the signals that matter.
                </p>
              </div>
              <div className="flex gap-10 text-[13px]">
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">Sections</p>
                  <a href="/?cat=Market" className="block text-fg-secondary hover:text-accent">Market</a>
                  <a href="/?cat=DeFi" className="block text-fg-secondary hover:text-accent">DeFi</a>
                  <a href="/?cat=Bitcoin" className="block text-fg-secondary hover:text-accent">Bitcoin</a>
                  <a href="/?cat=Ethereum" className="block text-fg-secondary hover:text-accent">Ethereum</a>
                  <a href="/?cat=NFTs" className="block text-fg-secondary hover:text-accent">NFTs</a>
                </div>
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">More</p>
                  <a href="#" className="block text-fg-secondary hover:text-accent">About</a>
                  <a href="#" className="block text-fg-secondary hover:text-accent">Advertise</a>
                  <a href="#" className="block text-fg-secondary hover:text-accent">Privacy Policy</a>
                  <a href="#" className="block text-fg-secondary hover:text-accent">Terms of Service</a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-[11px] text-fg-muted">
              &copy; {new Date().getFullYear()} trenchd. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
