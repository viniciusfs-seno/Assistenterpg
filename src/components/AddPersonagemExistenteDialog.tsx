import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Users, Heart, Zap, Loader2, Sparkles, Brain } from 'lucide-react';
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
  const [selectedCharacter, setSelectedCharacter] = useState<Combatant | null>(null);
  const [initiativeInput, setInitiativeInput] = useState('');

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
    setSelectedCharacter(character);
    setInitiativeInput('10'); // Default initiative
  };

  const handleConfirm = () => {
    if (!selectedCharacter) return;
    
    // Create a copy without the ID so it gets a new ID when added
    const { id, userId, ...characterData } = selectedCharacter as any;
    onSelect({
      ...characterData,
      initiative: parseInt(initiativeInput) || 10,
    });
    setOpen(false);
    setSelectedCharacter(null);
    setInitiativeInput('');
  };

  const handleCancel = () => {
    setSelectedCharacter(null);
    setInitiativeInput('');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSelectedCharacter(null);
          setInitiativeInput('');
        }
      }}>
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
        </DialogContent>
      </Dialog>

      {/* Initiative Input Dialog */}
      <Dialog open={!!selectedCharacter} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Definir Iniciativa</DialogTitle>
            <DialogDescription className="text-slate-400">
              Informe o valor de iniciativa para {selectedCharacter?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="initiative">Iniciativa</Label>
              <Input
                id="initiative"
                type="number"
                value={initiativeInput}
                onChange={(e) => setInitiativeInput(e.target.value)}
                placeholder="10"
                className="bg-slate-700 border-slate-600 text-white"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirm();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Adicionar Personagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
