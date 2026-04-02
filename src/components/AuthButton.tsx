"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-20 animate-pulse rounded-lg bg-white/[0.04]" />
    );
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface-light px-3.5 py-1.5 text-[13px] font-medium text-foreground transition-all hover:bg-surface-hover"
      >
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-4 w-4 rounded-full"
          />
        )}
        <span className="max-w-[80px] truncate">{session.user.name}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("twitter")}
      className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-accent-light"
    >
      Get Started
    </button>
  );
}
