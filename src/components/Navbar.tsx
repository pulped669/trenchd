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
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-emerald-400">
            trenchd
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Feed
            </Link>
            <Link
              href="/create"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Create Token
            </Link>
          </div>
        </div>
        <WalletMultiButton className="!bg-emerald-600 !rounded-lg !h-10 !text-sm hover:!bg-emerald-500 !transition-colors" />
      </div>
    </nav>
  );
}
