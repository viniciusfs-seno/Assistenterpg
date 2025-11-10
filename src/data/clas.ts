// src/data/clas.ts - COMPLETO E CORRIGIDO

import { ClaType } from '../types/character';

export interface ClaData {
  id: ClaType;
  nome: string;
  descricao: string;
  grandesClas: boolean;
  tecnicasHereditarias?: string[];
}

export const CLAS: ClaData[] = [
  {
    id: 'gojo',
    nome: 'Clã Gojo',
    descricao: 'Um dos três grandes clãs. Conhecido pela técnica hereditária Infinito e pelos Seis Olhos.',
    grandesClas: true,
    tecnicasHereditarias: ['infinito', '6_olhos', 'copiar'],
  },
  {
    id: 'zenin',
    nome: 'Clã Zenin',
    descricao: 'Um dos três grandes clãs. Tradicional e conservador, conhecido por suas técnicas hereditárias poderosas.',
    grandesClas: true,
    tecnicasHereditarias: ['dez_sombras', 'tecnica_projecao', 'plantas_desastre'],
  },
  {
    id: 'kamo',
    nome: 'Clã Kamo',
    descricao: 'Um dos três grandes clãs. Mestres da manipulação de sangue e outras técnicas hereditárias.',
    grandesClas: true,
    tecnicasHereditarias: ['manipulacao_sangue', 'oceano_desastroso', 'transfiguracao_ociosa'],
  },
  {
    id: 'okkotsu',
    nome: 'Clã Okkotsu',
    descricao: 'Descendentes de Sugawara no Michizane. Possuem grande quantidade de energia amaldiçoada.',
    grandesClas: false,
    tecnicasHereditarias: ['infinito', '6_olhos', 'copiar'],
  },
  {
    id: 'inumaki',
    nome: 'Clã Inumaki',
    descricao: 'Usuários da Fala Amaldiçoada, uma técnica hereditária que transforma palavras em comandos absolutos.',
    grandesClas: false,
    tecnicasHereditarias: ['fala_amaldicoada'],
  },
  {
    id: 'kugisaki',
    nome: 'Clã Kugisaki',
    descricao: 'Família conhecida pela técnica da Boneca de Palha e manipulação de pregos amaldiçoados.',
    grandesClas: false,
    tecnicasHereditarias: ['tecnica_boneca_palha'],
  },
  {
    id: 'ryomen',
    nome: 'Clã Ryomen',
    descricao: 'Linhagem lendária associada ao Rei das Maldições. Técnicas de fogo e corte devastadoras.',
    grandesClas: false,
    tecnicasHereditarias: ['santuario', 'chamas_desastre'],
  },
  {
    id: 'itadori',
    nome: 'Clã Itadori',
    descricao: 'Família com resistência física excepcional e conexão com técnicas místicas.',
    grandesClas: false,
    tecnicasHereditarias: ['santuario', 'gravidade_zero'],
  },
  {
    id: 'ram',
    nome: 'Clã Ram',
    descricao: 'Descendentes ligados ao elemento fogo, dominando técnicas pirotécnicas devastadoras.',
    grandesClas: false,
    tecnicasHereditarias: ['furia_agni'],
  },
  {
    id: 'fujiwara',
    nome: 'Clã Fujiwara',
    descricao: 'Antiga família nobre com controle sobre fenômenos atmosféricos e celestiais.',
    grandesClas: false,
    tecnicasHereditarias: ['manipulacao_ceu'],
  },
  {
    id: 'haganezuka',
    nome: 'Clã Haganezuka',
    descricao: 'Mestres ferreiros que criam armas amaldiçoadas através de sua técnica hereditária.',
    grandesClas: false,
    tecnicasHereditarias: ['fabricacao_amaldicoada'],
  },
  {
    id: 'sem_cla',
    nome: 'Sem Clã',
    descricao: 'Feiticeiros sem linhagem familiar conhecida. Acesso apenas a técnicas não-hereditárias.',
    grandesClas: false,
    tecnicasHereditarias: undefined,
  },
];
