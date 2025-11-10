// src/components/ficha/CharacterList.tsx - CORRIGIDO

import { useState } from 'react';
import { useCharacterList, useCharacter } from '../../hooks/useCharacter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sword, Plus, User, TrendingUp, ArrowLeft, Trash } from 'lucide-react';
import { CompleteCharacterSheet } from './CompleteCharacterSheet';

interface CharacterListProps {
  onCreateNew: () => void;
  onViewCharacter: (characterId: string) => void;
  onBack: () => void;
}

export function CharacterList({
  onCreateNew,
  onViewCharacter,
  onBack,
}: CharacterListProps) {
  const { characters, loading, reloadCharacters } = useCharacterList();
  const { deleteCharacter } = useCharacter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (characterId: string) => {
    if (!confirm('Tem certeza que deseja excluir este personagem?')) return;

    setDeleting(characterId);
    try {
      await deleteCharacter(characterId);
      await reloadCharacters();
      if (expandedId === characterId) {
        setExpandedId(null);
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir personagem');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Sword className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Carregando personagens...</p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-slate-700 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h2 className="text-2xl font-bold text-white">Meus Personagens</h2>
          </div>
          <Button onClick={onCreateNew} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Personagem
          </Button>
        </div>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12">
            <div className="text-center">
              <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum personagem criado
              </h3>
              <p className="text-slate-400 mb-6">
                Crie seu primeiro feiticeiro Jujutsu para começar!
              </p>
              <Button
                onClick={onCreateNew}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Personagem
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-slate-600 border-slate-600 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-white">Meus Personagens</h2>
        </div>
        <Button onClick={onCreateNew} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Personagem
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((char) => (
          <Card
            key={char.id}
            className="bg-slate-800/50 border-slate-700 hover:border-red-500 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === char.id ? null : char.id)
                  }
                >
                  <CardTitle className="text-white">{char.nome}</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">
                    {char.classe.charAt(0).toUpperCase() + char.classe.slice(1)}
                    {char.trilha && ` - ${char.trilha}`}
                  </p>
                </div>
                <Badge variant="outline" className="border-red-500 text-red-500">
                  Nível {char.nivel}
                </Badge>
              </div>
            </CardHeader>

            {expandedId === char.id ? (
              <CardContent>
                <CompleteCharacterSheet
                  data={char}
                  onDelete={() => handleDelete(char.id)}
                  onEdit={() => onViewCharacter(char.id)}
                />
              </CardContent>
            ) : (
              <>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-slate-500">PV</p>
                        <p className="text-sm font-semibold text-white">
                          {char.stats.pvAtual}/{char.stats.pvMax}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">PE</p>
                        <p className="text-sm font-semibold text-white">
                          {char.stats.peAtual}/{char.stats.peMax}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">EA</p>
                        <p className="text-sm font-semibold text-white">
                          {char.stats.eaAtual}/{char.stats.eaMax}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">DEF</p>
                        <p className="text-sm font-semibold text-white">
                          {char.stats.defesa}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>Clã: {char.cla}</span>
                      <span>•</span>
                      <span>{char.grauFeiticeiro.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                </CardContent>

                <CardContent className="flex justify-end pt-0">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleDelete(char.id)}
                    disabled={deleting === char.id}
                  >
                    <Trash className="w-4 h-4" />
                    {deleting === char.id ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
