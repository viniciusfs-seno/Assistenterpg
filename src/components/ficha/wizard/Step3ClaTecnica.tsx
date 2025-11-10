// src/components/ficha/wizard/Step3ClaTecnica.tsx - COMPLETO

import { useState, useMemo } from 'react';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { ClaType } from '../../../types/character';
import { CLAS } from '../../../data/clas';
import { TECNICAS_INATAS } from '../../../data/tecnicas-inatas';
import { Crown, Sparkles, Search, CheckCircle } from 'lucide-react';

interface Step3ClaTecnicaProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step3ClaTecnica({ data, updateData }: Step3ClaTecnicaProps) {
  const [selectedCla, setSelectedCla] = useState<ClaType>(data.cla);
  const [selectedTecnica, setSelectedTecnica] = useState<string>(data.tecnicaInataId);
  const [searchTecnica, setSearchTecnica] = useState('');

  const handleClaSelect = (cla: ClaType) => {
    setSelectedCla(cla);
    updateData({ cla, tecnicaInataId: '' });
    setSelectedTecnica('');
  };

  const handleTecnicaSelect = (tecnicaId: string) => {
    setSelectedTecnica(tecnicaId);
    updateData({ tecnicaInataId: tecnicaId });
  };

  const tecnicasDisponiveis = useMemo(() => {
    let tecnicas = TECNICAS_INATAS;

    if (selectedCla !== 'sem_cla') {
      const claData = CLAS.find(c => c.id === selectedCla);
      if (claData?.tecnicasHereditarias) {
        tecnicas = TECNICAS_INATAS.filter(t => 
          (t.tipo === 'hereditaria' && t.cla === selectedCla) ||
          t.tipo === 'nao_hereditaria'
        );
      } else {
        tecnicas = TECNICAS_INATAS.filter(t => t.tipo === 'nao_hereditaria');
      }
    } else {
      tecnicas = TECNICAS_INATAS.filter(t => t.tipo === 'nao_hereditaria');
    }

    if (searchTecnica) {
      tecnicas = tecnicas.filter(t =>
        t.nome.toLowerCase().includes(searchTecnica.toLowerCase())
      );
    }

    return tecnicas;
  }, [selectedCla, searchTecnica]);

  const claData = CLAS.find(c => c.id === selectedCla);

  return (
    <div className="space-y-8">
      {/* Seção de Clãs */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Escolha seu Clã
        </h3>
        <p className="text-slate-400 mb-4">
          Seu clã determina acesso a técnicas hereditárias e prestígio inicial.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLAS.map((cla) => {
            const isSelected = selectedCla === cla.id;
            const isGrandeCla = cla.grandesClas;

            return (
              <Card
                key={cla.id}
                onClick={() => handleClaSelect(cla.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected
                    ? 'bg-yellow-900/30 border-yellow-500 ring-2 ring-yellow-500'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isGrandeCla && <Crown className="w-5 h-5 text-yellow-500" />}
                    <h4 className="text-lg font-semibold text-white">{cla.nome}</h4>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-yellow-500" />}
                </div>

                <p className="text-sm text-slate-400 mb-3">{cla.descricao}</p>

                {isGrandeCla && (
                  <span 
                    className="inline-block px-2 py-1 rounded-md text-xs font-medium text-center border"
                    style={{ backgroundColor: '#713f12', color: '#fde047', borderColor: '#a16207' }}
                  >
                    Grande Clã
                  </span>
                )}

                {cla.tecnicasHereditarias && cla.tecnicasHereditarias.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500 mb-1">Técnicas Hereditárias:</p>
                    <p className="text-xs text-slate-300">
                      {cla.tecnicasHereditarias.length} disponível(is)
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Seção de Técnicas Inatas */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Escolha sua Técnica Inata
        </h3>
        <p className="text-slate-400 mb-4">
          Sua técnica inata define seu estilo de combate e habilidades únicas.
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Buscar técnica..."
            value={searchTecnica}
            onChange={(e) => setSearchTecnica(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {claData && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-300">
              <strong className="text-white">Clã {claData.nome}:</strong>{' '}
              {claData.tecnicasHereditarias 
                ? `Acesso a ${claData.tecnicasHereditarias.length} técnica(s) hereditária(s) + todas não-hereditárias`
                : 'Apenas técnicas não-hereditárias disponíveis'
              }
            </p>
          </div>
        )}

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {tecnicasDisponiveis.map((tecnica) => {
            const isSelected = selectedTecnica === tecnica.id;
            const isHereditaria = tecnica.tipo === 'hereditaria';

            return (
              <Card
                key={tecnica.id}
                onClick={() => handleTecnicaSelect(tecnica.id)}
                className={`cursor-pointer transition-all p-4 ${
                  isSelected
                    ? 'bg-purple-900/30 border-purple-500 ring-2 ring-purple-500'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-white">
                        {tecnica.nome}
                      </h4>
                      {isHereditaria && (
                        <span 
                          className="inline-block px-2 py-1 rounded-md text-xs font-medium text-center border"
                          style={{ backgroundColor: '#581c87', color: '#d8b4fe', borderColor: '#7e22ce' }}
                        >
                          Hereditária
                        </span>
                      )}
                      {isSelected && <CheckCircle className="w-5 h-5 text-purple-500 ml-auto" />}
                    </div>
                    <p className="text-sm text-slate-400">{tecnica.descricao}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {tecnicasDisponiveis.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">Nenhuma técnica encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
