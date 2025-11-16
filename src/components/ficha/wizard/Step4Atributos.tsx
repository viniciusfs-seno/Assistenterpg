// src/components/ficha/wizard/Step4Atributos.tsx - CORRIGIDO

import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Plus, Minus, AlertTriangle, Zap, Brain, Heart } from 'lucide-react';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { Attributes } from '../../../types/character';

interface Step4AtributosProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

const ATRIBUTOS_INFO = {
  agilidade: {
    nome: 'Agilidade',
    descricao: 'Coordenação motora, velocidade e destreza',
    icon: '🏃',
    corInicio: '#2563eb',
    corFim: '#1d4ed8',
  },
  forca: {
    nome: 'Força',
    descricao: 'Potência muscular e atletismo',
    icon: '💪',
    corInicio: '#dc2626',
    corFim: '#b91c1c',
  },
  intelecto: {
    nome: 'Intelecto',
    descricao: 'Raciocínio, memória e educação',
    icon: '🧠',
    corInicio: '#9333ea',
    corFim: '#7e22ce',
  },
  presenca: {
    nome: 'Presença',
    descricao: 'Sentidos, vontade e carisma',
    icon: '✨',
    corInicio: '#ca8a04',
    corFim: '#a16207',
  },
  vigor: {
    nome: 'Vigor',
    descricao: 'Saúde e resistência física',
    icon: '❤️',
    corInicio: '#16a34a',
    corFim: '#15803d',
  },
};

// CÁLCULO CORRETO: 4 pontos base + bônus nos níveis 4, 7, 10, 13, 16, 19
const calcularPontosDisponiveis = (nivel: number): number => {
  const niveisComBonus = [4, 7, 10, 13, 16, 19];
  const bonusNiveis = niveisComBonus.filter(n => nivel >= n).length;
  return 4 + bonusNiveis;
};

export function Step4Atributos({ data, updateData }: Step4AtributosProps) {
  const [pontosGastos, setPontosGastos] = useState(0);

  const pontosDisponiveis = calcularPontosDisponiveis(data.nivel);
  const pontosBase = 5; // Todos começam com 1 (5 atributos x 1 = 5)

  // LIMITE MÁXIMO: 3 antes do nível 4, 7 depois
  const limiteMaximo = data.nivel < 4 ? 3 : 7;

  useEffect(() => {
    const soma = Object.values(data.atributos).reduce((a, b) => a + b, 0);
    const gastosAlemBase = soma - pontosBase;
    setPontosGastos(gastosAlemBase);
  }, [data.atributos]);

  const pontosRestantes = pontosDisponiveis - pontosGastos;

  const handleIncrement = (attr: keyof Attributes) => {
    if (pontosRestantes > 0 && data.atributos[attr] < limiteMaximo) {
      updateData({
        atributos: {
          ...data.atributos,
          [attr]: data.atributos[attr] + 1,
        },
      });
    }
  };

  const handleDecrement = (attr: keyof Attributes) => {
    if (data.atributos[attr] > 0) {
      updateData({
        atributos: {
          ...data.atributos,
          [attr]: data.atributos[attr] - 1,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ALERTA SE NÍVEL < 4 */}
      {data.nivel < 4 && (
        <Card
          className="p-4"
          style={{
            backgroundColor: 'rgba(124, 45, 18, 0.2)',
            borderColor: '#f59e0b',
            borderWidth: '2px'
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: '#fbbf24' }}
            />
            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: '#fde68a' }}
              >
                ⚠️ Limite de Atributos (Nível {data.nivel})
              </p>
              <p
                className="text-xs"
                style={{ color: '#fef3c7' }}
              >
                Antes do nível 4, nenhum atributo pode passar de 3. A partir do nível 4, o limite aumenta para 7.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div
        className="rounded-lg p-6"
        style={{
          background: 'linear-gradient(to right, rgba(127, 29, 29, 0.2), rgba(194, 65, 12, 0.2))',
          border: '1px solid rgba(239, 68, 68, 0.5)'
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">Pontos de Atributo</h3>
            <p className="text-sm mt-1" style={{ color: '#cbd5e1' }}>
              Todos começam com 1. Distribua {pontosDisponiveis} pontos extras (0-{limiteMaximo} por atributo).
            </p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
              Nível {data.nivel}: Base 4 pontos + {calcularPontosDisponiveis(data.nivel) - 4} bônus (níveis 4, 7, 10, 13, 16, 19)
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold" style={{ color: '#ef4444' }}>{pontosRestantes}</div>
            <div className="text-sm" style={{ color: '#cbd5e1' }}>restantes</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(ATRIBUTOS_INFO) as Array<keyof Attributes>).map((attr) => {
          const info = ATRIBUTOS_INFO[attr];
          const valor = data.atributos[attr];
          const porcentagem = (valor / limiteMaximo) * 100;
          const isZerado = valor === 0;
          const noLimite = valor >= limiteMaximo;

          return (
            <Card
              key={attr}
              className="p-6"
              style={{
                backgroundColor: '#0f172a',
                borderColor: '#475569'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{info.icon}</span>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white">{info.nome}</h4>
                  <p className="text-sm" style={{ color: '#cbd5e1' }}>{info.descricao}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleDecrement(attr)}
                  disabled={valor <= 0}
                  className="w-12 h-12"
                  style={{
                    borderColor: '#475569'
                  }}
                >
                  <Minus className="w-5 h-5" />
                </Button>

                <div className="text-center">
                  <div
                    className="text-6xl font-bold"
                    style={{
                      color: isZerado ? '#ef4444' : noLimite ? '#22c55e' : '#ffffff'
                    }}
                  >
                    {valor}
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: isZerado ? '#fca5a5' : noLimite ? '#86efac' : '#94a3b8'
                    }}
                  >
                    {isZerado ? '⚠️ DESVANTAGEM' : noLimite ? '✓ MÁXIMO' : `máx. ${limiteMaximo}`}
                  </div>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleIncrement(attr)}
                  disabled={valor >= limiteMaximo || pontosRestantes <= 0}
                  className="w-12 h-12"
                  style={{
                    borderColor: '#475569'
                  }}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {isZerado && (
                <div
                  className="rounded-lg p-2 mb-3 flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(127, 29, 29, 0.3)',
                    border: '1px solid #b91c1c'
                  }}
                >
                  <AlertTriangle className="w-4 h-4" style={{ color: '#fca5a5' }} />
                  <p className="text-xs" style={{ color: '#fca5a5' }}>
                    Atributo 0: rola 2d20 e fica com o pior resultado
                  </p>
                </div>
              )}

              {/* ✅ CORRIGIDO: Gradiente com cores hexadecimais */}
              <div className="mt-4">
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${porcentagem}%`,
                      background: `linear-gradient(to right, ${info.corInicio}, ${info.corFim})`
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs" style={{ color: '#94a3b8' }}>
                  <span>Desv. (0)</span>
                  <span>Máximo ({limiteMaximo})</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* NOVO: Seletor de Atributo para EA */}
      <Card
        className="p-6"
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#8b5cf6',
          borderWidth: '2px'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6" style={{ color: '#a78bfa' }} />
          <div>
            <h3 className="text-xl font-semibold text-white">
              Atributo para Energia Amaldiçoada (EA)
            </h3>
            <p className="text-sm" style={{ color: '#cbd5e1' }}>
              Escolha permanente que afetará seus recursos mágicos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Intelecto */}
          <button
            onClick={() => updateData({ atributoEA: 'intelecto' })}
            className="p-5 rounded-lg border-2 transition-all text-left"
            style={{
              backgroundColor: data.atributoEA === 'intelecto' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.5)',
              borderColor: data.atributoEA === 'intelecto' ? '#3b82f6' : '#475569',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8" style={{ color: '#3b82f6' }} />
              <div>
                <div className="text-lg font-bold text-white">
                  Intelecto ({data.atributos.intelecto})
                </div>
                <div className="text-sm" style={{ color: '#94a3b8' }}>
                  Feiticeiros cerebrais
                </div>
              </div>
            </div>
            <p className="text-sm" style={{ color: '#cbd5e1' }}>
              Para personagens que usam conhecimento e raciocínio lógico para controlar energia amaldiçoada.
            </p>
          </button>

          {/* Presença */}
          <button
            onClick={() => updateData({ atributoEA: 'presenca' })}
            className="p-5 rounded-lg border-2 transition-all text-left"
            style={{
              backgroundColor: data.atributoEA === 'presenca' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.5)',
              borderColor: data.atributoEA === 'presenca' ? '#a855f7' : '#475569',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-8 h-8" style={{ color: '#a855f7' }} />
              <div>
                <div className="text-lg font-bold text-white">
                  Presença ({data.atributos.presenca})
                </div>
                <div className="text-sm" style={{ color: '#94a3b8' }}>
                  Feiticeiros intuitivos
                </div>
              </div>
            </div>
            <p className="text-sm" style={{ color: '#cbd5e1' }}>
              Para personagens que usam força de vontade e intuição para manipular energia amaldiçoada.
            </p>
          </button>
        </div>

        <div
          className="mt-4 p-3 rounded-lg flex items-start gap-2"
          style={{
            backgroundColor: 'rgba(124, 45, 18, 0.3)',
            border: '1px solid #92400e'
          }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#fbbf24' }} />
          <p className="text-sm" style={{ color: '#fde68a' }}>
            <strong>Importante:</strong> Esta escolha é permanente e não pode ser mudada depois!
            Escolha o atributo que melhor representa como seu personagem manipula energia amaldiçoada.
          </p>
        </div>
      </Card>

      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid #475569'
        }}
      >
        <p className="text-sm" style={{ color: '#cbd5e1' }}>
          <strong className="text-white">💡 Sistema de dados:</strong> Você rola Xd20 nos testes, onde X = valor do atributo.
          Se X=0, rola 2d20 e fica com o pior (desvantagem). Se X≥1, fica com o melhor resultado.
        </p>
      </div>
      <br></br>
    </div>
  );
}
