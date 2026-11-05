import { getSessionToken } from "./auth/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiFetch<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<{
  data: T | null;
  error: string | null;
  status: number;
}> {
  const { requireAuth = true, headers = {}, ...rest } = options;
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
    const res = await fetch(url, {
      headers: reqHeaders,
      ...rest,
    });

    const status = res.status;
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        data: null,
        error: body?.message || `Request gagal dengan status ${status}`,
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
