import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10, // Limita eventos para evitar sobrecarga
        },
      },
    });
  }
  return supabaseInstance;
}

// ⬅️ NOVO: Exporta instância única para usar no WebSocket
export const supabase = createClient();
