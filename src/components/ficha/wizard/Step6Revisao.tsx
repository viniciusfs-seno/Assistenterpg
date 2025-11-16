// src/components/ficha/wizard/Step6Revisao.tsx - CORRIGIDO COM PROFICIÊNCIAS DOS PODERES

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { User, Swords, MapPin, Crown, Sparkles, BookOpen, Shield, Award, Zap, GraduationCap } from 'lucide-react';
import { getClasseData } from '../../../data/classes';
import { ORIGENS } from '../../../data/origens';
import { CLAS } from '../../../data/clas';
import { TECNICAS_INATAS } from '../../../data/tecnicas-inatas';
import { calcularStats } from '../../../types/character';
import { calcularBeneficiosPrestigio, calcularClassificacaoPrestigioCla, getCorGrauFeiticeiro } from '../../../utils/prestigio';
import { getPoderById } from '../../../data/poderes';
import { calcularBonusPoderes } from '../../../utils/poderEffects'; // ✅ NOVO IMPORT
import { getProficienciaById } from '../../../data/proficiencias'; // ✅ NOVO IMPORT

interface Step6RevisaoProps {
  data: CharacterCreationData;
}

export function Step6Revisao({ data }: Step6RevisaoProps) {
  const classeData = getClasseData(data.classe);
  const origemData = ORIGENS.find(o => o.id === data.origemId);
  const claData = CLAS.find(c => c.id === data.cla);
  const tecnicaData = TECNICAS_INATAS.find(t => t.id === data.tecnicaInataId);

  const beneficiosPrestigio = calcularBeneficiosPrestigio(data.pontosPrestígio || 0);
  const classificacaoCla = (data.prestigioCla && data.prestigioCla > 0)
    ? calcularClassificacaoPrestigioCla(data.prestigioCla)
    : null;

  const stats = calcularStats(
    data.nivel,
    data.classe,
    data.atributos,
    data.atributoEA || 'intelecto',
    data.poderesIds || [],
    []
  );

  const isTresGrandesClas = ['gojo', 'zenin', 'kamo'].includes(data.cla);
  const bonusJujutsu = data.periciasBonusExtra?.['Jujutsu'] || 0;

  // ✅ CORRIGIDO: Filtrar poderes válidos antes de renderizar
  const poderesValidos = (data.poderesIds || [])
    .map(poderId => getPoderById(poderId))
    .filter((poder): poder is NonNullable<typeof poder> => poder !== null);

  // ✅ NOVO: Calcular proficiências dos poderes
  const bonusPoderes = calcularBonusPoderes(data.poderesIds || [], data.nivel);
  const proficienciasPoderes = bonusPoderes.proficienciasGanhas;

  // ✅ NOVO: Combinar proficiências da classe e dos poderes
  const todasProficiencias = [
    ...(classeData?.proficiencias || []),
    ...proficienciasPoderes
  ];

  // ✅ NOVO: Remover duplicatas
  const proficienciasUnicas = Array.from(new Set(todasProficiencias));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">✅ Revisão Final</h3>
        <p style={{ color: '#cbd5e1' }}>
          Revise todas as informações do seu personagem antes de finalizar.
        </p>
      </div>

      {/* INFORMAÇÕES BÁSICAS */}
      <Card
        className="p-4"
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          borderWidth: '1px'
        }}
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" style={{ color: '#60a5fa' }} />
          Informações Básicas
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Nome</p>
            <p className="font-semibold text-white text-base">{data.nome}</p>
          </div>
          {data.idade && (
            <div>
              <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Idade</p>
              <p className="font-semibold text-white text-base">{data.idade}</p>
            </div>
          )}
          <div>
            <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Nível</p>
            <p className="font-semibold text-white text-base">{data.nivel}</p>
          </div>
          {data.jogador && (
            <div>
              <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Jogador</p>
              <p className="font-semibold text-white text-base">{data.jogador}</p>
            </div>
          )}
        </div>
        {data.descricao && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #334155' }}>
            <p className="text-xs mb-2 font-semibold" style={{ color: '#94a3b8' }}>Descrição</p>
            <p className="text-sm leading-relaxed" style={{ color: '#e2e8f0' }}>{data.descricao}</p>
          </div>
        )}
      </Card>

      {/* PRESTÍGIO */}
      <Card
        className="p-4"
        style={{
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          borderColor: '#fbbf24',
          borderWidth: '2px'
        }}
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: '#fbbf24' }} />
          Prestígio
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Pontos de Prestígio</p>
            <p className="font-semibold text-white text-base">{data.pontosPrestígio || 0}</p>
          </div>
          <div>
            <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Grau de Feiticeiro</p>
            <p
              className="font-semibold text-base"
              style={{ color: getCorGrauFeiticeiro(beneficiosPrestigio.grauFeiticeiro) }}
            >
              {beneficiosPrestigio.grauFeiticeiroLabel}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Limite de Crédito</p>
            <p className="font-semibold text-white text-base">{beneficiosPrestigio.limiteCreditoLabel}</p>
          </div>
          {isTresGrandesClas && (
            <div>
              <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Prestígio do Clã</p>
              <p className="font-semibold text-white text-base">
                {data.prestigioCla || 0}
                {classificacaoCla && (
                  <span className="text-xs ml-2" style={{ color: '#fbbf24' }}>
                    ({classificacaoCla.label})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#cbd5e1' }}>Limite de Itens por Categoria:</p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" style={{ backgroundColor: '#1e293b', color: '#ffffff', borderColor: '#475569' }}>
              Cat. 4: {beneficiosPrestigio.limiteItens.categoria4}
            </Badge>
            <Badge variant="outline" style={{ backgroundColor: '#1e293b', color: '#60a5fa', borderColor: '#60a5fa' }}>
              Cat. 3: {beneficiosPrestigio.limiteItens.categoria3}
            </Badge>
            <Badge variant="outline" style={{ backgroundColor: '#1e293b', color: '#8b5cf6', borderColor: '#8b5cf6' }}>
              Cat. 2: {beneficiosPrestigio.limiteItens.categoria2}
            </Badge>
            <Badge variant="outline" style={{ backgroundColor: '#1e293b', color: '#f59e0b', borderColor: '#f59e0b' }}>
              Cat. 1: {beneficiosPrestigio.limiteItens.categoria1}
            </Badge>
            <Badge variant="outline" style={{ backgroundColor: '#1e293b', color: '#ef4444', borderColor: '#ef4444' }}>
              Especial: {beneficiosPrestigio.limiteItens.especial}
            </Badge>
          </div>
        </div>
      </Card>

      {/* CLASSE & ORIGEM */}
      <Card
        className="p-4"
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#ef4444',
          borderWidth: '2px'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Swords className="w-5 h-5" style={{ color: '#ef4444' }} />
              Classe
            </h4>
            <p className="font-semibold text-white mb-2">{classeData?.nome}</p>
            <p className="text-sm" style={{ color: '#cbd5e1' }}>{classeData?.descricao}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: '#22c55e' }} />
              Origem
            </h4>
            <p className="font-semibold text-white mb-2">{origemData?.nome}</p>
            <p className="text-sm" style={{ color: '#cbd5e1' }}>{origemData?.descricao}</p>
          </div>
        </div>
      </Card>

      {/* ESCOLA TÉCNICA JUJUTSU */}
      {data.estudouEscolaTecnica && (
        <Card
          className="p-4"
          style={{
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            borderColor: '#8b5cf6',
            borderWidth: '2px'
          }}
        >
          <div className="flex items-start gap-3">
            <GraduationCap className="w-6 h-6 flex-shrink-0" style={{ color: '#a78bfa' }} />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-2">
                🎓 Estudou na Escola Técnica Jujutsu
              </h4>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#e9d5ff' }}>
                {bonusJujutsu > 0 ? (
                  <>
                    Você recebeu a perícia <strong>Jujutsu</strong>, mas sua classe ou origem já concedia essa perícia.
                    Por isso, você ganhou <strong style={{ color: '#fbbf24' }}>+{bonusJujutsu} de bônus extra</strong> em Jujutsu!
                  </>
                ) : (
                  <>
                    Você recebe a perícia <strong>Jujutsu</strong> gratuitamente por ter estudado na Escola Técnica.
                  </>
                )}
              </p>
              <Badge
                variant="outline"
                style={{
                  backgroundColor: '#1e3a8a',
                  color: '#93c5fd',
                  borderColor: '#3b82f6',
                  padding: '6px 12px',
                  fontSize: '0.875rem'
                }}
              >
                📚 Jujutsu {bonusJujutsu > 0 && `(+${5 + bonusJujutsu} total)`}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* CLÃ & TÉCNICA */}
      <Card
        className="p-4"
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#ef4444',
          borderWidth: '2px'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Crown className="w-5 h-5" style={{ color: '#eab308' }} />
              Clã
            </h4>
            <p className="font-semibold text-white mb-2">{claData?.nome}</p>
            <p className="text-sm" style={{ color: '#cbd5e1' }}>{claData?.descricao}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: '#a855f7' }} />
              Técnica Inata
            </h4>
            <p className="font-semibold text-white mb-2">{tecnicaData?.nome || 'Nenhuma'}</p>
            <p className="text-sm" style={{ color: '#cbd5e1' }}>{tecnicaData?.descricao}</p>
          </div>
        </div>
      </Card>

      {/* ATRIBUTOS - HORIZONTAL FORÇADO */}
      <Card
        className="p-4"
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          borderWidth: '1px'
        }}
      >
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <User className="w-5 h-5" style={{ color: '#22c55e' }} />
          Atributos
        </h4>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {Object.entries(data.atributos).map(([attr, val]) => (
            <div
              key={`attr-${attr}`}
              className="text-center rounded-md py-3"
              style={{
                backgroundColor: '#1e293b',
                flex: '1 1 calc(20% - 10px)',
                minWidth: '80px'
              }}
            >
              <div className="text-xs uppercase mb-1 font-bold" style={{ color: '#cbd5e1' }}>
                {attr.slice(0, 3).toUpperCase()}
              </div>
              <div className="text-2xl font-bold text-white">{val}</div>
            </div>
          ))}
        </div>

        <div
          className="mt-4 p-3 rounded-lg flex items-center gap-3"
          style={{
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid #8b5cf6'
          }}
        >
          <Zap className="w-5 h-5" style={{ color: '#a78bfa' }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#c4b5fd' }}>
              Atributo para Energia Amaldiçoada (EA)
            </p>
            <p className="text-sm font-bold text-white">
              {data.atributoEA === 'intelecto' ? '🧠 Intelecto' : '✨ Presença'} ({data.atributos[data.atributoEA || 'intelecto']})
            </p>
          </div>
        </div>
      </Card>

      {/* ESTATÍSTICAS */}
      <Card
        className="p-4"
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          borderWidth: '1px'
        }}
      >
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" style={{ color: '#60a5fa' }} />
          Estatísticas
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            className="rounded-md p-3 text-center"
            style={{ backgroundColor: '#1e293b' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#cbd5e1' }}>PV</p>
            <p className="text-2xl font-bold text-white">{stats.pvMax}</p>
          </div>
          <div
            className="rounded-md p-3 text-center"
            style={{ backgroundColor: '#1e293b' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#cbd5e1' }}>PE</p>
            <p className="text-2xl font-bold text-white">{stats.peMax}</p>
          </div>
          <div
            className="rounded-md p-3 text-center"
            style={{ backgroundColor: '#1e293b' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#cbd5e1' }}>EA</p>
            <p className="text-2xl font-bold text-white">{stats.eaMax}</p>
          </div>
          <div
            className="rounded-md p-3 text-center"
            style={{ backgroundColor: '#1e293b' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#cbd5e1' }}>SAN</p>
            <p className="text-2xl font-bold text-white">{stats.sanMax}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div
            className="rounded-md p-3 text-center"
            style={{ backgroundColor: '#1e293b' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#cbd5e1' }}>Defesa</p>
            <p className="text-2xl font-bold text-white">{stats.defesa}</p>
          </div>
          <div
            className="rounded-md p-3 text-center"
            style={{ backgroundColor: '#1e293b' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#cbd5e1' }}>Deslocamento</p>
            <p className="text-2xl font-bold text-white">{stats.deslocamento}m</p>
          </div>
        </div>
      </Card>

      {/* PERÍCIAS */}
      <Card
        className="p-4"
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#ef4444',
          borderWidth: '2px'
        }}
      >
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: '#a855f7' }} />
          Perícias Treinadas
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.periciasTreinadas.length > 0 ? (
            data.periciasTreinadas.map((pericia, index) => {
              const temBonus = data.periciasBonusExtra?.[pericia];
              return (
                <Badge
                  key={`pericia-${pericia}-${index}`}
                  variant="outline"
                  style={{
                    backgroundColor: '#1e3a8a',
                    color: '#93c5fd',
                    borderColor: '#1d4ed8'
                  }}
                >
                  {pericia} {temBonus ? `(+${5 + temBonus})` : ''}
                </Badge>
              );
            })
          ) : (
            <p className="text-sm" style={{ color: '#cbd5e1' }}>Nenhuma perícia selecionada</p>
          )}
        </div>
        <p className="text-xs mt-3 font-semibold" style={{ color: '#cbd5e1' }}>
          Total: {data.periciasTreinadas.length} perícia(s)
        </p>
      </Card>

      {/* ✅ CORRIGIDO: Proficiências - AGORA MOSTRA CLASSE + PODERES */}
      <Card 
        className="p-4" 
        style={{ 
          backgroundColor: '#0f172a', 
          borderColor: '#10b981', 
          borderWidth: '2px' 
        }}
      >
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          🛡️ Proficiências
        </h4>
        
        {proficienciasUnicas.length > 0 ? (
          <div className="space-y-3">
            {/* Proficiências da Classe */}
            {classeData?.proficiencias && classeData.proficiencias.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Da Classe:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {classeData.proficiencias.map((prof, index) => {
                    const profData = getProficienciaById(prof);
                    return (
                      <div
                        key={`prof-classe-${prof}-${index}`}
                        className="p-2 rounded"
                        style={{
                          backgroundColor: '#1e293b',
                          borderLeft: '3px solid #3b82f6'
                        }}
                      >
                        <p className="text-sm" style={{ color: '#e2e8f0' }}>
                          {profData?.nome || prof}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ✅ NOVO: Proficiências dos Poderes */}
            {proficienciasPoderes.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#94a3b8' }}>
                  Dos Poderes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {proficienciasPoderes.map((prof, index) => {
                    const profData = getProficienciaById(prof);
                    return (
                      <div
                        key={`prof-poder-${prof}-${index}`}
                        className="p-2 rounded"
                        style={{
                          backgroundColor: '#1e293b',
                          borderLeft: '3px solid #10b981'
                        }}
                      >
                        <p className="text-sm" style={{ color: '#e2e8f0' }}>
                          {profData?.nome || prof}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Nenhuma proficiência
          </p>
        )}

        <p className="text-xs mt-3 font-semibold" style={{ color: '#cbd5e1' }}>
          Total: {proficienciasUnicas.length} proficiência(s)
        </p>
      </Card>

      {/* PODERES DE CLASSE */}
      {poderesValidos.length > 0 && (
        <Card
          className="p-4"
          style={{
            backgroundColor: '#0f172a',
            borderColor: '#8b5cf6',
            borderWidth: '2px'
          }}
        >
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#a855f7' }} />
            Poderes de Classe
          </h4>
          <div className="space-y-2">
            {poderesValidos.map((poder) => (
              <div
                key={`poder-${poder.id}`}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: '#1e293b',
                  borderLeft: '4px solid #8b5cf6'
                }}
              >
                <div className="flex items-start gap-2 mb-1">
                  <h5 className="font-semibold text-white text-sm">{poder.nome}</h5>
                  <Badge
                    style={{
                      backgroundColor: poder.tipo === 'passivo' ? '#3b82f6' : '#8b5cf6',
                      color: '#ffffff',
                      fontSize: '10px',
                      padding: '2px 6px'
                    }}
                  >
                    {poder.tipo === 'passivo' ? '🔹 Passivo' : '⚡ Manual'}
                  </Badge>
                </div>
                <p className="text-xs" style={{ color: '#cbd5e1' }}>
                  {poder.descricao}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3 font-semibold" style={{ color: '#cbd5e1' }}>
            Total: {poderesValidos.length} poder(es)
          </p>
        </Card>
      )}

      <br />
    </div>
  );
}
