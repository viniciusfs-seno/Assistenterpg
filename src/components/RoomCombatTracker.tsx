import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CombatantCard } from './CombatantCard';
import { AddCombatantDialog } from './AddCombatantDialog';
import { SelectExistingCharacterDialog } from './SelectExistingCharacterDialog';
import { NPCLibrary } from './NPCLibrary';
import { DiceRoller } from './DiceRoller';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Swords, RotateCcw, Play, ArrowLeft, Users, Crown, Flag } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { apiRequest } from '../utils/api';
import type { Combatant } from './CombatTracker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface RoomCombatTrackerProps {
  roomCode: string;
  isDM: boolean;
  onLeaveRoom: () => void;
}

export function RoomCombatTracker({ roomCode, isDM, onLeaveRoom }: RoomCombatTrackerProps) {
  const { getAccessToken, user } = useAuth();
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCombatReport, setShowCombatReport] = useState(false);

  const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
  
  // Filter out deceased combatants for turn order
  const activeCombatants = sortedCombatants.filter(c => !c.isDeceased);

  // Player's own combatant
  const playerCombatant = sortedCombatants.find(
    c => c.isPlayer && c.id.startsWith(`player_${user?.id}`)
  );

  // Fetch room data
  const fetchRoom = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }
      const { room } = await apiRequest(`/rooms/${roomCode}`, {}, token);
      
      // Filter out null/undefined combatants
      const validCombatants = (room.combatants || []).filter((c: any) => c && c.id);
      setCombatants(validCombatants);
      setCurrentTurnIndex(room.currentTurnIndex || 0);
      setCombatStarted(room.combatStarted || false);
      setRound(room.round || 1);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch room:', err);
      setLoading(false);
    }
  };

  // Update room data
  const updateRoom = async (updates: any) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }
      await apiRequest(`/rooms/${roomCode}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }, token);
    } catch (err) {
      console.error('Failed to update room:', err);
    }
  };

  // Polling for real-time updates
  useEffect(() => {
    fetchRoom();
    const interval = setInterval(fetchRoom, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [roomCode]);

  const addCombatant = async (combatant: Omit<Combatant, 'id'>) => {
    const newCombatant = {
      ...combatant,
      id: `${isDM ? 'npc' : `player_${user?.id}`}_${Date.now()}`,
      damageTaken: 0,
      damageDealt: 0,
      deathSaveCount: 3,
      isDeceased: false,
    };
    const updatedCombatants = [...combatants, newCombatant];
    setCombatants(updatedCombatants);
    await updateRoom({ combatants: updatedCombatants });
  };

  const removeCombatant = async (id: string) => {
    const index = activeCombatants.findIndex(c => c.id === id);
    if (combatStarted && index < currentTurnIndex) {
      const newIndex = Math.max(0, currentTurnIndex - 1);
      setCurrentTurnIndex(newIndex);
      await updateRoom({
        combatants: combatants.filter(c => c.id !== id),
        currentTurnIndex: newIndex,
      });
    } else {
      await updateRoom({
        combatants: combatants.filter(c => c.id !== id),
      });
    }
  };

  const updateCombatant = async (id: string, updates: Partial<Combatant>) => {
    const updatedCombatants = combatants.map(c => {
      if (c.id !== id) return c;
      
      const updated = { ...c, ...updates };
      
      // Track damage taken
      if (updates.health !== undefined && updates.health < c.health) {
        const damageTaken = c.health - updates.health;
        updated.damageTaken = (c.damageTaken || 0) + damageTaken;
      }
      
      // When health drops to 0, initialize death saves
      if (updated.health === 0 && c.health > 0 && !updated.isDeceased) {
        updated.deathSaveCount = 3;
      }
      
      // When health goes above 0, clear death saves
      if (updated.health > 0) {
        updated.deathSaveCount = undefined;
        updated.isDeceased = false;
      }
      
      return updated;
    });
    setCombatants(updatedCombatants);
    await updateRoom({ combatants: updatedCombatants });
  };

  const reviveCombatant = async (id: string) => {
    const updatedCombatants = combatants.map(c =>
      c.id === id
        ? { 
            ...c, 
            health: 1, 
            deathSaveCount: undefined, 
            isDeceased: false 
          }
        : c
    );
    setCombatants(updatedCombatants);
    await updateRoom({ combatants: updatedCombatants });
  };

  const nextTurn = async () => {
    if (activeCombatants.length === 0) return;

    // Process death saves for defeated combatants
    const updatedWithDeathSaves = combatants.map(c => {
      if (c.health === 0 && !c.isDeceased && c.deathSaveCount !== undefined) {
        const newCount = c.deathSaveCount - 1;
        if (newCount <= 0) {
          return { ...c, deathSaveCount: 0, isDeceased: true };
        }
        return { ...c, deathSaveCount: newCount };
      }
      return c;
    });
    setCombatants(updatedWithDeathSaves);
    
    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= activeCombatants.length) {
      setCurrentTurnIndex(0);
      setRound(round + 1);
      await updateRoom({ 
        combatants: updatedWithDeathSaves,
        currentTurnIndex: 0, 
        round: round + 1 
      });
    } else {
      setCurrentTurnIndex(nextIndex);
      await updateRoom({ 
        combatants: updatedWithDeathSaves,
        currentTurnIndex: nextIndex 
      });
    }
  };

  const startCombat = async () => {
    if (combatants.length > 0) {
      setCombatStarted(true);
      setCurrentTurnIndex(0);
      setRound(1);
      await updateRoom({ combatStarted: true, currentTurnIndex: 0, round: 1 });
    }
  };

  const resetCombat = async () => {
    const resetCombatants = combatants.map(c => ({
      ...c,
      health: c.maxHealth,
      stamina: c.maxStamina,
      deathSaveCount: 3,
      isDeceased: false,
      damageTaken: 0,
      damageDealt: 0,
    }));
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setRound(1);
    setCombatants(resetCombatants);
    await updateRoom({
      combatants: resetCombatants,
      combatStarted: false,
      currentTurnIndex: 0,
      round: 1,
    });
  };

  const endCombat = () => {
    setShowCombatReport(true);
  };

  const clearAll = async () => {
    setCombatants([]);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setRound(1);
    await updateRoom({
      combatants: [],
      combatStarted: false,
      currentTurnIndex: 0,
      round: 1,
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 bg-slate-800/50 border-slate-700">
          <div className="text-center text-slate-400">Carregando sala...</div>
        </Card>
      </div>
    );
  }

  // Player view - only see their own character
  if (!isDM) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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
                  <span className="text-slate-400">Sala: {roomCode}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Dice Roller */}
        <DiceRoller />

        {/* Round Counter */}
        {combatStarted && (
          <Alert className="bg-slate-800/50 border-slate-700">
            <AlertDescription className="text-center text-white">
              Round {round}
            </AlertDescription>
          </Alert>
        )}

        {/* Add Character */}
        {!playerCombatant && (
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="text-center space-y-4">
              <div className="text-slate-400">
                <p>Você ainda não adicionou seu personagem</p>
              </div>
              <div className="flex gap-2 justify-center">
                <AddCombatantDialog onAdd={addCombatant} />
                <SelectExistingCharacterDialog onSelect={addCombatant} />
              </div>
            </div>
          </Card>
        )}

        {/* Player's Character */}
        {playerCombatant && (
          <div>
            <h3 className="text-slate-300 mb-3">Seu Personagem</h3>
            <CombatantCard
              combatant={playerCombatant}
              isCurrentTurn={
                combatStarted &&
                sortedCombatants[currentTurnIndex]?.id === playerCombatant.id
              }
              onUpdate={updateCombatant}
              onRemove={removeCombatant}
            />
          </div>
        )}

        {/* Turn Order (names only) */}
        {combatStarted && sortedCombatants.length > 0 && (
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <h3 className="text-slate-300 mb-3">Ordem de Iniciativa</h3>
            <div className="space-y-2">
              {sortedCombatants.map((c, idx) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-2 p-2 rounded ${
                    idx === currentTurnIndex
                      ? 'bg-blue-600/30 border border-blue-500'
                      : 'bg-slate-700/50'
                  }`}
                >
                  <span className="text-slate-400 text-sm w-6">{idx + 1}.</span>
                  <span className="text-white">{c.name}</span>
                  {idx === currentTurnIndex && (
                    <Badge className="ml-auto bg-yellow-600">Turno Atual</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // DM view - see everything
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
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
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600">
                  <Crown className="w-3 h-3 mr-1" />
                  Mestre
                </Badge>
                <span className="text-slate-400">Sala: {roomCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <AddCombatantDialog onAdd={addCombatant} />
            <SelectExistingCharacterDialog onSelect={addCombatant} />
            <NPCLibrary onSelectNPC={addCombatant} />
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
              <Button onClick={nextTurn} className="bg-blue-600 hover:bg-blue-700">
                <Swords className="w-4 h-4 mr-2" />
                Próximo Turno
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {combatStarted && (
              <Button
                onClick={resetCombat}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
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

      {/* Dice Roller */}
      <DiceRoller />

      {/* Round Counter */}
      {combatStarted && (
        <Alert className="bg-slate-800/50 border-slate-700">
          <AlertDescription className="text-center text-white">
            Round {round}
          </AlertDescription>
        </Alert>
      )}

      {/* Combatants List */}
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
          {sortedCombatants.map((combatant, index) => (
            <CombatantCard
              key={combatant.id}
              combatant={combatant}
              isCurrentTurn={combatStarted && index === currentTurnIndex}
              onUpdate={updateCombatant}
              onRemove={removeCombatant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
