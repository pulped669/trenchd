"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/60 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          trenchd<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/create"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:block"
          >
            Launch
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
