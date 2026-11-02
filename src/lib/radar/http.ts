const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export class HttpError extends Error {
  constructor(
    public status: number,
    public url: string,
    body: string,
  ) {
    super(`HTTP ${status} from ${new URL(url).host}${body ? `: ${body.slice(0, 160)}` : ""}`);
  }
}

/** GET JSON with a timeout. Throws HttpError on non-2xx, Error on timeout/network failure. */
export async function getJson<T = unknown>(
  url: string,
  init: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeoutMs ?? 12_000);
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json", "user-agent": BROWSER_UA, ...init.headers },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new HttpError(res.status, url, await res.text().catch(() => ""));
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if (controller.signal.aborted) throw new Error(`Timed out fetching ${new URL(url).host}`);
    const cause = (err as { cause?: { code?: string } }).cause?.code;
    throw new Error(`Network error fetching ${new URL(url).host}${cause ? ` (${cause})` : ""}`);
  } finally {
    clearTimeout(timer);
  }
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Loose field readers for third-party JSON we don't control. */
export const read = {
  str(v: unknown): string | undefined {
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  },
  num(v: unknown): number | undefined {
    const n = typeof v === "string" ? Number(v) : v;
    return typeof n === "number" && Number.isFinite(n) ? n : undefined;
  },
  /** Accepts ms epoch, s epoch, ISO strings, and Twitter's "Tue Dec 10 07:00:30 +0000 2024". */
  time(v: unknown): number | undefined {
    if (typeof v === "number" && Number.isFinite(v)) return v < 1e12 ? v * 1000 : v;
    if (typeof v !== "string" || !v) return undefined;
    if (/^\d+$/.test(v)) return read.time(Number(v));
    const t = Date.parse(v);
    if (Number.isFinite(t)) return t;
    // "Tue Dec 10 07:00:30 +0000 2024" → "Dec 10 2024 07:00:30 +0000"
    const m = v.match(/^\w{3} (\w{3}) (\d{1,2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{4}) (\d{4})$/);
    if (m) {
      const t2 = Date.parse(`${m[1]} ${m[2]} ${m[5]} ${m[3]} ${m[4]}`);
      if (Number.isFinite(t2)) return t2;
    }
    return undefined;
  },
};
