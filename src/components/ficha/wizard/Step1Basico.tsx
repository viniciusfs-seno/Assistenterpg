// src/components/ficha/wizard/Step1Basico.tsx - VERSÃO FINAL COM ALINHAMENTO

import { useState } from 'react';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { calcularBeneficiosPrestigio, calcularClassificacaoPrestigioCla } from '../../../utils/prestigio';
import { Award, CreditCard, GraduationCap, AlertCircle, Scale } from 'lucide-react';
import { ALINHAMENTOS, AlinhamentoType } from '../../../data/alinhamentos';

interface Step1BasicoProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step1Basico({ data, updateData }: Step1BasicoProps) {
  const beneficiosPrestigio = calcularBeneficiosPrestigio(data.pontosPrestígio || 0);
  const classificacaoCla = (data.prestigioCla && data.prestigioCla > 0)
    ? calcularClassificacaoPrestigioCla(data.prestigioCla)
    : null;

  const mostrarPrestigioCla = data.cla && ['gojo', 'zenin', 'kamo'].includes(data.cla);

  const [alinhamentoSelecionado, setAlinhamentoSelecionado] = useState<AlinhamentoType | null>(
    data.alinhamento as AlinhamentoType || null
  );

  const handleAlinhamentoChange = (id: AlinhamentoType) => {
    setAlinhamentoSelecionado(id);
    updateData({ alinhamento: id });
  };

  // ✅ Organizar alinhamentos por categoria
  const alinhamentosBons = ALINHAMENTOS.filter(a => a.categoria === 'Bom');
  const alinhamentosNeutros = ALINHAMENTOS.filter(a => a.categoria === 'Neutro');
  const alinhamentosMaus = ALINHAMENTOS.filter(a => a.categoria === 'Mau');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="nome" className="text-white">
            Nome do Personagem *
          </Label>
          <Input
            id="nome"
            value={data.nome}
            onChange={(e) => updateData({ nome: e.target.value })}
            placeholder="Ex: Megumi Fushiguro"
            className="bg-slate-900 border-slate-700 text-white mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="idade" className="text-white">
            Idade
          </Label>
          <Input
            id="idade"
            type="number"
            min="1"
            value={data.idade || ''}
            onChange={(e) => updateData({ idade: parseInt(e.target.value) || undefined })}
            placeholder="Ex: 15"
            className="bg-slate-900 border-slate-700 text-white mt-2"
          />
        </div>

        <div>
          <Label htmlFor="nivel" className="text-white">
            Nível *
          </Label>
          <Input
            id="nivel"
            type="number"
            min="1"
            max="20"
            value={data.nivel}
            onChange={(e) => updateData({ nivel: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })}
            className="bg-slate-900 border-slate-700 text-white mt-2"
            required
          />
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
            Nível do personagem (1-20)
          </p>
        </div>

        <div>
          <Label htmlFor="pontosPrestígio" className="text-white flex items-center gap-2">
            <Award className="w-4 h-4" style={{ color: '#fbbf24' }} />
            Pontos de Prestígio *
          </Label>
          <Input
            id="pontosPrestígio"
            type="number"
            min="0"
            max="300"
            value={data.pontosPrestígio || 0}
            onChange={(e) => updateData({ pontosPrestígio: Math.max(0, parseInt(e.target.value) || 0) })}
            className="bg-slate-900 border-slate-700 text-white mt-2"
            required
          />
          <div className="mt-2 flex items-center gap-2">
            <div
              style={{
                backgroundColor: '#1e293b',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#fbbf24',
                border: '1px solid #fbbf24',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Award style={{ width: '12px', height: '12px' }} />
              {beneficiosPrestigio.grauFeiticeiroLabel}
            </div>
            <div
              style={{
                backgroundColor: '#1e293b',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#60a5fa',
                border: '1px solid #60a5fa',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CreditCard style={{ width: '12px', height: '12px' }} />
              Crédito {beneficiosPrestigio.limiteCreditoLabel}
            </div>
          </div>
        </div>

        {mostrarPrestigioCla && (
          <div>
            <Label htmlFor="prestigioCla" className="text-white">
              Prestígio do Clã
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
              <p className="text-xs mt-1" style={{ color: '#fbbf24' }}>
                Classificação: {classificacaoCla.label}
              </p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="jogador" className="text-white">
            Nome do Jogador
          </Label>
          <Input
            id="jogador"
            value={data.jogador || ''}
            onChange={(e) => updateData({ jogador: e.target.value })}
            placeholder="Seu nome"
            className="bg-slate-900 border-slate-700 text-white mt-2"
          />
        </div>
      </div>

      {/* TOGGLE ESCOLA TÉCNICA JUJUTSU */}
      <div
        className="p-4 rounded-lg border-2"
        style={{
          backgroundColor: data.estudouEscolaTecnica ? 'rgba(139, 92, 246, 0.15)' : '#1e293b',
          borderColor: data.estudouEscolaTecnica ? '#8b5cf6' : '#475569',
        }}
      >
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => updateData({ estudouEscolaTecnica: !data.estudouEscolaTecnica })}
            className="flex-shrink-0 transition-all"
            style={{
              width: '56px',
              height: '32px',
              backgroundColor: data.estudouEscolaTecnica ? '#8b5cf6' : '#475569',
              borderRadius: '16px',
              position: 'relative',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                position: 'absolute',
                top: '4px',
                left: data.estudouEscolaTecnica ? '28px' : '4px',
                transition: 'left 0.2s',
              }}
            />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap
                className="w-5 h-5"
                style={{ color: data.estudouEscolaTecnica ? '#a78bfa' : '#94a3b8' }}
              />
              <h4
                className="font-semibold text-base"
                style={{ color: data.estudouEscolaTecnica ? '#ffffff' : '#cbd5e1' }}
              >
                Estudou na Escola Técnica Jujutsu
              </h4>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: data.estudouEscolaTecnica ? '#e9d5ff' : '#94a3b8' }}
            >
              {data.estudouEscolaTecnica ? (
                <>
                  ✅ <strong>Ativo:</strong> Você recebe a perícia <strong>Jujutsu</strong> gratuitamente.
                  Se sua classe ou origem já concede Jujutsu, você ganha <strong>+2 de bônus</strong> nela.
                </>
              ) : (
                <>
                  Marque se seu personagem estudou em uma escola técnica de jujutsu.
                  Isso concede a perícia <strong>Jujutsu</strong> gratuitamente.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ SELEÇÃO DE ALINHAMENTO (3 COLUNAS + CARD EMBAIXO) */}
      <Card className="p-4 bg-slate-800 border-slate-700">
        <Label className="flex items-center gap-2 mb-3 text-white">
          <Scale className="w-5 h-5" />
          Alinhamento
        </Label>
        <p className="text-sm mb-4" style={{ color: '#cbd5e1' }}>
          O alinhamento define a visão moral e ética do seu personagem.
        </p>

        {/* ✅ GRID COM 3 COLUNAS COMPACTAS */}
        <div className="grid grid-cols-3 gap-3">
          {/* ✅ COLUNA 1: BOM */}
          <div>
            <h5 className="text-sm font-bold mb-3 text-center" style={{ color: '#10b981' }}>
              ✨ Bom
            </h5>
            <div className="space-y-2">
              {alinhamentosBons.map((alinhamento) => {
                const isSelected = alinhamentoSelecionado === alinhamento.id;
                return (
                  <Card
                    key={alinhamento.id}
                    className={`cursor-pointer transition-all ${isSelected ? 'border-2' : 'border hover:border-slate-500'
                      }`}
                    style={{
                      backgroundColor: isSelected ? `${alinhamento.cor}20` : '#1e293b',
                      borderColor: isSelected ? alinhamento.cor : '#475569',
                      padding: '8px',
                      textAlign: 'center'
                    }}
                    onClick={() => handleAlinhamentoChange(alinhamento.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', position: 'relative' }}>
                      <Badge
                        style={{
                          backgroundColor: alinhamento.cor,
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          padding: '2px 6px'
                        }}
                      >
                        {alinhamento.sigla}
                      </Badge>
                      {isSelected && (
                        <span style={{
                          color: '#4ade80',
                          fontSize: '16px',
                          position: 'absolute',
                          right: '0',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}>✓</span>
                      )}
                    </div>
                    <h4 style={{ fontWeight: 600, color: '#ffffff', fontSize: '13px' }}>
                      {alinhamento.nome}
                    </h4>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* ✅ COLUNA 2: NEUTRO */}
          <div>
            <h5 className="text-sm font-bold mb-3 text-center" style={{ color: '#94a3b8' }}>
              ⚖️ Neutro
            </h5>
            <div className="space-y-2">
              {alinhamentosNeutros.map((alinhamento) => {
                const isSelected = alinhamentoSelecionado === alinhamento.id;
                return (
                  <Card
                    key={alinhamento.id}
                    className={`cursor-pointer transition-all ${isSelected ? 'border-2' : 'border hover:border-slate-500'
                      }`}
                    style={{
                      backgroundColor: isSelected ? `${alinhamento.cor}20` : '#1e293b',
                      borderColor: isSelected ? alinhamento.cor : '#475569',
                      padding: '8px',
                      textAlign: 'center'
                    }}
                    onClick={() => handleAlinhamentoChange(alinhamento.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', position: 'relative' }}>
                      <Badge
                        style={{
                          backgroundColor: alinhamento.cor,
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          padding: '2px 6px'
                        }}
                      >
                        {alinhamento.sigla}
                      </Badge>
                      {isSelected && (
                        <span style={{
                          color: '#4ade80',
                          fontSize: '16px',
                          position: 'absolute',
                          right: '0',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}>✓</span>
                      )}
                    </div>
                    <h4 style={{ fontWeight: 600, color: '#ffffff', fontSize: '13px' }}>
                      {alinhamento.nome}
                    </h4>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* ✅ COLUNA 3: MAU */}
          <div>
            <h5 className="text-sm font-bold mb-3 text-center" style={{ color: '#ef4444' }}>
              🔥 Mau
            </h5>
            <div className="space-y-2">
              {alinhamentosMaus.map((alinhamento) => {
                const isSelected = alinhamentoSelecionado === alinhamento.id;
                const isCaotico_Mau = alinhamento.id === AlinhamentoType.CAOTICO_MAU;
                return (
                  <Card
                    key={alinhamento.id}
                    className={`cursor-pointer transition-all ${isSelected ? 'border-2' : 'border hover:border-slate-500'
                      }`}
                    style={{
                      backgroundColor: isSelected ? `${alinhamento.cor}20` : '#1e293b',
                      borderColor: isSelected ? alinhamento.cor : '#475569',
                      padding: '8px',
                      textAlign: 'center',
                      opacity: isCaotico_Mau ? 0.8 : 1
                    }}
                    onClick={() => handleAlinhamentoChange(alinhamento.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', position: 'relative' }}>
                      <Badge
                        style={{
                          backgroundColor: alinhamento.cor,
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          padding: '2px 6px'
                        }}
                      >
                        {alinhamento.sigla}
                      </Badge>
                      {isSelected && (
                        <span style={{
                          color: '#4ade80',
                          fontSize: '16px',
                          position: 'absolute',
                          right: '0',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}>✓</span>
                      )}
                    </div>
                    <h4 style={{ fontWeight: 600, color: '#ffffff', fontSize: '13px' }}>
                      {alinhamento.nome}
                    </h4>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* ✅ CARD DE DETALHES EMBAIXO (só aparece quando selecionado) */}
        {alinhamentoSelecionado && (() => {
          const alinhamentoAtual = ALINHAMENTOS.find(a => a.id === alinhamentoSelecionado);
          if (!alinhamentoAtual) return null;

          return (
            <Card
              className="mt-4"
              style={{
                backgroundColor: `${alinhamentoAtual.cor}15`,
                borderColor: alinhamentoAtual.cor,
                borderWidth: '2px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                <Badge
                  style={{
                    backgroundColor: alinhamentoAtual.cor,
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    padding: '4px 8px'
                  }}
                >
                  {alinhamentoAtual.sigla}
                </Badge>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                    {alinhamentoAtual.nome}
                  </h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0', marginBottom: '12px' }}>
                    {alinhamentoAtual.descricao}
                  </p>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0,0,0,0.3)'
                    }}
                  >
                    <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#94a3b8' }}>
                      📖 Exemplo:
                    </p>
                    <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#cbd5e1' }}>
                      {alinhamentoAtual.exemplo}
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ ALERTA DE RESTRIÇÃO COM CSS INLINE (cores visíveis) */}
              {alinhamentoAtual.restricao && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(127, 29, 29, 0.3)',
                    border: '1px solid #dc2626',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '8px'
                  }}
                >
                  <AlertCircle
                    style={{
                      width: '20px',
                      height: '20px',
                      color: '#fca5a5',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  />
                  <p style={{
                    fontSize: '12px',
                    lineHeight: '1.6',
                    color: '#fecaca'
                  }}>
                    {alinhamentoAtual.restricao}
                  </p>
                </div>
              )}
            </Card>
          );
        })()}
      </Card>

      <div>
        <Label htmlFor="descricao" className="text-white">
          Descrição / Background
        </Label>
        <Textarea
          id="descricao"
          value={data.descricao || ''}
          onChange={(e) => updateData({ descricao: e.target.value })}
          placeholder="História do personagem, aparência, personalidade..."
          className="bg-slate-900 border-slate-700 text-white mt-2 min-h-[120px]"
        />
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
        <p className="text-sm" style={{ color: '#cbd5e1' }}>
          <strong className="text-white">💡 Dica:</strong> O nível determina quantos pontos de atributo você tem.
          Os pontos de prestígio definem seu Grau de Feiticeiro, limite de crédito e quantidade de itens que pode carregar.
        </p>
      </div>
      <br />
    </div>
  );
}
