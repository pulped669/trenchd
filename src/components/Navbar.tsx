"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan/10 bg-background/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-pixel)] text-[11px] tracking-wider text-cyan transition-all hover:neon-cyan"
        >
          TRENCHD
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#features" className="hidden text-[12px] uppercase tracking-wider text-muted transition-colors hover:text-pink sm:block">
            Features
          </Link>
          <Link href="#strategies" className="hidden text-[12px] uppercase tracking-wider text-muted transition-colors hover:text-pink sm:block">
            Strategies
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
