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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          trenchd<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/create"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:block"
          >
            Launch
          </Link>
          <WalletMultiButton className="!bg-accent/10 !text-accent !border !border-accent/20 !rounded-lg !h-9 !text-sm !font-medium hover:!bg-accent/20 !transition-all" />
        </div>
      </div>
    </nav>
  );
}
