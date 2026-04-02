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
  title: "trenchd — crypto news & intelligence",
  description:
    "Crypto news, market analysis, and trading intelligence. By Resell Calendar.",
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
            __html: `try{const t=localStorage.getItem("theme"),d=window.matchMedia("(prefers-color-scheme:dark)").matches;if(t==="dark"||(! t&&d))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <footer className="border-t border-border bg-bg">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-bold text-fg">
                  trenchd<span className="text-accent">.</span>
                </p>
                <p className="mt-1 text-[13px] text-fg-muted">
                  Crypto news by{" "}
                  <a
                    href="https://resellcalendar.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Resell Calendar
                  </a>
                </p>
              </div>
              <div className="flex gap-8 text-[13px] text-fg-secondary">
                <div className="space-y-2">
                  <p className="font-semibold text-fg">Sections</p>
                  <a href="/?cat=Market" className="block hover:text-accent">Market</a>
                  <a href="/?cat=DeFi" className="block hover:text-accent">DeFi</a>
                  <a href="/?cat=Bitcoin" className="block hover:text-accent">Bitcoin</a>
                  <a href="/?cat=Ethereum" className="block hover:text-accent">Ethereum</a>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-fg">Company</p>
                  <a href="https://resellcalendar.com" target="_blank" rel="noopener noreferrer" className="block hover:text-accent">Resell Calendar</a>
                  <a href="#" className="block hover:text-accent">Advertise</a>
                  <a href="#" className="block hover:text-accent">Privacy</a>
                  <a href="#" className="block hover:text-accent">Terms</a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-[11px] text-fg-muted">
              &copy; {new Date().getFullYear()} trenchd. A Resell Calendar property.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
