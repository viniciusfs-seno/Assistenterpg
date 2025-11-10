// PersonagemCard.tsx - VERSÃO COMPLETA COM TODAS AS CORREÇÕES

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
  combatant: Combatant & {
    effects?: string[];
    insanitySaveCount?: number;
    isInsane?: boolean;
    fellInsaneOnRound?: number | null;
  };
  isCurrentTurn?: boolean;
  onUpdate: (id: string, updates: Partial<Combatant>) => void;
  onRemove: (id: string) => void;
  onRevive?: (id: string) => void;
  onTreatInsanity?: (id: string) => void;
  isDM?: boolean;
  isOwner?: boolean;
}

// ⬅️ MUDANÇA: Adicionar "Caído" aos efeitos
const AVAILABLE_EFFECTS = [
  { id: 'poisoned', label: 'Envenenado', color: 'bg-green-700', icon: '☠️' },
  { id: 'burning', label: 'Em Chamas', color: 'bg-orange-600', icon: '🔥' },
  { id: 'paralyzed', label: 'Paralizado', color: 'bg-purple-600', icon: '⚡' },
  { id: 'prone', label: 'Caído', color: 'bg-slate-600', icon: '🔻' }, // ⬅️ NOVO
];

export function CombatantCard({
  combatant,
  isCurrentTurn = false,
  onUpdate,
  onRemove,
  onRevive,
  onTreatInsanity,
  isDM = false,
  isOwner = false,
}: CombatantCardProps) {
  const [editingInitiative, setEditingInitiative] = useState(false);
  const [initiativeValue, setInitiativeValue] = useState(combatant.initiative);
  
  const [healthCustom, setHealthCustom] = useState('');
  const [staminaCustom, setStaminaCustom] = useState('');
  const [cursedCustom, setCursedCustom] = useState('');
  const [sanityCustom, setSanityCustom] = useState('');

  const canEdit = isDM || isOwner;

  const adjust = (field: 'health' | 'stamina' | 'cursed' | 'sanity', amount: number) => {
    if (field === 'health') {
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

  const applyCustomValue = (field: 'health' | 'stamina' | 'cursed' | 'sanity', value: string) => {
    if (!value.trim()) return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    adjust(field, numValue);
    
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
  const isInsane = combatant.isInsane || false;
  const isGoingInsane = combatant.sanity === 0 && !isInsane && combatant.insanitySaveCount !== undefined;

  // ⬅️ MUDANÇA 1: Remove badge "Morrendo" para não ser redundante
  const getStatusBadges = () => {
    const badges = [];
    const isWounded = combatant.health > 0 && combatant.health <= combatant.maxHealth * 0.5;
    
    if (isDeceased) {
      badges.push(<Badge key="deceased" className="bg-red-600"><Skull className="w-3 h-3 mr-1" />Morto</Badge>);
    } else if (isDead) {
      // ⬅️ NÃO mostra badge "Morrendo" aqui (redundante com "Morrendo (X)")
      if (isWounded) {
        badges.push(<Badge key="wounded" className="bg-yellow-600">Machucado</Badge>);
      }
    } else {
      badges.push(<Badge key="alive" className="bg-green-600">Vivo</Badge>);
      if (isWounded) {
        badges.push(<Badge key="wounded" className="bg-yellow-600">Machucado</Badge>);
      }
    }
    
    // ⬅️ CORREÇÃO: Badge "Enlouqueceu" com inline style
    if (isInsane) {
      badges.push(
        <Badge 
          key="insane" 
          className="text-white shadow-lg font-semibold"
          style={{ backgroundColor: '#ec4899', borderColor: '#f472b6' }}
        >
          <Brain className="w-3 h-3 mr-1" />Enlouqueceu
        </Badge>
      );
    }
    
    return badges;
  };

  const getEffectBadges = () => {
    if (!combatant.effects || combatant.effects.length === 0) return null;
    
    return combatant.effects.map(effectId => {
      const effect = AVAILABLE_EFFECTS.find(e => e.id === effectId);
      if (!effect) return null;
      
      return (
        <Badge key={effectId} className={`${effect.color} text-white`}>
          {effect.icon} {effect.label}
        </Badge>
      );
    }).filter(Boolean);
  };

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
              
              {/* ⬅️ MUDANÇA: Mostra badges de status SEMPRE (não só para mestre) */}
              {getStatusBadges()}
              {getEffectBadges()}
              
              {isCurrentTurn && !isDeceased && (<Badge className="bg-yellow-600">Turno Atual</Badge>)}
              
              {isDead && !isDeceased && combatant.deathSaveCount !== undefined && (
                <Badge className="bg-orange-600 text-white border-2 border-orange-400 shadow-lg">
                  <HeartPulse className="w-3 h-3 mr-1" />Morrendo ({combatant.deathSaveCount})
                </Badge>
              )}
              
              {isGoingInsane && (
                <Badge 
                  className="text-white border-2 shadow-lg font-semibold"
                  style={{ backgroundColor: '#ec4899', borderColor: '#f472b6' }}
                >
                  <Brain className="w-3 h-3 mr-1" />Enlouquecendo ({combatant.insanitySaveCount})
                </Badge>
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
            
            {canEdit && !isDeceased && !(isDead && !isDM) && (
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
                    className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
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
              
              {isDM && isGoingInsane && onTreatInsanity && (
                <Button 
                  size="sm" 
                  onClick={() => onTreatInsanity(combatant.id)} 
                  className="w-full text-white font-semibold shadow-lg mt-2"
                  style={{ backgroundColor: '#06b6d4' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#22d3ee'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#06b6d4'}
                >
                  <Brain className="w-4 h-4 mr-2" /> Tratar (1 Sanidade)
                </Button>
              )}
              
              {/* ⬅️ CORREÇÃO: Bloqueia sanidade se Morrendo OU Enlouquecendo (para jogadores) */}
              {canEdit && !(isDead && !isDM) && !(isGoingInsane && !isDM) && (
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
                      className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
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
              {canEdit && !(isDead && !isDM) && (
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
                      className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
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
              {canEdit && !(isDead && !isDM) && (
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
                      className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
