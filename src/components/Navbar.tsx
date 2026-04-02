"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/50 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
            <div className="h-2 w-2 rounded-sm bg-accent" />
          </div>
          trenchd
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#features" className="hidden text-[13px] text-muted transition-colors hover:text-foreground sm:block">
            Features
          </Link>
          <Link href="#strategies" className="hidden text-[13px] text-muted transition-colors hover:text-foreground sm:block">
            Strategies
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
