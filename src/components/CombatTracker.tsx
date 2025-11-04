import { useState } from "react";
import { CombatantCard } from "./CombatantCard";
import { AddCombatantDialog } from "./AddCombatantDialog";
import { SelectExistingCharacterDialog } from "./SelectExistingCharacterDialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Swords, RotateCcw, Play, Pause, Flag } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  isPlayer: boolean;
  deathSaveCount?: number; // Countdown from 3 when at 0 HP
  isDeceased?: boolean; // True when death saves reach 0
  damageTaken?: number; // Total damage taken during combat
  damageDealt?: number; // Total damage dealt during combat
}

export function CombatTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [showCombatReport, setShowCombatReport] = useState(false);

  const sortedCombatants = [...combatants].sort(
    (a, b) => b.initiative - a.initiative,
  );

  // Filter out deceased combatants for turn order
  const activeCombatants = sortedCombatants.filter(c => !c.isDeceased);

  const addCombatant = (combatant: Omit<Combatant, "id">) => {
    const newCombatant = {
      ...combatant,
      id: Date.now().toString(),
      damageTaken: 0,
      damageDealt: 0,
      deathSaveCount: 3,
      isDeceased: false,
    };
    setCombatants([...combatants, newCombatant]);
  };

  const removeCombatant = (id: string) => {
    const index = activeCombatants.findIndex(
      (c) => c.id === id,
    );
    if (combatStarted && index < currentTurnIndex) {
      setCurrentTurnIndex((prev) => Math.max(0, prev - 1));
    }
    setCombatants(combatants.filter((c) => c.id !== id));
  };

  const updateCombatant = (
    id: string,
    updates: Partial<Combatant>,
  ) => {
    setCombatants(
      combatants.map((c) => {
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
      }),
    );
  };

  const reviveCombatant = (id: string) => {
    setCombatants(
      combatants.map((c) =>
        c.id === id
          ? { 
              ...c, 
              health: 1, 
              deathSaveCount: undefined, 
              isDeceased: false 
            }
          : c,
      ),
    );
  };

  const nextTurn = () => {
    if (activeCombatants.length === 0) return;

    // Process death saves for defeated combatants
    setCombatants(combatants.map(c => {
      if (c.health === 0 && !c.isDeceased && c.deathSaveCount !== undefined) {
        const newCount = c.deathSaveCount - 1;
        if (newCount <= 0) {
          return { ...c, deathSaveCount: 0, isDeceased: true };
        }
        return { ...c, deathSaveCount: newCount };
      }
      return c;
    }));

    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= activeCombatants.length) {
      setCurrentTurnIndex(0);
      setRound(round + 1);
    } else {
      setCurrentTurnIndex(nextIndex);
    }
  };

  const startCombat = () => {
    if (combatants.length > 0) {
      setCombatStarted(true);
      setCurrentTurnIndex(0);
      setRound(1);
    }
  };

  const resetCombat = () => {
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setRound(1);
    // Reset all health and stamina to max
    setCombatants(
      combatants.map((c) => ({
        ...c,
        health: c.maxHealth,
        stamina: c.maxStamina,
        deathSaveCount: 3,
        isDeceased: false,
        damageTaken: 0,
        damageDealt: 0,
      })),
    );
  };

  const endCombat = () => {
    setShowCombatReport(true);
  };

  const clearAll = () => {
    setCombatants([]);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setRound(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Controls */}
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <AddCombatantDialog onAdd={addCombatant} />
            <SelectExistingCharacterDialog onSelect={addCombatant} />
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
                Next Turn
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
                  Finalizar Combate
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
              Clique em "Adicionar Personagem" para começar
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedCombatants.map((combatant) => {
            const activeIndex = activeCombatants.findIndex(c => c.id === combatant.id);
            return (
              <CombatantCard
                key={combatant.id}
                combatant={combatant}
                isCurrentTurn={
                  combatStarted && activeIndex === currentTurnIndex
                }
                onUpdate={updateCombatant}
                onRemove={removeCombatant}
                onRevive={reviveCombatant}
              />
            );
          })}
        </div>
      )}

      {/* Combat Report Dialog */}
      <Dialog open={showCombatReport} onOpenChange={setShowCombatReport}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Relatório do Combate</DialogTitle>
            <DialogDescription className="text-slate-400">
              Round {round} completado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-slate-700/50 border-slate-600">
                <div className="text-sm text-slate-400">Total de Rounds</div>
                <div className="text-2xl text-white">{round}</div>
              </Card>
              <Card className="p-4 bg-slate-700/50 border-slate-600">
                <div className="text-sm text-slate-400">Combatentes</div>
                <div className="text-2xl text-white">{sortedCombatants.length}</div>
              </Card>
            </div>

            {/* Damage Statistics */}
            <div>
              <h3 className="text-lg mb-3">Estatísticas de Dano</h3>
              <div className="space-y-2">
                {sortedCombatants.map((combatant) => (
                  <Card key={combatant.id} className="p-4 bg-slate-700/50 border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{combatant.name}</span>
                        <Badge
                          variant={combatant.isPlayer ? "default" : "secondary"}
                          className={combatant.isPlayer ? "bg-blue-600" : "bg-red-600"}
                        >
                          {combatant.isPlayer ? "Player" : "Enemy"}
                        </Badge>
                        {combatant.isDeceased && (
                          <Badge variant="destructive">Morto</Badge>
                        )}
                        {combatant.health === 0 && !combatant.isDeceased && (
                          <Badge className="bg-orange-600">Derrotado</Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-400">
                        HP Final: {combatant.health}/{combatant.maxHealth}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Dano Recebido: </span>
                        <span className="text-red-400">{combatant.damageTaken || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Dano Causado: </span>
                        <span className="text-green-400">{combatant.damageDealt || 0}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Victory/Defeat Status */}
            <div>
              <h3 className="text-lg mb-3">Status Final</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-900/30 border-blue-700">
                  <div className="text-sm text-slate-400 mb-1">Players Vivos</div>
                  <div className="text-2xl text-white">
                    {sortedCombatants.filter(c => c.isPlayer && c.health > 0).length} / {sortedCombatants.filter(c => c.isPlayer).length}
                  </div>
                </Card>
                <Card className="p-4 bg-red-900/30 border-red-700">
                  <div className="text-sm text-slate-400 mb-1">Inimigos Vivos</div>
                  <div className="text-2xl text-white">
                    {sortedCombatants.filter(c => !c.isPlayer && c.health > 0).length} / {sortedCombatants.filter(c => !c.isPlayer).length}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}