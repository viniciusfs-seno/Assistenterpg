// AuthContext.tsx — Comentários em PT-BR adicionados sem alterar a lógica

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Bootstrap: tenta recuperar sessão ativa ao montar o provider
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listener: atualiza estado local ao ocorrerem mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  // Login por email/senha, retorna access_token para chamadas ao backend
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    return data.session.access_token;
  };

  // Signup via função serverless (Hono) e em seguida realiza signIn
  const signUp = async (email: string, password: string, name: string) => {
    const { apiRequest } = await import('../utils/api');
    await apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    await signIn(email, password);
  };

  // Logout no Supabase e limpeza do estado local
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Recupera o access_token atual (ou null se não houver sessão)
  const getAccessToken = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    if (!session) {
      console.warn('No active session found');
      return null;
    }
    return session.access_token;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, getAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniência que exige uso dentro de AuthProvider
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
