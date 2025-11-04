import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { BookOpen, Plus } from 'lucide-react';
import { npcTemplates, NPCTemplate } from '../data/npc-templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface NPCLibraryProps {
  onSelectNPC: (npc: Omit<NPCTemplate, 'description' | 'category'>) => void;
}

export function NPCLibrary({ onSelectNPC }: NPCLibraryProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (npc: NPCTemplate) => {
    onSelectNPC({
      name: npc.name,
      initiative: npc.initiative,
      maxHealth: npc.maxHealth,
      maxStamina: npc.maxStamina,
    });
    setOpen(false);
  };

  const commonNPCs = npcTemplates.filter(npc => npc.category === 'common');
  const eliteNPCs = npcTemplates.filter(npc => npc.category === 'elite');
  const bossNPCs = npcTemplates.filter(npc => npc.category === 'boss');

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
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-slate-300">
            <span className="text-slate-500">Init:</span> {npc.initiative}
          </div>
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
          Adicionar
        </Button>
      </div>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
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
  );
}
