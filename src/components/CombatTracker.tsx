import { useState } from "react";
import { CombatantCard } from "./CombatantCard";
import { AddCombatantDialog } from "./AddCombatantDialog";
import { SelectExistingCharacterDialog } from "./SelectExistingCharacterDialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Swords, RotateCcw, Play, Pause } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  isPlayer: boolean;
}

export function CombatTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatStarted, setCombatStarted] = useState(false);
  const [round, setRound] = useState(1);

  const sortedCombatants = [...combatants].sort(
    (a, b) => b.initiative - a.initiative,
  );

  const addCombatant = (combatant: Omit<Combatant, "id">) => {
    const newCombatant = {
      ...combatant,
      id: Date.now().toString(),
    };
    setCombatants([...combatants, newCombatant]);
  };

  const removeCombatant = (id: string) => {
    const index = sortedCombatants.findIndex(
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
      combatants.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    );
  };

  const nextTurn = () => {
    if (sortedCombatants.length === 0) return;

    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= sortedCombatants.length) {
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
      })),
    );
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
          {sortedCombatants.map((combatant, index) => (
            <CombatantCard
              key={combatant.id}
              combatant={combatant}
              isCurrentTurn={
                combatStarted && index === currentTurnIndex
              }
              onUpdate={updateCombatant}
              onRemove={removeCombatant}
            />
          ))}
        </div>
      )}
    </div>
  );
}