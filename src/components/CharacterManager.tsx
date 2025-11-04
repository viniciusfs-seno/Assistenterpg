import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Users, Trash2, Heart, Zap } from 'lucide-react';
import { AddCombatantDialog } from './AddCombatantDialog';
import { apiRequest } from '../utils/api';
import type { Combatant } from './CombatTracker';

export function CharacterManager() {
  const { getAccessToken } = useAuth();
  const [characters, setCharacters] = useState<Combatant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCharacters = async () => {
    try {
      const token = await getAccessToken();
      const { characters: chars } = await apiRequest('/characters', {}, token!);
      setCharacters(chars || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar personagens');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const addCharacter = async (character: Omit<Combatant, 'id'>) => {
    try {
      const token = await getAccessToken();
      const { character: newChar } = await apiRequest('/characters', {
        method: 'POST',
        body: JSON.stringify(character),
      }, token!);
      setCharacters([...characters, newChar]);
    } catch (err: any) {
      setError(err.message || 'Falha ao criar personagem');
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const token = await getAccessToken();
      await apiRequest(`/characters/${id}`, {
        method: 'DELETE',
      }, token!);
      setCharacters(characters.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Falha ao deletar personagem');
    }
  };

  if (loading) {
    return (
      <Card className="p-12 bg-slate-800/50 border-slate-700">
        <div className="text-center text-slate-400">Carregando personagens...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Meus Personagens
          </h2>
          <AddCombatantDialog onAdd={addCharacter} />
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {characters.length === 0 ? (
        <Card className="p-12 bg-slate-800/30 border-slate-700 border-dashed">
          <div className="text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum personagem salvo</p>
            <p className="text-sm mt-2">Crie um personagem para começar</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {characters.map((character) => (
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
