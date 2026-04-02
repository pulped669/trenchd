"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-[15px] font-semibold text-fg">Stay in the loop</h3>
      <p className="mt-1 text-[13px] text-fg-secondary">
        Get the top crypto stories delivered daily. No spam.
      </p>
      {submitted ? (
        <p className="mt-4 text-[13px] font-medium text-accent">
          You&apos;re in. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-fg placeholder-fg-muted outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
