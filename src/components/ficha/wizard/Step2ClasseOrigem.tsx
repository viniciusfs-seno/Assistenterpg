import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { ClasseType } from '../../../types/character';
import { CLASSES, getClasseData } from '../../../data/classes';
import { ORIGENS } from '../../../data/origens';
import { consolidarPericias, resolverConflitosAutomaticos } from '../../../utils/periciaConflictResolver';
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
    opcoes: string[];
    tipo: 'classe' | 'origem';
    indice?: number;
  } | null>(null);

  const [periciasClasseEscolhidas, setPericiasClasseEscolhidas] = useState<string[]>([]);
  const [periciasOrigemEscolhidas, setPericiasOrigemEscolhidas] = useState<string[]>([]);

  const classeData = getClasseData(selectedClasse);
  const origemData = ORIGENS.find(o => o.id === selectedOrigem);

  useEffect(() => {
    if (!classeData || !origemData) return;

    const escolhasCorrigidas = resolverConflitosAutomaticos(
      selectedClasse,
      selectedOrigem,
      periciasClasseEscolhidas
    );

    if (JSON.stringify(escolhasCorrigidas) !== JSON.stringify(periciasClasseEscolhidas)) {
      setPericiasClasseEscolhidas(escolhasCorrigidas);
    }
  }, [selectedClasse, selectedOrigem]);

  useEffect(() => {
    const resultado = consolidarPericias(
      selectedClasse,
      selectedOrigem,
      periciasClasseEscolhidas,
      periciasOrigemEscolhidas,
      data.estudouEscolaTecnica || false
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

    let opcoesDisponiveis = classeData.periciasEscolha[indice].opcoes;

    if (origemData?.periciasTreinadas) {
      opcoesDisponiveis = opcoesDisponiveis.filter(p => !origemData.periciasTreinadas.includes(p));
    }

    if (origemData?.periciasEscolha) {
      const opcoesOrigem = origemData.periciasEscolha.opcoes;
      const opcoesComuns = opcoesDisponiveis.filter(p => opcoesOrigem.includes(p));
      if (opcoesComuns.length > 0 && periciasOrigemEscolhidas.length > 0) {
        opcoesDisponiveis = opcoesDisponiveis.filter(p => !periciasOrigemEscolhidas.includes(p));
      }
    }

    setEscolhaAtual({
      opcoes: opcoesDisponiveis,
      tipo: 'classe',
      indice,
    });
    setModalAberto(true);
  };

  const abrirModalEscolhaOrigem = () => {
    if (!origemData?.periciasEscolha) return;

    let opcoesDisponiveis = origemData.periciasEscolha.opcoes;

    if (classeData?.periciasTreinadas) {
      opcoesDisponiveis = opcoesDisponiveis.filter(p => !classeData.periciasTreinadas.includes(p));
    }

    if (classeData?.periciasEscolha) {
      classeData.periciasEscolha.forEach((escolhaClasse) => {
        const opcoesComuns = escolhaClasse.opcoes.filter(p => origemData.periciasEscolha!.opcoes.includes(p));
        if (opcoesComuns.length > 0 && periciasClasseEscolhidas.length > 0) {
          opcoesDisponiveis = opcoesDisponiveis.filter(p => !periciasClasseEscolhidas.includes(p));
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
    periciasOrigemEscolhidas,
    data.estudouEscolaTecnica || false
  );

  const hasBonusExtra = Object.keys(resultado.bonusExtras).length > 0;

  return (
    <div className="space-y-8">
      {hasBonusExtra && (
        <Card
          className="p-4"
          style={{
            backgroundColor: 'rgba(133, 77, 14, 0.2)',
            borderColor: '#ca8a04',
            borderWidth: '1px',
          }}
        >
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: '#fde047' }}>
                🎁 Bônus de Perícia Duplicada!
              </p>
              <p className="text-xs mb-2" style={{ color: '#fef08a' }}>
                Sua classe e origem concedem a mesma perícia. Você ganha +2 de bônus adicional:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(resultado.bonusExtras).map(([pericia, bonus]) => (
                  <span
                    key={pericia}
                    style={{
                      backgroundColor: '#a16207',
                      color: '#fef3c7',
                      border: '1px solid #ca8a04',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}
                  >
                    {pericia}: +{5 + bonus} total (+5 treinado +{bonus} duplicação)
                  </span>
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
        <p className="text-sm mb-4" style={{ color: '#cbd5e1' }}>
          A classe define seu estilo de jogo e progressão de características.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CLASSES.map((classe) => {
            const Icon =
              classe.id === 'combatente' ? Swords : classe.id === 'sentinela' ? Shield : Brain;
            const isSelected = selectedClasse === classe.id;

            return (
              <Card
                key={classe.id}
                onClick={() => handleClasseSelect(classe.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected ? 'bg-red-900/30' : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: '#ef4444',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.25)',
                      }
                    : {}
                }
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-8 h-8 text-red-500" />
                  {isSelected && <CheckCircle className="w-5 h-5" style={{ color: '#ef4444' }} />}
                </div>

                <h4 className="text-lg font-semibold text-white mb-2">{classe.nome}</h4>
                <p className="text-sm mb-4" style={{ color: '#cbd5e1' }}>
                  {classe.descricao}
                </p>

                {/* Stats iniciais */}
                <div className="rounded-lg p-3 mb-3 space-y-1" style={{ backgroundColor: '#1e293b' }}>
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

                {/* Perícias da Classe */}
                {isSelected && classeData && (
                  <div className="mt-4 space-y-3">
                    <div
                      className="inline-flex items-center px-3 py-1.5 rounded-md shadow-md"
                      style={{ backgroundColor: '#2563eb' }}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ffffff' }}>
                        Perícias da Classe
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {classeData.periciasTreinadas.map((p) => {
                        const temBonus = resultado.bonusExtras[p];
                        return (
                          <span
                            key={p}
                            style={{
                              backgroundColor: '#15803d',
                              color: '#ffffff',
                              border: '1px solid #16a34a',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            {p} {temBonus && `(+${temBonus})`}
                          </span>
                        );
                      })}

                      {periciasClasseEscolhidas.filter(Boolean).map((p, idx) => {
                        const temBonus = resultado.bonusExtras[p];
                        return (
                          <span
                            key={`escolhida-${idx}`}
                            style={{
                              backgroundColor: '#15803d',
                              color: '#ffffff',
                              border: '1px solid #16a34a',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            {p} {temBonus && `(+${temBonus})`}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {classeData.periciasEscolha?.map((escolha, idx) => {
                        const jaEscolheu = periciasClasseEscolhidas[idx];

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModalEscolhaClasse(idx);
                            }}
                            style={{
                              backgroundColor: jaEscolheu ? '#1e40af' : '#0f172a',
                              color: jaEscolheu ? '#dbeafe' : '#93c5fd',
                              border: `2px solid ${jaEscolheu ? '#3b82f6' : '#1e40af'}`,
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: jaEscolheu ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = jaEscolheu ? '#2563eb' : '#1e293b';
                              e.currentTarget.style.borderColor = '#60a5fa';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = jaEscolheu ? '#1e40af' : '#0f172a';
                              e.currentTarget.style.borderColor = jaEscolheu ? '#3b82f6' : '#1e40af';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {jaEscolheu ? (
                              <>
                                <span style={{ marginRight: '6px' }}>✓</span>
                                {jaEscolheu}
                              </>
                            ) : (
                              <>
                                <span style={{ marginRight: '6px' }}>📋</span>
                                Escolher ({escolha.opcoes.length} opções)
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Perícias livres */}
                    <div
                      className="rounded-lg p-3 mt-3"
                      style={{
                        backgroundColor: '#1e293b',
                        border: '2px solid #2563eb',
                      }}
                    >
                      <p className="text-base font-bold mb-0.5" style={{ color: '#93c5fd' }}>
                        📚 Perícias livres: {classeData.periciasLivres.base} + INT
                      </p>
                      <p className="text-xs italic" style={{ color: '#e2e8f0' }}>
                        Você pode escolher qualquer perícia adicional
                      </p>
                    </div>
                  </div>
                )}

                {/* Benefícios */}
                <div className="mt-4">
                  <div
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: 'rgba(51, 65, 85, 0.5)',
                      border: '1px solid #475569',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#22c55e',
                          borderRadius: '50%',
                        }}
                      ></div>
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: '#cbd5e1' }}
                      >
                        Benefícios
                      </span>
                    </div>

                    <div className="space-y-2">
                      {classe.beneficios.map((beneficio, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 group">
                          <CheckCircle
                            className="w-4 h-4 flex-shrink-0 mt-0.5 transition-colors"
                            style={{ color: '#4ade80' }}
                          />
                          <span
                            className="text-sm leading-relaxed transition-colors"
                            style={{ color: '#e2e8f0' }}
                          >
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

      {/* Seção de Origens com scrolling */}
      <div>
        <br />
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
            paddingRight: '8px',
          }}
        >
          {ORIGENS.map((origem) => {
            const isSelected = selectedOrigem === origem.id;

            return (
              <Card
                key={origem.id}
                onClick={() => handleOrigemSelect(origem.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected ? 'bg-green-900/30' : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: '#ef4444',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.25)',
                      }
                    : {}
                }
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
                  <Card
                    className="p-2 mb-3"
                    style={{
                      backgroundColor: 'rgba(124, 45, 18, 0.2)',
                      borderColor: '#c2410c',
                    }}
                  >
                    <p className="text-xs font-semibold" style={{ color: '#fdba74' }}>
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Requisitos: {origem.requisitos.join(', ')}
                    </p>
                  </Card>
                )}

                <div className="mb-3 space-y-3">
                  <div
                    className="inline-flex items-center px-3 py-1.5 rounded-md shadow-md"
                    style={{ backgroundColor: '#16a34a' }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ffffff' }}>
                      Perícias da Origem
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {origem.periciasTreinadas.map((p) => {
                      const temBonus = resultado.bonusExtras[p];
                      return (
                        <span
                          key={p}
                          style={{
                            backgroundColor: '#15803d',
                            color: '#ffffff',
                            border: '1px solid #16a34a',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {p} {temBonus && `(+${temBonus})`}
                        </span>
                      );
                    })}

                    {isSelected &&
                      periciasOrigemEscolhidas.map((p, idx) => {
                        const temBonus = resultado.bonusExtras[p];
                        return (
                          <span
                            key={`origem-${idx}`}
                            style={{
                              backgroundColor: '#15803d',
                              color: '#ffffff',
                              border: '1px solid #16a34a',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            {p} {temBonus && `(+${temBonus})`}
                          </span>
                        );
                      })}
                  </div>

                  {isSelected &&
                    origem.periciasEscolha &&
                    periciasOrigemEscolhidas.length < origem.periciasEscolha.quantidade && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalEscolhaOrigem();
                        }}
                        style={{
                          backgroundColor: '#064e3b',
                          color: '#d1fae5',
                          border: '2px solid #10b981',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#065f46';
                          e.currentTarget.style.borderColor = '#34d399';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#064e3b';
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>📝</span>
                        <span>
                          Escolher perícia ({periciasOrigemEscolhidas.length}/{origem.periciasEscolha.quantidade})
                        </span>
                      </button>
                    )}
                </div>

                <div className="space-y-2">
                  <div
                    className="inline-flex items-center px-3 py-1.5 rounded-md shadow-md"
                    style={{ backgroundColor: '#7c3aed' }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ffffff' }}>
                      Habilidade Especial
                    </span>
                  </div>

                  <div
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: '#1e293b',
                      border: '2px solid #7c3aed',
                    }}
                  >
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
