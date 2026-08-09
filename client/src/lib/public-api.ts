import type { PublicBundle } from "@/lib/content";

export class PublicApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`/api/public${path}`);
  if (!res.ok) {
    throw new PublicApiError(res.status, `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function listResource<T>(path: string): Promise<T[]> {
  return getJson<T[]>(path);
}

export function getPublicBundle(): Promise<PublicBundle> {
  return getJson<PublicBundle>("/bundle");
}

export async function getSingleton<T>(path: string): Promise<T | undefined> {
  try {
    return await getJson<T>(path);
  } catch (err) {
    if (err instanceof PublicApiError && err.status === 404) return undefined;
    throw err;
  }
}

export async function getResource<T>(path: string): Promise<T | undefined> {
  try {
    return await getJson<T>(path);
  } catch (err) {
    if (err instanceof PublicApiError && err.status === 404) return undefined;
    throw err;
  }
}

export type InquiryInput = {
  name: string;
  email: string;
  message: string;
};

export async function submitInquiry(input: InquiryInput): Promise<void> {
  const res = await fetch("/api/public/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!res.ok) {
    throw new PublicApiError(res.status, `Inquiry failed (${res.status})`);
  }
}
