// src/data/graus-feiticeiro.ts

import { GrauFeiticeiro } from '../types/character';

export interface GrauFeiticeiroData {
  id: GrauFeiticeiro;
  nome: string;
  descricao: string;
  nivelMinimo?: number;
}

export const GRAUS_FEITICEIRO: GrauFeiticeiroData[] = [
  {
    id: 'grau_especial',
    nome: 'Grau Especial',
    descricao: 'Feiticeiros excepcionalmente poderosos, capazes de enfrentar maldições de grau especial.',
    nivelMinimo: 15,
  },
  {
    id: 'grau_1',
    nome: 'Grau 1',
    descricao: 'Feiticeiros experientes e altamente qualificados.',
    nivelMinimo: 10,
  },
  {
    id: 'grau_2',
    nome: 'Grau 2',
    descricao: 'Feiticeiros competentes com habilidades consideráveis.',
    nivelMinimo: 5,
  },
  {
    id: 'grau_3',
    nome: 'Grau 3',
    descricao: 'Feiticeiros em desenvolvimento com habilidades básicas.',
    nivelMinimo: 3,
  },
  {
    id: 'grau_4',
    nome: 'Grau 4',
    descricao: 'Feiticeiros iniciantes, ainda aprendendo o básico.',
    nivelMinimo: 1,
  },
  {
    id: 'sem_grau',
    nome: 'Sem Grau',
    descricao: 'Indivíduos sem classificação oficial ou sem habilidades de feitiçaria.',
  },
];

/**
 * Busca dados de um grau por ID
 */
export function getGrauData(grauId: GrauFeiticeiro): GrauFeiticeiroData | undefined {
  return GRAUS_FEITICEIRO.find(g => g.id === grauId);
}
