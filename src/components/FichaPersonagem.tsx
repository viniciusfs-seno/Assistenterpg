// src/components/FichaPersonagem.tsx

import { useState } from 'react';

type Atributos = {
  agilidade: number;
  forca: number;
  intelecto: number;
  presenca: number;
  vigor: number;
};

type Pericia = {
  nome: string;
  atributoBase: string;
  treinada: boolean;
  kit: boolean;
  carga: boolean;
  grauTreinamento: number;
};

type Poder = {
  nome: string;
  descricao: string;
  preRequisitos?: string[];
};

type Classe = 'Combatente' | 'Sentinela' | 'Especialista';

type Clã = string; // Pode ser enumerado a partir da lista enviada

export function FichaPersonagem() {
  // Estados básicos
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [clã, setClã] = useState<Clã>('');
  const [origem, setOrigem] = useState('');
  const [classe, setClasse] = useState<Classe>('Combatente');
  const [trilha, setTrilha] = useState('');
  const [nivel, setNivel] = useState(1);

  // Atributos
  const [atributos, setAtributos] = useState<Atributos>({
    agilidade: 1,
    forca: 1,
    intelecto: 1,
    presenca: 1,
    vigor: 1,
  });

  // Perícias exemplo
  const [pericias, setPericias] = useState<Pericia[]>([
    {
      nome: 'Acrobacia',
      atributoBase: 'Agi',
      treinada: false,
      kit: false,
      carga: false,
      grauTreinamento: 0,
    },
    // Preencher com outras perícias da planilha
  ]);

  // Poderes exemplo
  const [poderes, setPoderes] = useState<Poder[]>([]);

  // TODO: outros estados para feitiços, equipamentos, prestígio, etc

  // Função para alterar atributos (com limite de pontos)
  const handleSetAtributo = (key: keyof Atributos, value: number) => {
    if (value < 0 || value > 7) return;
    setAtributos((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-6">Ficha Completa do Personagem</h1>

      {/* Seção Informações Básicas */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-slate-700 p-2 rounded"
          />
          <input
            type="number"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            className="bg-slate-700 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Sexo/Gênero"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="bg-slate-700 p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <select value={clã} onChange={(e) => setClã(e.target.value)} className="bg-slate-700 p-2 rounded">
            <option value="">Selecione o Clã</option>
            {/* Mapear os clãs recebidos */}
          </select>
          <select value={origem} onChange={(e) => setOrigem(e.target.value)} className="bg-slate-700 p-2 rounded">
            <option value="">Selecione a Origem</option>
          </select>
          <select value={classe} onChange={(e) => setClasse(e.target.value as Classe)} className="bg-slate-700 p-2 rounded">
            <option value="Combatente">Combatente</option>
            <option value="Sentinela">Sentinela</option>
            <option value="Especialista">Especialista</option>
          </select>
        </div>
        <div className="mt-4">
          <label className="block mb-1">Trilha de Classe</label>
          <select value={trilha} onChange={(e) => setTrilha(e.target.value)} className="bg-slate-700 p-2 rounded w-full">
            <option value="">Selecione a Trilha</option>
          </select>
        </div>
        <div className="mt-4 w-24">
          <input
            type="number"
            min={1}
            max={20}
            placeholder="Nível"
            value={nivel}
            onChange={(e) => setNivel(Number(e.target.value))}
            className="bg-slate-700 p-2 rounded w-full"
          />
        </div>
      </section>

      {/* Seção Atributos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Atributos (0 a 7)</h2>
        <div className="grid grid-cols-5 gap-6">
          {(['agilidade', 'forca', 'intelecto', 'presenca', 'vigor'] as (keyof Atributos)[]).map((key) => (
            <div key={key}>
              <label className="block mb-1 capitalize">{key}</label>
              <input
                type="number"
                min={0}
                max={7}
                value={atributos[key]}
                onChange={(e) => handleSetAtributo(key, Number(e.target.value))}
                className="bg-slate-700 p-2 rounded w-full text-center"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Perícias */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Perícias</h2>
        <div>
          {pericias.map((pericia, idx) => (
            <div key={idx} className="flex gap-4 items-center mb-2 bg-slate-700 p-3 rounded">
              <span className="flex-1 font-semibold">{pericia.nome}</span>
              <span className="w-20 text-center">{pericia.atributoBase}</span>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={pericia.treinada}
                  onChange={() => {
                    const newPericias = [...pericias];
                    newPericias[idx].treinada = !newPericias[idx].treinada;
                    setPericias(newPericias);
                  }}
                />
                Treinada
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={pericia.kit}
                  onChange={() => {
                    const newPericias = [...pericias];
                    newPericias[idx].kit = !newPericias[idx].kit;
                    setPericias(newPericias);
                  }}
                />
                Kit
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={pericia.carga}
                  onChange={() => {
                    const newPericias = [...pericias];
                    newPericias[idx].carga = !newPericias[idx].carga;
                    setPericias(newPericias);
                  }}
                />
                Carga
              </label>
              <select
                value={pericia.grauTreinamento}
                onChange={(e) => {
                  const newPericias = [...pericias];
                  newPericias[idx].grauTreinamento = Number(e.target.value);
                  setPericias(newPericias);
                }}
                className="bg-slate-600 rounded"
              >
                <option value={0}>Destreinado (0)</option>
                <option value={5}>Treinado (+5)</option>
                <option value={10}>Graduado (+10)</option>
                <option value={15}>Veterano (+15)</option>
                <option value={20}>Expert (+20)</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* TODO: Seções para Poderes, Equipamentos, Feitiços etc */}

    </div>
  );
}
