import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { UserPlus } from 'lucide-react';
import { Combatant } from './CombatTracker';

interface AddCombatantDialogProps {
  onAdd: (combatant: Omit<Combatant, 'id'>) => void;
}

export function AddCombatantDialog({ onAdd }: AddCombatantDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('10');
  const [maxHealth, setMaxHealth] = useState('50');
  const [maxStamina, setMaxStamina] = useState('20');
  const [isPlayer, setIsPlayer] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const initiativeNum = parseInt(initiative) || 10;
    const healthNum = parseInt(maxHealth) || 50;
    const staminaNum = parseInt(maxStamina) || 20;

    onAdd({
      name: name.trim() || 'Unnamed',
      initiative: initiativeNum,
      health: healthNum,
      maxHealth: healthNum,
      stamina: staminaNum,
      maxStamina: staminaNum,
      isPlayer,
    });

    // Reset form
    setName('');
    setInitiative('10');
    setMaxHealth('50');
    setMaxStamina('20');
    setIsPlayer(true);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Combatant
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Adicionar Personagem</DialogTitle>
          <DialogDescription className="text-slate-400">
            Adiciona um novo personagem para o Tracker
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="health">Vida máxima</Label>
                <Input
                  id="health"
                  type="number"
                  value={maxHealth}
                  onChange={(e) => setMaxHealth(e.target.value)}
                  placeholder="50"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stamina">Max Stamina</Label>
                <Input
                  id="stamina"
                  type="number"
                  value={maxStamina}
                  onChange={(e) => setMaxStamina(e.target.value)}
                  placeholder="20"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="player-toggle">Player Character</Label>
                <p className="text-sm text-slate-400">
                  {isPlayer ? 'This is a player character' : 'This is an enemy/NPC'}
                </p>
              </div>
              <Switch
                id="player-toggle"
                checked={isPlayer}
                onCheckedChange={setIsPlayer}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Add Combatant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
