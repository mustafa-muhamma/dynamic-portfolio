import { NextResponse } from "next/server";

import { API_URL } from "@/lib/config";

const passthroughHeaders = [
  "content-type",
  "content-disposition",
  "content-length",
  "cache-control"
] as const;

export async function GET() {
  const upstream = await fetch(`${API_URL}/resume/download`, {
    cache: "no-store",
    redirect: "follow"
  });

  const body = await upstream.arrayBuffer();
  const headers = new Headers();
  for (const name of passthroughHeaders) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new NextResponse(body, { status: upstream.status, headers });
}
