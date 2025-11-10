// src/components/ficha/wizard/Step5Pericias.tsx - CORRIGIDO

import { useState } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { PERICIAS_BASE } from '../../../types/character';
import { calcularPericiasLivres, getClasseData } from '../../../data/classes';
import { ORIGENS } from '../../../data/origens';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Step5PericiasProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step5Pericias({ data, updateData }: Step5PericiasProps) {
  const classeData = getClasseData(data.classe);
  const origemData = ORIGENS.find(o => o.id === data.origemId);
  
  // Calcular quantidade de perícias livres baseado na classe e intelecto
  const periciasLivresTotal = calcularPericiasLivres(data.classe, data.atributos.intelecto);
  
  // Perícias já garantidas (classe + origem) - APENAS AS EFETIVAMENTE SELECIONADAS
  const periciasGarantidas = data.periciasTreinadas || [];
  
  // Separar perícias garantidas das livres
  const periciasGarantidasReais = new Set<string>();
  
  // Adicionar perícias fixas da classe
  (classeData?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));
  
  // Adicionar perícias fixas da origem
  (origemData?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));
  
  // Adicionar perícias escolhidas da classe (filtrar apenas as que estão em periciasTreinadas)
  if (classeData?.periciasEscolha) {
    classeData.periciasEscolha.forEach(escolha => {
      escolha.opcoes.forEach(opcao => {
        if (periciasGarantidas.includes(opcao)) {
          periciasGarantidasReais.add(opcao);
        }
      });
    });
  }
  
  // Adicionar perícias escolhidas da origem (filtrar apenas as que estão em periciasTreinadas)
  if (origemData?.periciasEscolha) {
    origemData.periciasEscolha.opcoes.forEach(opcao => {
      if (periciasGarantidas.includes(opcao)) {
        periciasGarantidasReais.add(opcao);
      }
    });
  }
  
  // Contar quantas perícias livres já foram escolhidas
  const periciasLivresEscolhidas = periciasGarantidas.filter(p => 
    !periciasGarantidasReais.has(p)
  );

  const periciasLivresRestantes = periciasLivresTotal - periciasLivresEscolhidas.length;

  const togglePericia = (nomePericias: string) => {
    const index = periciasGarantidas.indexOf(nomePericias);
    
    if (index > -1) {
      // Remover apenas se for perícia livre (não garantida)
      if (!periciasGarantidasReais.has(nomePericias)) {
        const novasPericias = [...periciasGarantidas];
        novasPericias.splice(index, 1);
        updateData({ periciasTreinadas: novasPericias });
      }
    } else {
      // Adicionar se ainda tem espaço
      if (periciasLivresRestantes > 0) {
        updateData({ periciasTreinadas: [...periciasGarantidas, nomePericias] });
      }
    }
  };

  const isPericiaGarantida = (nomePericias: string): boolean => {
    return periciasGarantidasReais.has(nomePericias);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Perícias Treinadas</h3>
        <p className="text-slate-400 mb-4">
          Selecione as perícias nas quais seu personagem é treinado. Perícias treinadas ganham +5 nos testes.
        </p>
      </div>

      {/* Informações sobre perícias garantidas - APENAS AS SELECIONADAS */}
      <Card className="bg-blue-900/20 border-blue-700 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-blue-200 font-semibold">Perícias Garantidas</p>
            
            {/* Perícias fixas da classe */}
            {classeData && classeData.periciasTreinadas.length > 0 && (
              <div className="text-xs text-blue-300">
                <span className="font-semibold">Classe ({classeData.nome}) - Fixas:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {classeData.periciasTreinadas.map(p => (
                    <Badge key={p} variant="outline" className="bg-green-900 text-green-300 border-green-700">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Perícias ESCOLHIDAS da classe */}
            {classeData?.periciasEscolha && classeData.periciasEscolha.length > 0 && (
              <div className="text-xs text-blue-300">
                <span className="font-semibold">Classe ({classeData.nome}) - Escolhidas:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {periciasGarantidas
                    .filter(p => {
                      // Verificar se a perícia está em alguma das opções de escolha E foi selecionada
                      return classeData.periciasEscolha!.some(escolha => 
                        escolha.opcoes.includes(p)
                      ) && !classeData.periciasTreinadas.includes(p); // Não duplicar as fixas
                    })
                    .map(p => (
                      <Badge key={p} variant="outline" className="bg-blue-900 text-blue-300 border-blue-700">
                        {p}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            )}
            
            {/* Perícias fixas da origem */}
            {origemData && origemData.periciasTreinadas.length > 0 && (
              <div className="text-xs text-blue-300">
                <span className="font-semibold">Origem ({origemData.nome}) - Fixas:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {origemData.periciasTreinadas.map(p => (
                    <Badge key={p} variant="outline" className="bg-green-900 text-green-300 border-green-700">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Perícias ESCOLHIDAS da origem */}
            {origemData?.periciasEscolha && (
              <div className="text-xs text-blue-300">
                <span className="font-semibold">Origem ({origemData.nome}) - Escolhidas:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {periciasGarantidas
                    .filter(p => {
                      // Verificar se a perícia está nas opções de origem E foi selecionada
                      return origemData.periciasEscolha!.opcoes.includes(p) && 
                             !origemData.periciasTreinadas.includes(p); // Não duplicar as fixas
                    })
                    .map(p => (
                      <Badge key={p} variant="outline" className="bg-blue-900 text-blue-300 border-blue-700">
                        {p}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            )}
            
            <p className="text-xs text-slate-400 italic mt-2">
              Essas perícias foram selecionadas na sua classe e origem e não podem ser removidas.
            </p>
          </div>
        </div>
      </Card>

      {/* Contador de perícias livres */}
      <Card className="bg-purple-900/20 border-purple-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-300">Perícias Livres</p>
            <p className="text-xs text-slate-400">
              {classeData?.periciasLivres.base} (base da classe) + {data.atributos.intelecto} (Intelecto) = {periciasLivresTotal} perícia(s) livre(s)
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${periciasLivresRestantes === 0 ? 'text-green-500' : 'text-yellow-500'}`}>
              {periciasLivresEscolhidas.length} / {periciasLivresTotal}
            </p>
            <p className="text-xs text-slate-400">Escolhidas</p>
          </div>
        </div>
      </Card>

      {/* Aviso se ainda faltam perícias */}
      {periciasLivresRestantes > 0 && (
        <Card className="bg-yellow-900/20 border-yellow-700 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-semibold">
                Você ainda pode escolher {periciasLivresRestantes} perícia(s)!
              </p>
              <p className="text-xs text-yellow-300 mt-1">
                Clique nas perícias abaixo para adicioná-las à sua ficha.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de todas as perícias */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Todas as Perícias</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PERICIAS_BASE.map((pericia) => {
            const isSelected = periciasGarantidas.includes(pericia.nome);
            const isGarantida = isPericiaGarantida(pericia.nome);
            const canSelect = !isGarantida && periciasLivresRestantes > 0;
            const canRemove = isSelected && !isGarantida;

            return (
              <Card
                key={pericia.nome}
                onClick={() => togglePericia(pericia.nome)}
                className={`p-3 transition-all ${
                  isSelected && isGarantida
                    ? 'bg-green-900/30 border-green-600 cursor-not-allowed'
                    : isSelected
                    ? 'bg-purple-900/30 border-purple-500 hover:bg-purple-900/40 cursor-pointer'
                    : canSelect
                    ? 'bg-slate-800 border-slate-700 hover:border-slate-600 cursor-pointer'
                    : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{pericia.nome}</p>
                      {isSelected && (
                        <CheckCircle className={`w-4 h-4 ${isGarantida ? 'text-green-500' : 'text-purple-500'}`} />
                      )}
                      {isGarantida && (
                        <Badge variant="outline" className="text-xs bg-green-900 text-green-300 border-green-700">
                          Garantida
                        </Badge>
                      )}
                      {canRemove && (
                        <Badge variant="outline" className="text-xs bg-purple-900 text-purple-300 border-purple-700">
                          Livre
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold">Base:</span> {pericia.atributoBase.slice(0, 3).toUpperCase()}
                    </p>
                    {pericia.somenteComTreinamento && (
                      <Badge variant="outline" className="text-xs mt-1 bg-orange-900 text-orange-300 border-orange-700">
                        Só Treinada
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dica final */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-blue-400">💡 Dica:</span> Perícias com badge "Garantida" (verde) vêm da sua classe/origem e não podem ser removidas.
          Perícias com badge "Livre" (roxo) podem ser adicionadas ou removidas livremente até o limite de perícias livres disponíveis.
        </p>
      </Card>
    </div>
  );
}
