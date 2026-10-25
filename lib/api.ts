function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gateland_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Request failed with status ${response.status}`);
  }

  return json;
}

// ─── AUTH APIS ──────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    return request<ApiResponse<{ token: string; user: any }>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (payload: { name: string; email: string; password: string; role?: string }) => {
    return request<ApiResponse<{ token: string; user: any }>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMe: async () => {
    return request<ApiResponse<{ user: any }>>('/api/auth/me');
  },
};

// ─── GATES APIS ─────────────────────────────────────────────
export const gatesApi = {
  getAll: async () => {
    return request<ApiResponse<any[]>>('/api/gates');
  },
  getById: async (id: number | string) => {
    return request<ApiResponse<any>>(`/api/gates/${id}`);
  },
  create: async (data: { name: string; location: string }) => {
    return request<ApiResponse<any>>('/api/gates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  action: async (id: number | string, action: 'OPEN' | 'CLOSE') => {
    return request<ApiResponse<any>>(`/api/gates/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },
};

// ─── USERS APIS ─────────────────────────────────────────────
export const usersApi = {
  getAll: async () => {
    return request<ApiResponse<any[]>>('/api/users');
  },
};

// ─── ACCESS LOGS APIS ───────────────────────────────────────
export const accessLogsApi = {
  getAll: async () => {
    return request<ApiResponse<any[]>>('/api/access-logs');
  },
};

// ─── STATS APIS ─────────────────────────────────────────────
export const statsApi = {
  get: async () => {
    return request<ApiResponse<any>>('/api/stats');
  },
};
