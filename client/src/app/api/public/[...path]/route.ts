import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { API_URL } from "@/lib/config";

const PUBLIC_CACHE_REVALIDATE = 60;
const PUBLIC_CACHE_TAGS = ["public"];

async function handle(request: NextRequest, ctx: RouteContext<"/api/public/[...path]">) {
  const { path } = await ctx.params;

  const isRead = request.method === "GET";
  const body = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)
    ? await request.text()
    : undefined;

  const upstream = await fetch(`${API_URL}/${path.join("/")}`, {
    method: request.method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body,
    ...(isRead
      ? {
          cache: "force-cache",
          next: { revalidate: PUBLIC_CACHE_REVALIDATE, tags: PUBLIC_CACHE_TAGS }
        }
      : { cache: "no-store" })
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" }
  });
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
