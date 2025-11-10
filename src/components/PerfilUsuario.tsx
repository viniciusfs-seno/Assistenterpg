// src/components/PerfilUsuario.tsx - VERSÃO COMPLETA COM TROCA DE SENHA

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { User, Mail, Edit2, Save, X, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
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

export function PerfilUsuario() {
  const { user, profile, updateProfile, updatePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [newNickname, setNewNickname] = useState(profile?.nickname || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para troca de senha
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (newNickname.length < 3) {
      setError('Apelido deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }

    if (newNickname.length > 20) {
      setError('Apelido deve ter no máximo 20 caracteres');
      setLoading(false);
      return;
    }

    if (newNickname !== profile?.nickname) {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', newNickname)
        .maybeSingle();

      if (data) {
        setError('Este apelido já está em uso');
        setLoading(false);
        return;
      }
    }

    const { error: updateError } = await updateProfile({ nickname: newNickname });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('Perfil atualizado com sucesso!');
      setEditMode(false);
    }

    setLoading(false);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Preencha todos os campos de senha');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('As novas senhas não coincidem');
      setLoading(false);
      return;
    }

    // Validar senha forte
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setError('Senha fraca: ' + passwordValidation.errors.join(', '));
      setLoading(false);
      return;
    }

    // Verificar senha atual
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setError('Senha atual incorreta');
        setLoading(false);
        return;
      }

      // Atualizar senha
      const { error: updateError } = await updatePassword(newPassword);

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess('Senha alterada com sucesso!');
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setNewNickname(profile?.nickname || '');
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const handleCancelPasswordChange = () => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="p-6">
      {/* Botão de Editar no topo */}
      {!editMode && !showChangePassword && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setEditMode(true)}
            variant="outline"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-900/20 border-green-700">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Email (não editável) */}
        <div>
          <Label className="text-slate-300 flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            value={user?.email || ''}
            disabled
            className="bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-1">
            O email não pode ser alterado
          </p>
        </div>

        {/* Apelido (editável) */}
        <div>
          <Label className="text-slate-300 flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Apelido
          </Label>
          {editMode ? (
            <>
              <Input
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                maxLength={20}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-500 mt-1">
                {newNickname.length}/20 caracteres
              </p>
            </>
          ) : (
            <Input
              value={profile?.nickname || 'Não definido'}
              disabled
              className="bg-slate-700 border-slate-600 text-white cursor-not-allowed"
            />
          )}
        </div>

        {/* Informações adicionais */}
        <div className="pt-4 border-t border-slate-700">
          <h3 className="text-slate-400 text-sm font-semibold mb-2">
            Informações da Conta
          </h3>
          <div className="space-y-2 text-sm text-slate-500">
            <p>
              <span className="font-medium">ID:</span>{' '}
              <code className="text-xs bg-slate-900 px-1 py-0.5 rounded">
                {user?.id?.slice(0, 8)}...
              </code>
            </p>
            <p>
              <span className="font-medium">Criado em:</span>{' '}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('pt-BR')
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Botões de ação (modo edição de perfil) */}
        {editMode && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
              className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}

        {/* Seção de Troca de Senha */}
        {!editMode && (
          <div className="pt-4 border-t border-slate-700">
            <Button
              onClick={() => setShowChangePassword(!showChangePassword)}
              variant="outline"
              className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Lock className="w-4 h-4 mr-2" />
              {showChangePassword ? 'Cancelar Troca de Senha' : 'Trocar Senha'}
            </Button>

            {showChangePassword && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label className="text-slate-300">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswords ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Nova Senha</Label>
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Digite sua nova senha"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Confirmar Nova Senha</Label>
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Confirme sua nova senha"
                  />
                </div>

                {/* Indicadores de senha */}
                {newPassword && (
                  <div className="text-xs space-y-1 bg-slate-900/50 p-3 rounded border border-slate-700">
                    <p className="text-slate-400 font-semibold mb-2">Requisitos da senha:</p>
                    <p className={newPassword.length >= 8 ? 'text-green-400' : 'text-slate-500'}>
                      {newPassword.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
                    </p>
                    <p className={/[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[A-Z]/.test(newPassword) ? '✓' : '○'} Letra maiúscula
                    </p>
                    <p className={/[a-z]/.test(newPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[a-z]/.test(newPassword) ? '✓' : '○'} Letra minúscula
                    </p>
                    <p className={/[0-9]/.test(newPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[0-9]/.test(newPassword) ? '✓' : '○'} Número
                    </p>
                    <p className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-400' : 'text-slate-500'}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✓' : '○'} Caractere especial
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                  </Button>
                  <Button
                    onClick={handleCancelPasswordChange}
                    variant="outline"
                    disabled={loading}
                    className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
