// PersonagemCard.tsx 

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
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
  RotateCcw,
  Edit,
  Check,
  Brain,
  Sparkles,
} from "lucide-react";
import type { Combatant } from './TrackerCombate';

interface CombatantCardProps {
  combatant: Combatant;
  isCurrentTurn?: boolean;
  onUpdate: (id: string, updates: Partial<Combatant>) => void;
  onRemove: (id: string) => void;
  onRevive?: (id: string) => void;
  isDM?: boolean;
  isOwner?: boolean;
}

export function CombatantCard({
  combatant,
  isCurrentTurn = false,
  onUpdate,
  onRemove,
  onRevive,
  isDM = false,
  isOwner = false,
}: CombatantCardProps) {
  const [editingInitiative, setEditingInitiative] = useState(false);
  const [initiativeValue, setInitiativeValue] = useState(combatant.initiative);
  
  // Estados para os inputs customizados de cada atributo
  const [healthCustom, setHealthCustom] = useState('');
  const [staminaCustom, setStaminaCustom] = useState('');
  const [cursedCustom, setCursedCustom] = useState('');
  const [sanityCustom, setSanityCustom] = useState('');

  const canEdit = isDM || isOwner;

  // Função de ajuste CORRIGIDA - especialmente para sanidade
  const adjust = (field: 'health' | 'stamina' | 'cursed' | 'sanity', amount: number) => {
  if (field === 'health') {
    // Remove Math.min para permitir ultrapassar maxHealth
    const newHealth = Math.max(0, combatant.health + amount);
    onUpdate(combatant.id, { health: newHealth });
  } else if (field === 'stamina') {
    const newStamina = Math.max(0, combatant.stamina + amount);
    onUpdate(combatant.id, { stamina: newStamina });
  } else if (field === 'cursed') {
    const currentCursed = combatant.cursedEnergy ?? 0;
    const newCursed = Math.max(0, currentCursed + amount);
    onUpdate(combatant.id, { cursedEnergy: newCursed });
  } else if (field === 'sanity') {
    const currentSanity = combatant.sanity ?? 100;
    const newSanity = Math.max(0, currentSanity + amount);
    onUpdate(combatant.id, { sanity: newSanity });
  }
};


  // Função para aplicar valor customizado dos inputs
  const applyCustomValue = (field: 'health' | 'stamina' | 'cursed' | 'sanity', value: string) => {
    if (!value.trim()) return;
    
    // Remove espaços e converte para número
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    adjust(field, numValue);
    
    // Limpa o input após aplicar
    if (field === 'health') setHealthCustom('');
    else if (field === 'stamina') setStaminaCustom('');
    else if (field === 'cursed') setCursedCustom('');
    else if (field === 'sanity') setSanityCustom('');
  };

  const healthPercent = Math.min(100, combatant.maxHealth > 0 ? ((combatant.health ?? 0) / combatant.maxHealth) * 100 : 0);
  const staminaPercent = Math.min(100, combatant.maxStamina > 0 ? ((combatant.stamina ?? 0) / combatant.maxStamina) * 100 : 0);
  const cursedPercent = Math.min(100, combatant.maxCursedEnergy > 0 ? ((combatant.cursedEnergy ?? 0) / combatant.maxCursedEnergy) * 100 : 0);
  const sanityPercent = Math.min(100, combatant.maxSanity > 0 ? ((combatant.sanity ?? 100) / combatant.maxSanity) * 100 : 100);


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
        {/* Cabeçalho com iniciativa e badges */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative group">
              {editingInitiative ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={initiativeValue}
                    onChange={(e) => setInitiativeValue(parseInt(e.target.value) || 0)}
                    className="w-16 h-12 text-center bg-slate-700 border-slate-600 text-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onUpdate(combatant.id, { initiative: initiativeValue });
                        setEditingInitiative(false);
                      } else if (e.key === 'Escape') {
                        setInitiativeValue(combatant.initiative);
                        setEditingInitiative(false);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onUpdate(combatant.id, { initiative: initiativeValue });
                      setEditingInitiative(false);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="w-4 h-4 text-green-400" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 cursor-pointer hover:border-slate-500 transition-colors"
                  onClick={() => isDM && setEditingInitiative(true)}
                >
                  <span className="text-white">{combatant.initiative}</span>
                  {isDM && (
                    <Edit className="w-3 h-3 text-slate-400 absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-white ${isDeceased ? "line-through" : ""}`}>{combatant.name}</h3>
                <Badge variant={combatant.isPlayer ? "default" : "secondary"} className={combatant.isPlayer ? "bg-blue-600" : "bg-red-600"}>
                  {combatant.isPlayer ? (<><Shield className="w-3 h-3 mr-1" /> Player</>) : (<><Sword className="w-3 h-3 mr-1" /> NPC</>)}
                </Badge>
                {isCurrentTurn && !isDeceased && (<Badge className="bg-yellow-600">Turno Atual</Badge>)}
                {isDeceased && (<Badge variant="destructive" className="bg-black border-red-900"><Skull className="w-3 h-3 mr-1" /> Morto</Badge>)}
                {isDead && !isDeceased && combatant.deathSaveCount !== undefined && (
                  <Badge className="bg-orange-600"><HeartPulse className="w-3 h-3 mr-1" />Morte em {combatant.deathSaveCount} turnos</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDM && (
              <Button size="sm" variant="ghost" onClick={() => onRemove(combatant.id)} className="text-slate-400 hover:text-red-400 hover:bg-slate-700">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Grid com 2 colunas para os atributos */}
        <div className="grid grid-cols-2 gap-4">
          {/* Coluna 1, Linha 1: Vida */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Vida</span>
              </div>
              <span className="text-sm text-slate-300">{combatant.health} / {combatant.maxHealth}</span>
            </div>
            <Progress value={healthPercent} className="h-2 bg-slate-700" indicatorClassName={getHealthColor()} />
            
            {isDM && isDead && !isDeceased && onRevive && (
              <Button size="sm" onClick={() => onRevive(combatant.id)} className="w-full bg-green-700 hover:bg-green-600 mt-2">
                <HeartPulse className="w-4 h-4 mr-2" /> Reviver (1 HP)
              </Button>
            )}
            
            {canEdit && !isDeceased && (
              <div className="space-y-1 mt-2">
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => adjust('health', -1)} 
                    className="flex-1 border-slate-600"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => adjust('health', 1)} 
                    className="flex-1 border-slate-600"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Input
                    type="text"
                    value={healthCustom}
                    onChange={(e) => setHealthCustom(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyCustomValue('health', healthCustom);
                      }
                    }}
                    placeholder="+5 ou -3"
                    className="flex-1 h-8 text-xs bg-slate-700 border-slate-600 text-white text-center"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyCustomValue('health', healthCustom)}
                    className="border-slate-600"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Coluna 2, Linha 1: Sanidade */}
          {!isDeceased && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>Sanidade</span>
                </div>
                <span className="text-sm text-slate-300">{combatant.sanity ?? 100} / {combatant.maxSanity ?? 100}</span>
              </div>
              <Progress value={sanityPercent} className="h-2 bg-slate-700" indicatorClassName="bg-cyan-500" />
              {canEdit && (
                <div className="space-y-1 mt-2">
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => adjust('sanity', -1)} 
                      className="flex-1 border-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => adjust('sanity', 1)} 
                      className="flex-1 border-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Input
                      type="text"
                      value={sanityCustom}
                      onChange={(e) => setSanityCustom(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          applyCustomValue('sanity', sanityCustom);
                        }
                      }}
                      placeholder="+5 ou -3"
                      className="flex-1 h-8 text-xs bg-slate-700 border-slate-600 text-white text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyCustomValue('sanity', sanityCustom)}
                      className="border-slate-600"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coluna 1, Linha 2: Esforço */}
          {!isDeceased && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Esforço</span>
                </div>
                <span className="text-sm text-slate-300">{combatant.stamina} / {combatant.maxStamina}</span>
              </div>
              <Progress value={staminaPercent} className="h-2 bg-slate-700" indicatorClassName="bg-yellow-500" />
              {canEdit && (
                <div className="space-y-1 mt-2">
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => adjust('stamina', -1)} 
                      className="flex-1 border-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => adjust('stamina', 1)} 
                      className="flex-1 border-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Input
                      type="text"
                      value={staminaCustom}
                      onChange={(e) => setStaminaCustom(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          applyCustomValue('stamina', staminaCustom);
                        }
                      }}
                      placeholder="+5 ou -3"
                      className="flex-1 h-8 text-xs bg-slate-700 border-slate-600 text-white text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyCustomValue('stamina', staminaCustom)}
                      className="border-slate-600"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coluna 2, Linha 2: Energia Amaldiçoada */}
          {!isDeceased && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Energia Amaldiçoada</span>
                </div>
                <span className="text-sm text-slate-300">{combatant.cursedEnergy ?? 0} / {combatant.maxCursedEnergy ?? 0}</span>
              </div>
              <Progress value={cursedPercent} className="h-2 bg-slate-700" indicatorClassName="bg-purple-600" />
              {canEdit && (
                <div className="space-y-1 mt-2">
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => adjust('cursed', -1)} 
                      className="flex-1 border-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => adjust('cursed', 1)} 
                      className="flex-1 border-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Input
                      type="text"
                      value={cursedCustom}
                      onChange={(e) => setCursedCustom(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          applyCustomValue('cursed', cursedCustom);
                        }
                      }}
                      placeholder="+5 ou -3"
                      className="flex-1 h-8 text-xs bg-slate-700 border-slate-600 text-white text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyCustomValue('cursed', cursedCustom)}
                      className="border-slate-600"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Badge de status agregado */}
        <div className="mt-2">
          {combatant.isDeceased ? (
            <Badge className="bg-red-600">Morto</Badge>
          ) : combatant.health === 0 ? (
            <Badge className="bg-orange-600">Caído ({combatant.deathSaveCount})</Badge>
          ) : (
            <Badge className="bg-green-600">Ativo</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
