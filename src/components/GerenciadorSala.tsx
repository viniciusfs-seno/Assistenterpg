import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Home, LogIn, Copy, Check } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface RoomManagerProps {
  onJoinRoom: (roomCode: string, isDM: boolean) => void;
}

export function RoomManager({ onJoinRoom }: RoomManagerProps) {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  const createRoom = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }
      const { room } = await apiRequest('/rooms', {
        method: 'POST',
      }, token);
      
      setCreatedRoomCode(room.code);
      onJoinRoom(room.code, true);
    } catch (err: any) {
      setError(err.message || 'Falha ao criar sala');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Por favor, insira um código de sala');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }
      const { room } = await apiRequest(`/rooms/${roomCode.toUpperCase()}`, {}, token);
      
      onJoinRoom(room.code, false);
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar na sala');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(createdRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="space-y-6">
          <div>
            <h2 className="text-white mb-2">Criar Nova Sala</h2>
            <p className="text-sm text-slate-400 mb-4">
              Crie uma sala e compartilhe o código com seus jogadores
            </p>
            <Button
              onClick={createRoom}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Criar Sala (Mestre)
            </Button>

            {createdRoomCode && (
              <Alert className="mt-4 bg-slate-700/50 border-slate-600">
                <AlertDescription>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-300">Código da sala: </span>
                      <span className="text-white">{createdRoomCode}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyRoomCode}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">ou</span>
            </div>
          </div>

          <div>
            <h2 className="text-white mb-2">Entrar em Sala Existente</h2>
            <p className="text-sm text-slate-400 mb-4">
              Digite o código fornecido pelo mestre
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="room-code" className="text-slate-300">
                  Código da Sala
                </Label>
                <Input
                  id="room-code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="bg-slate-700 border-slate-600 text-white"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={joinRoom}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar na Sala (Jogador)
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
}
