"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "News", href: "/" },
  { label: "Market", href: "/?cat=Market" },
  { label: "DeFi", href: "/?cat=DeFi" },
  { label: "NFTs", href: "/?cat=NFTs" },
  { label: "Bitcoin", href: "/?cat=Bitcoin" },
  { label: "Ethereum", href: "/?cat=Ethereum" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-fg">
            trenchd<span className="text-accent">.</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-fg-secondary transition-colors hover:bg-bg-secondary hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://resellcalendar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-accent px-4 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 sm:block"
          >
            Resell Calendar
          </a>
        </div>
      </div>
    </header>
  );
}
