"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-full bg-white/[0.06]" />
    );
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-foreground backdrop-blur-sm transition-all hover:bg-white/[0.08]"
      >
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-5 w-5 rounded-full"
          />
        )}
        <span className="max-w-[100px] truncate">
          {session.user.name}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("twitter")}
      className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-[13px] font-medium text-foreground backdrop-blur-sm transition-all hover:bg-white/[0.08]"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Sign in
    </button>
  );
}
