// src/data/classes.ts - COMPLETO COM TODAS AS INFORMAÇÕES DAS CLASSES

import { ClasseType } from '../types/character';

export interface ClasseData {
  id: ClasseType;
  nome: string;
  descricao: string;
  
  // Stats base
  pvInicial: string;  // Ex: "20 + VIG"
  pvPorNivel: string; // Ex: "4 + VIG"
  peInicial: string;
  eaInicial: string;
  sanInicial: number;
  
  // Perícias garantidas pela classe
  periciasTreinadas: string[];
  periciasEscolha?: {
    opcoes: string[];
    quantidade: number;
  }[];
  
  // Quantidade de perícias livres (base + intelecto do personagem)
  periciasLivres: {
    base: number;
    modificador: 'intelecto'; // Sempre intelecto
  };
  
  // Benefícios e características
  beneficios: string[];
}

export const CLASSES: ClasseData[] = [
  {
    id: 'combatente',
    nome: 'Combatente',
    descricao: 'Especialista em combate direto e dano físico. Alta resistência e poder destrutivo.',
    
    pvInicial: '20 + VIG',
    pvPorNivel: '4 + VIG',
    peInicial: '3 + PRE',
    eaInicial: '3 + (INT ou PRE)',
    sanInicial: 12,
    
    periciasTreinadas: [],
    periciasEscolha: [
      {
        opcoes: ['Luta', 'Pontaria'],
        quantidade: 1,
      },
      {
        opcoes: ['Fortitude', 'Reflexos'],
        quantidade: 1,
      },
    ],
    
    periciasLivres: {
      base: 2,
      modificador: 'intelecto',
    },
    
    beneficios: [
      'Maior PV inicial e por nível',
      'Focado em combate corpo a corpo',
      'Poderes voltados para dano e resistência',
      'Acesso a trilhas de ataque devastadoras',
    ],
  },
  
  {
    id: 'sentinela',
    nome: 'Sentinela',
    descricao: 'Guardião versátil. Equilibrado entre combate físico e uso de jujutsu.',
    
    pvInicial: '16 + VIG',
    pvPorNivel: '2 + VIG',
    peInicial: '3 + PRE',
    eaInicial: '4 + (INT ou PRE)',
    sanInicial: 12,
    
    periciasTreinadas: ['Tática'],
    periciasEscolha: [
      {
        opcoes: ['Luta', 'Pontaria'],
        quantidade: 1,
      },
    ],
    
    periciasLivres: {
      base: 3,
      modificador: 'intelecto',
    },
    
    beneficios: [
      'Maior EA inicial (melhor para jujutsu)',
      'Equilíbrio entre combate e poderes',
      'Acesso a habilidades de suporte',
      'Versatilidade tática',
    ],
  },
  
  {
    id: 'especialista',
    nome: 'Especialista',
    descricao: 'Mestre em jujutsu e habilidades técnicas. Foco total em feitiços e estratégia.',
    
    pvInicial: '16 + VIG',
    pvPorNivel: '3 + VIG',
    peInicial: '3 + PRE',
    eaInicial: '4 + (INT ou PRE)',
    sanInicial: 16,
    
    periciasTreinadas: [],
    periciasEscolha: undefined,
    
    periciasLivres: {
      base: 6,
      modificador: 'intelecto',
    },
    
    beneficios: [
      'Maior SAN inicial (resistência mental)',
      'Mais EA para uso de técnicas',
      'Maior quantidade de perícias',
      'Acesso a múltiplos aprimoramentos',
    ],
  },
];

// Helper: Obter dados de uma classe específica
export function getClasseData(classeId: ClasseType): ClasseData | undefined {
  return CLASSES.find(c => c.id === classeId);
}

// Helper: Calcular total de perícias livres baseado no intelecto
export function calcularPericiasLivres(classeId: ClasseType, intelecto: number): number {
  const classe = getClasseData(classeId);
  if (!classe) return 0;
  
  return classe.periciasLivres.base + intelecto;
}

// Helper: Obter todas as perícias garantidas pela classe (incluindo as escolhidas)
export function getPericiasClasse(
  classeId: ClasseType,
  escolhas: string[] = []
): string[] {
  const classe = getClasseData(classeId);
  if (!classe) return [];
  
  return [...classe.periciasTreinadas, ...escolhas];
}
