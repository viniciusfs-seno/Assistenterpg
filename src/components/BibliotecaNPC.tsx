// BibliotecaNPC.tsx — Comentários em PT-BR sem alterar a lógica original

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BookOpen, Plus } from 'lucide-react';
import { npcTemplates, NPCTemplate } from '../data/npc-templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface NPCLibraryProps {
  onSelectNPC: (npc: Omit<NPCTemplate, 'description' | 'category'>) => void;
}

export function NPCLibrary({ onSelectNPC }: NPCLibraryProps) {
  const [open, setOpen] = useState(false);
  const [selectedNPC, setSelectedNPC] = useState<NPCTemplate | null>(null);
  const [initiativeInput, setInitiativeInput] = useState('');

  // Seleciona um NPC e sugere a iniciativa do template
  const handleSelect = (npc: NPCTemplate) => {
    setSelectedNPC(npc);
    setInitiativeInput(npc.initiative.toString()); // Sugestão inicial baseada no template
  };

  // Confirma inclusão do NPC convertendo os campos necessários para Combatant parcial
  const handleConfirm = () => {
    if (!selectedNPC) return;

    onSelectNPC({
      name: selectedNPC.name,
      initiative: parseInt(initiativeInput) || 10,
      maxHealth: selectedNPC.maxHealth,
      maxStamina: selectedNPC.maxStamina,
    });
    setOpen(false);
    setSelectedNPC(null);
    setInitiativeInput('');
  };

  // Cancela seleção e limpa estado
  const handleCancel = () => {
    setSelectedNPC(null);
    setInitiativeInput('');
  };

  // Agrupamentos por categoria para tabs
  const commonNPCs = npcTemplates.filter(npc => npc.category === 'common');
  const eliteNPCs = npcTemplates.filter(npc => npc.category === 'elite');
  const bossNPCs = npcTemplates.filter(npc => npc.category === 'boss');

  // Card de um NPC mostrando descrição e estatísticas principais
  const NPCCard = ({ npc }: { npc: NPCTemplate }) => (
    <Card className="p-4 bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-white">{npc.name}</h4>
            <p className="text-sm text-slate-400">{npc.description}</p>
          </div>
          <Badge
            className={
              npc.category === 'common'
                ? 'bg-green-600'
                : npc.category === 'elite'
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }
          >
            {npc.category === 'common' ? 'Comum' : npc.category === 'elite' ? 'Elite' : 'Boss'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-slate-300">
            <span className="text-slate-500">Vida:</span> {npc.maxHealth}
          </div>
          <div className="text-slate-300">
            <span className="text-slate-500">Esf:</span> {npc.maxStamina}
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => handleSelect(npc)}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Selecionar
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      {/* Diálogo principal: lista de NPCs */}
      <Dialog open={open} onOpenChange={(isOpen: boolean | ((prevState: boolean) => boolean)) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSelectedNPC(null);
          setInitiativeInput('');
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Biblioteca de NPCs
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Biblioteca de NPCs</DialogTitle>
            <DialogDescription className="text-slate-400">
              Selecione um NPC pré-configurado para adicionar ao combate
            </DialogDescription>
          </DialogHeader>

          {/* Tabs por categoria */}
          <Tabs defaultValue="common" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="common">Comuns</TabsTrigger>
              <TabsTrigger value="elite">Elite</TabsTrigger>
              <TabsTrigger value="boss">Boss</TabsTrigger>
            </TabsList>

            <TabsContent value="common">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-3">
                  {commonNPCs.map((npc, idx) => (
                    <NPCCard key={idx} npc={npc} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="elite">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-3">
                  {eliteNPCs.map((npc, idx) => (
                    <NPCCard key={idx} npc={npc} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="boss">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-3">
                  {bossNPCs.map((npc, idx) => (
                    <NPCCard key={idx} npc={npc} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Diálogo secundário: pedir iniciativa ao confirmar NPC */}
      <Dialog open={!!selectedNPC} onOpenChange={(isOpen: any) => !isOpen && handleCancel()}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Definir Iniciativa</DialogTitle>
            <DialogDescription className="text-slate-400">
              Informe o valor de iniciativa para {selectedNPC?.name}
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
              Adicionar NPC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
