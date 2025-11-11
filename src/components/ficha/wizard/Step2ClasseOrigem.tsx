// src/components/ficha/wizard/Step2ClasseOrigem.tsx - COM SCROLL

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { ClasseType } from '../../../types/character';
import { CLASSES, getClasseData } from '../../../data/classes';
import { ORIGENS } from '../../../data/origens';
import { consolidarPericias } from '../../../utils/periciaConflictResolver';
import { Swords, Shield, Brain, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { PericiaChoiceModal } from './PericiaChoiceModal';

interface Step2ClasseOrigemProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step2ClasseOrigem({ data, updateData }: Step2ClasseOrigemProps) {
  const [selectedClasse, setSelectedClasse] = useState<ClasseType>(data.classe);
  const [selectedOrigem, setSelectedOrigem] = useState<string>(data.origemId);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [escolhaAtual, setEscolhaAtual] = useState<{ 
    opcoes: string[], 
    tipo: 'classe' | 'origem', 
    indice?: number 
  } | null>(null);
  
  const [periciasClasseEscolhidas, setPericiasClasseEscolhidas] = useState<string[]>([]);
  const [periciasOrigemEscolhidas, setPericiasOrigemEscolhidas] = useState<string[]>([]);

  const classeData = getClasseData(selectedClasse);
  const origemData = ORIGENS.find(o => o.id === selectedOrigem);

  useEffect(() => {
    const resultado = consolidarPericias(
      selectedClasse,
      selectedOrigem,
      periciasClasseEscolhidas,
      periciasOrigemEscolhidas
    );
    
    updateData({ 
      periciasTreinadas: resultado.pericias,
      periciasBonusExtra: resultado.bonusExtras,
    });
  }, [selectedClasse, selectedOrigem, periciasClasseEscolhidas, periciasOrigemEscolhidas]);

  const handleClasseSelect = (classe: ClasseType) => {
    setSelectedClasse(classe);
    setPericiasClasseEscolhidas([]);
    updateData({ classe });
  };

  const handleOrigemSelect = (origemId: string) => {
    setSelectedOrigem(origemId);
    setPericiasOrigemEscolhidas([]);
    updateData({ origemId });
  };

  const abrirModalEscolhaClasse = (indice: number) => {
    if (!classeData?.periciasEscolha) return;
    
    const escolha = classeData.periciasEscolha[indice];
    let opcoesDisponiveis = escolha.opcoes;
    
    if (origemData?.periciasEscolha) {
      const opcoesOrigem = origemData.periciasEscolha.opcoes;
      const opcoesComuns = escolha.opcoes.filter(p => opcoesOrigem.includes(p));
      
      if (opcoesComuns.length > 0 && periciasOrigemEscolhidas.length > 0) {
        opcoesDisponiveis = escolha.opcoes.filter(
          p => !periciasOrigemEscolhidas.includes(p)
        );
      }
    }
    
    setEscolhaAtual({ 
      opcoes: opcoesDisponiveis, 
      tipo: 'classe',
      indice 
    });
    setModalAberto(true);
  };

  const abrirModalEscolhaOrigem = () => {
    if (!origemData?.periciasEscolha) return;
    
    let opcoesDisponiveis = origemData.periciasEscolha.opcoes;
    
    if (classeData?.periciasEscolha) {
      classeData.periciasEscolha.forEach((escolhaClasse) => {
        const opcoesComuns = escolhaClasse.opcoes.filter(p => 
          origemData.periciasEscolha!.opcoes.includes(p)
        );
        
        if (opcoesComuns.length > 0 && periciasClasseEscolhidas.length > 0) {
          opcoesDisponiveis = opcoesDisponiveis.filter(
            p => !periciasClasseEscolhidas.includes(p)
          );
        }
      });
    }
    
    setEscolhaAtual({
      opcoes: opcoesDisponiveis,
      tipo: 'origem',
    });
    setModalAberto(true);
  };

  const handleConfirmPericia = (pericia: string) => {
    if (!escolhaAtual) return;

    if (escolhaAtual.tipo === 'classe' && escolhaAtual.indice !== undefined) {
      const novasEscolhas = [...periciasClasseEscolhidas];
      novasEscolhas[escolhaAtual.indice] = pericia;
      setPericiasClasseEscolhidas(novasEscolhas);
      
      if (origemData?.periciasEscolha) {
        const opcoesOrigem = origemData.periciasEscolha.opcoes;
        if (opcoesOrigem.includes(pericia)) {
          const alternativas = opcoesOrigem.filter(p => p !== pericia);
          if (alternativas.length > 0 && periciasOrigemEscolhidas.length === 0) {
            setPericiasOrigemEscolhidas([alternativas[0]]);
          }
        }
      }
    } else if (escolhaAtual.tipo === 'origem') {
      setPericiasOrigemEscolhidas([...periciasOrigemEscolhidas, pericia]);
    }

    setModalAberto(false);
    setEscolhaAtual(null);
  };

  const resultado = consolidarPericias(
    selectedClasse,
    selectedOrigem,
    periciasClasseEscolhidas,
    periciasOrigemEscolhidas
  );

  const hasBonusExtra = Object.keys(resultado.bonusExtras).length > 0;

  return (
    <div className="space-y-8">
      {/* Alerta de perícias duplicadas */}
      {hasBonusExtra && (
        <Card className="bg-yellow-900/20 border-yellow-600 p-4">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-200 mb-2">
                🎁 Bônus de Perícia Duplicada!
              </p>
              <p className="text-xs text-yellow-300 mb-2">
                Sua classe e origem concedem a mesma perícia. Você ganha +2 de bônus adicional:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(resultado.bonusExtras).map(([pericia, bonus]) => (
                  <Badge key={pericia} className="bg-yellow-700 text-yellow-100 border-yellow-500 font-semibold">
                    {pericia}: +{5 + bonus} total (+5 treinado +{bonus} duplicação)
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ========== SEÇÃO DE CLASSES ========== */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-500" />
          Escolha sua Classe
        </h3>
        <p className="text-sm mb-4" style={{ color: '#cbd5e1' }}>
          A classe define seu estilo de jogo e progressão de características.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CLASSES.map((classe) => {
            const Icon = classe.id === 'combatente' ? Swords : classe.id === 'sentinela' ? Shield : Brain;
            const isSelected = selectedClasse === classe.id;

            return (
              <Card
                key={classe.id}
                onClick={() => handleClasseSelect(classe.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected
                    ? 'bg-red-900/30'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
                style={isSelected ? {
                  borderColor: '#ef4444',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.25)'
                } : {}}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-8 h-8 text-red-500" />
                  {isSelected && <CheckCircle className="w-5 h-5" style={{ color: '#ef4444' }} />}
                </div>

                <h4 className="text-lg font-semibold text-white mb-2">
                  {classe.nome}
                </h4>
                <p className="text-sm mb-4" style={{ color: '#cbd5e1' }}>
                  {classe.descricao}
                </p>

                {/* Stats iniciais */}
                <div className="bg-slate-800 rounded-lg p-3 mb-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#cbd5e1' }}>PV inicial:</span>
                    <span className="text-white font-semibold">{classe.pvInicial}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#cbd5e1' }}>PV por nível:</span>
                    <span className="text-white font-semibold">{classe.pvPorNivel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#cbd5e1' }}>PE inicial:</span>
                    <span className="text-white font-semibold">{classe.peInicial}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#cbd5e1' }}>EA inicial:</span>
                    <span className="text-white font-semibold">{classe.eaInicial}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#cbd5e1' }}>SAN inicial:</span>
                    <span className="text-white font-semibold">{classe.sanInicial}</span>
                  </div>
                </div>

                {/* PERÍCIAS DA CLASSE */}
                {isSelected && classeData && (
                  <div className="mt-4 space-y-3">
                    <div className="inline-flex items-center px-3 py-1.5 bg-blue-600 rounded-md shadow-md">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Perícias da Classe
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {classeData.periciasTreinadas.map(p => {
                        const temBonus = resultado.bonusExtras[p];
                        return (
                          <Badge 
                            key={p} 
                            className="bg-green-700 text-white border-green-500 font-semibold shadow-md"
                          >
                            {p} {temBonus && `(+${temBonus})`}
                          </Badge>
                        );
                      })}
                      
                      {periciasClasseEscolhidas.filter(Boolean).map((p, idx) => {
                        const temBonus = resultado.bonusExtras[p];
                        return (
                          <Badge 
                            key={`escolhida-${idx}`} 
                            className="bg-blue-900 text-blue-100 border-blue-500 font-semibold"
                          >
                            {p} {temBonus && `(+${temBonus})`}
                          </Badge>
                        );
                      })}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {classeData.periciasEscolha?.map((escolha, idx) => {
                        const jaEscolheu = periciasClasseEscolhidas[idx];
                        
                        return (
                          <Button
                            key={idx}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-blue-500 text-blue-300 hover:bg-blue-900/50 hover:text-blue-100 text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModalEscolhaClasse(idx);
                            }}
                          >
                            {jaEscolheu ? `Trocar: ${jaEscolheu}` : `Escolher (${escolha.opcoes.join(' / ')})`}
                          </Button>
                        );
                      })}
                    </div>
                    
                    {/* PERÍCIAS LIVRES */}
                    <div className="bg-slate-800 border-2 border-blue-600 rounded-lg p-3 mt-3">
                      <p className="text-base font-bold mb-0.5" style={{ color: '#93c5fd' }}>
                        📚 Perícias livres: {classeData.periciasLivres.base} + INT
                      </p>
                      <p className="text-xs italic" style={{ color: '#e2e8f0' }}>
                        Você pode escolher qualquer perícia adicional
                      </p>
                    </div>
                  </div>
                )}

                {/* BENEFÍCIOS */}
                <div className="mt-4">
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#cbd5e1' }}>
                        Benefícios
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {classe.beneficios.map((beneficio, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 group">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5 group-hover:text-green-300 transition-colors" />
                          <span className="text-sm leading-relaxed group-hover:text-white transition-colors" style={{ color: '#e2e8f0' }}>
                            {beneficio}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ========== SEÇÃO DE ORIGENS COM SCROLL ========== */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-green-500" />
          Escolha sua Origem
        </h3>
        <p className="text-sm mb-4" style={{ color: '#cbd5e1' }}>
          A origem representa seu passado e determina perícias iniciais.
        </p>

        <div 
          className="space-y-4"
          style={{
            maxHeight: '500px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          {ORIGENS.map((origem) => {
            const isSelected = selectedOrigem === origem.id;

            return (
              <Card
                key={origem.id}
                onClick={() => handleOrigemSelect(origem.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected
                    ? 'bg-green-900/30'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
                style={isSelected ? {
                  borderColor: '#ef4444',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.25)'
                } : {}}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-white">{origem.nome}</h4>
                      {isSelected && <CheckCircle className="w-5 h-5" style={{ color: '#ef4444' }} />}
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#cbd5e1' }}>
                      {origem.descricao}
                    </p>
                  </div>
                </div>

                {origem.requisitos && origem.requisitos.length > 0 && (
                  <Card className="bg-orange-900/20 border-orange-700 p-2 mb-3">
                    <p className="text-xs font-semibold" style={{ color: '#fdba74' }}>
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Requisitos: {origem.requisitos.join(', ')}
                    </p>
                  </Card>
                )}

                <div className="mb-3 space-y-3">
                  <div className="inline-flex items-center px-3 py-1.5 bg-green-600 rounded-md shadow-md">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Perícias da Origem
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {origem.periciasTreinadas.map(p => {
                      const temBonus = resultado.bonusExtras[p];
                      return (
                        <Badge 
                          key={p} 
                          className="bg-green-700 text-white border-green-500 font-semibold shadow-md"
                        >
                          {p} {temBonus && `(+${temBonus})`}
                        </Badge>
                      );
                    })}
                    
                    {isSelected && periciasOrigemEscolhidas.map((p, idx) => {
                      const temBonus = resultado.bonusExtras[p];
                      return (
                        <Badge 
                          key={`origem-${idx}`} 
                          className="bg-blue-900 text-blue-100 border-blue-500 font-semibold"
                        >
                          {p} {temBonus && `(+${temBonus})`}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  {isSelected && origem.periciasEscolha && periciasOrigemEscolhidas.length < origem.periciasEscolha.quantidade && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-300 hover:bg-green-900/50 hover:text-green-100 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModalEscolhaOrigem();
                      }}
                    >
                      Escolher perícia ({periciasOrigemEscolhidas.length}/{origem.periciasEscolha.quantidade})
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center px-3 py-1.5 bg-purple-600 rounded-md shadow-md">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Habilidade Especial
                    </span>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-3 border-2 border-purple-600">
                    <p className="text-sm leading-relaxed font-medium" style={{ color: '#f1f5f9' }}>
                      {origem.habilidadeEspecial}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <PericiaChoiceModal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setEscolhaAtual(null);
        }}
        opcoes={escolhaAtual?.opcoes || []}
        onSelect={handleConfirmPericia}
        titulo={escolhaAtual?.tipo === 'classe' ? 'Escolha perícia da classe' : 'Escolha perícia da origem'}
      />
    </div>
  );
}
