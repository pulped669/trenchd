import { NextResponse, type NextRequest } from "next/server";

// The radar spends Anthropic credits on every idea run, so it sits behind
// HTTP Basic auth whenever RADAR_PASSWORD is set (any username works).
// In production it refuses to serve at all without a password, unless you
// opt in explicitly with RADAR_PUBLIC=1.
export function proxy(request: NextRequest) {
  const password = process.env.RADAR_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "production" && process.env.RADAR_PUBLIC !== "1") {
      return new NextResponse("Radar is disabled: set RADAR_PASSWORD (or RADAR_PUBLIC=1).", { status: 503 });
    }
    return NextResponse.next();
  }

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      if (decoded.slice(decoded.indexOf(":") + 1) === password) return NextResponse.next();
    } catch {
      // fall through to the challenge
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "www-authenticate": 'Basic realm="trenchd radar", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/radar/:path*", "/api/radar/:path*"],
};
