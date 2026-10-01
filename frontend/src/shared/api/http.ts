export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
export const AUTH_LOST_EVENT = 'auth:lost';

export const tokenStorage = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function toError(res: Response): Promise<ApiError> {
  let message = `Ошибка сервера (${res.status})`;
  try {
    const body = await res.json();
    if (typeof body.detail === 'string') message = body.detail;
    else if (Array.isArray(body.detail)) {
      message = body.detail.map((d: { msg: string }) => d.msg).join('; ');
    }
  } catch {
  }
  return new ApiError(res.status, message);
}

let refreshing: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  refreshing ??= (async () => {
    const refresh = tokenStorage.refresh;
    if (!refresh) return false;
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (!res.ok) return false;
      tokenStorage.set((await res.json()).access_token);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

async function send(path: string, init: RequestInit, auth: boolean): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (auth && tokenStorage.access) headers.set('Authorization', `Bearer ${tokenStorage.access}`);
  try {
    return await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, 'Нет соединения с сервером');
  }
}

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const init: RequestInit = { method, body: body === undefined ? undefined : JSON.stringify(body) };

  let res = await send(path, init, auth);

  if (res.status === 401 && auth) {
    if (await refreshAccessToken()) {
      res = await send(path, init, auth);
    } else {
      tokenStorage.clear();
      window.dispatchEvent(new Event(AUTH_LOST_EVENT));
    }
  }

  if (!res.ok) throw await toError(res);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
