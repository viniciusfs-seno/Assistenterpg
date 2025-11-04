import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Users, Heart, Zap, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../utils/api';
import type { Combatant } from './TrackerCombate';

interface SelectExistingCharacterDialogProps {
  onSelect: (character: Omit<Combatant, 'id'>) => void;
  triggerButton?: React.ReactNode;
}

export function SelectExistingCharacterDialog({ onSelect, triggerButton }: SelectExistingCharacterDialogProps) {
  const { getAccessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<Combatant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCharacters = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }
      const { characters: chars } = await apiRequest('/characters', {}, token);
      // Filter out null/undefined values and ensure valid character structure
      const validChars = (chars || []).filter((c: any) => c && c.id && c.name);
      setCharacters(validChars);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar personagens');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCharacters();
    }
  }, [open]);

  const handleSelectCharacter = (character: Combatant) => {
    // Create a copy without the ID so it gets a new ID when added
    const { id, userId, ...characterData } = character as any;
    onSelect(characterData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Users className="w-4 h-4 mr-2" />
            Personagem Existente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Personagem Salvo</DialogTitle>
          <DialogDescription className="text-slate-400">
            Escolha um dos seus personagens salvos para adicionar
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-500" />
            <p className="text-slate-400">Nenhum personagem salvo</p>
            <p className="text-sm text-slate-500 mt-2">
              Crie personagens na seção "Gerenciar Personagens"
            </p>
          </div>
        ) : (
          <div className="grid gap-3 py-4">
            {characters.map((character) => (
              <Card
                key={character.id}
                className="p-4 bg-slate-700/50 border-slate-600 hover:border-purple-500 transition-colors cursor-pointer"
                onClick={() => handleSelectCharacter(character)}
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
      </DialogContent>
    </Dialog>
  );
}
