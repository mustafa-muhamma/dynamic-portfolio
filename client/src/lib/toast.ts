import { toast } from "sonner";

import { ApiError } from "@/lib/admin-api";

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

export function toastError(err: unknown, fallback: string): void {
  if (err instanceof ApiError && err.status === 401) return;
  toast.error(getErrorMessage(err, fallback));
}
