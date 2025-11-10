// src/components/ficha/CompleteCharacterSheet.tsx - CORRIGIDO

import { Character } from '../../types/character';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Swords, Crown, Sparkles, Users, Trash } from 'lucide-react';

interface CompleteCharacterSheetProps {
  data: Character;
  onDelete: () => void;
  onEdit?: () => void;
}

export function CompleteCharacterSheet({ data, onDelete, onEdit }: CompleteCharacterSheetProps) {
  return (
    <Card className="bg-slate-900 border-slate-700 p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-white">{data.nome}</h2>
        <div className="flex gap-3">
          {onEdit && (
            <Button onClick={onEdit} variant="outline" className="flex items-center gap-1 border-slate-600 text-white hover:bg-slate-800">
              Editar
            </Button>
          )}
          <Button onClick={onDelete} variant="destructive" className="flex items-center gap-1">
            <Trash className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-300 text-sm">
        <div>
          <strong>Nível:</strong> {data.nivel}
        </div>
        <div>
          <strong>Grau:</strong> {data.grauFeiticeiro}
        </div>
        {data.idade && (
          <div>
            <strong>Idade:</strong> {data.idade}
          </div>
        )}
        {data.jogador && (
          <div>
            <strong>Jogador:</strong> {data.jogador}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-500" />
          Atributos
        </h3>
        <div className="flex gap-6 text-white text-lg">
          {Object.entries(data.atributos).map(([attr, val]) => (
            <div key={attr} className="text-center bg-slate-800 p-3 rounded-md min-w-[70px]">
              <div className="uppercase text-sm text-slate-400">{attr.slice(0, 3)}</div>
              <div>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-500" />
            Classe
          </h3>
          <p className="text-white text-lg font-medium capitalize">{data.classe}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Clã
          </h3>
          <p className="text-white text-lg font-medium">{data.cla}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Técnica Inata
          </h3>
          <p className="text-white text-lg font-medium">{data.tecnicaInataId}</p>
        </div>
      </div>

      {data.descricao && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Descrição</h3>
          <p className="text-slate-300">{data.descricao}</p>
        </div>
      )}
    </Card>
  );
}
