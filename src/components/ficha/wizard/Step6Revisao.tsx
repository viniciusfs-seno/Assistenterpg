// src/components/ficha/wizard/Step6Revisao.tsx - COMPLETO

import { useMemo } from 'react';
import { Card } from '../../ui/card';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { ORIGENS } from '../../../data/origens';
import { CLAS } from '../../../data/clas';
import { TECNICAS_INATAS } from '../../../data/tecnicas-inatas';
import { calcularStats, CLASS_STATS } from '../../../types/character';
import { User, Swords, Crown, Sparkles, TrendingUp, Heart, Zap, Brain, Shield } from 'lucide-react';

interface Step6RevisaoProps {
  data: CharacterCreationData;
}

const GRAUS_MAP: Record<string, string> = {
  grau_4: 'Grau 4',
  grau_3: 'Grau 3',
  grau_2: 'Grau 2',
  grau_semi_1: 'Grau Semi-1',
  grau_1: 'Grau 1',
  grau_especial: 'Grau Especial',
};

export function Step6Revisao({ data }: Step6RevisaoProps) {
  const origem = useMemo(() => ORIGENS.find(o => o.id === data.origemId), [data.origemId]);
  const cla = useMemo(() => CLAS.find(c => c.id === data.cla), [data.cla]);
  const tecnica = useMemo(() => TECNICAS_INATAS.find(t => t.id === data.tecnicaInataId), [data.tecnicaInataId]);

  const stats = useMemo(() => {
    return calcularStats(data.nivel, data.classe, data.atributos, [], []);
  }, [data.nivel, data.classe, data.atributos]);

  const classStats = CLASS_STATS[data.classe];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Revisão do Personagem</h3>
        <p className="text-slate-400">
          Confira todos os detalhes antes de criar seu feiticeiro Jujutsu.
        </p>
      </div>

      {/* Informações Básicas */}
      <Card className="bg-slate-900 border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-500" />
          <h4 className="font-semibold text-white">Informações Básicas</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500">Nome</p>
            <p className="text-white font-medium">{data.nome}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Nível</p>
            <p className="text-white font-medium">{data.nivel}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Grau</p>
            <p className="text-white font-medium">{GRAUS_MAP[data.grauFeiticeiro]}</p>
          </div>
          {data.idade && (
            <div>
              <p className="text-xs text-slate-500">Idade</p>
              <p className="text-white font-medium">{data.idade} anos</p>
            </div>
          )}
          {data.jogador && (
            <div>
              <p className="text-xs text-slate-500">Jogador</p>
              <p className="text-white font-medium">{data.jogador}</p>
            </div>
          )}
          {data.descricao && (
            <div className="col-span-2 md:col-span-3">
              <p className="text-xs text-slate-500">Descrição</p>
              <p className="text-sm text-slate-300">{data.descricao}</p>
            </div>
          )}
        </div>
      </Card>

            {/* Atributos - LINHA HORIZONTAL ÚNICA */}
      <Card className="bg-slate-900 border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h4 className="font-semibold text-white">Atributos</h4>
        </div>
        <div className="flex justify-center gap-4">
          {Object.entries(data.atributos).map(([attr, valor]) => (
            <div key={attr} className="text-center bg-slate-800 rounded-lg p-3 min-w-[70px]">
              <p className="text-xs text-slate-400 uppercase mb-1">{attr.slice(0, 3)}</p>
              <div className="text-2xl font-bold text-white">{valor}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Classe & Origem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Swords className="w-5 h-5 text-red-500" />
            <h4 className="font-semibold text-white">Classe</h4>
          </div>
          <p className="text-lg text-white font-medium capitalize mb-2">{data.classe}</p>
          <div className="text-xs text-slate-400 space-y-1">
            <p>PV Inicial: {classStats.pvInicial + data.atributos.vigor}</p>
            <p>PE Inicial: {classStats.peInicial + data.atributos.presenca}</p>
            <p>EA Inicial: {classStats.eaInicial + Math.max(data.atributos.intelecto, data.atributos.presenca)}</p>
            <p>SAN Inicial: {classStats.sanInicial}</p>
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-500" />
            <h4 className="font-semibold text-white">Origem</h4>
          </div>
          <p className="text-lg text-white font-medium mb-2">{origem?.nome}</p>
          <div className="flex flex-wrap gap-1">
            {origem?.periciasTreinadas.map(pericia => (
              <span
                key={pericia}
                className="inline-block px-2 py-0.5 rounded text-xs font-medium text-center border"
                style={{ backgroundColor: '#14532d', color: '#86efac', borderColor: '#15803d' }}
              >
                {pericia}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Clã & Técnica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h4 className="font-semibold text-white">Clã</h4>
          </div>
          <p className="text-lg text-white font-medium mb-2">{cla?.nome}</p>
          {cla?.grandesClas && (
            <span 
              className="inline-block px-2 py-1 rounded text-xs font-medium text-center border"
              style={{ backgroundColor: '#713f12', color: '#fde047', borderColor: '#a16207' }}
            >
            Grande Clã
            </span>
          )}
        </Card>

        <Card className="bg-slate-900 border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h4 className="font-semibold text-white">Técnica Inata</h4>
          </div>
          <p className="text-lg text-white font-medium mb-2">{tecnica?.nome}</p>
          {tecnica?.tipo === 'hereditaria' && (
            <span 
              className="inline-block px-2 py-1 rounded text-xs font-medium text-center border"
              style={{ backgroundColor: '#581c87', color: '#d8b4fe', borderColor: '#7e22ce' }}
            >
              Hereditária
            </span>
          )}
        </Card>
      </div>

      {/* Características Derivadas */}
      <Card className="bg-slate-900 border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-500" />
          <h4 className="font-semibold text-white">Características (Nível {data.nivel})</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-red-500" />
              <p className="text-xs text-slate-400">PV</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.pvMax}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-slate-400">PE</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.peMax}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <p className="text-xs text-slate-400">EA</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.eaMax}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-slate-400">SAN</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.sanMax}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400">Defesa</p>
            <p className="text-lg font-bold text-white">{stats.defesa}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400">Deslocamento</p>
            <p className="text-lg font-bold text-white">{stats.deslocamento}m</p>
          </div>
        </div>
      </Card>

      {/* Perícias - CORES FIXADAS INLINE */}
      <Card className="bg-slate-900 border-slate-700 p-4">
        <h4 className="font-semibold text-white mb-3">Perícias Treinadas ({data.periciasTreinadas.length})</h4>
        <div className="flex flex-wrap gap-2">
          {data.periciasTreinadas.map(pericia => (
            <span
              key={pericia}
              className="inline-block px-3 py-1 rounded-md text-sm font-medium text-center border"
              style={{ backgroundColor: '#1e3a8a', color: '#93c5fd', borderColor: '#1d4ed8' }}
            >
              {pericia}
            </span>
          ))}
        </div>
      </Card>

      {/* Aviso final */}
      <div className="bg-green-900 border border-green-700 rounded-lg p-4">
        <p className="text-sm text-green-300 text-center">
          ✓ Tudo pronto! Clique em "Criar Personagem" para finalizar.
        </p>
      </div>
    </div>
  );
}
