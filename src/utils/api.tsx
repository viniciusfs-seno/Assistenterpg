import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-9334e2c0`;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string,
) {
  const token = accessToken || publicAnonKey;
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error(`API Error (${endpoint}):`, data);
    throw new Error(data.error || 'API request failed');
  }

  return data;
}
