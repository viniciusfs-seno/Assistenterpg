// TrackerCombate.tsx — Comentários em PT-BR sem alterar a lógica original

import { useState } from "react";
import { CombatantCard } from "./PersonagemCard";
import { AddCombatantDialog } from "./AddPersonagemDialog";
import { SelectExistingCharacterDialog } from "./AddPersonagemExistenteDialog";
import { NPCLibrary } from "./BibliotecaNPC";
import { DiceRoller } from "./RoladorDados";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Swords, RotateCcw, Play, Flag } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import type { NPCTemplate } from "./BibliotecaNPC";

// Estrutura do combatente em memória local
export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  cursedEnergy: number;
  maxCursedEnergy: number;
  sanity: number;
  maxSanity: number;
  isPlayer: boolean;
  isDeceased?: boolean;
  deathSaveCount?: number;
  damageTaken?: number;
  damageDealt?: number;
  timesFallen?: number;
  timesDied?: number;
  fellOnRound?: number | null;
}

// Estrutura do relatório salvo em localStorage
export interface BattleReport {
  id: string;
  timestamp: string;
  roundEnded: number;
  combatants: {
    id: string;
    name: string;
    damageTaken: number;
    damageDealt: number;
    timesFallen: number;
    died: boolean;
    finalHP: number;
  }[];
}

const REPORTS_STORAGE_KEY = "battleReports_v1";

export function TrackerCombate() {
  // Estado principal do combate (local)
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [combatStarted, setCombatStarted] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [round, setRound] = useState(1);
  // Diálogos e relatórios
  const [showCombatReport, setShowCombatReport] = useState(false);
  const [showReportsList, setShowReportsList] = useState(false);
  const [battleReports, setBattleReports] = useState<BattleReport[]>(() => {
    try {
      const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [selectedReport, setSelectedReport] = useState<BattleReport | null>(null);

  // Ordenação por iniciativa e filtragem de vivos (não mortos definitivos)
  const sortedCombatants = [...combatants].sort(
    (a, b) => b.initiative - a.initiative
  );
  const activeCombatants = sortedCombatants.filter((c) => !c.isDeceased);

  // Persistência de relatórios no localStorage
  const persistReports = (reports: BattleReport[]) => {
    setBattleReports(reports);
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error("Failed to persist reports", e);
    }
  };

  // Adiciona combatente (gera id interno e zera contadores)
  const addCombatant = (combatant: Omit<Combatant, "id">) => {
    const newCombatant: Combatant = {
      ...combatant,
      id: Date.now().toString(),
      damageTaken: 0,
      damageDealt: 0,
      deathSaveCount: 3,
      isDeceased: false,
      timesFallen: 0,
      timesDied: 0,
      fellOnRound: null,
    };
    setCombatants((prev) => [...prev, newCombatant]);
  };

  // Converte template de NPC em combatente e adiciona
  const handleSelectNPC = (npc: Omit<NPCTemplate, "description" | "category">) => {
    const npcCombatant: Omit<Combatant, "id"> = {
      name: npc.name,
      initiative: npc.initiative,
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

  // Remove combatente e ajusta índice de turno quando necessário
  const removeCombatant = (id: string) => {
    const index = activeCombatants.findIndex((c) => c.id === id);
    if (combatStarted && index < currentTurnIndex) {
      const newIndex = Math.max(0, currentTurnIndex - 1);
      setCurrentTurnIndex(newIndex);
    }
    setCombatants((prev) => prev.filter((c) => c.id !== id));
  };

  // Atualiza atributos e deriva contadores de dano/queda/morte
  const updateCombatant = (id: string, updates: Partial<Combatant>) => {
    setCombatants((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };

        // Dano tomado na transição de health
        if (updates.health !== undefined && updates.health < c.health) {
          const damageTaken = c.health - updates.health;
          updated.damageTaken = (c.damageTaken || 0) + damageTaken;
        }

        // Caiu a 0 de vida: reinicia saves de morte e marca rodada
        if (updated.health === 0 && c.health > 0 && !updated.isDeceased) {
          updated.deathSaveCount = 3;
          updated.timesFallen = (c.timesFallen || 0) + 1;
          updated.fellOnRound = round;
        }

        // Se levantou (>0), limpa estados de queda/morte
        if (updated.health > 0) {
          updated.deathSaveCount = undefined;
          updated.isDeceased = false;
          updated.fellOnRound = null;
        }

        return updated;
      })
    );
  };

  // Reviver: volta com 1 HP, limpa flags de morte/queda
  const reviveCombatant = (id: string) => {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, health: 1, isDeceased: false, deathSaveCount: undefined, fellOnRound: null }
          : c
      )
    );
  };

  // Iniciar combate: reseta turno e round
  const startCombat = () => {
    if (combatants.length > 0) {
      setCombatStarted(true);
      setCurrentTurnIndex(0);
      setRound(1);
    }
  };

  // Gera e salva relatório do combate atual (round encerrado)
  const generateReportAndPersist = (endRound: number) => {
    const report: BattleReport = {
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

  // Encerrar combate atual: registra relatório e volta para estado inicial de turno
  const endCombat = () => {
    generateReportAndPersist(round);
    setShowCombatReport(true);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
  };

  // Avançar turno: processa saves de morte e rota índice, avançando round ao final
  const nextTurn = () => {
    if (activeCombatants.length === 0) return;

    const currentCombatant = activeCombatants[currentTurnIndex];

    const updatedCombatants = combatants.map((c) => {
      if (
        c.id === currentCombatant.id &&
        c.health === 0 &&
        !c.isDeceased &&
        c.deathSaveCount !== undefined
      ) {
        // Evita decrementar no mesmo round em que caiu
        if (c.fellOnRound === round) return c;
        const newCount = c.deathSaveCount - 1;
        if (newCount <= 0) {
          return { ...c, deathSaveCount: 0, isDeceased: true, timesDied: (c.timesDied || 0) + 1 };
        }
        return { ...c, deathSaveCount: newCount };
      }
      return c;
    });

    setCombatants(updatedCombatants);

    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= activeCombatants.length) {
      setCurrentTurnIndex(0);
      setRound((prev) => prev + 1);
    } else {
      setCurrentTurnIndex(nextIndex);
    }
  };

  // Reset do estado dos combatentes mantendo lista (novo combate com mesmo grupo)
  const resetCombat = () => {
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
    setCombatants(resetCombatants);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setRound(1);
  };

  // Limpar completamente a lista de combatentes
  const clearAll = () => {
    setCombatants([]);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setRound(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Barra de ações principal */}
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <AddCombatantDialog onAdd={addCombatant} />
            <SelectExistingCharacterDialog onSelect={addCombatant} />
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
              <Button onClick={nextTurn} className="bg-blue-600 hover:bg-blue-700">
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

      {/* Indicador de round em combate */}
      {combatStarted && (
        <Alert className="bg-slate-800/50 border-slate-700">
          <AlertDescription className="text-center text-white">
            Round {round}
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de combatentes ordenados por iniciativa */}
      {sortedCombatants.length === 0 ? (
        <Card className="p-12 bg-slate-800/30 border-slate-700 border-dashed">
          <div className="text-center text-slate-500">
            <Swords className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum personagem adicionado</p>
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
              onRevive={reviveCombatant}
              isDM={true}
            />
          ))}
        </div>
      )}

      {/* Relatório do combate atual (resumo) */}
      <Dialog open={showCombatReport} onOpenChange={setShowCombatReport}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Relatório do Combate</DialogTitle>
            <DialogDescription className="text-slate-400">
              Round {round} completado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {combatants.map((c) => (
              <Card key={c.id} className="p-3 bg-slate-700/50 border-slate-600">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">{c.name}</div>
                    <div className="text-xs text-slate-400">
                      Final HP: {c.health}/{c.maxHealth}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    Dano: {c.damageTaken || 0} | Quedas: {c.timesFallen || 0}
                    {c.isDeceased && <div className="text-red-400">Morto</div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 p-4">
            <Button
              onClick={() => {
                setShowCombatReport(false);
                setCombatStarted(false);
                setCurrentTurnIndex(0);
                setRound(1);
              }}
              className="bg-green-700 hover:bg-green-600"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lista de relatórios salvos */}
      <Dialog open={showReportsList} onOpenChange={setShowReportsList}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Relatórios Salvos</DialogTitle>
            <DialogDescription className="text-slate-400">
              Relatórios de combates anteriores
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-3">
            {battleReports.length === 0 ? (
              <div className="text-slate-400">Nenhum relatório salvo.</div>
            ) : (
              battleReports.map((r) => (
                <Card key={r.id} className="p-3 bg-slate-700/50 border-slate-600">
                  <div className="flex justify-between items-center">
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
                        onClick={() => setSelectedReport(r)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const filtered = battleReports.filter(
                            (br) => br.id !== r.id
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
              onClick={() => persistReports([])}
              className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
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

      {/* Modal de relatório detalhado */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Relatório de Combate</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedReport
                ? new Date(selectedReport.timestamp).toLocaleString()
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 p-4">
              {selectedReport.combatants.map((c) => (
                <Card key={c.id} className="p-3 bg-slate-700/50 border-slate-600">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{c.name}</div>
                      <div className="text-xs text-slate-400">
                        HP final: {c.finalHP}
                      </div>
                    </div>
                    <div className="text-sm text-slate-300">
                      Dano: {c.damageTaken} | Quedas: {c.timesFallen}
                      {c.died && <div className="text-red-400">Morto</div>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end p-4">
            <Button
              onClick={() => setSelectedReport(null)}
              className="bg-green-700 hover:bg-green-600"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
