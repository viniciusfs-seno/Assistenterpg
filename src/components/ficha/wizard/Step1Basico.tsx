// src/components/ficha/wizard/Step1Basico.tsx - COMPLETO

import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { GrauFeiticeiro } from '../../../types/character';

interface Step1BasicoProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

const GRAUS_FEITICEIRO = [
  { id: 'grau_4', nome: 'Grau 4' },
  { id: 'grau_3', nome: 'Grau 3' },
  { id: 'grau_2', nome: 'Grau 2' },
  { id: 'grau_semi_1', nome: 'Grau Semi-1' },
  { id: 'grau_1', nome: 'Grau 1' },
  { id: 'grau_especial', nome: 'Grau Especial' },
];

export function Step1Basico({ data, updateData }: Step1BasicoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="nome" className="text-white">
            Nome do Personagem *
          </Label>
          <Input
            id="nome"
            value={data.nome}
            onChange={(e) => updateData({ nome: e.target.value })}
            placeholder="Ex: Megumi Fushiguro"
            className="bg-slate-900 border-slate-700 text-white mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="idade" className="text-white">
            Idade
          </Label>
          <Input
            id="idade"
            type="number"
            min="1"
            value={data.idade || ''}
            onChange={(e) => updateData({ idade: parseInt(e.target.value) || undefined })}
            placeholder="Ex: 15"
            className="bg-slate-900 border-slate-700 text-white mt-2"
          />
        </div>

        <div>
          <Label htmlFor="nivel" className="text-white">
            Nível *
          </Label>
          <Input
            id="nivel"
            type="number"
            min="1"
            max="20"
            value={data.nivel}
            onChange={(e) => updateData({ nivel: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })}
            className="bg-slate-900 border-slate-700 text-white mt-2"
            required
          />
          <p className="text-xs text-slate-500 mt-1">Nível do personagem (1-20)</p>
        </div>

        <div>
          <Label htmlFor="grauFeiticeiro" className="text-white">
            Grau de Feiticeiro *
          </Label>
          <Select
            value={data.grauFeiticeiro}
            onValueChange={(value) => updateData({ grauFeiticeiro: value as GrauFeiticeiro })}
          >
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white mt-2">
              <SelectValue placeholder="Selecione o grau" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {GRAUS_FEITICEIRO.map((grau) => (
                <SelectItem key={grau.id} value={grau.id} className="text-white">
                  {grau.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">Determina missões disponíveis</p>
        </div>

        <div>
          <Label htmlFor="jogador" className="text-white">
            Nome do Jogador
          </Label>
          <Input
            id="jogador"
            value={data.jogador || ''}
            onChange={(e) => updateData({ jogador: e.target.value })}
            placeholder="Seu nome"
            className="bg-slate-900 border-slate-700 text-white mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="descricao" className="text-white">
          Descrição / Background
        </Label>
        <Textarea
          id="descricao"
          value={data.descricao || ''}
          onChange={(e) => updateData({ descricao: e.target.value })}
          placeholder="História do personagem, aparência, personalidade..."
          className="bg-slate-900 border-slate-700 text-white mt-2 min-h-[120px]"
        />
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
        <p className="text-sm text-slate-400">
          <strong className="text-white">Dica:</strong> O nível determina quantos pontos de atributo você tem. 
          O grau de feiticeiro define seu reconhecimento na sociedade Jujutsu.
        </p>
      </div>
    </div>
  );
}
