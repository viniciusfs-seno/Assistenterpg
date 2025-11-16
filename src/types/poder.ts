// src/types/poder.ts - ATUALIZADO COM CAMELCASE

export type TipoPoder = 'passivo' | 'manual';
export type CategoriaPoder =
  | 'combate_corpo_a_corpo'
  | 'combate_distancia'
  | 'tatico'
  | 'especialista'
  | 'jujutsu';

export interface PreRequisitoAtributo {
  atributo: 'agilidade' | 'forca' | 'intelecto' | 'presenca' | 'vigor';
  valor: number;
}

export interface PreRequisitoPericia {
  pericia: string;
  nivel?: 'treinado' | 'graduado' | 'veterano' | 'expert';
}

export interface PreRequisitoPoder {
  poderId: string;
}

export interface PreRequisitos {
  atributos?: PreRequisitoAtributo[];
  pericias?: PreRequisitoPericia[];
  poderes?: PreRequisitoPoder[];
  nivel?: number;
  outros?: string[];
}

// ✅ ATUALIZADO: Sistema de efeitos automáticos (APENAS CAMELCASE)
export type TipoEfeitoPoder = 
  | 'bonusea'
  | 'bonuspe'
  | 'bonuspv'
  | 'bonussan'
  | 'bonuslimitepeea'
  | 'bonusdefesa'
  | 'bonusrd'
  | 'bonusdeslocamento'
  | 'bonuspericia'
  | 'outro';

export type CondicaoEfeito = 
  | 'sempre'           // Sempre ativo
  | 'nivelimpar'       // Apenas em níveis ímpares (3, 5, 7...)
  | 'nivelpar'         // Apenas em níveis pares (2, 4, 6...)
  | 'acada2niveis'     // Math.floor(nivel / 2)
  | 'acada3niveis'     // Math.floor(nivel / 3)
  | 'acada4niveis'     // Math.floor(nivel / 4)
  | 'nivelminimo';     // Requer nível mínimo

export interface EfeitoPoder {
  tipo: TipoEfeitoPoder;
  valor?: number;               // Valor fixo (ex: +2)
  valorPorNivel?: number;       // Valor por nível (ex: 0.5 = +1 a cada 2 níveis)
  condicao?: CondicaoEfeito;    // Condição para aplicar
  nivelMinimo?: number;         // Nível mínimo para ativar (usado com 'nivelminimo')
  alvo?: string;                // Para bonuspericia: nome da perícia
  descricao?: string;           // Descrição do efeito (opcional)
}

export interface Poder {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoPoder;
  categoria: CategoriaPoder;
  prerequisitos?: PreRequisitos;
  efeitos: string[];  // Descrição dos efeitos (exibição)
  efeitosPassivos?: EfeitoPoder[];  // Efeitos calculáveis automaticamente
  tags: string[];
}
