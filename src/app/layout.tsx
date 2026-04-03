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
  description: "Breaking crypto news, market analysis, and trading intelligence.",
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
        <div className="border-t border-border">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12 sm:py-16 text-center">
            <p className="font-editorial text-[20px] sm:text-[22px] font-bold text-fg">Stay ahead of the market</p>
            <p className="mt-2 text-[13px] sm:text-[14px] text-fg-secondary">Crypto news delivered daily. No spam, ever.</p>
            <form className="mx-auto mt-5 sm:mt-6 flex flex-col sm:flex-row max-w-[380px] gap-2.5">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-[10px] border border-border bg-bg px-4 py-3 text-[13px] text-fg placeholder-fg-muted outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
              <button className="shrink-0 rounded-[10px] bg-accent px-6 py-3 text-[13px] font-bold text-white transition-all duration-200 hover:bg-accent-light active:scale-[0.97]">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-editorial text-[20px] font-bold text-fg">trenchd</p>
                <p className="mt-2 max-w-[280px] text-[13px] leading-[1.65] text-fg-muted">
                  Breaking crypto news, deep analysis, and the signals that matter.
                </p>
              </div>
              <div className="flex gap-12 text-[13px]">
                <div className="space-y-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-fg-muted">Sections</p>
                  <a href="/?cat=Memecoins" className="block text-fg-secondary transition-colors hover:text-accent">Memecoins</a>
                  <a href="/?cat=X" className="block text-fg-secondary transition-colors hover:text-accent">X</a>
                  <a href="/?cat=On-Chain" className="block text-fg-secondary transition-colors hover:text-accent">On-Chain</a>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-fg-muted">Company</p>
                  <a href="#" className="block text-fg-secondary transition-colors hover:text-accent">About</a>
                  <a href="#" className="block text-fg-secondary transition-colors hover:text-accent">Advertise</a>
                  <a href="#" className="block text-fg-secondary transition-colors hover:text-accent">Privacy</a>
                  <a href="#" className="block text-fg-secondary transition-colors hover:text-accent">Terms</a>
                </div>
              </div>
            </div>
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <span className="text-[11px] text-fg-muted">&copy; {new Date().getFullYear()} trenchd</span>
              <a href="#" className="text-fg-muted transition-colors hover:text-fg" aria-label="Twitter">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
