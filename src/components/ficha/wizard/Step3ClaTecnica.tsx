// src/components/ficha/wizard/Step3ClaTecnica.tsx - COM VALIDAÇÕES DE ORIGEM E PRESTÍGIO DO CLÃ

import { useState, useMemo } from 'react';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { ClaType } from '../../../types/character';
import { CLAS } from '../../../data/clas';
import { TECNICAS_INATAS } from '../../../data/tecnicas-inatas';
import { Crown, Sparkles, Search, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { ORIGENS } from '../../../data/origens';
import { calcularClassificacaoPrestigioCla, getCorPrestigioCla } from '../../../utils/prestigio';

interface Step3ClaTecnicaProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step3ClaTecnica({ data, updateData }: Step3ClaTecnicaProps) {
  const [selectedCla, setSelectedCla] = useState<ClaType>(data.cla);
  const [selectedTecnica, setSelectedTecnica] = useState<string>(data.tecnicaInataId);
  const [searchTecnica, setSearchTecnica] = useState('');

  // Verifica a origem escolhida
  const origemData = ORIGENS.find(o => o.id === data.origemId);
  const isProdigio = data.origemId === 'prodigio_cla';
  const isRenegado = data.origemId === 'renegado';
  const requerGrandeCla = isProdigio || isRenegado;

  // Verifica se é um dos 3 grandes clãs
  const isTresGrandesClas = ['gojo', 'zenin', 'kamo'].includes(selectedCla);

  const classificacaoCla = (data.prestigioCla && data.prestigioCla > 0 && isTresGrandesClas) 
    ? calcularClassificacaoPrestigioCla(data.prestigioCla)
    : null;

  const handleClaSelect = (cla: ClaType) => {
    setSelectedCla(cla);
    updateData({ cla, tecnicaInataId: '' });
    setSelectedTecnica('');
  };

  const handleTecnicaSelect = (tecnicaId: string) => {
    setSelectedTecnica(tecnicaId);
    updateData({ tecnicaInataId: tecnicaId });
  };

  const claData = CLAS.find(c => c.id === selectedCla);

  // Filtra clãs disponíveis baseado na origem
  const clasDisponiveis = useMemo(() => {
    if (requerGrandeCla) {
      return CLAS.filter(c => c.grandesClas);
    }
    return CLAS;
  }, [requerGrandeCla]);

  // Filtra técnicas disponíveis baseado no clã E origem
  const tecnicasDisponiveis = useMemo(() => {
    let tecnicas = TECNICAS_INATAS;
    
    if (selectedCla !== 'sem_cla') {
      const claData = CLAS.find(c => c.id === selectedCla);
      
      if (claData?.tecnicasHereditarias) {
        if (isProdigio) {
          tecnicas = TECNICAS_INATAS.filter(t => {
            if (t.tipo !== 'hereditaria') return false;
            
            if (Array.isArray(t.cla)) {
              return t.cla.includes(selectedCla);
            }
            return t.cla === selectedCla;
          });
        } else if (isRenegado) {
          tecnicas = TECNICAS_INATAS.filter(t => t.tipo === 'nao_hereditaria');
        } else {
          tecnicas = TECNICAS_INATAS.filter(t => {
            if (t.tipo === 'nao_hereditaria') return true;
            
            if (t.tipo === 'hereditaria') {
              if (Array.isArray(t.cla)) {
                return t.cla.includes(selectedCla);
              }
              return t.cla === selectedCla;
            }
            
            return false;
          });
        }
      } else {
        tecnicas = TECNICAS_INATAS.filter(t => t.tipo === 'nao_hereditaria');
      }
    } else {
      tecnicas = TECNICAS_INATAS.filter(t => t.tipo === 'nao_hereditaria');
    }
    
    return tecnicas;
  }, [selectedCla, isProdigio, isRenegado]);

  const tecnicasFiltradas = tecnicasDisponiveis.filter(t =>
    t.nome.toLowerCase().includes(searchTecnica.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ALERTA SE FOR PRODÍGIO OU RENEGADO */}
      {requerGrandeCla && (
        <Card 
          className="p-4"
          style={{
            backgroundColor: isProdigio ? 'rgba(29, 78, 216, 0.15)' : 'rgba(124, 45, 18, 0.2)',
            borderColor: isProdigio ? '#3b82f6' : '#c2410c',
            borderWidth: '2px'
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle 
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: isProdigio ? '#60a5fa' : '#fdba74' }}
            />
            <div>
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: isProdigio ? '#dbeafe' : '#fde68a' }}
              >
                {isProdigio ? '👑 Prodígio do Clã' : '⚔️ Renegado'}
              </p>
              <p 
                className="text-xs mb-2"
                style={{ color: isProdigio ? '#bfdbfe' : '#fef3c7' }}
              >
                {isProdigio 
                  ? 'Você pode escolher apenas um dos 3 grandes clãs e APENAS técnicas hereditárias.'
                  : 'Você pode escolher apenas um dos 3 grandes clãs, mas NÃO pode escolher técnicas hereditárias.'
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ========== SEÇÃO DE CLÃS COM SCROLL ========== */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          Escolha seu Clã
        </h3>
        <p className="mb-6" style={{ color: '#cbd5e1' }}>
          {requerGrandeCla 
            ? 'Sua origem limita a escolha aos 3 grandes clãs.'
            : 'Seu clã determina acesso a técnicas hereditárias e prestígio inicial.'
          }
        </p>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{
            maxHeight: '500px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          {clasDisponiveis.map((cla) => {
            const isSelected = selectedCla === cla.id;
            const isGrandeCla = cla.grandesClas;

            return (
              <Card
                key={cla.id}
                onClick={() => handleClaSelect(cla.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected
                    ? 'bg-yellow-900/20'
                    : 'bg-slate-800/50 border-slate-700 hover:border-yellow-600'
                }`}
                style={isSelected ? {
                  borderColor: '#ef4444',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.25)'
                } : {}}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-white">{cla.nome}</h4>
                    {isSelected && <CheckCircle className="w-5 h-5" style={{ color: '#ef4444' }} />}
                  </div>
                </div>

                <p className="text-sm mb-3" style={{ color: '#cbd5e1' }}>
                  {cla.descricao}
                </p>

                {isGrandeCla && (
                  <div 
                    className="text-sm px-3 py-1.5 rounded mb-2"
                    style={{ 
                      backgroundColor: 'rgba(202, 138, 4, 0.15)', 
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      display: 'block',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}
                  >
                    Grande Clã
                  </div>
                )}

                {cla.tecnicasHereditarias && cla.tecnicasHereditarias.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold" style={{ color: '#d97706' }}>
                      Técnicas Hereditárias:
                    </p>
                    <p className="text-xs" style={{ color: '#f59e0b' }}>
                      {cla.tecnicasHereditarias.length} disponível(is)
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* CAMPO DE PRESTÍGIO DO CLÃ (apenas para 3 grandes clãs) */}
      {isTresGrandesClas && (
        <Card 
          className="p-4"
          style={{
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderColor: '#fbbf24',
            borderWidth: '2px'
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-5 h-5" style={{ color: '#fbbf24' }} />
            <h4 className="text-lg font-semibold text-white">Prestígio do Clã</h4>
          </div>
          
          <Label htmlFor="prestigioCla" className="text-white">
            Pontos de Prestígio no {claData?.nome}
          </Label>
          <Input
            id="prestigioCla"
            type="number"
            min="0"
            max="100"
            value={data.prestigioCla || 0}
            onChange={(e) => updateData({ prestigioCla: Math.max(0, parseInt(e.target.value) || 0) })}
            className="bg-slate-900 border-slate-700 text-white mt-2"
          />
          {classificacaoCla && (
            <div className="mt-2 flex items-center gap-2">
              <span
                style={{
                  backgroundColor: '#1e293b',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: getCorPrestigioCla(classificacaoCla.classificacao),
                  border: `1px solid ${getCorPrestigioCla(classificacaoCla.classificacao)}`,
                  fontWeight: 600
                }}
              >
                {classificacaoCla.label}
              </span>
            </div>
          )}
          <p className="text-xs mt-2" style={{ color: '#fde68a' }}>
            Prestígio do clã influencia narrativa e acesso a habilidades secretas do clã.
          </p>
        </Card>
      )}

      {/* ========== SEÇÃO DE TÉCNICAS COM SCROLL ========== */}
      <div>
        <br></br>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Escolha sua Técnica Inata
        </h3>
        <p className="mb-4" style={{ color: '#cbd5e1' }}>
          {isProdigio 
            ? 'Como prodígio, você só pode escolher técnicas hereditárias do seu clã.'
            : isRenegado
            ? 'Como renegado, você NÃO pode escolher técnicas hereditárias.'
            : 'Sua técnica inata define seu estilo de combate e habilidades únicas.'
          }
        </p>

        {claData && (
          <div 
            className="mb-4 p-3 rounded-lg border"
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              borderColor: '#475569'
            }}
          >
            <p className="text-sm" style={{ color: '#e2e8f0' }}>
              <span className="font-semibold">Clã {claData.nome}:</span>{' '}
              <span style={{ color: '#94a3b8' }}>
                {isProdigio 
                  ? `Apenas ${claData.tecnicasHereditarias?.length || 0} técnica(s) hereditária(s) disponível(is)`
                  : isRenegado
                  ? 'Apenas técnicas não-hereditárias disponíveis'
                  : claData.tecnicasHereditarias
                  ? `Acesso a ${claData.tecnicasHereditarias.length} técnica(s) hereditária(s) + todas não-hereditárias`
                  : 'Apenas técnicas não-hereditárias disponíveis'
                }
              </span>
            </p>
          </div>
        )}

        <div className="relative mb-4">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: '#94a3b8' }}
          />
          <Input
            type="text"
            placeholder="Buscar técnica..."
            value={searchTecnica}
            onChange={(e) => setSearchTecnica(e.target.value)}
            className="pl-10"
            style={{
              backgroundColor: '#1e293b',
              borderColor: '#475569',
              color: '#ffffff'
            }}
          />
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{
            maxHeight: '500px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          {tecnicasFiltradas.length > 0 ? (
            tecnicasFiltradas.map((tecnica) => {
              const isSelected = selectedTecnica === tecnica.id;

              return (
                <Card
                  key={tecnica.id}
                  onClick={() => handleTecnicaSelect(tecnica.id)}
                  className={`cursor-pointer transition-all p-4 ${
                    isSelected
                      ? 'bg-purple-900/20'
                      : 'bg-slate-800/50 border-slate-700 hover:border-purple-600'
                  }`}
                  style={isSelected ? {
                    borderColor: '#ef4444',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.25)'
                  } : {}}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg font-semibold text-white">{tecnica.nome}</h4>
                      {tecnica.tipo === 'hereditaria' && (
                        <span
                          className="text-xs"
                          style={{
                            backgroundColor: '#7c3aed',
                            color: '#e9d5ff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: '500',
                            display: 'inline-block'
                          }}
                        >
                          Hereditária
                        </span>
                      )}
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5" style={{ color: '#ef4444' }} />}
                  </div>

                  <p className="text-sm" style={{ color: '#cbd5e1' }}>
                    {tecnica.descricao}
                  </p>

                  {tecnica.requisitos && (
                    <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>
                      <span className="font-semibold">Requisito:</span> {tecnica.requisitos}
                    </p>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-8">
              <p style={{ color: '#94a3b8' }}>
                {isProdigio 
                  ? 'Nenhuma técnica hereditária disponível para este clã'
                  : isRenegado
                  ? 'Nenhuma técnica não-hereditária encontrada'
                  : 'Nenhuma técnica encontrada'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      <br></br>
    </div>
  );
}
