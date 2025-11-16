// src/utils/prestigio.ts

export type GrauFeiticeiro = 'grau_4' | 'grau_3' | 'grau_2' | 'grau_semi_1' | 'grau_1' | 'grau_especial';
export type LimiteCredito = 'baixo' | 'medio' | 'alto' | 'ilimitado';
export type PrestigioClaClassificacao = 'nenhum' | 'baixo' | 'medio' | 'alto' | 'lider';

export interface BeneficiosPrestigio {
  grauFeiticeiro: GrauFeiticeiro;
  grauFeiticeiroLabel: string;
  limiteCredito: LimiteCredito;
  limiteCreditoLabel: string;
  limiteItens: {
    categoria4: number;
    categoria3: number;
    categoria2: number;
    categoria1: number;
    especial: number;
  };
}

export interface ClassificacaoPrestigioCla {
  classificacao: PrestigioClaClassificacao;
  label: string;
}

/**
 * Calcula todos os benefícios baseado nos pontos de prestígio
 */
export function calcularBeneficiosPrestigio(pontosPrestígio: number): BeneficiosPrestigio {
  // Determinar grau de feiticeiro
  let grauFeiticeiro: GrauFeiticeiro = 'grau_4';
  let grauFeiticeiroLabel = 'Grau 4';
  
  if (pontosPrestígio >= 200) {
    grauFeiticeiro = 'grau_especial';
    grauFeiticeiroLabel = 'Grau Especial';
  } else if (pontosPrestígio >= 120) {
    grauFeiticeiro = 'grau_1';
    grauFeiticeiroLabel = 'Grau 1';
  } else if (pontosPrestígio >= 90) {
    grauFeiticeiro = 'grau_semi_1';
    grauFeiticeiroLabel = 'Grau Semi-1';
  } else if (pontosPrestígio >= 60) {
    grauFeiticeiro = 'grau_2';
    grauFeiticeiroLabel = 'Grau 2';
  } else if (pontosPrestígio >= 30) {
    grauFeiticeiro = 'grau_3';
    grauFeiticeiroLabel = 'Grau 3';
  }

  // Determinar limite de crédito
  let limiteCredito: LimiteCredito = 'baixo';
  let limiteCreditoLabel = 'Baixo';
  
  if (pontosPrestígio >= 200) {
    limiteCredito = 'ilimitado';
    limiteCreditoLabel = 'Ilimitado';
  } else if (pontosPrestígio >= 120) {
    limiteCredito = 'alto';
    limiteCreditoLabel = 'Alto';
  } else if (pontosPrestígio >= 30) {
    limiteCredito = 'medio';
    limiteCreditoLabel = 'Médio';
  }

  // Determinar limites de itens
  let limiteItens = {
    categoria4: 2,
    categoria3: 0,
    categoria2: 0,
    categoria1: 0,
    especial: 0,
  };

  if (pontosPrestígio >= 200) {
    limiteItens = { categoria4: 5, categoria3: 4, categoria2: 4, categoria1: 3, especial: 3 };
  } else if (pontosPrestígio >= 120) {
    limiteItens = { categoria4: 5, categoria3: 4, categoria2: 3, categoria1: 2, especial: 2 };
  } else if (pontosPrestígio >= 90) {
    limiteItens = { categoria4: 4, categoria3: 2, categoria2: 2, categoria1: 1, especial: 1 };
  } else if (pontosPrestígio >= 60) {
    limiteItens = { categoria4: 4, categoria3: 2, categoria2: 2, categoria1: 1, especial: 0 };
  } else if (pontosPrestígio >= 30) {
    limiteItens = { categoria4: 3, categoria3: 1, categoria2: 1, categoria1: 0, especial: 0 };
  }

  return {
    grauFeiticeiro,
    grauFeiticeiroLabel,
    limiteCredito,
    limiteCreditoLabel,
    limiteItens,
  };
}

/**
 * Calcula a classificação de prestígio do clã
 */
export function calcularClassificacaoPrestigioCla(prestigioCla: number): ClassificacaoPrestigioCla {
  if (prestigioCla >= 80) {
    return { classificacao: 'lider', label: 'Líder do Clã' };
  } else if (prestigioCla >= 50) {
    return { classificacao: 'alto', label: 'Alto' };
  } else if (prestigioCla >= 30) {
    return { classificacao: 'medio', label: 'Médio' };
  } else if (prestigioCla >= 10) {
    return { classificacao: 'baixo', label: 'Baixo' };
  }
  return { classificacao: 'nenhum', label: 'Nenhum' };
}

/**
 * Retorna a cor baseada no grau de feiticeiro
 */
export function getCorGrauFeiticeiro(grau: GrauFeiticeiro): string {
  const cores = {
    grau_4: '#94a3b8',
    grau_3: '#60a5fa',
    grau_2: '#8b5cf6',
    grau_semi_1: '#ec4899',
    grau_1: '#f59e0b',
    grau_especial: '#ef4444',
  };
  return cores[grau] || '#94a3b8';
}

/**
 * Retorna a cor baseada na classificação do prestígio do clã
 */
export function getCorPrestigioCla(classificacao: PrestigioClaClassificacao): string {
  const cores = {
    nenhum: '#64748b',
    baixo: '#60a5fa',
    medio: '#8b5cf6',
    alto: '#f59e0b',
    lider: '#ef4444',
  };
  return cores[classificacao] || '#64748b';
}
