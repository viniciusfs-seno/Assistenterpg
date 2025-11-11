// src/components/ficha/wizard/Step4Atributos.tsx - CORRIGIDO COM CSS INLINE

import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Plus, Minus, AlertTriangle } from 'lucide-react';
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
    cor: 'from-blue-600 to-blue-700',
  },
  forca: {
    nome: 'Força',
    descricao: 'Potência muscular e atletismo',
    icon: '💪',
    cor: 'from-red-600 to-red-700',
  },
  intelecto: {
    nome: 'Intelecto',
    descricao: 'Raciocínio, memória e educação',
    icon: '🧠',
    cor: 'from-purple-600 to-purple-700',
  },
  presenca: {
    nome: 'Presença',
    descricao: 'Sentidos, vontade e carisma',
    icon: '✨',
    cor: 'from-yellow-600 to-yellow-700',
  },
  vigor: {
    nome: 'Vigor',
    descricao: 'Saúde e resistência física',
    icon: '❤️',
    cor: 'from-green-600 to-green-700',
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

  useEffect(() => {
    const soma = Object.values(data.atributos).reduce((a, b) => a + b, 0);
    const gastosAlemBase = soma - pontosBase;
    setPontosGastos(gastosAlemBase);
  }, [data.atributos]);

  const pontosRestantes = pontosDisponiveis - pontosGastos;

  const handleIncrement = (attr: keyof Attributes) => {
    if (pontosRestantes > 0 && data.atributos[attr] < 7) {
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
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/50 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">Pontos de Atributo</h3>
            <p className="text-sm mt-1" style={{ color: '#cbd5e1' }}>
              Todos começam com 1. Distribua {pontosDisponiveis} pontos extras (0-7 por atributo).
            </p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
              Nível {data.nivel}: Base 4 pontos + {calcularPontosDisponiveis(data.nivel) - 4} bônus (níveis 4, 7, 10, 13, 16, 19)
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-red-500">{pontosRestantes}</div>
            <div className="text-sm" style={{ color: '#cbd5e1' }}>restantes</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(ATRIBUTOS_INFO) as Array<keyof Attributes>).map((attr) => {
          const info = ATRIBUTOS_INFO[attr];
          const valor = data.atributos[attr];
          const porcentagem = (valor / 7) * 100;
          const isZerado = valor === 0;

          return (
            <Card key={attr} className="bg-slate-900 border-slate-700 p-6">
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
                  className="border-slate-700 w-12 h-12"
                >
                  <Minus className="w-5 h-5" />
                </Button>

                <div className="text-center">
                  <div className={`text-6xl font-bold ${isZerado ? 'text-red-500' : 'text-white'}`}>
                    {valor}
                  </div>
                  <div className="text-sm" style={{ color: isZerado ? '#fca5a5' : '#94a3b8' }}>
                    {isZerado ? '⚠️ DESVANTAGEM' : 'máx. 7'}
                  </div>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleIncrement(attr)}
                  disabled={valor >= 7 || pontosRestantes <= 0}
                  className="border-slate-700 w-12 h-12"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {isZerado && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-2 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <p className="text-xs text-red-300">
                    Atributo 0: rola 2d20 e fica com o pior resultado
                  </p>
                </div>
              )}

              <div className="mt-4">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${info.cor} transition-all duration-300`}
                    style={{ width: `${porcentagem}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs" style={{ color: '#94a3b8' }}>
                  <span>Desv. (0)</span>
                  <span>Máximo (7)</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
        <p className="text-sm" style={{ color: '#cbd5e1' }}>
          <strong className="text-white">💡 Sistema de dados:</strong> Você rola Xd20 nos testes, onde X = valor do atributo. 
          Se X=0, rola 2d20 e fica com o pior (desvantagem). Se X≥1, fica com o melhor resultado.
        </p>
      </div>
    </div>
  );
}
