"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Solana", href: "/?cat=Solana" },
  { label: "Bankr", href: "/?cat=Bankr" },
  { label: "Blue Chips", href: "/?cat=Blue+Chips" },
  { label: "X", href: "/?cat=X" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[17px] font-extrabold tracking-tight text-fg">
            trenchd
          </Link>
          <div className="hidden h-5 w-px bg-border md:block" />
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-md px-2.5 py-1 text-[13px] text-fg-secondary transition-colors hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
