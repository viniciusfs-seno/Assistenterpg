// src/components/ficha/wizard/PericiaChoiceModal.tsx

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';

interface PericiaChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  opcoes: string[];
  onSelect: (pericia: string) => void;
  titulo?: string;
}

export function PericiaChoiceModal({
  isOpen,
  onClose,
  opcoes,
  onSelect,
  titulo = 'Escolha uma Perícia'
}: PericiaChoiceModalProps) {
  const [selected, setSelected] = useState<string>('');

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      setSelected('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {opcoes.map((pericia) => (
            <button
              key={pericia}
              onClick={() => setSelected(pericia)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selected === pericia
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <Label className="text-white cursor-pointer text-base">
                {pericia}
              </Label>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-white">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selected}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
