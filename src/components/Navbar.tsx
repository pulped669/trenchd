"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

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
          <WalletMultiButton className="!bg-white/[0.06] !text-foreground !border !border-white/[0.08] !rounded-full !h-9 !px-5 !text-[13px] !font-medium hover:!bg-white/[0.1] !transition-all !backdrop-blur-sm" />
        </div>
      </div>
    </nav>
  );
}
