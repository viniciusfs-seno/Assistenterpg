// src/utils/api.tsx - VERSÃO CORRIGIDA COM SUPORTE HÍBRIDO

import { supabase } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-9334e2c0`;

// Função para requisições à Edge Function (quando necessário)
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string,
) {
  const token = accessToken || publicAnonKey;
  
  console.log(`API Request: ${endpoint}`, {
    method: options.method || 'GET',
    hasToken: !!accessToken,
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
  });
  
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
    console.error(`API Error (${endpoint}):`, {
      status: response.status,
      statusText: response.statusText,
      data
    });
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// API helper para operações diretas no Supabase (mais rápido e confiável)
export const api = {
  // GET: Buscar dados
  async get(endpoint: string) {
    try {
      const tableName = endpoint.split('?')[0].replace(/^\//, '');
      const queryString = endpoint.split('?')[1];
      
      console.log(`API GET: ${tableName}`, { queryString });
      
      let query = supabase.from(tableName).select('*');
      
      // Se tem ?mine=1, filtrar pelo usuário atual
      if (queryString?.includes('mine=1')) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`API GET Error:`, error);
        throw error;
      }
      
      console.log(`API GET Success:`, { count: data?.length });
      return data || [];
    } catch (error) {
      console.error('API GET Exception:', error);
      throw error;
    }
  },

  // POST: Criar novo registro
  async post(endpoint: string, payload: any) {
    try {
      const tableName = endpoint.replace(/^\//, '');
      
      console.log(`API POST: ${tableName}`, { payload });
      
      // Adicionar user_id automaticamente se não existir
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !payload.user_id) {
        payload.user_id = user.id;
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .insert(payload)
        .select()
        .single();
      
      if (error) {
        console.error(`API POST Error:`, error);
        throw error;
      }
      
      console.log(`API POST Success:`, { id: data?.id });
      return data;
    } catch (error) {
      console.error('API POST Exception:', error);
      throw error;
    }
  },

  // PUT: Atualizar registro
  async put(endpoint: string, payload: any) {
    try {
      const [tableName, id] = endpoint.replace(/^\//, '').split('/');
      
      console.log(`API PUT: ${tableName}/${id}`, { payload });
      
      const { data, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`API PUT Error:`, error);
        throw error;
      }
      
      console.log(`API PUT Success:`, { id: data?.id });
      return data;
    } catch (error) {
      console.error('API PUT Exception:', error);
      throw error;
    }
  },

  // DELETE: Deletar registro
  async delete(endpoint: string) {
    try {
      const [tableName, id] = endpoint.replace(/^\//, '').split('/');
      
      console.log(`API DELETE: ${tableName}/${id}`);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`API DELETE Error:`, error);
        throw error;
      }
      
      console.log(`API DELETE Success`);
      return { success: true };
    } catch (error) {
      console.error('API DELETE Exception:', error);
      throw error;
    }
  }
};
