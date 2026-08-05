import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE } from "@/lib/session";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PATH);
  const isLoginRoute = pathname === LOGIN_PATH;
  const hasSession = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (isAdminRoute && !hasSession) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && hasSession) {
    const adminUrl = new URL(ADMIN_PATH, request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"]
};
