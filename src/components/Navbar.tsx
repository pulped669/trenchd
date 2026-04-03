"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Memecoins", href: "/?cat=Memecoins" },
  { label: "X", href: "/?cat=X" },
  { label: "On-Chain", href: "/?cat=On-Chain" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-2xl backdrop-saturate-[1.8]">
      <div className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group">
            <span className="font-editorial text-[20px] sm:text-[22px] font-bold text-fg transition-colors group-hover:text-accent">
              trenchd
            </span>
          </Link>
          <nav className="hidden items-center gap-1.5 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-[14px] font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:text-fg md:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" d="M4 8h16M4 16h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-border px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-fg transition-colors hover:bg-bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="h-px bg-border" />
      </div>
    </header>
  );
}
