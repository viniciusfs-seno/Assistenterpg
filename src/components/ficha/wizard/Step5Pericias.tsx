// src/components/ficha/wizard/Step5Pericias.tsx - CORRIGIDO COMPLETO

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
  
  const periciasLivresTotal = calcularPericiasLivres(data.classe, data.atributos.intelecto);
  const periciasGarantidas = data.periciasTreinadas || [];
  const periciasGarantidasReais = new Set<string>();
  
  (classeData?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));
  (origemData?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));
  
  if (classeData?.periciasEscolha) {
    classeData.periciasEscolha.forEach(escolha => {
      escolha.opcoes.forEach(opcao => {
        if (periciasGarantidas.includes(opcao)) {
          periciasGarantidasReais.add(opcao);
        }
      });
    });
  }
  
  if (origemData?.periciasEscolha) {
    origemData.periciasEscolha.opcoes.forEach(opcao => {
      if (periciasGarantidas.includes(opcao)) {
        periciasGarantidasReais.add(opcao);
      }
    });
  }
  
  const periciasLivresEscolhidas = periciasGarantidas.filter(p => 
    !periciasGarantidasReais.has(p)
  );

  const periciasLivresRestantes = periciasLivresTotal - periciasLivresEscolhidas.length;

  const togglePericia = (nomePericias: string) => {
    const index = periciasGarantidas.indexOf(nomePericias);
    
    if (index > -1) {
      if (!periciasGarantidasReais.has(nomePericias)) {
        const novasPericias = [...periciasGarantidas];
        novasPericias.splice(index, 1);
        updateData({ periciasTreinadas: novasPericias });
      }
    } else {
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
        <h3 className="text-xl font-semibold text-white mb-2">📚 Perícias Treinadas</h3>
        <p className="mb-4" style={{ color: '#cbd5e1' }}>
          Selecione as perícias nas quais seu personagem é treinado. Perícias treinadas ganham +5 nos testes.
        </p>
      </div>

      <Card 
        className="p-4"
        style={{
          backgroundColor: 'rgba(30, 64, 175, 0.2)',
          borderColor: '#3b82f6',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
          <div className="space-y-2">
            <p className="text-sm font-semibold" style={{ color: '#bfdbfe' }}>
              📋 Perícias Garantidas
            </p>
            
            {classeData && classeData.periciasTreinadas.length > 0 && (
              <div className="text-xs">
                <span className="font-semibold" style={{ color: '#93c5fd' }}>
                  Classe ({classeData.nome}) - Fixas:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {classeData.periciasTreinadas.map(p => (
                    <Badge 
                      key={p} 
                      variant="outline" 
                      style={{
                        backgroundColor: '#14532d',
                        color: '#86efac',
                        borderColor: '#15803d'
                      }}
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {classeData?.periciasEscolha && classeData.periciasEscolha.length > 0 && (
              <div className="text-xs">
                <span className="font-semibold" style={{ color: '#93c5fd' }}>
                  Classe ({classeData.nome}) - Escolhidas:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {periciasGarantidas
                    .filter(p => {
                      return classeData.periciasEscolha!.some(escolha => 
                        escolha.opcoes.includes(p)
                      ) && !classeData.periciasTreinadas.includes(p);
                    })
                    .map(p => (
                      <Badge 
                        key={p} 
                        variant="outline" 
                        style={{
                          backgroundColor: '#1e3a8a',
                          color: '#93c5fd',
                          borderColor: '#1d4ed8'
                        }}
                      >
                        {p}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            )}
            
            {origemData && origemData.periciasTreinadas.length > 0 && (
              <div className="text-xs">
                <span className="font-semibold" style={{ color: '#93c5fd' }}>
                  Origem ({origemData.nome}) - Fixas:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {origemData.periciasTreinadas.map(p => (
                    <Badge 
                      key={p} 
                      variant="outline" 
                      style={{
                        backgroundColor: '#14532d',
                        color: '#86efac',
                        borderColor: '#15803d'
                      }}
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {origemData?.periciasEscolha && (
              <div className="text-xs">
                <span className="font-semibold" style={{ color: '#93c5fd' }}>
                  Origem ({origemData.nome}) - Escolhidas:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {periciasGarantidas
                    .filter(p => {
                      return origemData.periciasEscolha!.opcoes.includes(p) && 
                             !origemData.periciasTreinadas.includes(p);
                    })
                    .map(p => (
                      <Badge 
                        key={p} 
                        variant="outline" 
                        style={{
                          backgroundColor: '#1e3a8a',
                          color: '#93c5fd',
                          borderColor: '#1d4ed8'
                        }}
                      >
                        {p}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            )}
            
            <p className="text-xs italic mt-2" style={{ color: '#cbd5e1' }}>
              Essas perícias foram selecionadas na sua classe e origem e não podem ser removidas.
            </p>
          </div>
        </div>
      </Card>

      <Card 
        className="p-4"
        style={{
          backgroundColor: 'rgba(88, 28, 135, 0.2)',
          borderColor: '#a855f7',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#d8b4fe' }}>
              🎯 Perícias Livres
            </p>
            <p className="text-xs" style={{ color: '#e2e8f0' }}>
              {classeData?.periciasLivres.base} (base da classe) + {data.atributos.intelecto} (Intelecto) = {periciasLivresTotal} perícia(s) livre(s)
            </p>
          </div>
          <div className="text-right">
            <p 
              className="text-2xl font-bold"
              style={{ color: periciasLivresRestantes === 0 ? '#22c55e' : '#eab308' }}
            >
              {periciasLivresEscolhidas.length} / {periciasLivresTotal}
            </p>
            <p className="text-xs" style={{ color: '#e2e8f0' }}>Escolhidas</p>
          </div>
        </div>
      </Card>

      {periciasLivresRestantes > 0 && (
        <Card 
          className="p-4"
          style={{
            backgroundColor: 'rgba(113, 63, 18, 0.2)',
            borderColor: '#ca8a04',
            borderWidth: '1px'
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#facc15' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#fef08a' }}>
                ⚠️ Você ainda pode escolher {periciasLivresRestantes} perícia(s)!
              </p>
              <p className="text-xs mt-1" style={{ color: '#fde047' }}>
                Clique nas perícias abaixo para adicioná-las à sua ficha.
              </p>
            </div>
          </div>
        </Card>
      )}

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
                    ? 'cursor-not-allowed'
                    : isSelected
                    ? 'cursor-pointer'
                    : canSelect
                    ? 'cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={
                  isSelected && isGarantida
                    ? {
                        backgroundColor: 'rgba(20, 83, 45, 0.3)',
                        borderColor: '#16a34a',
                        borderWidth: '1px'
                      }
                    : isSelected
                    ? {
                        backgroundColor: 'rgba(88, 28, 135, 0.3)',
                        borderColor: '#a855f7',
                        borderWidth: '1px'
                      }
                    : canSelect
                    ? {
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderWidth: '1px'
                      }
                    : {
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderWidth: '1px'
                      }
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-white">{pericia.nome}</p>
                      {isSelected && (
                        <CheckCircle 
                          className="w-4 h-4" 
                          style={{ color: isGarantida ? '#22c55e' : '#a855f7' }} 
                        />
                      )}
                      {isGarantida && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            backgroundColor: '#14532d',
                            color: '#86efac',
                            borderColor: '#15803d'
                          }}
                        >
                          ✓ Garantida
                        </Badge>
                      )}
                      {canRemove && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            backgroundColor: '#581c87',
                            color: '#d8b4fe',
                            borderColor: '#7e22ce'
                          }}
                        >
                          ★ Livre
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: '#cbd5e1' }}>
                      <span className="font-semibold">Base:</span> {pericia.atributoBase.slice(0, 3).toUpperCase()}
                    </p>
                    {pericia.somenteComTreinamento && (
                      <Badge 
                        variant="outline" 
                        className="text-xs mt-1"
                        style={{
                          backgroundColor: '#7c2d12',
                          color: '#fdba74',
                          borderColor: '#c2410c'
                        }}
                      >
                        🔒 Só Treinada
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card 
        className="p-4"
        style={{
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          borderWidth: '1px'
        }}
      >
        <p className="text-sm" style={{ color: '#e2e8f0' }}>
          <span className="font-semibold" style={{ color: '#60a5fa' }}>💡 Dica:</span> Perícias com badge "Garantida" (verde) vêm da sua classe/origem e não podem ser removidas.
          Perícias com badge "Livre" (roxo) podem ser adicionadas ou removidas livremente até o limite de perícias livres disponíveis.
        </p>
      </Card>
    </div>
  );
}
