// src/components/ficha/EditBackgroundModal.tsx - NOVO COMPONENTE

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Character, ClasseType, ClaType } from '../../types/character';
import { CLASSES } from '../../data/classes';
import { ORIGENS } from '../../data/origens';
import { CLAS } from '../../data/clas';
import { TECNICAS_INATAS } from '../../data/tecnicas-inatas';
import { AlertCircle, Info, Swords, Brain, UserCircle, Sparkles } from 'lucide-react';

interface EditBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onSave: (updates: {
    classe?: ClasseType;
    origemId?: string;
    cla?: ClaType;
    tecnicaInataId?: string;
  }) => Promise<void>;
}

export function EditBackgroundModal({
  isOpen,
  onClose,
  character,
  onSave,
}: EditBackgroundModalProps) {
  const [classe, setClasse] = useState<ClasseType>(character.classe);
  const [origemId, setOrigemId] = useState(character.origemId);
  const [cla, setCla] = useState<ClaType>(character.cla);
  const [tecnicaInataId, setTecnicaInataId] = useState(character.tecnicaInataId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setClasse(character.classe);
      setOrigemId(character.origemId);
      setCla(character.cla);
      setTecnicaInataId(character.tecnicaInataId);
    }
  }, [isOpen, character]);

  const hasChanges = 
    classe !== character.classe ||
    origemId !== character.origemId ||
    cla !== character.cla ||
    tecnicaInataId !== character.tecnicaInataId;

  // Validar compatibilidade clã/técnica
  const claData = CLAS.find(c => c.id === cla);
  const tecnicaData = TECNICAS_INATAS.find(t => t.id === tecnicaInataId);
  
  const tecnicaInvalida = tecnicaData?.hereditary && tecnicaData.cla !== cla && cla !== 'sem_cla';
  
  // Filtrar técnicas disponíveis baseado no clã
  const tecnicasDisponiveis = TECNICAS_INATAS.filter(tecnica => {
    if (tecnica.hereditary) {
      return tecnica.cla === cla || cla === 'sem_cla';
    }
    return true; // Técnicas não-hereditárias disponíveis para todos
  });

  const handleSave = async () => {
    if (tecnicaInvalida) {
      alert('A técnica selecionada não é compatível com o clã escolhido!');
      return;
    }

    setSaving(true);
    try {
      const updates: any = {};
      
      if (classe !== character.classe) updates.classe = classe;
      if (origemId !== character.origemId) updates.origemId = origemId;
      if (cla !== character.cla) updates.cla = cla;
      if (tecnicaInataId !== character.tecnicaInataId) updates.tecnicaInataId = tecnicaInataId;

      await onSave(updates);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Background</DialogTitle>
          <DialogDescription className="text-slate-400">
            Altere a classe, origem, clã e técnica inata do personagem.
          </DialogDescription>
        </DialogHeader>

        {/* Aviso de perícias */}
        {hasChanges && (
          <Card className="bg-yellow-900/20 border-yellow-700 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-1">⚠️ Atenção:</p>
                <p>Alterar classe ou origem pode afetar as perícias garantidas. Verifique suas perícias após salvar.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Seção: Classe */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-500" />
            Classe
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {CLASSES.map(c => (
              <Card
                key={c.id}
                onClick={() => setClasse(c.id)}
                className={`p-3 cursor-pointer transition-all ${
                  classe === c.id
                    ? 'bg-red-900/30 border-red-500 ring-2 ring-red-500'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                <p className="font-semibold text-white mb-1">{c.nome}</p>
                <p className="text-xs text-slate-400">{c.descricao.slice(0, 60)}...</p>
                <div className="mt-2 text-xs text-slate-300">
                  <p>PV: {c.pvInicial} + {c.pvPorNivel}/nível</p>
                  <p>Perícias livres: {c.periciasLivres.base} + INT</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Seção: Origem */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-500" />
            Origem
          </h3>
          <select
            value={origemId}
            onChange={(e) => setOrigemId(e.target.value)}
            className="w-full bg-slate-800 border-slate-700 text-white rounded-md px-4 py-2"
          >
            {ORIGENS.map(origem => (
              <option key={origem.id} value={origem.id}>
                {origem.nome} - {origem.descricao.slice(0, 50)}...
              </option>
            ))}
          </select>
          {origemId && (
            <Card className="bg-slate-800 border-slate-700 p-3 mt-2">
              <p className="text-sm text-slate-300">
                {ORIGENS.find(o => o.id === origemId)?.habilidadeEspecial}
              </p>
            </Card>
          )}
        </div>

        {/* Seção: Clã */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Clã
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CLAS.map(claOption => (
              <Card
                key={claOption.id}
                onClick={() => {
                  setCla(claOption.id);
                  // Se o clã mudar, resetar técnica se for hereditária incompatível
                  if (tecnicaData?.hereditary && tecnicaData.cla !== claOption.id && claOption.id !== 'sem_cla') {
                    setTecnicaInataId('');
                  }
                }}
                className={`p-3 cursor-pointer transition-all ${
                  cla === claOption.id
                    ? 'bg-purple-900/30 border-purple-500 ring-2 ring-purple-500'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                <p className="font-semibold text-white">{claOption.nome}</p>
                <p className="text-xs text-slate-400 mt-1">{claOption.descricao}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Seção: Técnica Inata */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Técnica Inata
          </h3>
          
          {tecnicaInvalida && (
            <Card className="bg-red-900/30 border-red-700 p-3 mb-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">
                  A técnica selecionada é hereditária e não pertence ao clã escolhido!
                </p>
              </div>
            </Card>
          )}

          <select
            value={tecnicaInataId}
            onChange={(e) => setTecnicaInataId(e.target.value)}
            className={`w-full bg-slate-800 border-slate-700 text-white rounded-md px-4 py-2 ${
              tecnicaInvalida ? 'border-red-500' : ''
            }`}
          >
            <option value="">Nenhuma técnica</option>
            <optgroup label="Técnicas Hereditárias">
              {tecnicasDisponiveis
                .filter(t => t.hereditary)
                .map(tecnica => (
                  <option key={tecnica.id} value={tecnica.id}>
                    {tecnica.nome} ({CLAS.find(c => c.id === tecnica.cla)?.nome})
                  </option>
                ))}
            </optgroup>
            <optgroup label="Técnicas Não-Hereditárias">
              {tecnicasDisponiveis
                .filter(t => !t.hereditary)
                .map(tecnica => (
                  <option key={tecnica.id} value={tecnica.id}>
                    {tecnica.nome}
                  </option>
                ))}
            </optgroup>
          </select>

          {tecnicaInataId && (
            <Card className="bg-slate-800 border-slate-700 p-3 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold text-white">
                  {tecnicasDisponiveis.find(t => t.id === tecnicaInataId)?.nome}
                </p>
                {tecnicaData?.hereditary && (
                  <Badge className="text-xs bg-purple-700">Hereditária</Badge>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {tecnicasDisponiveis.find(t => t.id === tecnicaInataId)?.descricao}
              </p>
            </Card>
          )}
        </div>

        {/* Resumo de mudanças */}
        {hasChanges && (
          <Card className="bg-blue-900/20 border-blue-700 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-2">📋 Mudanças detectadas:</p>
                <ul className="space-y-1 text-xs">
                  {classe !== character.classe && (
                    <li>• Classe: {character.classe} → <span className="font-bold">{classe}</span></li>
                  )}
                  {origemId !== character.origemId && (
                    <li>• Origem: {character.origemId} → <span className="font-bold">{origemId}</span></li>
                  )}
                  {cla !== character.cla && (
                    <li>• Clã: {character.cla} → <span className="font-bold">{cla}</span></li>
                  )}
                  {tecnicaInataId !== character.tecnicaInataId && (
                    <li>• Técnica: {character.tecnicaInataId || 'Nenhuma'} → <span className="font-bold">{tecnicaInataId || 'Nenhuma'}</span></li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || tecnicaInvalida || saving}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
