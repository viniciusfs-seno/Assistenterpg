// src/components/ficha/wizard/Step6Revisao.tsx - ATRIBUTOS HORIZONTAIS

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { User, Swords, MapPin, Crown, Sparkles, BookOpen, Shield } from 'lucide-react';
import { getClasseData } from '../../../data/classes';
import { ORIGENS } from '../../../data/origens';
import { CLAS } from '../../../data/clas';
import { TECNICAS_INATAS } from '../../../data/tecnicas-inatas';
import { getGrauData } from '../../../data/graus-feiticeiro';
import { calcularStats } from '../../../utils/statsCalculator';

interface Step6RevisaoProps {
  data: CharacterCreationData;
}

export function Step6Revisao({ data }: Step6RevisaoProps) {
  const classeData = getClasseData(data.classe);
  const origemData = ORIGENS.find(o => o.id === data.origemId);
  const claData = CLAS.find(c => c.id === data.cla);
  const tecnicaData = TECNICAS_INATAS.find(t => t.id === data.tecnicaInataId);
  const grauData = getGrauData(data.grauFeiticeiro);
  
  const stats = calcularStats(data.classe, data.nivel, data.atributos, data.grauFeiticeiro);

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
          <div>
            <p className="text-xs mb-1 font-semibold" style={{ color: '#94a3b8' }}>Grau</p>
            <p className="font-semibold text-white text-base">{grauData?.nome || data.grauFeiticeiro}</p>
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
              key={attr} 
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
            data.periciasTreinadas.map(pericia => (
              <Badge 
                key={pericia} 
                variant="outline"
                style={{
                  backgroundColor: '#1e3a8a',
                  color: '#93c5fd',
                  borderColor: '#1d4ed8'
                }}
              >
                {pericia}
              </Badge>
            ))
          ) : (
            <p className="text-sm" style={{ color: '#cbd5e1' }}>Nenhuma perícia selecionada</p>
          )}
        </div>
        <p className="text-xs mt-3 font-semibold" style={{ color: '#cbd5e1' }}>
          Total: {data.periciasTreinadas.length} perícia(s)
        </p>
      </Card>
    </div>
  );
}
