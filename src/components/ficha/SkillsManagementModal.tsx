// src/components/ficha/SkillsManagementModal.tsx - NOVO COMPONENTE

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { PERICIAS_BASE, GrauTreinamento } from '../../types/character';
import { Search, TrendingUp, ChevronUp, ChevronDown, Dice6, Plus } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

interface SkillData {
  skillName: string;
  grauTreinamento: GrauTreinamento;
  outros: number;
  atributoBase: string;
  bonusAtributo: number;
  bonusTotal: number;
}

interface SkillsManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: string;
  atributos: {
    agilidade: number;
    forca: number;
    intelecto: number;
    presenca: number;
    vigor: number;
  };
  onUpdate: () => void;
}

export function SkillsManagementModal({
  isOpen,
  onClose,
  characterId,
  atributos,
  onUpdate,
}: SkillsManagementModalProps) {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'bonus'>('nome');

  useEffect(() => {
    if (isOpen) {
      loadSkills();
    }
  }, [isOpen, characterId]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      // Buscar perícias treinadas do personagem
      const { data: characterSkills, error } = await supabase
        .from('character_skills')
        .select('*')
        .eq('character_id', characterId);

      if (error) throw error;

      // Criar mapa de perícias treinadas
      const skillsMap = new Map(
        (characterSkills || []).map(skill => [
          skill.skill_name,
          {
            grauTreinamento: skill.grau_treinamento as GrauTreinamento,
            outros: skill.outros || 0,
          }
        ])
      );

      // Combinar com lista completa de perícias
      const todasPericias: SkillData[] = PERICIAS_BASE.map(pericia => {
        const skillData = skillsMap.get(pericia.nome);
        const grau = skillData?.grauTreinamento || GrauTreinamento.DESTREINADO;
        const outros = skillData?.outros || 0;

        // Calcular bônus do atributo
        const atributoKey = pericia.atributoBase.toLowerCase() as keyof typeof atributos;
        const bonusAtributo = atributos[atributoKey] || 0;

        // Calcular bônus de treinamento
        const bonusTreinamento = {
          [GrauTreinamento.DESTREINADO]: 0,
          [GrauTreinamento.TREINADO]: 5,
          [GrauTreinamento.GRADUADO]: 10,
          [GrauTreinamento.VETERANO]: 15,
          [GrauTreinamento.EXPERT]: 20,
        }[grau];

        return {
          skillName: pericia.nome,
          grauTreinamento: grau,
          outros,
          atributoBase: pericia.atributoBase,
          bonusAtributo,
          bonusTotal: bonusAtributo + bonusTreinamento + outros,
        };
      });

      setSkills(todasPericias);
    } catch (error) {
      console.error('Erro ao carregar perícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSkillGrade = async (skillName: string, newGrade: GrauTreinamento) => {
    try {
      const skill = skills.find(s => s.skillName === skillName);
      if (!skill) return;

      if (newGrade === GrauTreinamento.DESTREINADO) {
        // Remover do banco se destreinado
        await supabase
          .from('character_skills')
          .delete()
          .eq('character_id', characterId)
          .eq('skill_name', skillName);
      } else {
        // Inserir ou atualizar
        await supabase
          .from('character_skills')
          .upsert({
            character_id: characterId,
            skill_name: skillName,
            grau_treinamento: newGrade,
            outros: skill.outros,
          });
      }

      // Recarregar
      await loadSkills();
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar grau:', error);
      alert('Erro ao atualizar perícia. Tente novamente.');
    }
  };

  const updateBonusOutros = async (skillName: string, delta: number) => {
    try {
      const skill = skills.find(s => s.skillName === skillName);
      if (!skill) return;

      const novoBonus = Math.max(0, skill.outros + delta);

      if (skill.grauTreinamento === GrauTreinamento.DESTREINADO && novoBonus > 0) {
        // Se não está treinado mas tem bônus, criar entrada
        await supabase
          .from('character_skills')
          .insert({
            character_id: characterId,
            skill_name: skillName,
            grau_treinamento: GrauTreinamento.DESTREINADO,
            outros: novoBonus,
          });
      } else {
        // Atualizar bônus existente
        await supabase
          .from('character_skills')
          .update({ outros: novoBonus })
          .eq('character_id', characterId)
          .eq('skill_name', skillName);
      }

      await loadSkills();
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar bônus:', error);
    }
  };

  const rollSkill = (skill: SkillData) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + skill.bonusTotal;
    
    alert(
      `🎲 Rolagem: ${skill.skillName}\n\n` +
      `Dado: ${roll}\n` +
      `Bônus Total: +${skill.bonusTotal}\n` +
      `  • Atributo (${skill.atributoBase}): +${skill.bonusAtributo}\n` +
      `  • Treinamento: +${getBonusTreinamento(skill.grauTreinamento)}\n` +
      `  • Outros: +${skill.outros}\n\n` +
      `RESULTADO: ${total}`
    );
  };

  const getBonusTreinamento = (grau: GrauTreinamento): number => {
    return {
      [GrauTreinamento.DESTREINADO]: 0,
      [GrauTreinamento.TREINADO]: 5,
      [GrauTreinamento.GRADUADO]: 10,
      [GrauTreinamento.VETERANO]: 15,
      [GrauTreinamento.EXPERT]: 20,
    }[grau];
  };

  const filteredSkills = skills
    .filter(skill => 
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'nome') {
        return a.skillName.localeCompare(b.skillName);
      } else {
        return b.bonusTotal - a.bonusTotal;
      }
    });

  const grausDisponiveis = [
    GrauTreinamento.DESTREINADO,
    GrauTreinamento.TREINADO,
    GrauTreinamento.GRADUADO,
    GrauTreinamento.VETERANO,
    GrauTreinamento.EXPERT,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Gerenciar Perícias</DialogTitle>
          <DialogDescription className="text-slate-400">
            Visualize e ajuste todas as perícias do personagem.
          </DialogDescription>
        </DialogHeader>

        {/* Controles de Busca e Ordenação */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar perícia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSortBy(sortBy === 'nome' ? 'bonus' : 'nome')}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            {sortBy === 'nome' ? 'A-Z' : '+Bônus'}
            <TrendingUp className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Lista de Perícias */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {loading ? (
            <p className="text-center text-slate-400 py-8">Carregando perícias...</p>
          ) : filteredSkills.length === 0 ? (
            <p className="text-center text-slate-400 py-8">Nenhuma perícia encontrada.</p>
          ) : (
            filteredSkills.map(skill => (
              <Card key={skill.skillName} className="bg-slate-800 border-slate-700 p-3">
                <div className="flex items-center justify-between gap-3">
                  
                  {/* Info da Perícia */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{skill.skillName}</p>
                      <Badge className="text-xs bg-slate-700">
                        {skill.atributoBase.slice(0, 3).toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${
                        skill.grauTreinamento === GrauTreinamento.DESTREINADO ? 'bg-slate-600' :
                        skill.grauTreinamento === GrauTreinamento.TREINADO ? 'bg-blue-700' :
                        skill.grauTreinamento === GrauTreinamento.GRADUADO ? 'bg-purple-700' :
                        skill.grauTreinamento === GrauTreinamento.VETERANO ? 'bg-orange-700' :
                        'bg-red-700'
                      }`}>
                        {skill.grauTreinamento}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      Bônus: {skill.bonusAtributo} (atrib) + {getBonusTreinamento(skill.grauTreinamento)} (treino) + {skill.outros} (outros) = <span className="font-bold text-green-400">+{skill.bonusTotal}</span>
                    </p>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-2">
                    
                    {/* Ajustar Bônus "Outros" */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateBonusOutros(skill.skillName, -1)}
                        disabled={skill.outros === 0}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <span className="text-sm w-8 text-center text-white">+{skill.outros}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateBonusOutros(skill.skillName, 1)}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Alterar Grau */}
                    <select
                      value={skill.grauTreinamento}
                      onChange={(e) => updateSkillGrade(skill.skillName, e.target.value as GrauTreinamento)}
                      className="bg-slate-700 border-slate-600 text-white text-sm rounded px-2 py-1"
                    >
                      {grausDisponiveis.map(grau => (
                        <option key={grau} value={grau}>{grau}</option>
                      ))}
                    </select>

                    {/* Rolar Dado */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rollSkill(skill)}
                      className="border-green-600 hover:bg-green-900/30"
                    >
                      <Dice6 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer com stats */}
        <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <div className="grid grid-cols-5 gap-3 text-center text-xs">
            {grausDisponiveis.map(grau => {
              const count = skills.filter(s => s.grauTreinamento === grau).length;
              return (
                <div key={grau}>
                  <p className="text-slate-400">{grau}</p>
                  <p className="text-lg font-bold text-white">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
