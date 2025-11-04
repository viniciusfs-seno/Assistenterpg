import { Combatant } from "./CombatTracker";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Heart,
  Zap,
  Plus,
  Minus,
  X,
  Shield,
  Sword,
  HeartPulse,
  Skull,
} from "lucide-react";

interface CombatantCardProps {
  combatant: Combatant;
  isCurrentTurn: boolean;
  onUpdate: (id: string, updates: Partial<Combatant>) => void;
  onRemove: (id: string) => void;
  onRevive?: (id: string) => void;
}

export function CombatantCard({
  combatant,
  isCurrentTurn,
  onUpdate,
  onRemove,
  onRevive,
}: CombatantCardProps) {
  const adjustHealth = (amount: number) => {
    const newHealth = Math.max(
      0,
      Math.min(combatant.maxHealth, combatant.health + amount),
    );
    onUpdate(combatant.id, { health: newHealth });
  };

  const adjustStamina = (amount: number) => {
    const newStamina = Math.max(
      0,
      Math.min(
        combatant.maxStamina,
        combatant.stamina + amount,
      ),
    );
    onUpdate(combatant.id, { stamina: newStamina });
  };

  const healthPercent =
    (combatant.health / combatant.maxHealth) * 100;
  const staminaPercent =
    (combatant.stamina / combatant.maxStamina) * 100;

  const getHealthColor = () => {
    if (healthPercent > 60) return "bg-green-500";
    if (healthPercent > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const isDead = combatant.health === 0;
  const isDeceased = combatant.isDeceased || false;

  return (
    <Card
      className={`p-4 transition-all ${
        isCurrentTurn
          ? "bg-blue-900/30 border-blue-500 border-2 shadow-lg shadow-blue-500/20"
          : isDeceased
            ? "bg-slate-900/60 border-red-900 opacity-50"
            : isDead
              ? "bg-slate-800/30 border-orange-700 opacity-70"
              : "bg-slate-800/50 border-slate-700"
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600">
              <span className="text-white">
                {combatant.initiative}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-white ${isDeceased ? "line-through" : ""}`}
                >
                  {combatant.name}
                </h3>
                <Badge
                  variant={
                    combatant.isPlayer ? "default" : "secondary"
                  }
                  className={
                    combatant.isPlayer
                      ? "bg-blue-600"
                      : "bg-red-600"
                  }
                >
                  {combatant.isPlayer ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" /> Player
                    </>
                  ) : (
                    <>
                      <Sword className="w-3 h-3 mr-1" /> Enemy
                    </>
                  )}
                </Badge>
                {isCurrentTurn && !isDeceased && (
                  <Badge className="bg-yellow-600">
                    Current Turn
                  </Badge>
                )}
                {isDeceased && (
                  <Badge variant="destructive" className="bg-black border-red-900">
                    <Skull className="w-3 h-3 mr-1" /> Morto
                  </Badge>
                )}
                {isDead && !isDeceased && combatant.deathSaveCount !== undefined && (
                  <Badge className="bg-orange-600">
                    <HeartPulse className="w-3 h-3 mr-1" /> 
                    Morte em {combatant.deathSaveCount} turnos
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(combatant.id)}
            className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Vida */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Vida</span>
            </div>
            <span className="text-sm text-slate-300">
              {combatant.health} / {combatant.maxHealth}
            </span>
          </div>
          <Progress
            value={healthPercent}
            className="h-2 bg-slate-700"
            indicatorClassName={getHealthColor()}
          />
          
          {/* Revive Button for defeated combatants */}
          {isDead && !isDeceased && onRevive && (
            <Button
              size="sm"
              onClick={() => onRevive(combatant.id)}
              className="w-full bg-green-700 hover:bg-green-600"
            >
              <HeartPulse className="w-4 h-4 mr-2" />
              Reviver (1 HP)
            </Button>
          )}
          
          {/* Health adjustment buttons - disabled if deceased */}
          {!isDeceased && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustHealth(-5)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Minus className="w-4 h-4 mr-1" /> 5
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustHealth(-1)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Minus className="w-4 h-4 mr-1" /> 1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustHealth(1)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-1" /> 1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustHealth(5)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-1" /> 5
              </Button>
            </div>
          )}
        </div>

        {/* Pontos de Esforço */}
        {!isDeceased && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Esforço</span>
              </div>
              <span className="text-sm text-slate-300">
                {combatant.stamina} / {combatant.maxStamina}
              </span>
            </div>
            <Progress
              value={staminaPercent}
              className="h-2 bg-slate-700"
              indicatorClassName="bg-yellow-500"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustStamina(-5)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Minus className="w-4 h-4 mr-1" /> 5
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustStamina(-1)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Minus className="w-4 h-4 mr-1" /> 1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustStamina(1)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-1" /> 1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => adjustStamina(5)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-1" /> 5
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}