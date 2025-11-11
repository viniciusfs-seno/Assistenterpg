// src/components/ficha/QuickActionsPanel.tsx - NOVO COMPONENTE

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, Zap, Brain, Shield, Coffee, Moon, AlertCircle } from 'lucide-react';
import { CalculatedStats } from '../../utils/statsCalculator';

interface QuickActionsPanelProps {
  stats: CalculatedStats;
  onUpdateStats: (newStats: Partial<CalculatedStats>) => Promise<void>;
}

export function QuickActionsPanel({ stats, onUpdateStats }: QuickActionsPanelProps) {
  
  const handleCurarTudo = async () => {
    if (window.confirm('Restaurar todos os pontos ao máximo?')) {
      await onUpdateStats({
        pvAtual: stats.pvMax,
        peAtual: stats.peMax,
        eaAtual: stats.eaMax,
        sanAtual: stats.sanMax,
      });
    }
  };

  const handleDescansoRapido = async () => {
    // Recupera metade do PV e PE (arredonda para cima)
    const novoPV = Math.min(stats.pvMax, stats.pvAtual + Math.ceil(stats.pvMax / 2));
    const novoPE = Math.min(stats.peMax, stats.peAtual + Math.ceil(stats.peMax / 2));
    
    await onUpdateStats({
      pvAtual: novoPV,
      peAtual: novoPE,
    });
  };

  const handleDescansoCompleto = async () => {
    // Recupera tudo exceto SAN (que requer tratamento especial)
    await onUpdateStats({
      pvAtual: stats.pvMax,
      peAtual: stats.peMax,
      eaAtual: stats.eaMax,
    });
  };

  const handleRecuperarSAN = async () => {
    // Recupera 1d6 de SAN (simulando com valor médio de 3-4)
    const recuperacao = Math.floor(Math.random() * 4) + 3; // 3-6
    const novoSAN = Math.min(stats.sanMax, stats.sanAtual + recuperacao);
    
    await onUpdateStats({
      sanAtual: novoSAN,
    });
  };

  const statusPV = (stats.pvAtual / stats.pvMax) * 100;
  const statusPE = (stats.peAtual / stats.peMax) * 100;
  const statusEA = (stats.eaAtual / stats.eaMax) * 100;
  const statusSAN = (stats.sanAtual / stats.sanMax) * 100;

  const precisaDescanso = statusPV < 100 || statusPE < 100 || statusEA < 100;
  const emPerigo = statusPV < 50 || statusSAN < 50;

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Ações Rápidas</h3>
        {emPerigo && (
          <Badge className="bg-red-700 text-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Atenção!
          </Badge>
        )}
      </div>

      {/* Grid de botões de ação rápida */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Curar Tudo */}
        <Button
          variant="outline"
          onClick={handleCurarTudo}
          className="flex flex-col items-center gap-2 h-auto py-3 border-green-600 hover:bg-green-900/30"
          disabled={!precisaDescanso && statusSAN === 100}
        >
          <Heart className="w-5 h-5 text-green-500" />
          <div className="text-center">
            <p className="text-xs font-semibold text-white">Curar Tudo</p>
            <p className="text-xs text-slate-400">Restaurar máximo</p>
          </div>
        </Button>

        {/* Descanso Rápido */}
        <Button
          variant="outline"
          onClick={handleDescansoRapido}
          className="flex flex-col items-center gap-2 h-auto py-3 border-blue-600 hover:bg-blue-900/30"
          disabled={statusPV === 100 && statusPE === 100}
        >
          <Coffee className="w-5 h-5 text-blue-500" />
          <div className="text-center">
            <p className="text-xs font-semibold text-white">Desc. Rápido</p>
            <p className="text-xs text-slate-400">+50% PV/PE</p>
          </div>
        </Button>

        {/* Descanso Completo */}
        <Button
          variant="outline"
          onClick={handleDescansoCompleto}
          className="flex flex-col items-center gap-2 h-auto py-3 border-purple-600 hover:bg-purple-900/30"
          disabled={!precisaDescanso}
        >
          <Moon className="w-5 h-5 text-purple-500" />
          <div className="text-center">
            <p className="text-xs font-semibold text-white">Desc. Longo</p>
            <p className="text-xs text-slate-400">PV/PE/EA max</p>
          </div>
        </Button>

        {/* Recuperar SAN */}
        <Button
          variant="outline"
          onClick={handleRecuperarSAN}
          className="flex flex-col items-center gap-2 h-auto py-3 border-yellow-600 hover:bg-yellow-900/30"
          disabled={statusSAN === 100}
        >
          <Brain className="w-5 h-5 text-yellow-500" />
          <div className="text-center">
            <p className="text-xs font-semibold text-white">Recuperar SAN</p>
            <p className="text-xs text-slate-400">+1d6</p>
          </div>
        </Button>
      </div>

      {/* Status de alerta */}
      {emPerigo && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-300">
              {statusPV < 50 && <p>⚠️ PV baixo! Você está em perigo.</p>}
              {statusSAN < 50 && <p>⚠️ SAN baixo! Risco de colapso mental.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Dica de uso */}
      <div className="mt-3 p-2 bg-slate-700/50 rounded text-xs text-slate-400">
        💡 <span className="font-semibold">Dica:</span> Use descansos durante pausas na aventura para recuperar recursos.
      </div>
    </Card>
  );
}
