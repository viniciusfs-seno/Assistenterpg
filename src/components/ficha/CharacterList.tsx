// src/components/ficha/CharacterList.tsx - CORRIGIDO COM CSS INLINE

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { supabase } from '../../utils/supabase/client';
import { Character } from '../../types/character';
import { Sword, Plus, Search, Trash2, Eye } from 'lucide-react';
import { CLAS } from '../../data/clas';
import { getClasseData } from '../../data/classes';
import { getGrauData } from '../../data/graus-feiticeiro';

interface CharacterListProps {
  onSelectCharacter: (characterId: string) => void;
  onCreateNew: () => void;
}

export function CharacterList({ onSelectCharacter, onCreateNew }: CharacterListProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  async function loadCharacters() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCharacters(data || []);
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(characterId: string) {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.'
    );

    if (!confirmed) return;

    setDeletingId(characterId);
    try {
      const { error: skillsError } = await supabase
        .from('character_skills')
        .delete()
        .eq('character_id', characterId);

      if (skillsError) throw skillsError;

      const { error: charError } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId);

      if (charError) throw charError;

      setCharacters(prev => prev.filter(c => c.id !== characterId));
    } catch (error) {
      console.error('Erro ao deletar personagem:', error);
      alert('Erro ao deletar personagem. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  }

  const filteredCharacters = characters.filter(char =>
    char.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Sword className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p style={{ color: '#cbd5e1' }}>⏳ Carregando personagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">
              📋 Meus Personagens
            </CardTitle>
            <Button
              onClick={onCreateNew}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar personagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12">
              <Sword className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="mb-4" style={{ color: '#cbd5e1' }}>
                {searchTerm
                  ? '🔍 Nenhum personagem encontrado.'
                  : '📭 Você ainda não possui personagens.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={onCreateNew}
                  variant="outline"
                  className="bg-slate-600 border-slate-600 text-white hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Personagem
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCharacters.map((char) => {
                const classeData = getClasseData(char.classe);
                const claData = CLAS.find(c => c.id === char.cla);
                const grauData = getGrauData(char.grauFeiticeiro);

                // Validação de segurança para stats (caso ainda não tenha sido migrado)
                const stats = char.stats || {
                  pvAtual: 0, pvMax: 0,
                  peAtual: 0, peMax: 0,
                  eaAtual: 0, eaMax: 0,
                  sanAtual: 0, sanMax: 0,
                };

                return (
                  <Card
                    key={char.id}
                    className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all cursor-pointer group"
                    onClick={() => onSelectCharacter(char.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                            {char.nome}
                          </h3>
                          <p className="text-sm" style={{ color: '#cbd5e1' }}>
                            Nível {char.nivel} • {grauData?.nome || char.grauFeiticeiro}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs bg-red-900 text-red-300 border-red-700">
                          {classeData?.nome || char.classe}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-900 text-blue-300 border-blue-700">
                          {claData?.nome || char.cla}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center bg-slate-700 rounded p-2">
                          <p className="text-xs" style={{ color: '#94a3b8' }}>PV</p>
                          <p className="text-sm font-bold text-white">
                            {stats.pvAtual}/{stats.pvMax}
                          </p>
                        </div>
                        <div className="text-center bg-slate-700 rounded p-2">
                          <p className="text-xs" style={{ color: '#94a3b8' }}>PE</p>
                          <p className="text-sm font-bold text-white">
                            {stats.peAtual}/{stats.peMax}
                          </p>
                        </div>
                        <div className="text-center bg-slate-700 rounded p-2">
                          <p className="text-xs" style={{ color: '#94a3b8' }}>EA</p>
                          <p className="text-sm font-bold text-white">
                            {stats.eaAtual}/{stats.eaMax}
                          </p>
                        </div>
                        <div className="text-center bg-slate-700 rounded p-2">
                          <p className="text-xs" style={{ color: '#94a3b8' }}>SAN</p>
                          <p className="text-sm font-bold text-white">
                            {stats.sanAtual}/{stats.sanMax}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCharacter(char.id);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Ficha
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(char.id);
                          }}
                          disabled={deletingId === char.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
