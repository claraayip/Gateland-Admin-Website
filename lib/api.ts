import { getSessionToken } from "./auth/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  next?: { revalidate?: number | false; tags?: string[] };
}

export async function apiFetch<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<{
  data: T | null;
  error: string | null;
  status: number;
}> {
  const { requireAuth = true, headers = {}, cache, next, ...rest } = options;
  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (requireAuth) {
    const token = await getSessionToken();
    if (token) {
      reqHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const fetchInit: FetchOptions = {
      headers: reqHeaders,
      ...(cache !== undefined ? { cache } : next ? {} : { cache: "no-store" }),
      ...(next ? { next } : {}),
      ...rest,
    };
    const res = await fetch(url, fetchInit);

    const status = res.status;
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const detailErr = Array.isArray(body?.errors) && body.errors.length > 0
        ? String(body.errors[0]?.message || "")
        : "";
      return {
        data: null,
        error: detailErr || body?.message || `Request gagal dengan status ${status}`,
        status,
      };
    }

    return {
      data: (body?.data ?? body) as T,
      error: null,
      status,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal terhubung ke server backend.";
    return {
      data: null,
      error: errorMessage,
      status: 500,
    };
  }
}
