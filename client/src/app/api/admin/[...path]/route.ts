import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { API_URL } from "@/lib/config";
import { getSessionToken } from "@/lib/session";

async function handle(request: NextRequest, ctx: RouteContext<"/api/admin/[...path]">) {
  const { path } = await ctx.params;
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)
    ? await request.text()
    : undefined;

  const upstream = await fetch(`${API_URL}/admin/${path.join("/")}`, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body,
    cache: "no-store"
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" }
  });
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
