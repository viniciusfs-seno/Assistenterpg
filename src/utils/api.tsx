// src/utils/api.tsx

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-9334e2c0`;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string,
) {
  const token = accessToken || publicAnonKey;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const raw = await res.text().catch(() => '');
  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    if (!res.ok) throw new Error(raw || `HTTP ${res.status} ${res.statusText}`);
    return null;
  }

  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status} ${res.statusText}`);
  return data;
}
