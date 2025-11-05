import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { apiRequest } from "../utils/api";
import type { Combatant } from "./TrackerCombate";
import type { NPCTemplate } from "./BibliotecaNPC";
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

export function TrackerCombateSala({
  roomCode,
  isDM,
  onLeaveRoom,
}: RoomCombatTrackerProps) {
  const { getAccessToken, user } = useAuth();
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCombatReport, setShowCombatReport] =
    useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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

  const sortedCombatants = [...combatants].sort(
    (a, b) => b.initiative - a.initiative,
  );
  const activeCombatants = sortedCombatants.filter(
    (c) => !c.isDeceased,
  );

  const playerCombatant = sortedCombatants.find(
    (c) => c.isPlayer && c.id.startsWith(`player_${user?.id}`),
  );

  // Fetch room data
  const fetchRoom = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const { room } = await apiRequest(
        `/rooms/${roomCode}`,
        {},
        token,
      );

      const validCombatants = (room.combatants || []).filter(
        (c: any) => c && c.id,
      );
      setCombatants(validCombatants);
      setCurrentTurnIndex(room.currentTurnIndex || 0);
      setCombatStarted(room.combatStarted || false);
      setRound(room.round || 1);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch room:", err);
      setLoading(false);
    }
  };

  const updateRoom = async (updates: any) => {
    try {
      setIsSyncing(true);
      const token = await getAccessToken();
      if (!token) return;
      await apiRequest(
        `/rooms/${roomCode}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        },
        token,
      );
    } catch (err) {
      console.error("Failed to update room:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchRoom();
    const interval = setInterval(() => {
      if (!isSyncing) fetchRoom();
    }, 2000);
    return () => clearInterval(interval);
  }, [roomCode, isSyncing]);

  const addCombatant = async (
    combatant: Omit<Combatant, "id">,
  ) => {
    const newCombatant = {
      ...combatant,
      id: `${isDM ? "npc" : `player_${user?.id}`}_${Date.now()}`,
      damageTaken: 0,
      damageDealt: 0,
      deathSaveCount: 3,
      isDeceased: false,
      timesFallen: 0,
      timesDied: 0,
      fellOnRound: null,
    };
    const updatedCombatants = [...combatants, newCombatant];
    setCombatants(updatedCombatants);
    await updateRoom({ combatants: updatedCombatants });
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
    const index = activeCombatants.findIndex(
      (c) => c.id === id,
    );
    const newList = combatants.filter((c) => c.id !== id);
    if (combatStarted && index < currentTurnIndex) {
      const newIndex = Math.max(0, currentTurnIndex - 1);
      setCurrentTurnIndex(newIndex);
      await updateRoom({
        combatants: newList,
        currentTurnIndex: newIndex,
      });
    } else {
      await updateRoom({ combatants: newList });
    }
    setCombatants(newList);
  };

  const updateCombatant = async (
    id: string,
    updates: Partial<Combatant>,
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
      }

      return updated;
    });
    setCombatants(updatedCombatants);
    await updateRoom({ combatants: updatedCombatants });
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
          }
        : c,
    );
    setCombatants(updatedCombatants);
    await updateRoom({ combatants: updatedCombatants });
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
    // Sync to server that combat has ended
    await updateRoom({
      combatStarted: false,
      currentTurnIndex: 0,
    });
  };

  const nextTurn = async () => {
    if (activeCombatants.length === 0) return;

    const currentCombatant = activeCombatants[currentTurnIndex];
    
    // Safety check: if currentCombatant is undefined, reset turn index
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
          return {
            ...c,
            deathSaveCount: 0,
            isDeceased: true,
            timesDied: (c.timesDied || 0) + 1,
          };
        }
        return { ...c, deathSaveCount: newCount };
      }
      return c;
    });
    setCombatants(updatedWithDeathSaves);

    // Recalculate active combatants after death save updates
    const updatedActiveCombatants = updatedWithDeathSaves
      .filter((c) => !c.isDeceased)
      .sort((a, b) => b.initiative - a.initiative);

    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= updatedActiveCombatants.length) {
      setCurrentTurnIndex(0);
      setRound(round + 1);
      await updateRoom({
        combatants: updatedWithDeathSaves,
        currentTurnIndex: 0,
        round: round + 1,
      });
    } else {
      setCurrentTurnIndex(nextIndex);
      await updateRoom({
        combatants: updatedWithDeathSaves,
        currentTurnIndex: nextIndex,
      });
    }
  };

  const startCombat = async () => {
    if (combatants.length > 0) {
      setCombatStarted(true);
      setCurrentTurnIndex(0);
      setRound(1);
      await updateRoom({
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
          <div className="text-center text-slate-400">
            Carregando sala...
          </div>
        </Card>
      </div>
    );
  }

  // Player view - show player's own combatant and initiative list; allow player to edit own stats
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
                <AddCombatantDialog onAdd={addCombatant} />
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
              isOwner={true} // allow editing of own stats
            />

            {/* Initiative order list (names + status) */}
            {combatStarted && sortedCombatants.length > 0 && (
              <Card className="p-4 bg-slate-800/50 border-slate-700 mt-4">
                <h4 className="text-slate-300 mb-2">
                  Ordem de Iniciativa
                </h4>
                <div className="space-y-2">
                  {sortedCombatants.map((c, idx) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm">
                          {idx + 1}.
                        </span>
                        <span className="text-white">
                          {c.name}
                        </span>
                      </div>
                      <div>
                        {c.isDeceased ? (
                          <Badge className="bg-red-600">
                            Morto
                          </Badge>
                        ) : c.health === 0 ? (
                          <Badge className="bg-orange-600">
                            Caído
                          </Badge>
                        ) : (
                          <Badge className="bg-green-600">
                            Vivo
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
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
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <AddCombatantDialog onAdd={addCombatant} />
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

          {/* Buttons */}
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
            <CombatantCard
              key={combatant.id}
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
          ))}
        </div>
      )}

      {/* Current Combat Report */}
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

      {/* Reports list dialog */}
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

      {/* Individual Report View Dialog */}
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