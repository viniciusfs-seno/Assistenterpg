// src/components/TrackerCombateSala.tsx — MIGRADO PARA WEBSOCKET (VERSÃO COMPLETA)

import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { CombatantCard } from "./PersonagemCard";
import { AddCombatantDialog } from "./AddPersonagemDialog";
import { SelectExistingCharacterDialog } from "./AddPersonagemExistenteDialog";
import { NPCLibrary } from "./BibliotecaNPC";
import { DiceRoller } from "./RoladorDados";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Swords,
  RotateCcw,
  Play,
  ArrowLeft,
  Users,
  Crown,
  Flag,
  Flame,
  Skull,
  Zap,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { apiRequest } from "../utils/api";
import { supabase } from "../utils/supabase/client"; // ⬅️ NOVO
import type { Combatant } from "./TrackerCombate";
import type { NPCTemplate } from "./BibliotecaNPC";
import type { RealtimeChannel } from "@supabase/supabase-js"; // ⬅️ NOVO
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface RoomCombatTrackerProps {
  roomCode: string;
  isDM: boolean;
  onLeaveRoom: () => void;
}

const REPORTS_STORAGE_KEY = "battleReports_v1";

interface CombatantWithEffects extends Combatant {
  effects?: string[];
  wasAliveAtStart?: boolean;
  diedOnRound?: number | null;
}

type RoomData = {
  code: string;
  dmId: string;
  status: 'ACTIVE' | 'CLOSED';
  currentTurnIndex: number;
  combatStarted: boolean;
  round: number;
  combatants: CombatantWithEffects[];
};

const AVAILABLE_EFFECTS = [
  { id: 'poisoned', label: 'Envenenado', color: 'bg-green-700', icon: '☠️' },
  { id: 'burning', label: 'Em Chamas', color: 'bg-orange-600', icon: '🔥' },
  { id: 'paralyzed', label: 'Paralizado', color: 'bg-purple-600', icon: '⚡' },
];

export function TrackerCombateSala({
  roomCode,
  isDM,
  onLeaveRoom,
}: RoomCombatTrackerProps) {
  const { getAccessToken, user } = useAuth();
  const [combatants, setCombatants] = useState<CombatantWithEffects[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCombatReport, setShowCombatReport] = useState(false);
  const [showReportsList, setShowReportsList] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [battleReports, setBattleReports] = useState<any[]>(
    () => {
      try {
        const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },
  );
  
  const [showPlayerReport, setShowPlayerReport] = useState(false);
  const [playerReportData, setPlayerReportData] = useState<any>(null);
  const [showEffectsDialog, setShowEffectsDialog] = useState(false);
  const [selectedCombatantForEffects, setSelectedCombatantForEffects] = useState<string | null>(null);
  
  // ⬅️ NOVO: Estado de conexão WebSocket
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const previousCombatStartedRef = useRef(combatStarted);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sortedCombatants = [...combatants].sort(
    (a, b) => b.initiative - a.initiative,
  );
  const activeCombatants = sortedCombatants.filter(
    (c) => !c.isDeceased,
  );

  const playerCombatant = sortedCombatants.find(
    (c) => c.isPlayer && c.id.startsWith(`player_${user?.id}`),
  );

  // ⬅️ NOVO: Fetch inicial (apenas uma vez)
  const fetchRoomOnce = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      
      const response = await apiRequest(`/rooms/${roomCode}`, {}, token);
      const roomData = response.room as RoomData;

      if (!isDM && roomData.status !== 'ACTIVE') {
        onLeaveRoom();
        return;
      }

      const validCombatants = (roomData.combatants || []).filter(
        (c: any) => c && c.id,
      );
      
      setCombatants(validCombatants);
      setCurrentTurnIndex(roomData.currentTurnIndex || 0);
      setCombatStarted(roomData.combatStarted || false);
      previousCombatStartedRef.current = roomData.combatStarted || false;
      setRound(roomData.round || 1);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch room:", err);
      setConnectionError("Erro ao carregar sala");
      setLoading(false);
    }
  };

    // ⬅️ MODIFICADO: Update room via HTTP (ainda precisa para persistência)
    // ⬅️ MODIFICADO: Envia broadcast após atualizar HTTP
  const updateRoomData = async (updates: Partial<RoomData>) => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      
      // 1. Atualiza no servidor (persistência)
      const response = await apiRequest(
        `/rooms/${roomCode}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        },
        token,
      );
      
      const roomData = response.room as RoomData;
      
      // 2. Envia broadcast para outros clientes (tempo real)
      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'room-update',
          payload: roomData,
        });
        console.log('📤 Broadcast enviado:', roomData);
      }
    } catch (err) {
      console.error("Failed to update room:", err);
      setConnectionError("Erro ao atualizar sala");
    }
  };


  // ⬅️ NOVO: Heartbeat do mestre (mantém sala ativa)
  const sendHeartbeat = async () => {
    if (!isDM) return;
    
    try {
      const token = await getAccessToken();
      if (!token) return;
      
      await apiRequest(`/rooms/${roomCode}`, {}, token);
    } catch (err) {
      console.error("Heartbeat failed:", err);
    }
  };

    // ⬅️ CORRIGIDO: Usa Broadcast ao invés de Postgres Changes
  useEffect(() => {
    if (!roomCode) return;

    fetchRoomOnce();

    // ⬅️ NOVO: Canal de broadcast para atualizações instantâneas
    const channel = supabase
      .channel(`room:${roomCode}`, {
        config: {
          broadcast: { self: true }, // Recebe até suas próprias mensagens
        },
      })
      .on('broadcast', { event: 'room-update' }, (payload) => {
      console.log('📡 Room updated via Broadcast:', payload);
      
      const roomData = payload.payload as RoomData;
      
      // ⬅️ CORRIGIDO: Busca jogador atual nos dados recebidos
      const currentPlayerCombatant = roomData.combatants.find(
        (c: CombatantWithEffects) => c.isPlayer && c.id.startsWith(`player_${user?.id}`)
      );
      
      // Detectar fim de combate para jogadores
      if (!isDM && previousCombatStartedRef.current && !roomData.combatStarted && currentPlayerCombatant) {
        console.log('🎯 Combate encerrado detectado para jogador!');
        setPlayerReportData({
          character: currentPlayerCombatant,
          roundEnded: roomData.round,
          timestamp: new Date().toISOString()
        });
        setShowPlayerReport(true);
      }
      
      const validCombatants = (roomData.combatants || []).filter(
        (c: any) => c && c.id
      );
      
      setCombatants(validCombatants);
      setCurrentTurnIndex(roomData.currentTurnIndex || 0);
      setCombatStarted(roomData.combatStarted || false);
      previousCombatStartedRef.current = roomData.combatStarted || false;
      setRound(roomData.round || 1);
      
      if (!isDM && roomData.status !== 'ACTIVE') {
        onLeaveRoom();
      }
    })
      .subscribe((status) => {
        console.log('🔌 Broadcast status:', status);
        
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setConnectionError(null);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false);
          setConnectionError('Conexão perdida');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    if (isDM) {
      sendHeartbeat();
      heartbeatIntervalRef.current = setInterval(sendHeartbeat, 10000);
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [roomCode, isDM, user?.id]);

  const addCombatant = async (
    combatant: Omit<CombatantWithEffects, "id">,
  ) => {
    if (!isDM) {
      const playerHasCharacter = combatants.some(
        (c) => c.id.startsWith(`player_${user?.id}`)
      );
      if (playerHasCharacter) {
        alert('Você já tem um personagem nesta sala. Apenas o mestre pode adicionar múltiplos personagens.');
        return;
      }
    }

    const newCombatant: CombatantWithEffects = {
      ...combatant,
      id: `${isDM ? "npc" : `player_${user?.id}`}_${Date.now()}`,
      damageTaken: 0,
      damageDealt: 0,
      deathSaveCount: 3,
      isDeceased: false,
      timesFallen: 0,
      timesDied: 0,
      fellOnRound: null,
      effects: [],
      wasAliveAtStart: undefined,
      diedOnRound: null,
    };
    const updatedCombatants = [...combatants, newCombatant];
    
    setCombatants(updatedCombatants);
    await updateRoomData({ combatants: updatedCombatants });
  };

  const saveCharacterToList = async (combatant: Omit<Combatant, 'id'>) => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      await apiRequest('/characters', {
        method: 'POST',
        body: JSON.stringify(combatant),
      }, token);
      console.log('Character saved to list');
    } catch (err) {
      console.error('Failed to save character:', err);
    }
  };

  const handleSelectNPC = (
    npc: Omit<NPCTemplate, "description" | "category">,
  ) => {
    const npcCombatant = {
      name: npc.name,
      initiative: npc.initiative || 0,
      health: npc.maxHealth,
      maxHealth: npc.maxHealth,
      stamina: npc.maxStamina,
      maxStamina: npc.maxStamina,
      cursedEnergy: 0,
      maxCursedEnergy: 0,
      sanity: 100,
      maxSanity: 100,
      isPlayer: false,
    };
    addCombatant(npcCombatant);
  };

  const removeCombatant = async (id: string) => {
    const index = activeCombatants.findIndex((c) => c.id === id);
    const newList = combatants.filter((c) => c.id !== id);
    
    setCombatants(newList);
    
    if (combatStarted && index < currentTurnIndex) {
      const newIndex = Math.max(0, currentTurnIndex - 1);
      setCurrentTurnIndex(newIndex);
      await updateRoomData({
        combatants: newList,
        currentTurnIndex: newIndex,
      });
    } else {
      await updateRoomData({ combatants: newList });
    }
  };

  const updateCombatant = async (
    id: string,
    updates: Partial<CombatantWithEffects>,
  ) => {
    const updatedCombatants = combatants.map((c) => {
      if (c.id !== id) return c;
      const updated = { ...c, ...updates };

      if (
        updates.health !== undefined &&
        updates.health < c.health
      ) {
        const damageTaken = c.health - updates.health;
        updated.damageTaken =
          (c.damageTaken || 0) + damageTaken;
      }

      if (
        updated.health === 0 &&
        c.health > 0 &&
        !updated.isDeceased
      ) {
        updated.deathSaveCount = 3;
        updated.timesFallen = (c.timesFallen || 0) + 1;
        updated.fellOnRound = round;
      }

      if (updated.health > 0) {
        updated.deathSaveCount = undefined;
        updated.isDeceased = false;
        updated.fellOnRound = null;
        updated.diedOnRound = null;
      }
      
      if (updated.isDeceased && !c.isDeceased) {
        updated.effects = [];
        if (c.wasAliveAtStart) {
          updated.diedOnRound = round;
        }
      }

      return updated;
    });
    
    setCombatants(updatedCombatants);
    await updateRoomData({ combatants: updatedCombatants });
  };

  const reviveCombatant = async (id: string) => {
    const updatedCombatants = combatants.map((c) =>
      c.id === id
        ? {
            ...c,
            health: 1,
            deathSaveCount: undefined,
            isDeceased: false,
            fellOnRound: null,
            diedOnRound: null,
          }
        : c,
    );
    setCombatants(updatedCombatants);
    await updateRoomData({ combatants: updatedCombatants });
  };
  
  const toggleEffect = async (combatantId: string, effectId: string) => {
    const updatedCombatants = combatants.map((c) => {
      if (c.id !== combatantId) return c;
      const currentEffects = c.effects || [];
      const hasEffect = currentEffects.includes(effectId);
      
      return {
        ...c,
        effects: hasEffect
          ? currentEffects.filter(e => e !== effectId)
          : [...currentEffects, effectId]
      };
    });
    
    setCombatants(updatedCombatants);
    await updateRoomData({ combatants: updatedCombatants });
  };

  const persistReports = (reports: any[]) => {
    setBattleReports(reports);
    try {
      localStorage.setItem(
        REPORTS_STORAGE_KEY,
        JSON.stringify(reports),
      );
    } catch (e) {
      console.error("Failed to persist reports", e);
    }
  };

  const generateReportAndPersist = async (endRound: number) => {
    const report = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      roundEnded: endRound,
      combatants: combatants.map((c) => ({
        id: c.id,
        name: c.name,
        damageTaken: c.damageTaken || 0,
        damageDealt: c.damageDealt || 0,
        timesFallen: c.timesFallen || 0,
        died: !!c.isDeceased,
        finalHP: c.health,
      })),
    };
    const newReports = [...battleReports, report];
    persistReports(newReports);
    return report;
  };

  const endCombat = async () => {
    await generateReportAndPersist(round);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setShowCombatReport(true);
    await updateRoomData({
      combatStarted: false,
      currentTurnIndex: 0,
    });
  };

  const nextTurn = async () => {
    if (activeCombatants.length === 0) return;

    const currentCombatant = activeCombatants[currentTurnIndex];
    if (!currentCombatant) {
      setCurrentTurnIndex(0);
      return;
    }

    const updatedWithDeathSaves = combatants.map((c) => {
      if (
        c.id === currentCombatant.id &&
        c.health === 0 &&
        !c.isDeceased &&
        c.deathSaveCount !== undefined
      ) {
        if (c.fellOnRound === round) {
          return c;
        }
        const newCount = c.deathSaveCount - 1;
        if (newCount <= 0) {
          const updated = {
            ...c,
            deathSaveCount: 0,
            isDeceased: true,
            timesDied: (c.timesDied || 0) + 1,
            effects: [],
          };
          if (c.wasAliveAtStart) {
            updated.diedOnRound = round;
          }
          return updated;
        }
        return { ...c, deathSaveCount: newCount };
      }
      return c;
    });
    setCombatants(updatedWithDeathSaves);

    const updatedActiveCombatants = updatedWithDeathSaves
      .filter((c) => !c.isDeceased)
      .sort((a, b) => b.initiative - a.initiative);

    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= updatedActiveCombatants.length) {
      setCurrentTurnIndex(0);
      setRound(round + 1);
      await updateRoomData({
        combatants: updatedWithDeathSaves,
        currentTurnIndex: 0,
        round: round + 1,
      });
    } else {
      setCurrentTurnIndex(nextIndex);
      await updateRoomData({
        combatants: updatedWithDeathSaves,
        currentTurnIndex: nextIndex,
      });
    }
  };

  const startCombat = async () => {
    if (combatants.length > 0) {
      const combatantsWithStartFlag = combatants.map(c => ({
        ...c,
        wasAliveAtStart: !c.isDeceased && c.health > 0,
        diedOnRound: null,
      }));
      
      setCombatants(combatantsWithStartFlag);
      setCombatStarted(true);
      previousCombatStartedRef.current = true;
      setCurrentTurnIndex(0);
      setRound(1);
      await updateRoomData({
        combatants: combatantsWithStartFlag,
        combatStarted: true,
        currentTurnIndex: 0,
        round: 1,
      });
    }
  };

  const resetCombat = async () => {
    const resetCombatants = combatants.map((c) => ({
      ...c,
      health: c.maxHealth,
      stamina: c.maxStamina,
      cursedEnergy: c.maxCursedEnergy ?? c.cursedEnergy ?? 0,
      sanity: c.maxSanity ?? c.sanity ?? 100,
      deathSaveCount: 3,
      isDeceased: false,
      damageTaken: 0,
      damageDealt: 0,
      timesFallen: 0,
      timesDied: 0,
      fellOnRound: null,
      effects: [],
      wasAliveAtStart: undefined,
      diedOnRound: null,
    }));
    setCombatStarted(false);
    previousCombatStartedRef.current = false;
    setCurrentTurnIndex(0);
    setRound(1);
    setCombatants(resetCombatants);
    await updateRoomData({
      combatants: resetCombatants,
      combatStarted: false,
      currentTurnIndex: 0,
      round: 1,
    });
  };

  const clearAll = async () => {
    setCombatants([]);
    setCombatStarted(false);
    previousCombatStartedRef.current = false;
    setCurrentTurnIndex(0);
    setRound(1);
    await updateRoomData({
      combatants: [],
      combatStarted: false,
      currentTurnIndex: 0,
      round: 1,
    });
  };
  
  const getStatusBadges = (c: CombatantWithEffects) => {
    const badges = [];
    const isWounded = c.health > 0 && c.health <= c.maxHealth * 0.5;
    
    if (c.isDeceased) {
      badges.push(<Badge key="deceased" className="bg-red-600">Morto</Badge>);
    } else if (c.health === 0) {
      badges.push(<Badge key="fallen" className="bg-orange-600">Caído</Badge>);
      if (isWounded) {
        badges.push(<Badge key="wounded" className="bg-yellow-600">Machucado</Badge>);
      }
    } else {
      badges.push(<Badge key="alive" className="bg-green-600">Vivo</Badge>);
      if (isWounded) {
        badges.push(<Badge key="wounded" className="bg-yellow-600">Machucado</Badge>);
      }
    }
    
    return badges;
  };
  
  const getEffectBadges = (c: CombatantWithEffects) => {
    if (!c.effects || c.effects.length === 0) return null;
    
    return c.effects.map(effectId => {
      const effect = AVAILABLE_EFFECTS.find(e => e.id === effectId);
      if (!effect) return null;
      
      return (
        <Badge key={effectId} className={`${effect.color} text-white`}>
          {effect.icon} {effect.label}
        </Badge>
      );
    }).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 bg-slate-800/50 border-slate-700">
          <div className="text-center text-slate-400">
            Carregando sala...
          </div>
        </Card>
      </div>
    );
  }

  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-400">Conectado</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-400">
            {connectionError || 'Desconectado'}
          </span>
        </>
      )}
    </div>
  );

  // Player view
  if (!isDM) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onLeaveRoom}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">
                    <Users className="w-3 h-3 mr-1" />
                    Jogador
                  </Badge>
                  <span className="text-slate-400">
                    Sala: {roomCode}
                  </span>
                  <ConnectionIndicator />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <DiceRoller />

        {combatStarted && (
          <Alert className="bg-slate-800/50 border-slate-700">
            <AlertDescription className="text-center text-white">
              Round {round}
            </AlertDescription>
          </Alert>
        )}

        {!playerCombatant && (
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="text-center space-y-4">
              <div className="text-slate-400">
                <p>Você ainda não adicionou seu personagem</p>
              </div>
              <div className="flex gap-2 justify-center">
                <AddCombatantDialog 
                  onAdd={addCombatant}
                  showSaveToggle={true}
                  onSaveCharacter={saveCharacterToList}
                />
                <SelectExistingCharacterDialog
                  onSelect={addCombatant}
                />
              </div>
            </div>
          </Card>
        )}

        {playerCombatant && (
          <div>
            <h3 className="text-slate-300 mb-3">
              Seu Personagem
            </h3>
            <CombatantCard
              combatant={playerCombatant}
              isCurrentTurn={
                combatStarted &&
                activeCombatants[currentTurnIndex]?.id ===
                  playerCombatant.id
              }
              onUpdate={updateCombatant}
              onRemove={removeCombatant}
              isDM={false}
              isOwner={true}
            />

            {combatStarted && sortedCombatants.length > 0 && (
              <Card className="p-4 bg-slate-800/50 border-slate-700 mt-4">
                <h4 className="text-slate-300 mb-2">
                  Ordem de Iniciativa
                </h4>
                <div className="space-y-2">
                  {sortedCombatants.map((c, idx) => {
                    const isCurrentTurn = activeCombatants[currentTurnIndex]?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center justify-between p-2 rounded transition-all ${
                          isCurrentTurn
                            ? 'bg-blue-600/40 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-slate-300 text-sm">
                            {idx + 1}.
                          </span>
                          <span className={`${isCurrentTurn ? 'text-white font-bold' : 'text-white'}`}>
                            {c.name}
                          </span>
                          {isCurrentTurn && (
                            <Badge className="bg-yellow-600 ml-2">
                              Turno Atual
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {getStatusBadges(c)}
                          {getEffectBadges(c)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        <Dialog open={showPlayerReport} onOpenChange={setShowPlayerReport}>
          <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Flag className="w-6 h-6 text-green-400" />
                Combate Finalizado!
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Resumo da sua performance
              </DialogDescription>
            </DialogHeader>

            {playerReportData && (
              <div className="space-y-6 p-4">
                <Alert className="bg-blue-900/30 border-blue-700">
                  <AlertDescription className="text-center">
                    <div className="text-lg font-bold text-white mb-1">
                      {playerReportData.character.name}
                    </div>
                    <div className="text-sm text-slate-300">
                      {playerReportData.character.isDeceased && playerReportData.character.diedOnRound ? (
                        <>Morreu no Round {playerReportData.character.diedOnRound}</>
                      ) : playerReportData.character.isDeceased && !playerReportData.character.wasAliveAtStart ? (
                        <>Estava morto durante todo o combate</>
                      ) : (
                        <>Sobreviveu até o Round {playerReportData.roundEnded}</>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>

                <Card className="p-4 bg-slate-700/50 border-slate-600">
                  <h4 className="text-white font-semibold mb-3">Estatísticas Finais</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-400 text-sm">HP Final</div>
                      <div className="text-white text-lg font-bold">
                        {playerReportData.character.health} / {playerReportData.character.maxHealth}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Status</div>
                      <div className="flex gap-1 flex-wrap">
                        {getStatusBadges(playerReportData.character)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Dano Recebido</div>
                      <div className="text-red-400 text-lg font-bold">
                        {playerReportData.character.damageTaken || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Vezes Caído</div>
                      <div className="text-orange-400 text-lg font-bold">
                        {playerReportData.character.timesFallen || 0}
                      </div>
                    </div>
                  </div>
                </Card>

                {playerReportData.character.isDeceased && playerReportData.character.wasAliveAtStart && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-700">
                    <AlertDescription className="text-center">
                      Seu personagem morreu durante o combate
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 p-4">
              <Button
                onClick={() => {
                  setShowPlayerReport(false);
                  setPlayerReportData(null);
                }}
                className="bg-green-700 hover:bg-green-600"
              >
                Entendido
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // DM view
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onLeaveRoom}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600">
                <Crown className="w-3 h-3 mr-1" />
                Mestre
              </Badge>
              <span className="text-slate-400">
                Sala: {roomCode}
              </span>
              <ConnectionIndicator />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <AddCombatantDialog 
              onAdd={addCombatant}
              showSaveToggle={true}
              onSaveCharacter={saveCharacterToList}
            />
            <SelectExistingCharacterDialog
              onSelect={addCombatant}
            />
            <NPCLibrary onSelectNPC={handleSelectNPC} />
            {!combatStarted ? (
              <Button
                onClick={startCombat}
                disabled={combatants.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Combate
              </Button>
            ) : (
              <Button
                onClick={nextTurn}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Swords className="w-4 h-4 mr-2" />
                Próximo Turno
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {combatStarted && (
              <>
                <Button
                  onClick={endCombat}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Encerrar Combate
                </Button>

                <Button
                  onClick={resetCombat}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </>
            )}

            <Button
              onClick={() => setShowReportsList(true)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              📜 Ver Relatórios de Combate
            </Button>

            <Button
              onClick={clearAll}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={combatants.length === 0}
            >
              Limpar
            </Button>
          </div>
        </div>
      </Card>

      <DiceRoller />

      {combatStarted && (
        <Alert className="bg-slate-800/50 border-slate-700">
          <AlertDescription className="text-center text-white">
            Round {round}
          </AlertDescription>
        </Alert>
      )}

      {sortedCombatants.length === 0 ? (
        <Card className="p-12 bg-slate-800/30 border-slate-700 border-dashed">
          <div className="text-center text-slate-500">
            <Swords className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum personagem adicionado</p>
            <p className="text-sm mt-2">
              Adicione personagens ou NPCs para começar
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedCombatants.map((combatant) => (
            <div key={combatant.id} className="space-y-2">
              <CombatantCard
                combatant={combatant}
                isCurrentTurn={
                  combatStarted &&
                  activeCombatants[currentTurnIndex]?.id ===
                    combatant.id
                }
                onUpdate={updateCombatant}
                onRemove={removeCombatant}
                onRevive={reviveCombatant}
                isDM={isDM}
              />
              {isDM && !combatant.isDeceased && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCombatantForEffects(combatant.id);
                    setShowEffectsDialog(true);
                  }}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  ⚡ Gerenciar Efeitos
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showEffectsDialog} onOpenChange={setShowEffectsDialog}>
        <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Gerenciar Efeitos</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedCombatantForEffects && 
                combatants.find(c => c.id === selectedCombatantForEffects)?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 p-4">
            {AVAILABLE_EFFECTS.map(effect => {
              const combatant = combatants.find(c => c.id === selectedCombatantForEffects);
              const hasEffect = combatant?.effects?.includes(effect.id) || false;
              
              return (
                <Button
                  key={effect.id}
                  variant={hasEffect ? "default" : "outline"}
                  className={`w-full justify-start ${hasEffect ? effect.color : 'border-slate-600'}`}
                  onClick={() => {
                    if (selectedCombatantForEffects) {
                      toggleEffect(selectedCombatantForEffects, effect.id);
                    }
                  }}
                >
                  <span className="mr-2">{effect.icon}</span>
                  {effect.label}
                  {hasEffect && <span className="ml-auto">✓</span>}
                </Button>
              );
            })}
          </div>

          <div className="flex justify-end p-4">
            <Button
              onClick={() => {
                setShowEffectsDialog(false);
                setSelectedCombatantForEffects(null);
              }}
              className="bg-green-700 hover:bg-green-600"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCombatReport}
        onOpenChange={setShowCombatReport}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Relatório do Combate
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Round {round} completado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {combatants.map((c) => (
              <Card
                key={c.id}
                className="p-3 bg-slate-700/50 border-slate-600"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">
                      {c.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      Final HP: {c.health}/{c.maxHealth}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    Dano: {c.damageTaken || 0} | Quedas:{" "}
                    {c.timesFallen || 0}
                    {c.isDeceased && (
                      <div className="text-red-400">Morto</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 p-4">
            <Button
              variant="outline"
              onClick={() => setShowCombatReport(false)}
              className="border-slate-600"
            >
              Fechar
            </Button>
            <Button
              onClick={() => {
                setShowCombatReport(false);
                resetCombat();
              }}
              className="bg-green-700 hover:bg-green-600"
            >
              Novo Combate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showReportsList}
        onOpenChange={setShowReportsList}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Relatórios Salvos</DialogTitle>
            <DialogDescription className="text-slate-400">
              Relatórios de combates anteriores (localStorage)
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-3">
            {battleReports.length === 0 ? (
              <div className="text-slate-400">
                Nenhum relatório salvo.
              </div>
            ) : (
              battleReports.map((r: any) => (
                <Card
                  key={r.id}
                  className="p-3 bg-slate-700/50 border-slate-600"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-white font-medium">
                        {new Date(r.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">
                        Rounds: {r.roundEnded}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReport(r);
                        }}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const filtered = battleReports.filter(
                            (br) => br.id !== r.id,
                          );
                          persistReports(filtered);
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="p-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                persistReports([]);
              }}
              className="border-slate-600"
            >
              Limpar todos
            </Button>
            <Button
              onClick={() => setShowReportsList(false)}
              className="bg-green-700 hover:bg-green-600"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Relatório do Combate
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedReport && new Date(selectedReport.timestamp).toLocaleString()} - Round {selectedReport?.roundEnded}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {selectedReport?.combatants.map((c: any) => (
              <Card
                key={c.id}
                className="p-3 bg-slate-700/50 border-slate-600"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">
                      {c.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      Final HP: {c.finalHP}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    Dano: {c.damageTaken || 0} | Quedas:{" "}
                    {c.timesFallen || 0}
                    {c.died && (
                      <div className="text-red-400">Morto</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 p-4">
            <Button
              variant="outline"
              onClick={() => setSelectedReport(null)}
              className="border-slate-600"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
