// src/components/ficha/FichaPersonagemCompleta.tsx - CORRIGIDO (SEM LOOP INFINITO)

import { useState, useEffect } from 'react';
import { useCharacter } from '../../hooks/useCharacter';
import { useCharacterSkills } from '../../hooks/useCharacterSkills';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Sword, User, Shield } from 'lucide-react';

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
  } = useCharacter(characterId);
  
  const { skills, loading: loadingSkills } = useCharacterSkills(characterId);

  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  // Sincronizar dados quando o personagem carregar
  useEffect(() => {
    if (character) {
      setNome(character.nome);
      setDescricao(character.descricao ?? '');
    }
  }, [character]);

  // REMOVIDO: useEffect que causava loop infinito
  // O hook useCharacter já carrega automaticamente quando recebe characterId

  if (loading || loadingSkills) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Sword className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Carregando ficha completa...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-12 text-center">
          <p className="text-slate-400">Personagem não encontrado</p>
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
      // Não precisa recarregar manualmente - o hook faz isso automaticamente
    } catch (err) {
      alert('Erro ao salvar a ficha: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  }

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
          <h1 className="text-4xl font-bold text-white">{character.nome}</h1>
        )}
      </div>

      <Card className="bg-slate-800 border border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
          <User className="w-6 h-6 text-green-500" />
          Atributos
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(character.atributos).map(([attr, val]) => (
            <div key={attr} className="text-center bg-slate-700 rounded-md py-4">
              <div className="text-xs uppercase text-slate-400 mb-2">{attr.slice(0, 3)}</div>
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
        <div className="grid grid-cols-6 gap-4 text-center text-white">
          <div>
            <div className="text-xs text-slate-400">PV</div>
            <div className="text-lg font-semibold">{character.stats.pvAtual}/{character.stats.pvMax}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">PE</div>
            <div className="text-lg font-semibold">{character.stats.peAtual}/{character.stats.peMax}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">EA</div>
            <div className="text-lg font-semibold">{character.stats.eaAtual}/{character.stats.eaMax}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">SAN</div>
            <div className="text-lg font-semibold">{character.stats.sanAtual}/{character.stats.sanMax}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">DEF</div>
            <div className="text-lg font-semibold">{character.stats.defesa}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">DESL</div>
            <div className="text-lg font-semibold">{character.stats.deslocamento}m</div>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-800 border border-slate-700 p-4 grid grid-cols-2 gap-6">
        <section>
          <h3 className="text-lg text-white font-semibold mb-2">Classe</h3>
          <p className="text-slate-300 capitalize">{character.classe}</p>
        </section>
        <section>
          <h3 className="text-lg text-white font-semibold mb-2">Origem</h3>
          <p className="text-slate-300 capitalize">{character.origemId}</p>
        </section>
        <section>
          <h3 className="text-lg text-white font-semibold mb-2">Clã</h3>
          <p className="text-slate-300 capitalize">{character.cla}</p>
        </section>
        <section>
          <h3 className="text-lg text-white font-semibold mb-2">Técnica Inata</h3>
          <p className="text-slate-300 capitalize">{character.tecnicaInataId}</p>
        </section>
      </Card>

      <Card className="bg-slate-800 border border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white mb-3">Perícias</h2>
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
            <p className="text-slate-400 text-sm">Nenhuma perícia treinada</p>
          )}
        </div>
      </Card>

      <Card className="bg-slate-800 border border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white mb-3">Descrição</h2>
        {editing ? (
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-3 bg-slate-900 text-white rounded-md focus:outline-none"
            rows={5}
          />
        ) : (
          <p className="text-slate-300 whitespace-pre-wrap">{character.descricao || 'Nenhuma descrição.'}</p>
        )}
      </Card>

      <div className="flex gap-4 justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            setEditing(!editing);
            if (editing && character) {
              // Restaurar valores originais ao cancelar
              setNome(character.nome);
              setDescricao(character.descricao ?? '');
            }
          }}
        >
          {editing ? 'Cancelar Edição' : 'Editar'}
        </Button>
        {editing && (
          <Button onClick={salvarEdicoes} className="bg-red-600 hover:bg-red-700">
            Salvar
          </Button>
        )}
      </div>
    </div>
  );
}
