// src/components/ficha/wizard/Step8Tecnicas.tsx - CORRIGIDO

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Plus, Minus, Info, Gift } from 'lucide-react';
import { CategoriaTecnica } from '../../../types/character';
import { 
  calcularBonusTecnicas, 
  podeAdicionarPontos, 
  getNomeTecnica,
  BonusTecnica 
} from '../../../utils/tecnicaValidator';

interface Step8TecnicasProps {
  nivel: number;
  estudouEscolaTecnica: boolean;
  trilha?: string;
  subcaminho?: string;
  cla?: string;
  tecnicasAtuais: { [categoria in CategoriaTecnica]: number };
  onUpdate: (tecnicas: { [categoria in CategoriaTecnica]: number }) => void;
}

export function Step8Tecnicas({ 
  nivel, 
  estudouEscolaTecnica,
  trilha, 
  subcaminho,
  cla,
  tecnicasAtuais, 
  onUpdate 
}: Step8TecnicasProps) {
  const [pontosGastos, setPontosGastos] = useState(0);
  const [bonusAplicados, setBonusAplicados] = useState<BonusTecnica[]>([]);

  // Calcular pontos disponíveis
  const calcularPontosDisponiveis = (nivel: number): number => {
    const niveisComPonto = [2, 8, 14, 18];
    return niveisComPonto.filter(n => nivel >= n).length;
  };

  const pontosDisponiveis = calcularPontosDisponiveis(nivel);

  // ✅ Calcular e aplicar bônus automáticos (APENAS NO MOUNT)
  useEffect(() => {
    const bonus = calcularBonusTecnicas(
      nivel,
      estudouEscolaTecnica,
      trilha as any,
      subcaminho,
      cla as any
    );
    
    setBonusAplicados(bonus);

    // ✅ CORREÇÃO: Aplicar bônus APENAS se as técnicas estiverem zeradas
    const tecnicasVazias = Object.values(tecnicasAtuais).every(v => v === 0);
    
    if (tecnicasVazias) {
      const tecnicasComBonus = { ...tecnicasAtuais };
      bonus.forEach(b => {
        tecnicasComBonus[b.categoria] = (tecnicasComBonus[b.categoria] || 0) + b.graus;
      });
      onUpdate(tecnicasComBonus);
    }
  }, [nivel, estudouEscolaTecnica, trilha, subcaminho, cla]);

  // ✅ CORREÇÃO: Recalcular pontos gastos SEM CONTAR BÔNUS
  useEffect(() => {
    const totalGasto = Object.entries(tecnicasAtuais).reduce((acc, [categoria, grau]) => {
      const bonusNaCategoria = bonusAplicados
        .filter(b => b.categoria === categoria as CategoriaTecnica)
        .reduce((sum, b) => sum + b.graus, 0);
      
      const pontosGastosNaCategoria = Math.max(0, grau - bonusNaCategoria);
      return acc + pontosGastosNaCategoria;
    }, 0);
    
    setPontosGastos(totalGasto);
  }, [tecnicasAtuais, bonusAplicados]);

  const handleIncrement = (categoria: CategoriaTecnica) => {
    const { pode, motivo } = podeAdicionarPontos(categoria, tecnicasAtuais[categoria], tecnicasAtuais, cla as any);
    
    if (!pode) {
      alert(motivo);
      return;
    }

    if (pontosGastos < pontosDisponiveis) {
      onUpdate({
        ...tecnicasAtuais,
        [categoria]: (tecnicasAtuais[categoria] || 0) + 1
      });
    }
  };

  const handleDecrement = (categoria: CategoriaTecnica) => {
    const grauAtual = tecnicasAtuais[categoria] || 0;
    const bonusNaCategoria = bonusAplicados
      .filter(b => b.categoria === categoria)
      .reduce((acc, b) => acc + b.graus, 0);

    // Não pode diminuir abaixo do bônus
    if (grauAtual > bonusNaCategoria) {
      onUpdate({
        ...tecnicasAtuais,
        [categoria]: grauAtual - 1
      });
    }
  };

  const getGrauManual = (categoria: CategoriaTecnica): number => {
    const total = tecnicasAtuais[categoria] || 0;
    const bonus = bonusAplicados
      .filter(b => b.categoria === categoria)
      .reduce((acc, b) => acc + b.graus, 0);
    return total - bonus;
  };

  const getBonusCategoria = (categoria: CategoriaTecnica): number => {
    return bonusAplicados
      .filter(b => b.categoria === categoria)
      .reduce((acc, b) => acc + b.graus, 0);
  };

  const tecnicas: CategoriaTecnica[] = [
    CategoriaTecnica.TECNICA_AMALDICOADA,
    CategoriaTecnica.BARREIRA,
    CategoriaTecnica.REVERSA,
    CategoriaTecnica.ANTI_BARREIRA,
    CategoriaTecnica.SHIKIGAMI,
    CategoriaTecnica.TECNICAS_SECRETAS
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">
          📚 Técnicas Básicas - Graus de Aprimoramento
        </h3>
        <p style={{ color: '#cbd5e1' }}>
          Distribua seus pontos de aprimoramento nas técnicas básicas.
        </p>
      </div>

      {/* Pontos Disponíveis */}
      <Card className="p-4 bg-slate-800 border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#cbd5e1' }}>
              Pontos Disponíveis
            </p>
            <p className="text-3xl font-bold text-white">
              {pontosDisponiveis - pontosGastos} / {pontosDisponiveis}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#94a3b8' }}>Nível {nivel}</p>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              Bônus: {bonusAplicados.reduce((acc, b) => acc + b.graus, 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* ✅ BÔNUS AUTOMÁTICOS COM CSS INLINE */}
      {bonusAplicados.length > 0 && (
        <Card 
          className="p-4"
          style={{
            backgroundColor: 'rgba(6, 78, 59, 0.3)',
            borderColor: '#16a34a',
            borderWidth: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <Gift 
              style={{ 
                width: '20px', 
                height: '20px', 
                color: '#4ade80',
                flexShrink: 0,
                marginTop: '2px'
              }} 
            />
            <div style={{ flex: 1 }}>
              <h4 
                style={{ 
                  fontWeight: 600, 
                  color: '#ffffff', 
                  marginBottom: '8px',
                  fontSize: '15px'
                }}
              >
                🎁 Bônus Automáticos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {bonusAplicados.map((b, idx) => (
                  <p 
                    key={idx} 
                    style={{ 
                      fontSize: '13px', 
                      color: '#86efac',
                      lineHeight: '1.5'
                    }}
                  >
                    • <strong style={{ color: '#ffffff' }}>+{b.graus}</strong> em {getNomeTecnica(b.categoria)} ({b.motivo})
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de Técnicas */}
      <div className="space-y-3">
        {tecnicas.map((categoria) => {
          const grauTotal = tecnicasAtuais[categoria] || 0;
          const grauManual = getGrauManual(categoria);
          const bonus = getBonusCategoria(categoria);
          const { pode, motivo } = podeAdicionarPontos(categoria, grauTotal, tecnicasAtuais, cla as any);

          return (
            <Card
              key={categoria}
              className="p-4"
              style={{
                backgroundColor: '#1e293b',
                borderColor: pode ? '#475569' : '#64748b',
                opacity: pode ? 1 : 0.7
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">
                      {getNomeTecnica(categoria)}
                    </h4>
                    {!pode && (
                      <Badge variant="outline" style={{ backgroundColor: '#dc2626', color: '#fff' }}>
                        🔒 Bloqueado
                      </Badge>
                    )}
                    {bonus > 0 && (
                      <Badge variant="outline" style={{ backgroundColor: '#10b981', color: '#fff' }}>
                        +{bonus} Bônus
                      </Badge>
                    )}
                  </div>
                  {!pode && (
                    <p className="text-xs mt-1" style={{ color: '#f87171' }}>
                      {motivo}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#94a3b8' }}>Grau</p>
                    <p className="text-2xl font-bold text-white">
                      {grauTotal}
                      {bonus > 0 && (
                        <span className="text-sm text-green-400 ml-1">
                          ({grauManual}+{bonus})
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      onClick={() => handleIncrement(categoria)}
                      disabled={!pode || pontosGastos >= pontosDisponiveis}
                      className="h-8 w-8 p-0"
                      style={{
                        backgroundColor: pode && pontosGastos < pontosDisponiveis ? '#10b981' : '#64748b'
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDecrement(categoria)}
                      disabled={grauManual === 0}
                      className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ✅ AVISO COM CSS INLINE */}
      <Card 
        className="p-4"
        style={{
          backgroundColor: 'rgba(30, 58, 138, 0.3)',
          borderColor: '#3b82f6',
          borderWidth: '2px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
          <Info 
            style={{ 
              width: '20px', 
              height: '20px', 
              color: '#60a5fa',
              flexShrink: 0,
              marginTop: '2px'
            }} 
          />
          <div>
            <p style={{ fontSize: '13px', color: '#bfdbfe', lineHeight: '1.6' }}>
              Você ganha novos pontos de aprimoramento nos níveis <strong style={{ color: '#ffffff' }}>2, 8, 14 e 18</strong>.
              Bônus automáticos não consomem pontos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
