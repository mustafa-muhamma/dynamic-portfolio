import { API_URL } from "@/lib/config";
import type { PublicBundle } from "@/lib/content";
import { PublicApiError } from "@/lib/public-api";

const PUBLIC_BUNDLE_REVALIDATE = 60;
const PUBLIC_BUNDLE_TAGS = ["public"];

export async function getPublicBundleCached(): Promise<PublicBundle> {
  const res = await fetch(`${API_URL}/bundle`, {
    cache: "force-cache",
    next: { revalidate: PUBLIC_BUNDLE_REVALIDATE, tags: PUBLIC_BUNDLE_TAGS },
    signal: AbortSignal.timeout(15_000)
  });
  if (!res.ok) {
    throw new PublicApiError(res.status, `Request failed (${res.status})`);
  }
  return (await res.json()) as PublicBundle;
}
