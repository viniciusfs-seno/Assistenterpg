// src/components/PaginaLogin.tsx - VERSÃO COMPLETA COM RESET DE SENHA

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Sword, LogIn, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { supabase } from '../utils/supabase/client';

// Função de validação de senha
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Uma letra maiúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Uma letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Um número');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Um caractere especial');
  }

  return { valid: errors.length === 0, errors };
}

export function PaginaLogin() {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado do formulário: Entrar
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Estado do formulário: Criar Conta
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpNickname, setSignUpNickname] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Handler: Entrar
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: signInError } = await signIn(signInEmail, signInPassword);

    if (signInError) {
      setError(signInError.message || 'Falha ao fazer login');
    }

    setLoading(false);
  };

  // Handler: Criar Conta
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações
    const validationErrors: string[] = [];

    if (!signUpEmail) {
      validationErrors.push('Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      validationErrors.push('Email inválido');
    }

    if (!signUpNickname) {
      validationErrors.push('Apelido é obrigatório');
    } else if (signUpNickname.length < 3) {
      validationErrors.push('Apelido deve ter pelo menos 3 caracteres');
    } else if (signUpNickname.length > 20) {
      validationErrors.push('Apelido deve ter no máximo 20 caracteres');
    } else {
      // Verifica se nickname já existe
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', signUpNickname)
        .maybeSingle();

      if (data) {
        validationErrors.push('Este apelido já está em uso');
      }
    }

    const passwordValidation = validatePassword(signUpPassword);
    if (!passwordValidation.valid) {
      validationErrors.push(...passwordValidation.errors);
    }

    if (signUpPassword !== signUpConfirmPassword) {
      validationErrors.push('As senhas não coincidem');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(signUpEmail, signUpPassword, signUpNickname);

    if (signUpError) {
      if (signUpError.message?.includes('already registered') || 
          signUpError.message?.includes('User already registered')) {
        setError('Este email já está cadastrado. Tente fazer login ou use outro email.');
      } else {
        setError(signUpError.message || 'Falha ao criar conta');
      }
    } else {
      setSuccess('Conta criada! Verifique seu email para confirmar.');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
      setSignUpNickname('');
    }

    setLoading(false);
  };

  // Handler: Google OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    const { error: googleError } = await signInWithGoogle();
    
    if (googleError) {
      setError(googleError.message || 'Falha ao fazer login com Google');
    }
    
    setLoading(false);
  };

  // Handler: Esqueci minha senha
  const handleForgotPassword = async () => {
    if (!signInEmail) {
      setError('Digite seu email primeiro');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const { error: resetError } = await resetPassword(signInEmail);
    
    if (resetError) {
      setError(resetError.message || 'Erro ao enviar email de recuperação');
    } else {
      setSuccess('Link de recuperação enviado! Verifique seu email.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sword className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">Tracker de Combate de RPG</h1>
            <Sword className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-400">Gerenciador de Combate do Seno</p>
        </div>

        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            {/* Tab: Entrar */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-slate-300">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-slate-300">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showSignInPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/20 border-green-700">
                    <AlertDescription className="text-green-400">{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                {/* Botão Esqueci Minha Senha */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-blue-400 hover:underline text-sm disabled:opacity-50"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800/50 text-slate-400">ou</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </Button>
              </form>
            </TabsContent>

            {/* Tab: Criar Conta */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nickname" className="text-slate-300">
                    Apelido <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="signup-nickname"
                    type="text"
                    value={signUpNickname}
                    onChange={(e) => setSignUpNickname(e.target.value)}
                    placeholder="Seu apelido"
                    required
                    maxLength={20}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-500">
                    {signUpNickname.length}/20 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-300">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-slate-300">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="signup-confirm-password"
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Indicadores de Requisitos da Senha */}
                {signUpPassword && (
                  <div className="text-xs space-y-1 bg-slate-900/50 p-3 rounded border border-slate-700">
                    <p className="text-slate-400 font-semibold mb-2">Requisitos da senha:</p>
                    <p className={signUpPassword.length >= 8 ? 'text-green-400' : 'text-slate-500'}>
                      {signUpPassword.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
                    </p>
                    <p className={/[A-Z]/.test(signUpPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[A-Z]/.test(signUpPassword) ? '✓' : '○'} Letra maiúscula
                    </p>
                    <p className={/[a-z]/.test(signUpPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[a-z]/.test(signUpPassword) ? '✓' : '○'} Letra minúscula
                    </p>
                    <p className={/[0-9]/.test(signUpPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[0-9]/.test(signUpPassword) ? '✓' : '○'} Número
                    </p>
                    <p className={/[!@#$%^&*(),.?":{}|<>]/.test(signUpPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(signUpPassword) ? '✓' : '○'} Caractere especial
                    </p>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/20 border-green-700">
                    <AlertDescription className="text-green-400">{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800/50 text-slate-400">ou</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
