// src/components/ficha/wizard/Step5Pericias.tsx - CORRIGIDO: Extração correta do nome da perícia

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { PERICIAS_BASE } from '../../../types/character';
import { calcularPericiasLivres, getClasseData } from '../../../data/classes';
import { ORIGENS } from '../../../data/origens';
import { getTrilhaById } from '../../../data/trilhas';
import { CheckCircle, AlertCircle, Info, Lock } from 'lucide-react';

interface Step5PericiasProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step5Pericias({ data, updateData }: Step5PericiasProps) {
  const classeData = getClasseData(data.classe);
  const origemData = ORIGENS.find(o => o.id === data.origemId);
  const trilhaData = data.trilha ? getTrilhaById(data.trilha) : null;
  
  const periciasLivresTotal = calcularPericiasLivres(data.classe, data.atributos.intelecto);
  const periciasGarantidas = data.periciasTreinadas || [];
  
  // 1. Perícias garantidas por CLASSE e ORIGEM (não removíveis E não contam como livres)
  const periciasGarantidasClasseOrigem = new Set<string>();
  
  (classeData?.periciasTreinadas || []).forEach(p => periciasGarantidasClasseOrigem.add(p));
  (origemData?.periciasTreinadas || []).forEach(p => periciasGarantidasClasseOrigem.add(p));
  
  // Adicionar escolhas obrigatórias da classe
  if (classeData?.periciasEscolha) {
    classeData.periciasEscolha.forEach(escolha => {
      escolha.opcoes.forEach(opcao => {
        if (periciasGarantidas.includes(opcao)) {
          periciasGarantidasClasseOrigem.add(opcao);
        }
      });
    });
  }
  
  // Adicionar escolhas obrigatórias da origem
  if (origemData?.periciasEscolha) {
    origemData.periciasEscolha.opcoes.forEach(opcao => {
      if (periciasGarantidas.includes(opcao)) {
        periciasGarantidasClasseOrigem.add(opcao);
      }
    });
  }
  
  // 2. 🎓 Jujutsu da Escola Técnica (NÃO REMOVÍVEL E NÃO CONTA COMO LIVRE)
  const PERICIA_JUJUTSU = 'Jujutsu';
  const temJujutsuEscolaTecnica = data.estudouEscolaTecnica === true;
  
  // 3. CORREÇÃO: Extrair perícias dos requisitos da trilha
  const periciasTrilhaRequisitos = new Set<string>();
  
  if (trilhaData?.requisitos) {
    const requisitosStr = typeof trilhaData.requisitos === 'string' 
      ? trilhaData.requisitos 
      : '';
    
    console.log('String de requisitos:', requisitosStr);
    
    // Para cada perícia válida, verifica se está mencionada nos requisitos
    PERICIAS_BASE.forEach(pericia => {
      // Verifica se o nome da perícia aparece no texto de requisitos
      if (requisitosStr.includes(pericia.nome)) {
        periciasTrilhaRequisitos.add(pericia.nome);
        console.log(`✅ Perícia "${pericia.nome}" encontrada nos requisitos`);
      }
    });
  }
  
  console.log('Perícias de trilha requisitadas:', Array.from(periciasTrilhaRequisitos));
  
  // 4. Todas as perícias não removíveis
  const periciasNaoRemoviveis = new Set(periciasGarantidasClasseOrigem);
  
  // Adicionar Jujutsu da escola técnica (NÃO REMOVÍVEL)
  if (temJujutsuEscolaTecnica) {
    periciasNaoRemoviveis.add(PERICIA_JUJUTSU);
  }
  
  // Adicionar perícias da trilha (NÃO REMOVÍVEIS)
  periciasTrilhaRequisitos.forEach(p => periciasNaoRemoviveis.add(p));
  
  console.log('Perícias não removíveis:', Array.from(periciasNaoRemoviveis));
  
  // 5. CORREÇÃO PRINCIPAL: Perícias livres escolhidas
  // Exclui: classe, origem, escola técnica
  // Inclui: trilha (porque ocupam slots livres)
  const periciasLivresEscolhidas = periciasGarantidas.filter(p => {
    // Se é da classe/origem, NÃO é livre
    if (periciasGarantidasClasseOrigem.has(p)) return false;
    
    // Se é Jujutsu da escola técnica, NÃO é livre
    if (p === PERICIA_JUJUTSU && temJujutsuEscolaTecnica) return false;
    
    // Qualquer outra perícia (incluindo trilha) É livre
    return true;
  });

  const periciasLivresRestantes = periciasLivresTotal - periciasLivresEscolhidas.length;

  // Effect: Adicionar Jujutsu automaticamente quando marcar escola técnica
  useEffect(() => {
    if (temJujutsuEscolaTecnica && !periciasGarantidas.includes(PERICIA_JUJUTSU)) {
      updateData({ periciasTreinadas: [...periciasGarantidas, PERICIA_JUJUTSU] });
    }
  }, [temJujutsuEscolaTecnica]);

  // Effect: Adicionar perícias de trilha automaticamente
  useEffect(() => {
    if (periciasTrilhaRequisitos.size > 0) {
      const novasPericias = [...periciasGarantidas];
      let adicionou = false;
      
      periciasTrilhaRequisitos.forEach(pericia => {
        if (!novasPericias.includes(pericia)) {
          novasPericias.push(pericia);
          adicionou = true;
        }
      });
      
      if (adicionou) {
        updateData({ periciasTreinadas: novasPericias });
      }
    }
  }, [data.trilha]);

  // CORREÇÃO: Função para toggle com validação reforçada
  const togglePericia = (nomePericias: string) => {
    console.log('Tentando toggle da perícia:', nomePericias);
    console.log('É não-removível?', periciasNaoRemoviveis.has(nomePericias));
    console.log('É de trilha?', periciasTrilhaRequisitos.has(nomePericias));
    
    const index = periciasGarantidas.indexOf(nomePericias);
    
    if (index > -1) {
      // VERIFICAÇÃO REFORÇADA: Bloqueia remoção de perícias não removíveis
      if (periciasNaoRemoviveis.has(nomePericias)) {
        // Não faz nada se é não-removível
        console.log(`❌ Perícia "${nomePericias}" não pode ser removida (é obrigatória)`);
        return; // BLOQUEIO TOTAL
      }
      
      // Se chegou aqui, pode remover
      console.log(`✅ Removendo perícia "${nomePericias}"`);
      const novasPericias = [...periciasGarantidas];
      novasPericias.splice(index, 1);
      updateData({ periciasTreinadas: novasPericias });
    } else {
      // Só pode adicionar se tem espaço livre
      if (periciasLivresRestantes > 0) {
        console.log(`✅ Adicionando perícia "${nomePericias}"`);
        updateData({ periciasTreinadas: [...periciasGarantidas, nomePericias] });
      } else {
        console.log(`❌ Sem espaço livre para adicionar "${nomePericias}"`);
      }
    }
  };

  const isPericiaGarantidaClasseOrigem = (nomePericias: string): boolean => {
    return periciasGarantidasClasseOrigem.has(nomePericias);
  };

  const isPericiaGarantidaPorTrilha = (nomePericias: string): boolean => {
    return periciasTrilhaRequisitos.has(nomePericias);
  };

  const isPericiaGarantidaPorEscolaTecnica = (nomePericias: string): boolean => {
    return temJujutsuEscolaTecnica && nomePericias === PERICIA_JUJUTSU;
  };

  const isPericiaRemovivel = (nomePericias: string): boolean => {
    return !periciasNaoRemoviveis.has(nomePericias);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">📚 Perícias Treinadas</h3>
        <p className="mb-4" style={{ color: '#cbd5e1' }}>
          Selecione as perícias nas quais seu personagem é treinado. Perícias treinadas ganham +5 nos testes.
        </p>
      </div>

      {/* PERÍCIAS GARANTIDAS */}
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
              📋 Perícias Garantidas (Classe/Origem)
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

            {/* 🎓 Perícia da Escola Técnica */}
            {temJujutsuEscolaTecnica && (
              <div className="text-xs">
                <span className="font-semibold" style={{ color: '#93c5fd' }}>
                  🎓 Escola Técnica Jujutsu:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    style={{
                      backgroundColor: '#1e1b4b',
                      color: '#c7d2fe',
                      borderColor: '#4f46e5'
                    }}
                  >
                    <Lock className="w-3 h-3 inline mr-1" />
                    {PERICIA_JUJUTSU}
                  </Badge>
                </div>
              </div>
            )}

            {/* Perícias da trilha (requisitos) */}
            {periciasTrilhaRequisitos.size > 0 && (
              <div className="text-xs">
                <span className="font-semibold" style={{ color: '#93c5fd' }}>
                  Trilha ({trilhaData?.nome}) - Requisitos:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.from(periciasTrilhaRequisitos).map(p => (
                    <Badge 
                      key={p} 
                      variant="outline" 
                      style={{
                        backgroundColor: '#7c2d12',
                        color: '#fdba74',
                        borderColor: '#c2410c'
                      }}
                    >
                      🔥 {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-xs italic mt-2" style={{ color: '#cbd5e1' }}>
              Perícias de classe/origem/escola técnica (🎓) não contam no limite de perícias livres. 
              Perícias de trilha (🔥) ocupam slots livres mas não podem ser removidas.
            </p>
          </div>
        </div>
      </Card>

      {/* PERÍCIAS LIVRES */}
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
        {periciasLivresEscolhidas.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold mb-2" style={{ color: '#d8b4fe' }}>
              Perícias livres selecionadas:
            </p>
            <div className="flex flex-wrap gap-2">
              {periciasLivresEscolhidas.map(p => {
                const isDaTrilha = isPericiaGarantidaPorTrilha(p);
                return (
                  <Badge 
                    key={p} 
                    variant="outline" 
                    style={{
                      backgroundColor: isDaTrilha ? '#7c2d12' : '#581c87',
                      color: isDaTrilha ? '#fdba74' : '#d8b4fe',
                      borderColor: isDaTrilha ? '#c2410c' : '#7e22ce'
                    }}
                  >
                    {isDaTrilha ? '🔥' : '★'} {p}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
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

      {/* LISTA DE TODAS AS PERÍCIAS */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Todas as Perícias</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PERICIAS_BASE.map((pericia) => {
            const isSelected = periciasGarantidas.includes(pericia.nome);
            const isGarantidaClasseOrigem = isPericiaGarantidaClasseOrigem(pericia.nome);
            const isGarantidaPorTrilha = isPericiaGarantidaPorTrilha(pericia.nome);
            const isGarantidaPorEscolaTecnica = isPericiaGarantidaPorEscolaTecnica(pericia.nome);
            const isRemovivel = isPericiaRemovivel(pericia.nome);
            const canSelect = !isSelected && periciasLivresRestantes > 0;
            const canClick = isRemovivel || !isSelected;

            return (
              <Card
                key={pericia.nome}
                onClick={() => canClick && togglePericia(pericia.nome)}
                className={`p-3 transition-all ${
                  !canClick
                    ? 'cursor-not-allowed opacity-90'
                    : isSelected
                    ? 'cursor-pointer'
                    : canSelect
                    ? 'cursor-pointer hover:border-purple-500'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={
                  isSelected && !isRemovivel
                    ? {
                        backgroundColor: isGarantidaPorEscolaTecnica 
                          ? 'rgba(30, 27, 75, 0.3)' 
                          : isGarantidaPorTrilha 
                          ? 'rgba(124, 45, 18, 0.3)' 
                          : 'rgba(20, 83, 45, 0.3)',
                        borderColor: isGarantidaPorEscolaTecnica 
                          ? '#4f46e5' 
                          : isGarantidaPorTrilha 
                          ? '#c2410c' 
                          : '#16a34a',
                        borderWidth: '2px'
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
                          style={{ color: !isRemovivel ? (isGarantidaPorEscolaTecnica ? '#c7d2fe' : isGarantidaPorTrilha ? '#fdba74' : '#22c55e') : '#a855f7' }} 
                        />
                      )}
                      {isGarantidaPorEscolaTecnica && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            backgroundColor: '#1e1b4b',
                            color: '#c7d2fe',
                            borderColor: '#4f46e5'
                          }}
                        >
                          <Lock className="w-3 h-3 inline mr-1" />
                          🎓 Escola
                        </Badge>
                      )}
                      {isGarantidaPorTrilha && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            backgroundColor: '#7c2d12',
                            color: '#fdba74',
                            borderColor: '#c2410c'
                          }}
                        >
                          <Lock className="w-3 h-3 inline mr-1" />
                          🔥 Trilha
                        </Badge>
                      )}
                      {isGarantidaClasseOrigem && (
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
                      {isRemovivel && isSelected && (
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

      {/* DICA FINAL */}
      <Card 
        className="p-4"
        style={{
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          borderWidth: '1px'
        }}
      >
        <p className="text-sm" style={{ color: '#e2e8f0' }}>
          <span className="font-semibold" style={{ color: '#60a5fa' }}>💡 Dica:</span> Perícias com badge "Garantida" (verde) vêm da sua classe/origem e não contam no limite de perícias livres. 
          Perícias com badge "Escola" (🎓 azul) vêm da Escola Técnica Jujutsu e também não contam no limite.
          Perícias com badge "Trilha" (🔥 laranja) são requisitos da sua trilha e ocupam slots livres, mas não podem ser removidas. 
          Perícias com badge "Livre" (★ roxo) podem ser adicionadas ou removidas livremente.
        </p>
      </Card>
      <br></br>
    </div>
  );
}
