"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Solana", href: "/?cat=Solana" },
  { label: "Bankr", href: "/?cat=Bankr" },
  { label: "Blue Chips", href: "/?cat=Blue+Chips" },
  { label: "X", href: "/?cat=X" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-2xl backdrop-saturate-[1.8]">
      <div className="mx-auto flex h-[52px] max-w-[1120px] items-center justify-between px-5">
        <div className="flex items-center gap-7">
          <Link href="/" className="group flex items-baseline gap-0.5">
            <span className="text-[16px] font-extrabold tracking-[-0.03em] text-fg transition-colors group-hover:text-accent">
              trenchd
            </span>
          </Link>
          <nav className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative px-3 py-1 text-[13px] font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="h-px bg-border" />
      </div>
    </header>
  );
}
