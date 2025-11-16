// src/utils/poderEffects.ts - VERSÃO CORRIGIDA COM PROFICIÊNCIAS EXPANDIDAS

import { getPoderById } from '../data/poderes';
import { EfeitoPoder } from '../types/poder';
import { ProficienciaType } from '../types/character';

export interface BonusPoderes {
  bonusEA: number;
  bonusPE: number;
  bonusPV: number;
  bonusSAN: number;
  bonusLimitePE_EA: number;
  bonusDefesa: number;
  bonusRD: number;
  bonusDeslocamento: number;
  bonusPericias: { [pericia: string]: number };
  proficienciasGanhas: ProficienciaType[];
}

/**
 * Calcula todos os bônus provenientes dos poderes passivos do personagem
 */
export function calcularBonusPoderes(
  poderesIds: string[],
  nivel: number
): BonusPoderes {
  console.log('🎯 [CALCULAR BONUS PODERES]', { poderesIds, nivel });

  const bonus: BonusPoderes = {
    bonusEA: 0,
    bonusPE: 0,
    bonusPV: 0,
    bonusSAN: 0,
    bonusLimitePE_EA: 0,
    bonusDefesa: 0,
    bonusRD: 0,
    bonusDeslocamento: 0,
    bonusPericias: {},
    proficienciasGanhas: []
  };

  if (!poderesIds || poderesIds.length === 0) {
    return bonus;
  }

  poderesIds.forEach(poderId => {
    const poder = getPoderById(poderId);

    // Só aplica efeitos de poderes passivos
    if (!poder || poder.tipo !== 'passivo' || !poder.efeitosPassivos) {
      return;
    }

    console.log(`📌 [PROCESSAR PODER] ${poder.nome}`, poder.efeitosPassivos);

    poder.efeitosPassivos.forEach(efeito => {
      // Verificar se a condição é atendida
      if (!verificarCondicaoEfeito(efeito.condicao, nivel, efeito.nivelMinimo)) {
        console.log(`❌ [CONDIÇÃO NÃO ATENDIDA]`, { efeito, nivel });
        return;
      }

      const valorCalculado = calcularValorEfeito(efeito, nivel);
      console.log(`✅ [EFEITO ATIVO]`, { tipo: efeito.tipo, valor: valorCalculado });

      // ✅ APENAS camelCase (sem duplicatas)
      switch (efeito.tipo) {
        case 'bonusea':
          bonus.bonusEA += valorCalculado;
          break;
        case 'bonuspe':
          bonus.bonusPE += valorCalculado;
          break;
        case 'bonuspv':
          bonus.bonusPV += valorCalculado;
          break;
        case 'bonussan':
          bonus.bonusSAN += valorCalculado;
          break;
        case 'bonuslimitepeea':
          bonus.bonusLimitePE_EA += valorCalculado;
          break;
        case 'bonusdefesa':
          bonus.bonusDefesa += valorCalculado;
          break;
        case 'bonusrd':
          bonus.bonusRD += valorCalculado;
          break;
        case 'bonusdeslocamento':
          bonus.bonusDeslocamento += valorCalculado;
          break;
        case 'bonuspericia':
          if (efeito.alvo) {
            bonus.bonusPericias[efeito.alvo] =
              (bonus.bonusPericias[efeito.alvo] || 0) + valorCalculado;
          }
          break;
      }
    });

    // ✅ Implementar proficiências específicas
    implementarProficiencias(poderId, bonus);
  });

  console.log('🎉 [BONUS FINAIS]', bonus);
  return bonus;
}

/**
 * Verifica se a condição do efeito é atendida
 */
function verificarCondicaoEfeito(
  condicao: string | undefined,
  nivel: number,
  nivelMinimo?: number
): boolean {
  if (!condicao || condicao === 'sempre') {
    return nivelMinimo ? nivel >= nivelMinimo : true;
  }

  switch (condicao) {
    case 'nivelimpar':
      return nivel % 2 !== 0;

    case 'nivelpar':
      return nivel % 2 === 0;

    case 'acada2niveis':
      return true; // Calculado no valorPorNivel

    case 'acada3niveis':
      return true; // Calculado no valorPorNivel

    case 'acada4niveis':
      return true; // Calculado no valorPorNivel

    case 'nivelminimo':
      return nivelMinimo ? nivel >= nivelMinimo : true;

    default:
      console.warn(`⚠️ Condição desconhecida: ${condicao}`);
      return true;
  }
}

/**
 * Calcula o valor de um efeito específico baseado no nível
 */
function calcularValorEfeito(efeito: EfeitoPoder, nivel: number): number {
  // Valor fixo sem condições
  if (efeito.valor !== undefined && !efeito.condicao && !efeito.valorPorNivel) {
    return efeito.valor;
  }

  // Valor progressivo por nível
  if (efeito.valorPorNivel !== undefined) {
    let valorBase = efeito.valor || 0;
    
    switch (efeito.condicao) {
      case 'acada2niveis':
        valorBase += Math.floor(nivel / 2) * efeito.valorPorNivel;
        break;
      
      case 'acada3niveis':
        valorBase += Math.floor(nivel / 3) * efeito.valorPorNivel;
        break;
      
      case 'acada4niveis':
        valorBase += Math.floor(nivel / 4) * efeito.valorPorNivel;
        break;
      
      case 'nivelimpar':
        // Conta quantos níveis ímpares até o atual
        valorBase += Math.ceil(nivel / 2) * efeito.valorPorNivel;
        break;
      
      default:
        valorBase += nivel * efeito.valorPorNivel;
        break;
    }
    
    return valorBase;
  }

  // Aplicar condições ao valor fixo
  const valorBase = efeito.valor || 1;
  return aplicarCondicao(valorBase, efeito.condicao, nivel, efeito.nivelMinimo);
}

/**
 * Aplica condições para determinar se/como o efeito é ativado
 */
function aplicarCondicao(
  valor: number,
  condicao: string | undefined,
  nivel: number,
  nivelMinimo?: number
): number {
  if (!condicao || condicao === 'sempre') {
    return valor;
  }

  switch (condicao) {
    case 'nivelimpar':
      return nivel % 2 === 1 ? valor : 0;

    case 'nivelpar':
      return nivel % 2 === 0 ? valor : 0;

    case 'acada2niveis':
      return Math.floor(nivel / 2) * valor;

    case 'acada3niveis':
      return Math.floor(nivel / 3) * valor;

    case 'acada4niveis':
      return Math.floor(nivel / 4) * valor;

    case 'nivelminimo':
      return (nivelMinimo && nivel >= nivelMinimo) ? valor : 0;

    default:
      console.warn(`⚠️ Condição desconhecida: ${condicao}`);
      return 0;
  }
}

/**
 * Implementa proficiências específicas de poderes
 */
function implementarProficiencias(poderId: string, bonus: BonusPoderes): void {
  const proficienciasPorPoder: { [key: string]: (ProficienciaType | string)[] } = {
    // ===== COMBATE GERAL =====
    'armamento_pesado': [ProficienciaType.ARMAS_PESADAS],
    'protecao_pesada': [ProficienciaType.PROTECOES_PESADAS],
    
    // ===== ARMAS TÁTICAS (SUBCATEGORIAS) =====
    'balistica_avancada': ['ARMAS_TATICAS_FOGO'], // Armas de fogo táticas
    'ninja_urbano': [
      'ARMAS_TATICAS_CORPO_A_CORPO',  // Armas táticas corpo a corpo
      'ARMAS_TATICAS_DISPARO'         // Armas táticas de disparo (não fogo)
    ],
    
    // ===== ARMAS AMALDIÇOADAS =====
    'armamento_amaldicoado': ['ARMAS_AMALDICOADAS'],
  };

  const proficiencias = proficienciasPorPoder[poderId];
  if (proficiencias) {
    proficiencias.forEach(prof => {
      // Evita duplicatas
      if (!bonus.proficienciasGanhas.includes(prof as ProficienciaType)) {
        bonus.proficienciasGanhas.push(prof as ProficienciaType);
      }
    });
    console.log(`🛡️ [PROFICIÊNCIA GANHA]`, { poder: poderId, proficiencias });
  }
}

/**
 * Retorna uma descrição legível dos bônus dos poderes
 */
export function descreverBonusPoderes(bonus: BonusPoderes): string[] {
  const descricoes: string[] = [];

  if (bonus.bonusEA > 0) descricoes.push(`+${bonus.bonusEA} EA`);
  if (bonus.bonusPE > 0) descricoes.push(`+${bonus.bonusPE} PE`);
  if (bonus.bonusPV > 0) descricoes.push(`+${bonus.bonusPV} PV`);
  if (bonus.bonusSAN > 0) descricoes.push(`+${bonus.bonusSAN} SAN`);
  if (bonus.bonusLimitePE_EA > 0) descricoes.push(`+${bonus.bonusLimitePE_EA} Limite PE/EA`);
  if (bonus.bonusDefesa > 0) descricoes.push(`+${bonus.bonusDefesa} Defesa`);
  if (bonus.bonusRD > 0) descricoes.push(`+${bonus.bonusRD} RD`);
  if (bonus.bonusDeslocamento > 0) descricoes.push(`+${bonus.bonusDeslocamento}m Deslocamento`);

  Object.entries(bonus.bonusPericias).forEach(([pericia, valor]) => {
    if (valor > 0) {
      descricoes.push(`+${valor} ${pericia}`);
    }
  });

  if (bonus.proficienciasGanhas.length > 0) {
    descricoes.push(`Proficiências: ${bonus.proficienciasGanhas.join(', ')}`);
  }

  return descricoes;
}

/**
 * Verifica se o personagem tem um poder específico
 */
export function temPoder(poderesIds: string[], poderId: string): boolean {
  return poderesIds.includes(poderId);
}

/**
 * Retorna a lista de todas as proficiências ganhas por poderes
 */
export function obterProficienciasDePoderes(poderesIds: string[]): ProficienciaType[] {
  const bonus = calcularBonusPoderes(poderesIds, 1); // Nível não importa para proficiências
  return bonus.proficienciasGanhas;
}
