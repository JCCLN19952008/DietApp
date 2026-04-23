// Lightweight fetch wrapper.
// Usage:
//   const data = await api.get<User[]>('/users');
//   const user = await api.post<User>('/auth/login', { email, password });

const BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function headers(extra?: HeadersInit): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'Request failed');
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                 => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown)  => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown)  => request<T>('PUT',    path, body),
  delete: <T>(path: string)                 => request<T>('DELETE', path),
};
