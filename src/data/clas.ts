// src/data/clas.ts - COMPLETO COM TODOS OS CLÃS

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
    nome: 'Gojo',
    descricao: 'Um dos três grandes clãs. Conhecido pela técnica hereditária Infinito e pelos Seis Olhos.',
    grandesClas: true,
    tecnicasHereditarias: ['infinito', '6_olhos', 'copiar'],
  },
  {
    id: 'zenin',
    nome: 'Zenin',
    descricao: 'Um dos três grandes clãs. Tradicional e conservador, conhecido por suas técnicas hereditárias poderosas.',
    grandesClas: true,
    tecnicasHereditarias: ['dez_sombras', 'tecnica_projecao', 'plantas_desastre'],
  },
  {
    id: 'kamo',
    nome: 'Kamo',
    descricao: 'Um dos três grandes clãs. Mestres da manipulação de sangue e outras técnicas hereditárias.',
    grandesClas: true,
    tecnicasHereditarias: ['manipulacao_sangue', 'oceano_desastroso', 'transfiguracao_ociosa'],
  },
  {
    id: 'okkotsu',
    nome: 'Okkotsu',
    descricao: 'Descendentes de Sugawara no Michizane. Possuem grande quantidade de energia amaldiçoada.',
    grandesClas: false,
    tecnicasHereditarias: ['infinito', '6_olhos', 'copiar'],
  },
  {
    id: 'inumaki',
    nome: 'Inumaki',
    descricao: 'Usuários da Fala Amaldiçoada, uma técnica hereditária que transforma palavras em comandos absolutos.',
    grandesClas: false,
    tecnicasHereditarias: ['fala_amaldicoada'],
  },
  {
    id: 'kugisaki',
    nome: 'Kugisaki',
    descricao: 'Família conhecida pela técnica da Boneca de Palha e manipulação de pregos amaldiçoados.',
    grandesClas: false,
    tecnicasHereditarias: ['tecnica_boneca_palha'],
  },
  {
    id: 'suguru',
    nome: 'Suguru',
    descricao: 'Linhagem associada à manipulação de espíritos amaldiçoados e controle mental.',
    grandesClas: false,
  },
  {
    id: 'kasumi',
    nome: 'Kasumi',
    descricao: 'Família de espadachins tradicionais que combinam técnicas de espada com energia amaldiçoada.',
    grandesClas: false,
  },
  {
    id: 'fujiwara',
    nome: 'Fujiwara',
    descricao: 'Antiga família nobre com controle sobre fenômenos atmosféricos e celestiais.',
    grandesClas: false,
    tecnicasHereditarias: ['manipulacao_ceu'],
  },
  {
    id: 'ijichi',
    nome: 'Ijichi',
    descricao: 'Família de suporte especializada em técnicas auxiliares e criação de barreiras.',
    grandesClas: false,
  },
  {
    id: 'hasaba',
    nome: 'Hasaba',
    descricao: 'Clã menor especializado em técnicas de camuflagem e ocultação de energia amaldiçoada.',
    grandesClas: false,
  },
  {
    id: 'kinji',
    nome: 'Kinji',
    descricao: 'Família conectada a técnicas baseadas em probabilidade e jogos de azar.',
    grandesClas: false,
  },
  {
    id: 'ryomen',
    nome: 'Ryomen',
    descricao: 'Linhagem lendária associada ao Rei das Maldições. Técnicas de fogo e corte devastadoras.',
    grandesClas: false,
    tecnicasHereditarias: ['santuario', 'chamas_desastre'],
  },
  {
    id: 'kento',
    nome: 'Kento',
    descricao: 'Família de feiticeiros metódicos especializados em análise de pontos fracos e combate preciso.',
    grandesClas: false,
  },
  {
    id: 'ram',
    nome: 'Ram',
    descricao: 'Descendentes ligados ao elemento fogo, dominando técnicas pirotécnicas devastadoras.',
    grandesClas: false,
    tecnicasHereditarias: ['furia_agni'],
  },
  {
    id: 'haganezuka',
    nome: 'Haganezuka',
    descricao: 'Mestres ferreiros que criam armas amaldiçoadas através de sua técnica hereditária.',
    grandesClas: false,
    tecnicasHereditarias: ['fabricacao_amaldicoada'],
  },
  {
    id: 'itadori',
    nome: 'Itadori',
    descricao: 'Família com resistência física excepcional e conexão com técnicas místicas.',
    grandesClas: false,
    tecnicasHereditarias: ['santuario', 'gravidade_zero'],
  },
  {
    id: 'sem_cla',
    nome: 'Sem Clã',
    descricao: 'Feiticeiros sem linhagem familiar conhecida. Acesso apenas a técnicas não-hereditárias.',
    grandesClas: false,
  },
];
