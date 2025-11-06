// AddPersonagemDialog.tsx — Comentários em PT-BR sem alterar a lógica original

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { UserPlus } from 'lucide-react';
import { Combatant } from './TrackerCombate';

interface AddCombatantDialogProps {
  onAdd: (combatant: Omit<Combatant, 'id'>) => void;
  showInitiative?: boolean;
  showSaveToggle?: boolean;
  onSaveCharacter?: (combatant: Omit<Combatant, 'id'>) => void;
}

export function AddCombatantDialog({ onAdd, showInitiative = true, showSaveToggle = false, onSaveCharacter }: AddCombatantDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('10');
  const [maxHealth, setMaxHealth] = useState('20');
  const [maxStamina, setMaxStamina] = useState('20');
  const [maxCursedEnergy, setMaxCursedEnergy] = useState('20');
  const [maxSanity, setMaxSanity] = useState('20');
  const [isPlayer, setIsPlayer] = useState(true);
  const [saveCharacter, setSaveCharacter] = useState(false);

  // Envia dados validados ao callback e reseta o diálogo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const initiativeNum = parseInt(initiative) || 10;
    const healthNum = Math.min(parseInt(maxHealth) || 20, 2000);
    const staminaNum = Math.min(parseInt(maxStamina) || 20, 2000);
    const cursedEnergyNum = Math.min(parseInt(maxCursedEnergy) || 20, 2000);
    const sanityNum = Math.min(parseInt(maxSanity) || 20, 2000);

    const characterData = {
      name: name.trim() || 'Unnamed',
      initiative: initiativeNum,
      health: healthNum,
      maxHealth: healthNum,
      stamina: staminaNum,
      maxStamina: staminaNum,
      cursedEnergy: cursedEnergyNum,
      maxCursedEnergy: cursedEnergyNum,
      sanity: sanityNum,
      maxSanity: sanityNum,
      isPlayer,
    };

    onAdd(characterData);

    // If save toggle is enabled and checked, also save to character list
    if (showSaveToggle && saveCharacter && onSaveCharacter) {
      onSaveCharacter(characterData);
    }

    // Reseta o formulário e fecha o diálogo
    setName('');
    setInitiative('10');
    setMaxHealth('50');
    setMaxStamina('20');
    setMaxCursedEnergy('0');
    setMaxSanity('100');
    setIsPlayer(true);
    setSaveCharacter(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Personagem
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Criar Novo Personagem</DialogTitle>
          <DialogDescription className="text-slate-400">
            Crie um novo personagem do zero
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Campo: Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Informe o nome do personagem"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Campo: Iniciativa */}
            {showInitiative && (
              <div className="space-y-2">
                <Label htmlFor="initiative">Iniciativa</Label>
                <Input
                  id="initiative"
                  type="number"
                  value={initiative}
                  onChange={(e) => setInitiative(e.target.value)}
                  placeholder="10"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            )}

            {/* Campos: Vida / Esforço / Energia / Sanidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="health">Vida máxima</Label>
                <Input
                  id="health"
                  type="number"
                  min="1"
                  max="2000"
                  value={maxHealth}
                  onChange={(e) => setMaxHealth(e.target.value)}
                  placeholder="50"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stamina">Pontos de Esforço</Label>
                <Input
                  id="stamina"
                  type="number"
                  min="0"
                  max="2000"
                  value={maxStamina}
                  onChange={(e) => setMaxStamina(e.target.value)}
                  placeholder="20"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cursedEnergy">Energia Amaldiçoada</Label>
                <Input
                  id="cursedEnergy"
                  type="number"
                  min="0"
                  max="2000"
                  value={maxCursedEnergy}
                  onChange={(e) => setMaxCursedEnergy(e.target.value)}
                  placeholder="0"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sanity">Sanidade</Label>
                <Input
                  id="sanity"
                  type="number"
                  min="0"
                  max="2000"
                  value={maxSanity}
                  onChange={(e) => setMaxSanity(e.target.value)}
                  placeholder="100"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Toggle: Jogador ou NPC */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="player-toggle">Jogador</Label>
                <p className="text-sm text-slate-400">
                  {isPlayer ? 'Isso é um personagem de jogador' : 'Isso é um NPC'}
                </p>
              </div>
              <Switch
                id="player-toggle"
                checked={isPlayer}
                onCheckedChange={setIsPlayer}
              />
            </div>

            {/* Toggle: Save Character */}
            {showSaveToggle && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-toggle">Salvar Personagem</Label>
                  <p className="text-sm text-slate-400">
                    Salvar este personagem na sua lista para uso futuro
                  </p>
                </div>
                <Switch
                  id="save-toggle"
                  checked={saveCharacter}
                  onCheckedChange={setSaveCharacter}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Adicionar pesonagem
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
