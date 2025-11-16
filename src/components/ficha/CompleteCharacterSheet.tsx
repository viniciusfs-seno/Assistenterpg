import { useState } from 'react';
import { Character, PERICIAS_BASE, GrauTreinamento } from '../../types/character';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  User,
  BookOpen,
  Heart,
  Shield,
  ChevronLeft,
  Backpack,
  Sparkles,
  Target,
  Award,
  CreditCard,
  Package,
  Zap,
  GraduationCap
} from 'lucide-react';
import { getClasseData } from '../../data/classes';
import { ORIGENS } from '../../data/origens';
import { CLAS } from '../../data/clas';
import { getTrilhaById } from '../../data/trilhas';
import { getProficienciaById } from '../../data/proficiencias';
import { calcularBeneficiosPrestigio, calcularClassificacaoPrestigioCla, getCorGrauFeiticeiro, getCorPrestigioCla } from '../../utils/prestigio';
import { getPoderById } from '../../data/poderes';

interface CompleteCharacterSheetProps {
  character: Character;
  onBack: () => void;
  onEdit?: () => void;
  viewMode?: 'simple' | 'detailed';
}

type Tab = 'overview' | 'trilha' | 'skills' | 'background' | 'inventory';

export function CompleteCharacterSheet({ character, onBack, onEdit, viewMode = 'detailed' }: CompleteCharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const classeData = getClasseData(character.classe);
  const origemData = ORIGENS.find(o => o.id === character.origemId);
  const claData = CLAS.find(c => c.id === character.cla);
  const trilhaData = character.trilha ? getTrilhaById(character.trilha) : null;

  const pvTotal = character.stats?.pvMax ?? 0;
  const peTotal = character.stats?.peMax ?? 0;
  const eaTotal = character.stats?.eaMax ?? 0;
  const sanTotal = character.stats?.sanMax ?? 0;
  const defesa = character.stats?.defesa ?? (10 + character.atributos.agilidade);
  const deslocamento = character.stats?.deslocamento ?? 9;

  const beneficiosPrestigio = calcularBeneficiosPrestigio(character.pontosPrestígio || 0);
  const classificacaoCla = character.prestigioCla
    ? calcularClassificacaoPrestigioCla(character.prestigioCla)
    : null;

  const isTresGrandesClas = ['gojo', 'zenin', 'kamo'].includes(character.cla);

  const tabs = [
    { id: 'overview' as Tab, label: 'Visão Geral', icon: User },
    { id: 'trilha' as Tab, label: 'Trilha', icon: Target },
    { id: 'skills' as Tab, label: 'Habilidades', icon: Sparkles },
    { id: 'background' as Tab, label: 'Background', icon: BookOpen },
    { id: 'inventory' as Tab, label: 'Inventário', icon: Backpack }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '24px' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #475569'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Button
            onClick={onBack}
            style={{
              backgroundColor: '#475569',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ChevronLeft style={{ width: '20px', height: '20px' }} />
            Voltar
          </Button>
          {onEdit && (
            <Button
              onClick={onEdit}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Editar
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
              {character.nome}
            </h1>
            <p style={{ fontSize: '18px', color: '#94a3b8', margin: 0 }}>
              {classeData?.nome} -  {origemData?.nome} -  {claData?.nome}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: getCorGrauFeiticeiro(beneficiosPrestigio.grauFeiticeiro),
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            >
              <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: 600 }}>GRAU</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {beneficiosPrestigio.grauFeiticeiroLabel.replace('Grau ', '')}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: 600 }}>NÍVEL</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{character.nivel}</div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px 12px 0 0',
          padding: '0',
          display: 'flex',
          gap: '0',
          borderBottom: '2px solid #475569'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 24px',
                backgroundColor: isActive ? '#ef4444' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s',
                borderRadius: isActive ? '12px 12px 0 0' : '0'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#334155';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon style={{ width: '18px', height: '18px' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '0 0 12px 12px',
          padding: '20px',
          border: '1px solid #475569',
          borderTop: 'none'
        }}
      >
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '360px', flex: '1' }}>
              <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                  Informações
                </h3>
                <InfoRow label="Classe" value={classeData?.nome} />
                <InfoRow label="Origem" value={origemData?.nome} />
                <InfoRow label="Clã" value={claData?.nome} />
                {trilhaData && (
                  <InfoRow
                    label="Trilha"
                    value={
                      trilhaData.nome +
                      (trilhaData.id === 'mestre_barreiras' && character.subcaminhoMestreBarreiras
                        ? ` (${character.subcaminhoMestreBarreiras.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})`
                        : ''
                      )
                    }
                  />
                )}
              </Card>

              <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
                  Prestígio
                </h3>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Pontos de Prestígio</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fbbf24' }}>
                      {character.pontosPrestígio || 0}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <div style={{
                      backgroundColor: '#1e293b',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: getCorGrauFeiticeiro(beneficiosPrestigio.grauFeiticeiro),
                      border: `1px solid ${getCorGrauFeiticeiro(beneficiosPrestigio.grauFeiticeiro)}`,
                      fontWeight: 600
                    }}>
                      <Award style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                      {beneficiosPrestigio.grauFeiticeiroLabel}
                    </div>
                    <div style={{
                      backgroundColor: '#1e293b',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#60a5fa',
                      border: '1px solid #60a5fa',
                      fontWeight: 600
                    }}>
                      <CreditCard style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                      Crédito {beneficiosPrestigio.limiteCreditoLabel}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Package style={{ width: '14px', height: '14px' }} />
                    Limite de Itens por Categoria
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', fontSize: '11px' }}>
                    <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '6px 4px', borderRadius: '4px' }}>
                      <div style={{ color: '#94a3b8', marginBottom: '2px' }}>Cat. 4</div>
                      <div style={{ color: '#ffffff', fontWeight: 'bold' }}>{beneficiosPrestigio.limiteItens.categoria4}</div>
                    </div>
                    <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '6px 4px', borderRadius: '4px' }}>
                      <div style={{ color: '#94a3b8', marginBottom: '2px' }}>Cat. 3</div>
                      <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>{beneficiosPrestigio.limiteItens.categoria3}</div>
                    </div>
                    <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '6px 4px', borderRadius: '4px' }}>
                      <div style={{ color: '#94a3b8', marginBottom: '2px' }}>Cat. 2</div>
                      <div style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{beneficiosPrestigio.limiteItens.categoria2}</div>
                    </div>
                    <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '6px 4px', borderRadius: '4px' }}>
                      <div style={{ color: '#94a3b8', marginBottom: '2px' }}>Cat. 1</div>
                      <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>{beneficiosPrestigio.limiteItens.categoria1}</div>
                    </div>
                    <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '6px 4px', borderRadius: '4px' }}>
                      <div style={{ color: '#94a3b8', marginBottom: '2px' }}>Esp.</div>
                      <div style={{ color: '#ef4444', fontWeight: 'bold' }}>{beneficiosPrestigio.limiteItens.especial}</div>
                    </div>
                  </div>
                </div>

                {isTresGrandesClas && classificacaoCla && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Prestígio do Clã</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fbbf24' }}>
                          {character.prestigioCla || 0}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: getCorPrestigioCla(classificacaoCla.classificacao),
                          backgroundColor: '#1e293b',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: `1px solid ${getCorPrestigioCla(classificacaoCla.classificacao)}`
                        }}>
                          {classificacaoCla.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                  Proficiências
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(character.proficiencias || []).length > 0 ? (
                    character.proficiencias.map(profId => {
                      const prof = getProficienciaById(profId);
                      if (!prof) return null;

                      const colorMap = {
                        arma: '#3b82f6',
                        protecao: '#22c55e',
                        item_amaldicoado: '#8b5cf6',
                      };

                      return (
                        <div
                          key={profId}
                          style={{
                            backgroundColor: '#1e293b',
                            border: `2px solid ${colorMap[prof.categoria]}`,
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '13px',
                            color: colorMap[prof.categoria],
                            fontWeight: 600,
                            cursor: 'help',
                          }}
                          title={`${prof.descricao}\n\nPenalidade: ${prof.penalidade}`}
                        >
                          {prof.nome}
                        </div>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Nenhuma proficiência</span>
                  )}
                </div>
              </Card>

              {/* ESCOLA TÉCNICA JUJUTSU */}
              {character.estudouEscolaTecnica && (
                <Card 
                  style={{ 
                    backgroundColor: 'rgba(139, 92, 246, 0.15)', 
                    borderColor: '#8b5cf6',
                    borderWidth: '2px',
                    padding: '18px' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <GraduationCap style={{ width: '20px', height: '20px', color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                        Escola Técnica Jujutsu
                      </h3>
                      <p style={{ fontSize: '13px', color: '#e9d5ff', lineHeight: '1.5', marginBottom: '8px' }}>
                        {character.periciasBonusExtra?.['Jujutsu'] ? (
                          <>
                            Estudou na Escola Técnica e recebeu <strong style={{ color: '#fbbf24' }}>+{character.periciasBonusExtra['Jujutsu']} de bônus</strong> em Jujutsu por já possuir essa perícia.
                          </>
                        ) : (
                          <>
                            Estudou na Escola Técnica e recebe a perícia <strong>Jujutsu</strong> gratuitamente.
                          </>
                        )}
                      </p>
                      <div
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #8b5cf6',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '13px',
                          color: '#a78bfa',
                          fontWeight: 600,
                          display: 'inline-block'
                        }}
                      >
                        🎓 Graduado
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                  Atributos
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <AttributeBox label="AGI" value={character.atributos.agilidade} color="#3b82f6" />
                  <AttributeBox label="FOR" value={character.atributos.forca} color="#ef4444" />
                  <AttributeBox label="INT" value={character.atributos.intelecto} color="#8b5cf6" />
                  <AttributeBox label="PRE" value={character.atributos.presenca} color="#f59e0b" />
                  <AttributeBox label="VIG" value={character.atributos.vigor} color="#22c55e" />
                </div>

                {/* ATRIBUTO EA */}
                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Zap style={{ width: '16px', height: '16px', color: '#a78bfa', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#c4b5fd', fontWeight: 600, marginBottom: '2px' }}>
                      Atributo para EA
                    </div>
                    <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 'bold' }}>
                      {character.atributoEA === 'intelecto' ? '🧠 Intelecto' : '✨ Presença'} ({character.atributos[character.atributoEA || 'intelecto']})
                    </div>
                  </div>
                </div>
              </Card>

              <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart style={{ width: '18px', height: '18px', color: '#ef4444' }} />
                  Recursos
                </h3>
                <ResourceItem label="Pontos de Vida" value={character.stats?.pvAtual} max={pvTotal} color="#ef4444" />
                <ResourceItem label="Pontos de Esforço" value={character.stats?.peAtual} max={peTotal} color="#3b82f6" />
                <ResourceItem label="Energia Amaldiçoada" value={character.stats?.eaAtual} max={eaTotal} color="#6366f1" />
                <ResourceItem label="Sanidade" value={character.stats?.sanAtual} max={sanTotal} color="#a855f7" />
              </Card>

              <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield style={{ width: '18px', height: '18px', color: '#22c55e' }} />
                  Combate
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <CombatBox label="Defesa" value={defesa} color="#22c55e" />
                  <CombatBox label="Deslocamento" value={`${deslocamento}m`} color="#a3e635" />
                </div>
                <div style={{ marginTop: 10, fontSize: '12px', color: '#94a3b8' }}>
                  Iniciativa: role <b>Iniciativa</b> em combate.
                </div>
              </Card>
            </div>

            <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '18px', flex: '1', minWidth: '480px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                Perícias
              </h3>
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', color: '#a3a3a3', fontWeight: 500, fontSize: 13, padding: '8px 12px 8px 6px', borderBottom: '1px solid #334155' }}>Perícia</th>
                      <th style={{ textAlign: 'center', color: '#a3a3a3', fontWeight: 500, fontSize: 13, padding: '8px 8px', borderBottom: '1px solid #334155' }}>Bônus</th>
                      <th style={{ textAlign: 'center', color: '#a3a3a3', fontWeight: 500, fontSize: 13, padding: '8px 12px', borderBottom: '1px solid #334155' }}>Grau</th>
                      <th style={{ textAlign: 'center', color: '#a3a3a3', fontWeight: 500, fontSize: 13, padding: '8px 8px', borderBottom: '1px solid #334155' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERICIAS_BASE.map(periciaBase => {
                      const grau = character.periciaGrados?.[periciaBase.nome] ?? GrauTreinamento.DESTREINADO;
                      const bonusExtra = character.periciasBonusExtra?.[periciaBase.nome] ?? 0;
                      const total = grau + bonusExtra;
                      const atributoAbrev = {
                        agilidade: 'AGI',
                        forca: 'FOR',
                        intelecto: 'INT',
                        presenca: 'PRE',
                        vigor: 'VIG'
                      }[periciaBase.atributoBase] ?? '?';

                      const legendaGrau = {
                        [GrauTreinamento.DESTREINADO]: 'Destreinado',
                        [GrauTreinamento.TREINADO]: 'Treinado',
                        [GrauTreinamento.GRADUADO]: 'Graduado',
                        [GrauTreinamento.VETERANO]: 'Veterano',
                        [GrauTreinamento.EXPERT]: 'Expert'
                      }[grau] ?? grau;

                      return (
                        <tr key={periciaBase.nome} style={{ borderBottom: '1px solid #1e293b' }}>
                          <td style={{ color: '#fff', fontWeight: 500, padding: '7px 12px 7px 6px', fontSize: '14px' }}>
                            {periciaBase.nome} <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '13px' }}>({atributoAbrev})</span>
                          </td>
                          <td style={{ color: bonusExtra > 0 ? '#fbbf24' : '#6b7280', textAlign: 'center', fontWeight: 600, padding: '7px 8px', fontSize: '14px' }}>
                            {bonusExtra > 0 ? `+${bonusExtra}` : '—'}
                          </td>
                          <td style={{ color: '#60a5fa', textAlign: 'center', fontWeight: 600, padding: '7px 12px', fontSize: '13px' }}>
                            +{grau} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>({legendaGrau})</span>
                          </td>
                          <td style={{ color: '#22c55e', textAlign: 'center', fontWeight: 700, padding: '7px 8px', fontSize: '15px' }}>
                            {total >= 0 ? `+${total}` : total}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'trilha' && (
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {trilhaData ? (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
                    {trilhaData.nome}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    {trilhaData.descricao}
                  </p>
                  {trilhaData.requisitos && (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#1e293b', borderRadius: '8px', borderLeft: '4px solid #fbbf24' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '14px' }}>Requisito:</span>
                      <span style={{ color: '#e2e8f0', marginLeft: '8px', fontSize: '14px' }}>{trilhaData.requisitos}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {trilhaData.habilidades.map((hab) => {
                    const isUnlocked = character.nivel >= hab.nivel;

                    return (
                      <Card
                        key={hab.nivel}
                        style={{
                          backgroundColor: isUnlocked ? '#0f172a' : '#1a1a2e',
                          borderColor: isUnlocked ? '#ef4444' : '#334155',
                          borderWidth: '2px',
                          padding: '20px',
                          opacity: isUnlocked ? 1 : 0.6
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                          <div
                            style={{
                              backgroundColor: isUnlocked ? '#ef4444' : '#475569',
                              color: '#ffffff',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              minWidth: '70px',
                              textAlign: 'center'
                            }}
                          >
                            Nível {hab.nivel}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '18px', fontWeight: '600', color: isUnlocked ? '#ffffff' : '#94a3b8', marginBottom: '8px' }}>
                              {hab.nome}
                            </h4>
                            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                              {hab.descricao}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {trilhaData.subcaminhos && character.subcaminhoMestreBarreiras && (
                  <div style={{ marginTop: '32px' }}>
                    {trilhaData.subcaminhos
                      .filter(sub => sub.id === character.subcaminhoMestreBarreiras)
                      .map(subcaminho => (
                        <div key={subcaminho.id}>
                          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '12px' }}>
                            {subcaminho.nome}
                          </h3>
                          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
                            {subcaminho.descricao}
                          </p>
                          <div style={{ display: 'grid', gap: '16px' }}>
                            {subcaminho.habilidades.map((hab) => {
                              const isUnlocked = character.nivel >= hab.nivel;

                              return (
                                <Card
                                  key={hab.nivel}
                                  style={{
                                    backgroundColor: isUnlocked ? '#0f172a' : '#1a1a2e',
                                    borderColor: isUnlocked ? '#8b5cf6' : '#334155',
                                    borderWidth: '2px',
                                    padding: '20px',
                                    opacity: isUnlocked ? 1 : 0.6
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div
                                      style={{
                                        backgroundColor: isUnlocked ? '#8b5cf6' : '#475569',
                                        color: '#ffffff',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        minWidth: '70px',
                                        textAlign: 'center'
                                      }}
                                    >
                                      Nível {hab.nivel}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: isUnlocked ? '#ffffff' : '#94a3b8', marginBottom: '8px' }}>
                                        {hab.nome}
                                      </h4>
                                      <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                                        {hab.descricao}
                                      </p>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8' }}>
                <Target style={{ width: '48px', height: '48px', color: '#475569', margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>Nenhuma trilha selecionada</p>
                <p style={{ fontSize: '14px' }}>Trilhas são desbloqueadas no nível 2.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {character.poderesIds && character.poderesIds.length > 0 ? (
              <>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
                  Poderes de Classe
                </h2>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {character.poderesIds.map(poderId => {
                    const poder = getPoderById(poderId);
                    if (!poder) return null;

                    return (
                      <Card
                        key={poderId}
                        style={{
                          backgroundColor: '#0f172a',
                          borderColor: '#8b5cf6',
                          borderWidth: '2px',
                          padding: '20px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
                                {poder.nome}
                              </h4>
                              <div
                                style={{
                                  backgroundColor: poder.tipo === 'passivo' ? '#3b82f6' : '#8b5cf6',
                                  color: '#ffffff',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  padding: '4px 10px',
                                  borderRadius: '6px'
                                }}
                              >
                                {poder.tipo === 'passivo' ? '🔹 Passivo' : '⚡ Manual'}
                              </div>
                              <div
                                style={{
                                  backgroundColor: '#1e293b',
                                  color: '#94a3b8',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #475569'
                                }}
                              >
                                {poder.categoria.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                            </div>
                            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px' }}>
                              {poder.descricao}
                            </p>
                            {poder.efeitos.length > 0 && (
                              <div>
                                <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#a78bfa', marginBottom: '6px' }}>
                                  ✨ Efeitos:
                                </h5>
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                  {poder.efeitos.map((efeito, idx) => (
                                    <li key={idx} style={{ fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>
                                      {efeito}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {poder.prerequisitos && (
                              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                                <h5 style={{ fontSize: '12px', fontWeight: '600', color: '#fca5a5', marginBottom: '6px' }}>
                                  ⚠️ Pré-requisitos:
                                </h5>
                                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                                  {poder.prerequisitos.nivel && (
                                    <div>-  Nível {poder.prerequisitos.nivel}</div>
                                  )}
                                  {poder.prerequisitos.atributos?.map((req, idx) => (
                                    <div key={idx}>
                                      -  {req.atributo.charAt(0).toUpperCase() + req.atributo.slice(1)} {req.valor}
                                    </div>
                                  ))}
                                  {poder.prerequisitos.pericias?.map((req, idx) => (
                                    <div key={idx}>
                                      -  {req.nivel ? `${req.nivel} em ` : 'Treinado em '}{req.pericia}
                                    </div>
                                  ))}
                                  {poder.prerequisitos.outros?.map((req, idx) => (
                                    <div key={idx}>-  {req}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {poder.tags.length > 0 && (
                              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {poder.tags.map(tag => (
                                  <span
                                    key={tag}
                                    style={{
                                      backgroundColor: '#1e293b',
                                      color: '#94a3b8',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      border: '1px solid #334155'
                                    }}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ padding: '64px', textAlign: 'center', color: '#a1a1aa', fontSize: '18px' }}>
                <Sparkles style={{ width: '36px', height: '36px', color: '#fbbf24', margin: '0 auto', marginBottom: '16px' }} />
                <div>Nenhum poder escolhido ainda</div>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
                  Poderes são desbloqueados nos níveis 3, 6, 9, 12, 15 e 18
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'background' && (
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '24px' }}>
              Background
            </h2>
            <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '24px', marginBottom: 24 }}>
              <InfoRow label="Nome" value={character.nome} />
              <InfoRow label="Idade" value={character.idade ?? 'Não informado'} />
              <InfoRow label="Jogador" value={character.jogador ?? 'Não informado'} />
            </Card>
            {character.descricao && (
              <Card style={{ backgroundColor: '#0f172a', borderColor: '#475569', padding: '24px', marginBottom: 24 }}>
                <div style={{ color: '#cbd5e1', fontWeight: 500, marginBottom: 6 }}>Descrição</div>
                <div style={{ color: '#e2e8f0', fontSize: '15px', whiteSpace: 'pre-line' }}>{character.descricao}</div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div style={{ padding: '64px', textAlign: 'center', color: '#a1a1aa', fontSize: '18px' }}>
            <Backpack style={{ width: '36px', height: '36px', color: '#fbbf24', marginBottom: '16px' }} />
            <div>Em breve: aqui ficará o inventário do personagem!</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceItem({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600, color }}>{value ?? 0}/{max ?? 0}</span>
      </div>
      <div style={{ height: 6, background: '#1e293b', borderRadius: 999, overflow: 'hidden', marginTop: 3 }}>
        <div
          style={{
            height: '100%',
            width: `${max ? Math.min(100, (value / max) * 100) : 0}%`,
            background: color,
            transition: 'width 0.3s'
          }}
        />
      </div>
    </div>
  );
}

function AttributeBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderColor: color,
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 8,
        textAlign: 'center',
        padding: '12px 6px'
      }}
    >
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 24, color, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function CombatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        border: `2px solid ${color}`,
        borderRadius: 8,
        textAlign: 'center',
        padding: '14px 8px'
      }}
    >
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 26, color, fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '14px' }}>{label}</span>
      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '14px' }}>{value ?? '-'}</span>
    </div>
  );
}
