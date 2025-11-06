// GerenciadorPersonagem.tsx — Comentários em PT-BR sem alterar a lógica original

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Users, Trash2, Heart, Zap, Sparkles, Brain } from 'lucide-react';
import { AddCombatantDialog } from './AddPersonagemDialog';
import { DebugCharacters } from './DebugPersonagens';
import { apiRequest } from '../utils/api';
import type { Combatant } from './TrackerCombate';

export function GerenciadorPersonagem() {
  const { getAccessToken } = useAuth();
  const [characters, setCharacters] = useState<Combatant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca personagens do usuário autenticado no backend (Edge Function)
  const fetchCharacters = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }
      console.log('Fetching characters...');
      const response = await apiRequest('/characters', {}, token);
      console.log('Characters response:', response);
      const chars = response.characters;
      // Filtra itens inválidos (null/undefined) e exige campos essenciais
      const validChars = (chars || []).filter((c: any) => c && c.id && c.name);
      console.log('Valid characters:', validChars.length, validChars);
      setCharacters(validChars);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch characters error:', err);
      setError(err.message || 'Falha ao carregar personagens');
      setLoading(false);
    }
  };

  // Efeito: carrega lista após montar o componente
  useEffect(() => {
    console.log('CharacterManager mounted, fetching characters...');
    fetchCharacters();
  }, []);

  // Criação de personagem persistindo no backend e atualizando estado local
  const addCharacter = async (character: Omit<Combatant, 'id'>) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        return;
      }
      console.log('Creating character:', character);
      const response = await apiRequest('/characters', {
        method: 'POST',
        body: JSON.stringify(character),
      }, token);
      console.log('Create character response:', response);
      const newChar = response.character;
      console.log('New character:', newChar);
      setCharacters([...characters, newChar]);
    } catch (err: any) {
      console.error('Create character error:', err);
      setError(err.message || 'Falha ao criar personagem');
    }
  };

  // Exclusão de personagem no backend seguida de atualização local
  const deleteCharacter = async (id: string) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        return;
      }
      await apiRequest(`/characters/${id}`, {
        method: 'DELETE',
      }, token);
      setCharacters(characters.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Falha ao deletar personagem');
    }
  };

  // Placeholder de carregamento enquanto lista é obtida
  if (loading) {
    return (
      <Card className="p-12 bg-slate-800/50 border-slate-700">
        <div className="text-center text-slate-400">Carregando personagens...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ferramentas de debug opcionais */}
      <DebugCharacters />

      {/* Cabeçalho da seção com ação de atualizar e criar personagem */}
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Meus Personagens
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCharacters}
              disabled={loading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Atualizar
            </Button>
            <AddCombatantDialog onAdd={addCharacter} showInitiative={false} />
          </div>
        </div>
      </Card>

      {/* Exibição de erro se houver */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estado vazio com instrução de criação */}
      {characters.length === 0 ? (
        <Card className="p-12 bg-slate-800/30 border-slate-700 border-dashed">
          <div className="text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum personagem salvo</p>
            <p className="text-sm mt-2">Crie um personagem para começar</p>
          </div>
        </Card>
      ) : (
        // Grid de cards de personagens com estatísticas principais
        <div className="grid gap-4 md:grid-cols-2">
          {characters.filter(c => c && c.id).map((character) => (
            <Card
              key={character.id}
              className="p-4 bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white">{character.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={character.isPlayer ? 'default' : 'secondary'}
                        className={character.isPlayer ? 'bg-blue-600' : 'bg-red-600'}
                      >
                        {character.isPlayer ? 'Jogador' : 'NPC'}
                      </Badge>
                      <span className="text-sm text-slate-400">
                        Init: {character.initiative}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteCharacter(character.id)}
                    className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Vida: {character.maxHealth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Esforço: {character.maxStamina}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Energia: {character.maxCursedEnergy ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span>Sanidade: {character.maxSanity ?? 100}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
