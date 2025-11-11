// src/components/ficha/EditAttributesModal.tsx - NOVO COMPONENTE

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Character, Attributes } from '../../types/character';
import { Plus, Minus, RotateCcw, AlertCircle, TrendingUp } from 'lucide-react';
import { calcularStats } from '../../utils/statsCalculator';

interface EditAttributesModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onSave: (newAttributes: Attributes) => Promise<void>;
}

export function EditAttributesModal({ 
  isOpen, 
  onClose, 
  character, 
  onSave 
}: EditAttributesModalProps) {
  const [atributos, setAtributos] = useState<Attributes>(character.atributos);
  const [saving, setSaving] = useState(false);

  // Resetar ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setAtributos(character.atributos);
    }
  }, [isOpen, character.atributos]);

  // Calcular pontos disponíveis baseado no nível
  const calcularPontosDisponiveis = (nivel: number): number => {
    let pontos = 4; // Base para nível 1
    if (nivel >= 4) pontos++;
    if (nivel >= 7) pontos++;
    if (nivel >= 10) pontos++;
    if (nivel >= 13) pontos++;
    if (nivel >= 16) pontos++;
    if (nivel >= 19) pontos++;
    return pontos;
  };

  const pontosBase = 5; // Todos começam com 5 pontos
  const pontosDisponiveis = pontosBase + calcularPontosDisponiveis(character.nivel);
  const pontosUsados = Object.values(atributos).reduce((a, b) => a + b, 0);
  const pontosRestantes = pontosDisponiveis - pontosUsados;

  // Calcular stats com os novos atributos
  const statsAtuais = character.stats;
  const statsNovos = calcularStats(character.classe, character.nivel, atributos, character.grauFeiticeiro);

  const handleIncrement = (attr: keyof Attributes) => {
    if (pontosRestantes > 0 && atributos[attr] < 5) {
      setAtributos(prev => ({ ...prev, [attr]: prev[attr] + 1 }));
    }
  };

  const handleDecrement = (attr: keyof Attributes) => {
    if (atributos[attr] > 0) {
      setAtributos(prev => ({ ...prev, [attr]: prev[attr] - 1 }));
    }
  };

  const handleReset = () => {
    setAtributos(character.atributos);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(atributos);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar atributos:', error);
      alert('Erro ao salvar atributos. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const atributosConfig = [
    { key: 'agilidade' as keyof Attributes, label: 'Agilidade', abbr: 'AGI', color: 'blue' },
    { key: 'forca' as keyof Attributes, label: 'Força', abbr: 'FOR', color: 'red' },
    { key: 'intelecto' as keyof Attributes, label: 'Intelecto', abbr: 'INT', color: 'purple' },
    { key: 'presenca' as keyof Attributes, label: 'Presença', abbr: 'PRE', color: 'yellow' },
    { key: 'vigor' as keyof Attributes, label: 'Vigor', abbr: 'VIG', color: 'green' },
  ];

  const hasChanges = JSON.stringify(atributos) !== JSON.stringify(character.atributos);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Atributos</DialogTitle>
          <DialogDescription className="text-slate-400">
            Ajuste os atributos do seu personagem. Os stats serão recalculados automaticamente.
          </DialogDescription>
        </DialogHeader>

        {/* Contador de Pontos */}
        <Card className="bg-slate-800 border-slate-700 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pontos Disponíveis</p>
              <p className="text-xs text-slate-500">
                Nível {character.nivel}: {pontosBase} (base) + {calcularPontosDisponiveis(character.nivel)} (nível) = {pontosDisponiveis}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${pontosRestantes === 0 ? 'text-green-500' : pontosRestantes < 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                {pontosRestantes}
              </p>
              <p className="text-xs text-slate-400">Restantes</p>
            </div>
          </div>
          {pontosRestantes < 0 && (
            <div className="mt-3 flex items-start gap-2 bg-red-900/30 border border-red-700 rounded-lg p-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">
                Você excedeu o limite de pontos! Remova {Math.abs(pontosRestantes)} ponto(s).
              </p>
            </div>
          )}
        </Card>

        {/* Grid de Atributos */}
        <div className="space-y-3">
          {atributosConfig.map((config) => {
            const valor = atributos[config.key];
            const valorOriginal = character.atributos[config.key];
            const mudou = valor !== valorOriginal;

            return (
              <Card key={config.key} className={`p-4 ${mudou ? 'bg-blue-900/20 border-blue-600' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`bg-${config.color}-700 text-${config.color}-100 border-${config.color}-600`}>
                        {config.abbr}
                      </Badge>
                      <p className="font-semibold text-white">{config.label}</p>
                      {mudou && (
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    {mudou && (
                      <p className="text-xs text-blue-400 mt-1">
                        {valorOriginal} → {valor} ({valor > valorOriginal ? '+' : ''}{valor - valorOriginal})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDecrement(config.key)}
                      disabled={valor === 0}
                      className="w-8 h-8 p-0 border-slate-600 hover:bg-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <span className="text-2xl font-bold text-white w-8 text-center">
                      {valor}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleIncrement(config.key)}
                      disabled={pontosRestantes === 0 || valor === 5}
                      className="w-8 h-8 p-0 border-slate-600 hover:bg-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Comparação de Stats */}
        {hasChanges && (
          <Card className="bg-purple-900/20 border-purple-700 p-4 mt-4">
            <p className="text-sm font-semibold text-purple-300 mb-3">📊 Impacto nos Stats:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'PV Máx', atual: statsAtuais.pvMax, novo: statsNovos.pvMax },
                { label: 'PE Máx', atual: statsAtuais.peMax, novo: statsNovos.peMax },
                { label: 'EA Máx', atual: statsAtuais.eaMax, novo: statsNovos.eaMax },
                { label: 'SAN Máx', atual: statsAtuais.sanMax, novo: statsNovos.sanMax },
                { label: 'Defesa', atual: statsAtuais.defesa, novo: statsNovos.defesa },
                { label: 'Desloc.', atual: statsAtuais.deslocamento, novo: statsNovos.deslocamento },
              ].map((stat) => {
                const diferenca = stat.novo - stat.atual;
                const mudou = diferenca !== 0;

                return (
                  <div key={stat.label} className={`p-2 rounded ${mudou ? 'bg-purple-800/30' : 'bg-slate-800'}`}>
                    <p className="text-slate-400">{stat.label}</p>
                    <p className={`font-semibold ${mudou ? 'text-purple-300' : 'text-white'}`}>
                      {stat.atual} → {stat.novo}
                      {mudou && (
                        <span className={diferenca > 0 ? 'text-green-400' : 'text-red-400'}>
                          {' '}({diferenca > 0 ? '+' : ''}{diferenca})
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={pontosRestantes < 0 || !hasChanges || saving}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
