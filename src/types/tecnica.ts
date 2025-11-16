// src/types/tecnica.ts
export enum CategoriaTecnica {
  TECNICA_AMALDICOADA = 'tecnica_amaldicoada',
  BARREIRA = 'barreira',
  REVERSA = 'reversa',
  ANTI_BARREIRA = 'anti_barreira',
  SHIKIGAMI = 'shikigami'
}

export interface TecnicaBasica {
  id: string;
  nome: string;
  categoria: CategoriaTecnica;
  descricao: string;

  // Efeitos por grau
  efeitosPorGrau: {
    [grau: number]: {
      descricao: string;
      custoEA?: number;
      custoPE?: number;
      dano?: string;
      cura?: string;
      bonus?: string;
      acumulavel: boolean;
      maxAcumulacoes?: number;
    }
  };

  // Pré-requisitos
  grauMinimo?: number;
  prerequisitos?: {
    outrasTecnicas?: { categoria: CategoriaTecnica, grauMinimo: number }[];
    outros?: string[];
  };
}