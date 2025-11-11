// src/components/ficha/FichaPersonagemCompleta.tsx - CORRIGIDO COM CSS INLINE COMPLETO

import { useState, useEffect } from 'react';
import { useCharacter } from '../../hooks/useCharacter';
import { useCharacterSkills } from '../../hooks/useCharacterSkills';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Sword, User, Shield, Edit, Plus, Minus, BookOpen, Settings } from 'lucide-react';
import { EditAttributesModal } from './EditAttributesModal';
import { QuickActionsPanel } from './QuickActionsPanel';
import { SkillsManagementModal } from './SkillsManagementModal';
import { EditBackgroundModal } from './EditBackgroundModal';
import { Attributes, ClasseType, ClaType } from '../../types/character';
import { recalcularStatsPreservandoAtual, calcularStats } from '../../utils/statsCalculator';
import { CLAS } from '../../data/clas';
import { ORIGENS } from '../../data/origens';
import { TECNICAS_INATAS } from '../../data/tecnicas-inatas';
import { getGrauData } from '../../data/graus-feiticeiro';
import { getClasseData } from '../../data/classes';

interface FichaPersonagemCompletaProps {
  characterId: string;
  onBack: () => void;
}

export function FichaPersonagemCompleta({
  characterId,
  onBack,
}: FichaPersonagemCompletaProps) {
  const {
    character,
    loading,
    updateCharacter,
    refreshCharacter,
  } = useCharacter(characterId);
  
  const { skills, loading: loadingSkills, refreshSkills } = useCharacterSkills(characterId);

  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const [editAtributosOpen, setEditAtributosOpen] = useState(false);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);

  const [statsAtuais, setStatsAtuais] = useState(character?.stats);

  useEffect(() => {
    if (character) {
      setNome(character.nome);
      setDescricao(character.descricao ?? '');
      setStatsAtuais(character.stats);
    }
  }, [character]);

  if (loading || loadingSkills) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Sword className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p style={{ color: '#cbd5e1' }}>⏳ Carregando ficha completa...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-12 text-center">
          <p style={{ color: '#cbd5e1' }}>❌ Personagem não encontrado</p>
          <Button onClick={onBack} className="mt-4">
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }

  async function salvarEdicoes() {
    try {
      await updateCharacter({
        nome,
        descricao,
      });
      setEditing(false);
    } catch (err) {
      alert('Erro ao salvar a ficha: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  }

  async function handleSaveAtributos(newAttributes: Attributes) {
    try {
      const novosStats = recalcularStatsPreservandoAtual(
        character.classe,
        character.nivel,
        newAttributes,
        character.grauFeiticeiro,
        character.stats
      );

      await updateCharacter({
        atributos: newAttributes,
        stats: novosStats,
      });

      setStatsAtuais(novosStats);
    } catch (error) {
      console.error('Erro ao salvar atributos:', error);
      throw error;
    }
  }

  async function handleSaveBackground(updates: {
    classe?: ClasseType;
    origemId?: string;
    cla?: ClaType;
    tecnicaInataId?: string;
  }) {
    try {
      if (updates.classe) {
        const novosStats = calcularStats(
          updates.classe,
          character.nivel,
          character.atributos,
          character.grauFeiticeiro
        );
        
        await updateCharacter({
          ...updates,
          stats: novosStats,
        });
        
        setStatsAtuais(novosStats);
      } else {
        await updateCharacter(updates);
      }

      if (updates.classe || updates.origemId) {
        refreshSkills();
      }
    } catch (error) {
      console.error('Erro ao salvar background:', error);
      throw error;
    }
  }

  const adjustStat = async (stat: 'pvAtual' | 'peAtual' | 'eaAtual' | 'sanAtual', delta: number) => {
    if (!statsAtuais) return;

    const maxKey = stat.replace('Atual', 'Max') as 'pvMax' | 'peMax' | 'eaMax' | 'sanMax';
    const novoValor = Math.max(0, Math.min(statsAtuais[maxKey], statsAtuais[stat] + delta));

    const novosStats = { ...statsAtuais, [stat]: novoValor };
    setStatsAtuais(novosStats);

    try {
      await updateCharacter({ stats: novosStats });
    } catch (error) {
      console.error('Erro ao ajustar stat:', error);
      setStatsAtuais(statsAtuais);
    }
  };

  const handleSkillsUpdate = () => {
    refreshSkills();
    refreshCharacter();
  };

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto bg-slate-900 border border-slate-700 rounded-lg">

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-slate-700 text-white hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        {editing ? (
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="text-4xl font-bold p-1 rounded w-full max-w-xl bg-slate-800 text-white focus:outline-none"
          />
        ) : (
          <h1 className="text-4xl font-bold text-white">✨ {character.nome}</h1>
        )}
      </div>

      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Nível</p>
            <p className="text-lg font-semibold text-white">{character.nivel}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Grau</p>
            <p className="text-lg font-semibold text-white">
              {getGrauData(character.grauFeiticeiro)?.nome || character.grauFeiticeiro}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Jogador</p>
            <p className="text-lg font-semibold text-white">{character.jogador || 'N/A'}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800 border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-green-500" />
            Atributos
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditAtributosOpen(true)}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(character.atributos).map(([attr, val]) => (
            <div key={attr} className="text-center bg-slate-700 rounded-md py-4">
              <div className="text-xs uppercase mb-2" style={{ color: '#94a3b8' }}>
                {attr.slice(0, 3)}
              </div>
              <div className="text-2xl text-white font-bold">{val}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-slate-800 border border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-blue-500" />
          Estatísticas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsAtuais && [
            { label: 'PV', atual: 'pvAtual', max: 'pvMax' },
            { label: 'PE', atual: 'peAtual', max: 'peMax' },
            { label: 'EA', atual: 'eaAtual', max: 'eaMax' },
            { label: 'SAN', atual: 'sanAtual', max: 'sanMax' },
          ].map((stat) => {
            const atualKey = stat.atual as 'pvAtual' | 'peAtual' | 'eaAtual' | 'sanAtual';
            const maxKey = stat.max as 'pvMax' | 'peMax' | 'eaMax' | 'sanMax';
            const valorAtual = statsAtuais[atualKey];
            const valorMax = statsAtuais[maxKey];
            const porcentagem = (valorAtual / valorMax) * 100;

            return (
              <div key={stat.label} className="bg-slate-700 rounded-md p-3">
                <div className="text-xs mb-2" style={{ color: '#94a3b8' }}>{stat.label}</div>
                <div className="flex items-center justify-between mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustStat(atualKey, -1)}
                    className="h-6 w-6 p-0 hover:bg-slate-600"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-lg font-semibold text-white">
                    {valorAtual}/{valorMax}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustStat(atualKey, 1)}
                    className="h-6 w-6 p-0 hover:bg-slate-600"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      porcentagem > 66 ? 'bg-green-500' :
                      porcentagem > 33 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${porcentagem}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 text-center text-white">
          <div className="bg-slate-700 rounded-md p-3">
            <div className="text-xs" style={{ color: '#94a3b8' }}>Defesa</div>
            <div className="text-lg font-semibold">{character.stats.defesa}</div>
          </div>
          <div className="bg-slate-700 rounded-md p-3">
            <div className="text-xs" style={{ color: '#94a3b8' }}>Deslocamento</div>
            <div className="text-lg font-semibold">{character.stats.deslocamento}m</div>
          </div>
        </div>
      </Card>

      <QuickActionsPanel
        stats={statsAtuais || character.stats}
        onUpdateStats={async (updates) => {
          if (!statsAtuais) return;
          const novosStats = { ...statsAtuais, ...updates };
          setStatsAtuais(novosStats);
          try {
            await updateCharacter({ stats: novosStats });
          } catch (error) {
            console.error('Erro ao atualizar stats:', error);
            setStatsAtuais(statsAtuais);
          }
        }}
      />

      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">🎭 Background</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBackgroundModalOpen(true)}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <section>
            <h3 className="text-sm mb-1" style={{ color: '#94a3b8' }}>Classe</h3>
            <p className="text-lg text-white font-semibold">
              {getClasseData(character.classe)?.nome || character.classe}
            </p>
          </section>
          <section>
            <h3 className="text-sm mb-1" style={{ color: '#94a3b8' }}>Origem</h3>
            <p className="text-lg text-white font-semibold">
              {ORIGENS.find(o => o.id === character.origemId)?.nome || character.origemId}
            </p>
          </section>
          <section>
            <h3 className="text-sm mb-1" style={{ color: '#94a3b8' }}>Clã</h3>
            <p className="text-lg text-white font-semibold">
              {CLAS.find(c => c.id === character.cla)?.nome || character.cla}
            </p>
          </section>
          <section>
            <h3 className="text-sm mb-1" style={{ color: '#94a3b8' }}>Técnica Inata</h3>
            <p className="text-lg text-white font-semibold">
              {TECNICAS_INATAS.find(t => t.id === character.tecnicaInataId)?.nome || 'Nenhuma'}
            </p>
          </section>
        </div>
      </Card>

      <Card className="bg-slate-800 border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-white">📚 Perícias</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSkillsModalOpen(true)}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Gerenciar Todas
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map(skill => (
              <div
                key={skill.skillName}
                className="bg-blue-900 text-blue-300 border border-blue-700 rounded-md px-3 py-1 text-sm"
                title={`Treinamento: ${skill.grauTreinamento}`}
              >
                {skill.skillName}
                {skill.outros !== 0 && ` (+${skill.outros})`}
              </div>
            ))
          ) : (
            <p className="text-sm" style={{ color: '#94a3b8' }}>Nenhuma perícia treinada</p>
          )}
        </div>
      </Card>

      <Card className="bg-slate-800 border border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white mb-3">📖 Descrição</h2>
        {editing ? (
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-3 bg-slate-900 text-white rounded-md focus:outline-none"
            rows={5}
          />
        ) : (
          <p className="whitespace-pre-wrap" style={{ color: '#e2e8f0' }}>
            {character.descricao || 'Nenhuma descrição.'}
          </p>
        )}
      </Card>

      <div className="flex gap-4 justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            setEditing(!editing);
            if (editing && character) {
              setNome(character.nome);
              setDescricao(character.descricao ?? '');
            }
          }}
        >
          {editing ? 'Cancelar Edição' : '✏️ Editar Descrição'}
        </Button>
        {editing && (
          <Button onClick={salvarEdicoes} className="bg-red-600 hover:bg-red-700">
            ✓ Salvar
          </Button>
        )}
      </div>

      <EditAttributesModal
        isOpen={editAtributosOpen}
        onClose={() => setEditAtributosOpen(false)}
        character={character}
        onSave={handleSaveAtributos}
      />

      <SkillsManagementModal
        isOpen={skillsModalOpen}
        onClose={() => setSkillsModalOpen(false)}
        characterId={characterId}
        atributos={character.atributos}
        onUpdate={handleSkillsUpdate}
      />

      <EditBackgroundModal
        isOpen={backgroundModalOpen}
        onClose={() => setBackgroundModalOpen(false)}
        character={character}
        onSave={handleSaveBackground}
      />
    </div>
  );
}
