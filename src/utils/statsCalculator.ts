// src/utils/statsCalculator.ts

import { ClasseType, Attributes, GrauFeiticeiro } from '../types/character';

export interface CalculatedStats {
  pvMax: number;
  pvAtual: number;
  peMax: number;
  peAtual: number;
  eaMax: number;
  eaAtual: number;
  sanMax: number;
  sanAtual: number;
  defesa: number;
  deslocamento: number;
}

/**
 * Calcula todos os stats do personagem baseado em classe, nível, atributos e grau
 */
export function calcularStats(
  classe: ClasseType,
  nivel: number,
  atributos: Attributes,
  grauFeiticeiro: GrauFeiticeiro
): CalculatedStats {
  // Validação de segurança
  if (!atributos || typeof atributos !== 'object') {
    console.error('⚠️ Atributos inválidos, usando valores padrão');
    atributos = {
      agilidade: 1,
      forca: 1,
      intelecto: 1,
      presenca: 1,
      vigor: 1,
    };
  }

  const { agilidade, forca, intelecto, presenca, vigor } = atributos;

  // ====================================
  // CÁLCULO DE PV (afetado por VIGOR)
  // ====================================
  let pvBase = 0;
  let pvPorNivel = 0;

  if (classe === 'combatente') {
    pvBase = 20 + vigor;
    pvPorNivel = 4 + vigor;
  } else if (classe === 'sentinela') {
    pvBase = 16 + vigor;
    pvPorNivel = 2 + vigor;
  } else if (classe === 'especialista') {
    pvBase = 16 + vigor;
    pvPorNivel = 3 + vigor;
  }

  const pvMax = pvBase + (pvPorNivel * (nivel - 1));

  // ====================================
  // CÁLCULO DE PE (afetado por PRESENÇA)
  // ====================================
  const peMax = 3 + presenca + (nivel - 1);

  // ====================================
  // CÁLCULO DE EA (afetado por INT ou PRE, o maior)
  // ====================================
  let eaBase = 0;
  if (classe === 'combatente') {
    eaBase = 3 + Math.max(intelecto, presenca);
  } else {
    eaBase = 4 + Math.max(intelecto, presenca);
  }
  const eaMax = eaBase + (nivel - 1);

  // ====================================
  // CÁLCULO DE SANIDADE (não é afetado por atributos)
  // ====================================
  let sanBase = 0;
  let sanPorNivel = 0;

  if (classe === 'combatente') {
    sanBase = 12;
    sanPorNivel = 3;
  } else if (classe === 'sentinela') {
    sanBase = 12;
    sanPorNivel = 4;
  } else if (classe === 'especialista') {
    sanBase = 16;
    sanPorNivel = 4;
  }

  const sanMax = sanBase + (sanPorNivel * (nivel - 1));

  // ====================================
  // CÁLCULO DE DEFESA (afetado por AGILIDADE)
  // ====================================
  const defesa = 10 + agilidade;

  // ====================================
  // CÁLCULO DE DESLOCAMENTO (fixo)
  // ====================================
  const deslocamento = 9;

  return {
    pvMax,
    pvAtual: pvMax,
    peMax,
    peAtual: peMax,
    eaMax,
    eaAtual: eaMax,
    sanMax,
    sanAtual: sanMax,
    defesa,
    deslocamento,
  };
}

/**
 * Recalcula apenas os valores máximos, preservando porcentagem atual
 */
export function recalcularStatsPreservandoAtual(
  classe: ClasseType,
  nivel: number,
  atributos: Attributes,
  grauFeiticeiro: GrauFeiticeiro,
  statsAtuais: CalculatedStats
): CalculatedStats {
  const novosStats = calcularStats(classe, nivel, atributos, grauFeiticeiro);

  // Calcular porcentagens atuais (com proteção contra divisão por zero)
  const pvPorcentagem = statsAtuais.pvMax > 0 ? statsAtuais.pvAtual / statsAtuais.pvMax : 1;
  const pePorcentagem = statsAtuais.peMax > 0 ? statsAtuais.peAtual / statsAtuais.peMax : 1;
  const eaPorcentagem = statsAtuais.eaMax > 0 ? statsAtuais.eaAtual / statsAtuais.eaMax : 1;
  const sanPorcentagem = statsAtuais.sanMax > 0 ? statsAtuais.sanAtual / statsAtuais.sanMax : 1;

  return {
    ...novosStats,
    pvAtual: Math.floor(novosStats.pvMax * pvPorcentagem),
    peAtual: Math.floor(novosStats.peMax * pePorcentagem),
    eaAtual: Math.floor(novosStats.eaMax * eaPorcentagem),
    sanAtual: Math.floor(novosStats.sanMax * sanPorcentagem),
  };
}
