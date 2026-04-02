"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-20 animate-pulse rounded bg-cyan/5" />
    );
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 rounded border border-cyan/20 bg-cyan/5 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-cyan transition-all hover:bg-cyan/10 hover:glow-cyan"
      >
        {session.user.image && (
          <img src={session.user.image} alt="" className="h-4 w-4 rounded-full" />
        )}
        <span className="max-w-[80px] truncate">{session.user.name}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("twitter")}
      className="glow-pink rounded border border-pink/30 bg-pink/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-pink transition-all hover:bg-pink/20"
    >
      Connect
    </button>
  );
}
