// src/components/GerenciadorSala.tsx — versão completa com “Minhas Salas”, retry e tratamento de erro

import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import {
  Home,
  LogIn,
  Copy,
  Check,
  DoorOpen,
  Trash2,
  Crown,
} from 'lucide-react';
import { apiRequest } from '../utils/api';

type RoomStatus = 'ACTIVE' | 'CLOSED';

interface Room {
  code: string;
  dmId: string;
  status: RoomStatus;
  lastMasterSeen: number | null;
  createdAt: number;
  combatStarted: boolean;
  round: number;
  // demais campos existem mas não são necessários aqui
}

interface RoomManagerProps {
  onJoinRoom: (roomCode: string, isDM: boolean) => void;
}

export function GerenciadorSala({ onJoinRoom }: RoomManagerProps) {
  const { getAccessToken, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Lista de salas pertencentes ao mestre
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const fetchMyRooms = async () => {
    try {
      setRoomsLoading(true);
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        setRoomsLoading(false);
        return;
      }
      const resp = await apiRequest('/rooms?mine=1', {}, token);
      const rooms: Room[] = resp?.rooms || [];
      setMyRooms(rooms);
      setRoomsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar suas salas');
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

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
      const { room } = await apiRequest('/rooms', { method: 'POST' }, token);
      setCreatedRoomCode(room.code);
      
      // Activate room by fetching it as DM (triggers heartbeat)
      await apiRequest(`/rooms/${room.code}`, {}, token);
      
      await fetchMyRooms();
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
      const code = roomCode.toUpperCase();
      const { room } = await apiRequest(`/rooms/${code}`, {}, token);

      const isDM = room.dmId === user?.id;
      if (!isDM && room.status !== 'ACTIVE') {
        // Retry rápido para dar tempo do heartbeat do mestre ativar
        await new Promise((r) => setTimeout(r, 1200));
        const { room: room2 } = await apiRequest(`/rooms/${code}`, {}, token);
        if (room2.status !== 'ACTIVE') {
          setError('Sala fechada pelo mestre. Tente novamente quando estiver ativa.');
          setLoading(false);
          return;
        }
      }

      onJoinRoom(room.code, isDM);
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

  const enterAsDM = async (code: string) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        return;
      }
      // Activate room by fetching it as DM (triggers heartbeat and sets status to ACTIVE)
      const { room } = await apiRequest(`/rooms/${code}`, {}, token);
      onJoinRoom(code, true);
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar na sala');
    }
  };

  const deleteRoom = async (code: string) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        return;
      }
      await apiRequest(`/rooms/${code}`, { method: 'DELETE' }, token);
      await fetchMyRooms();
    } catch (err: any) {
      setError(err.message || 'Falha ao excluir sala');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Criar / Entrar */}
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="space-y-6">
          <div>
            <h2 className="text-white mb-2">Criar Nova Sala</h2>
            <p className="text-sm text-slate-400 mb-4">
              Crie uma sala associada a você como mestre; ela ficará disponível na sua lista até ser excluída
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

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">ou</span>
            </div>
          </div>

          {/* Entrar */}
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
                Entrar na Sala
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

      {/* Minhas Salas */}
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Minhas Salas
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchMyRooms}
            className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600" 
            disabled={roomsLoading}
          >
            Atualizar
          </Button>
        </div>

        {roomsLoading ? (
          <div className="text-slate-400">Carregando suas salas...</div>
        ) : myRooms.length === 0 ? (
          <div className="text-slate-500">Você ainda não criou salas.</div>
        ) : (
          <div className="space-y-3">
            {myRooms.map((room) => (
              <div
                key={room.code}
                className="flex items-center justify-between p-3 rounded border border-slate-700 bg-slate-800/60"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white">Sala {room.code}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        room.status === 'ACTIVE'
                          ? 'bg-green-700 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {room.status === 'ACTIVE' ? 'Ativa' : 'Fechada'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {room.combatStarted
                      ? `Combate em andamento • Round ${room.round}`
                      : 'Sem combate em andamento'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => enterAsDM(room.code)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <DoorOpen className="w-4 h-4 mr-1" />
                    Entrar como Mestre
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteRoom(room.code)}
                    className="border-red-700 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
