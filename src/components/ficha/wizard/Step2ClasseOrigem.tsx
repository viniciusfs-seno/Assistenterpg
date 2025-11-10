// src/components/ficha/wizard/Step2ClasseOrigem.tsx - COM RESOLUÇÃO DE CONFLITOS

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { ClasseType } from '../../../types/character';
import { CLASSES, getClasseData, calcularPericiasLivres } from '../../../data/classes';
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

  // Atualizar perícias e bônus quando houver mudanças
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
    
    // CENÁRIO 3: Verificar se há conflito com origem
    let opcoesDisponiveis = escolha.opcoes;
    
    if (origemData?.periciasEscolha) {
      const opcoesOrigem = origemData.periciasEscolha.opcoes;
      const opcoesComuns = escolha.opcoes.filter(p => opcoesOrigem.includes(p));
      
      // Se houver conflito, forçar escolha automática na origem
      if (opcoesComuns.length > 0 && periciasOrigemEscolhidas.length > 0) {
        // Remover opção já escolhida na origem
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
    
    // CENÁRIO 3: Verificar se há conflito com classe
    if (classeData?.periciasEscolha) {
      classeData.periciasEscolha.forEach((escolhaClasse) => {
        const opcoesComuns = escolhaClasse.opcoes.filter(p => 
          origemData.periciasEscolha!.opcoes.includes(p)
        );
        
        if (opcoesComuns.length > 0 && periciasClasseEscolhidas.length > 0) {
          // Remover opções já escolhidas na classe
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
      
      // CENÁRIO 3: Auto-selecionar alternativa na origem se houver conflito
      if (origemData?.periciasEscolha) {
        const opcoesOrigem = origemData.periciasEscolha.opcoes;
        if (opcoesOrigem.includes(pericia)) {
          // Há conflito! Escolher automaticamente a outra opção
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

  // Verificar conflitos e bônus extras
  const resultado = consolidarPericias(
    selectedClasse,
    selectedOrigem,
    periciasClasseEscolhidas,
    periciasOrigemEscolhidas
  );

  const hasBonusExtra = Object.keys(resultado.bonusExtras).length > 0;

  return (
    <div className="space-y-8">
      {/* Alerta de perícias duplicadas (CENÁRIO 2) */}
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
                  <Badge key={pericia} className="bg-yellow-700 text-yellow-100 border-yellow-500">
                    {pericia}: +{5 + bonus} total (+5 treinado +{bonus} duplicação)
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Seção de Classes */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-500" />
          Escolha sua Classe
        </h3>
        <p className="text-slate-400 mb-4">
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
                    ? 'bg-red-900/30 border-red-500 ring-2 ring-red-500'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-8 h-8 text-red-500" />
                  {isSelected && <CheckCircle className="w-5 h-5 text-red-500" />}
                </div>

                <h4 className="text-lg font-semibold text-white mb-2">
                  {classe.nome}
                </h4>
                <p className="text-sm text-slate-400 mb-4">{classe.descricao}</p>

                <div className="bg-slate-800 rounded-lg p-3 mb-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">PV inicial:</span>
                    <span className="text-white font-semibold">{classe.pvInicial}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">PV por nível:</span>
                    <span className="text-white font-semibold">{classe.pvPorNivel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">PE inicial:</span>
                    <span className="text-white font-semibold">{classe.peInicial}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">EA inicial:</span>
                    <span className="text-white font-semibold">{classe.eaInicial}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">SAN inicial:</span>
                    <span className="text-white font-semibold">{classe.sanInicial}</span>
                  </div>
                </div>

                {/* Perícias da classe */}
                {isSelected && classeData && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-blue-400">Perícias da Classe:</p>
                    
                    {classeData.periciasTreinadas.map(p => {
                      const temBonus = resultado.bonusExtras[p];
                      return (
                        <span key={p} className="inline-block mr-2 px-2 py-1 rounded-md text-xs bg-green-900 text-green-300 border border-green-700">
                          {p} {temBonus && `(+${temBonus})`}
                        </span>
                      );
                    })}
                    
                    {periciasClasseEscolhidas.filter(Boolean).map((p, idx) => {
                      const temBonus = resultado.bonusExtras[p];
                      return (
                        <span key={`escolhida-${idx}`} className="inline-block mr-2 px-2 py-1 rounded-md text-xs bg-blue-900 text-blue-300 border border-blue-700">
                          {p} {temBonus && `(+${temBonus})`}
                        </span>
                      );
                    })}
                    
                    {classeData.periciasEscolha?.map((escolha, idx) => {
                      const jaEscolheu = periciasClasseEscolhidas[idx];
                      
                      return (
                        <Button
                          key={idx}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-1 mr-2 border-blue-500 text-blue-400 hover:bg-blue-900/30 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEscolhaClasse(idx);
                          }}
                        >
                          {jaEscolheu ? `Trocar: ${jaEscolheu}` : `Escolher (${escolha.opcoes.join(' / ')})`}
                        </Button>
                      );
                    })}
                    
                    <p className="text-xs text-slate-500 mt-2">
                      Perícias livres: {classeData.periciasLivres.base} + INT
                    </p>
                  </div>
                )}

                <div className="space-y-1 mt-3">
                  {classe.beneficios.map((beneficio, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 text-xs mt-0.5">✓</span>
                      <span className="text-xs text-slate-300">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Seção de Origens (similar, mas mais compacta) */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          Escolha sua Origem
        </h3>
        <p className="text-slate-400 mb-4">
          A origem representa seu passado e determina perícias iniciais.
        </p>

        <div className="space-y-4">
          {ORIGENS.map((origem) => {
            const isSelected = selectedOrigem === origem.id;

            return (
              <Card
                key={origem.id}
                onClick={() => handleOrigemSelect(origem.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected
                    ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-white">{origem.nome}</h4>
                      {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{origem.descricao}</p>
                  </div>
                </div>

                {origem.requisitos && origem.requisitos.length > 0 && (
                  <Card className="bg-orange-900/20 border-orange-700 p-2 mb-2">
                    <p className="text-xs text-orange-300">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Requisitos: {origem.requisitos.join(', ')}
                    </p>
                  </Card>
                )}

                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Perícias:</p>
                  <div className="flex flex-wrap gap-2">
                    {origem.periciasTreinadas.map(p => {
                      const temBonus = resultado.bonusExtras[p];
                      return (
                        <span key={p} className="inline-block px-2 py-1 rounded-md text-xs bg-green-900 text-green-300 border border-green-700">
                          {p} {temBonus && `(+${temBonus})`}
                        </span>
                      );
                    })}
                    
                    {isSelected && periciasOrigemEscolhidas.map((p, idx) => {
                      const temBonus = resultado.bonusExtras[p];
                      return (
                        <span key={`origem-${idx}`} className="inline-block px-2 py-1 rounded-md text-xs bg-blue-900 text-blue-300 border border-blue-700">
                          {p} {temBonus && `(+${temBonus})`}
                        </span>
                      );
                    })}
                  </div>
                  
                  {isSelected && origem.periciasEscolha && periciasOrigemEscolhidas.length < origem.periciasEscolha.quantidade && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-900/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModalEscolhaOrigem();
                      }}
                    >
                      Escolher perícia ({periciasOrigemEscolhidas.length}/{origem.periciasEscolha.quantidade})
                    </Button>
                  )}
                </div>

                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-purple-400 mb-1">Habilidade:</p>
                  <p className="text-xs text-slate-300">{origem.habilidadeEspecial}</p>
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
