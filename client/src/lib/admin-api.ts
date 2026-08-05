const BASE = "/api/admin";

let loggingOut = false;

export async function handleUnauthorized(): Promise<void> {
  if (loggingOut) return;
  loggingOut = true;
  try {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
  } finally {
    window.location.assign(new URL("/login", window.location.origin).toString());
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function adminRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  if (res.status === 401) {
    await handleUnauthorized();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T | { error?: { message?: string } }) : undefined;

  if (!res.ok) {
    const message =
      (data as { error?: { message?: string } })?.error?.message ??
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export const adminApi = {
  list: <T>(resource: string) => adminRequest<T[]>("GET", resource),
  get: <T>(resource: string) => adminRequest<T>("GET", resource),
  create: <T>(resource: string, data: unknown) => adminRequest<T>("POST", resource, data),
  update: <T>(resource: string, id: string, data: unknown) =>
    adminRequest<T>("PUT", `${resource}/${id}`, data),
  remove: <T>(resource: string, id: string) => adminRequest<T>("DELETE", `${resource}/${id}`),
  upsert: <T>(resource: string, data: unknown) => adminRequest<T>("PUT", resource, data)
};
