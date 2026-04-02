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
    <nav className="sticky top-0 z-50 border-b border-gray-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-green-dark">
          trenchd
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/create"
            className="hidden text-sm text-gray-text transition-colors hover:text-foreground sm:block"
          >
            Launch Token
          </Link>
          <WalletMultiButton className="!bg-green-dark !rounded-lg !h-10 !text-sm !font-medium hover:!opacity-90 !transition-opacity" />
        </div>
      </div>
    </nav>
  );
}
