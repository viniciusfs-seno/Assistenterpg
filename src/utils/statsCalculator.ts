// src/utils/statsCalculator.ts - COM LOGS DETALHADOS E SUPORTE A EQUIPAMENTOS

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
  defesaBase: number;
  defesaEquipamento: number;
  defesaOutros: number;
  rd: number;
  rdEquipamento: number;
  rdOutros: number;
  deslocamento: number;
  limitePE_EA: number;
}

/**
 * Calcula todos os stats do personagem baseado em classe, nível, atributos e grau
 * VERSÃO CORRIGIDA COM FÓRMULAS DO SUPLEMENTO + LOGS DE DEBUG
 * 
 * @param classe - Classe do personagem
 * @param nivel - Nível (1-20)
 * @param atributos - Atributos do personagem
 * @param grauFeiticeiro - Grau do feiticeiro (não usado no cálculo, mantido por compatibilidade)
 * @param atributoEA - Atributo escolhido para EA ('intelecto' ou 'presenca')
 * @param equipamentos - Array de equipamentos (opcional, será implementado)
 * @param defesaEquipamento - Bônus de defesa de equipamentos (calculado automaticamente se equipamentos forem passados)
 * @param defesaOutros - Outros bônus de defesa
 * @param rdEquipamento - RD de equipamentos (calculado automaticamente se equipamentos forem passados)
 * @param rdOutros - Outros RD
 */
export function calcularStats(
  classe: ClasseType,
  nivel: number,
  atributos: Attributes,
  grauFeiticeiro: GrauFeiticeiro,
  atributoEA: 'intelecto' | 'presenca' = 'intelecto',
  equipamentos: any[] = [], // Array de equipamentos para implementação futura
  defesaEquipamento: number = 0,
  defesaOutros: number = 0,
  rdEquipamento: number = 0,
  rdOutros: number = 0
): CalculatedStats {
  console.log('📊 ==================== INÍCIO CÁLCULO STATS ====================');
  console.log('📥 [INPUT]', {
    classe,
    nivel,
    atributos,
    grauFeiticeiro,
    atributoEA,
    equipamentos: equipamentos.length,
    defesaEquipamento,
    defesaOutros,
    rdEquipamento,
    rdOutros
  });

  // ✅ FUTURO: Calcular defesa/RD de equipamentos automaticamente
  if (equipamentos.length > 0) {
    console.log('🎒 [EQUIPAMENTOS] Detectados, calculando bônus...');
    
    defesaEquipamento = equipamentos.reduce((acc, item) => {
      return acc + (item.equipado ? (item.item?.defesaBonus || 0) : 0);
    }, 0);

    rdEquipamento = equipamentos.reduce((acc, item) => {
      return acc + (item.equipado ? (item.item?.rdBonus || 0) : 0);
    }, 0);

    console.log('🎒 [EQUIPAMENTOS] Bônus calculados:', {
      defesaEquipamento,
      rdEquipamento
    });
  }

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

  const { agilidade, intelecto, presenca, vigor } = atributos;

  // Garantir que nível é pelo menos 1
  nivel = Math.max(1, nivel);

  // ====================================
  // CÁLCULO DE PV (CORRETO)
  // (PV_inicial + VIG) + [(X + VIG) × (nível - 1)]
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

  console.log('🩸 [DEBUG PV]', {
    classe,
    vigor,
    nivel,
    pvBase: `${classe === 'combatente' ? 20 : 16} + ${vigor} = ${pvBase}`,
    pvPorNivel: `${classe === 'combatente' ? 4 : classe === 'sentinela' ? 2 : 3} + ${vigor} = ${pvPorNivel}`,
    calculo: `${pvBase} + (${pvPorNivel} × ${nivel - 1})`,
    pvMax
  });

  // ====================================
  // CÁLCULO DE PE (CORRIGIDO)
  // (3 + PRE) + [(3 + PRE) × (nível - 1)]
  // ====================================
  const peBase = 3 + presenca;
  const pePorNivel = 3 + presenca;
  const peMax = peBase + (pePorNivel * (nivel - 1));

  console.log('⚡ [DEBUG PE]', {
    presenca,
    nivel,
    peBase: `3 + ${presenca} = ${peBase}`,
    pePorNivel: `3 + ${presenca} = ${pePorNivel}`,
    calculo: `${peBase} + (${pePorNivel} × ${nivel - 1})`,
    peMax
  });

  // ====================================
  // CÁLCULO DE EA (CORRIGIDO COM ESCOLHA)
  // Combatente: (3 + atributo) + [(3 + atributo) × (nível - 1)]
  // Sentinela/Especialista: (4 + atributo) + [(4 + atributo) × (nível - 1)]
  // ====================================
  let eaBase = 0;
  let eaPorNivel = 0;

  const atributoEAValor = atributoEA === 'intelecto' ? intelecto : presenca;

  if (classe === 'combatente') {
    eaBase = 3 + atributoEAValor;
    eaPorNivel = 3 + atributoEAValor;
  } else {
    eaBase = 4 + atributoEAValor;
    eaPorNivel = 4 + atributoEAValor;
  }

  const eaMax = eaBase + (eaPorNivel * (nivel - 1));

  console.log('✨ [DEBUG EA]', {
    classe,
    atributoEA,
    atributoEAValor,
    nivel,
    eaBase: `${classe === 'combatente' ? 3 : 4} + ${atributoEAValor} = ${eaBase}`,
    eaPorNivel: `${classe === 'combatente' ? 3 : 4} + ${atributoEAValor} = ${eaPorNivel}`,
    calculo: `${eaBase} + (${eaPorNivel} × ${nivel - 1})`,
    eaMax
  });

  // ====================================
  // CÁLCULO DE SANIDADE (CORRETO)
  // Combatente: 12 inicial, +3 por nível
  // Sentinela: 12 inicial, +4 por nível
  // Especialista: 16 inicial, +4 por nível
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

  console.log('🧠 [DEBUG SAN]', {
    classe,
    nivel,
    sanBase,
    sanPorNivel,
    calculo: `${sanBase} + (${sanPorNivel} × ${nivel - 1})`,
    sanMax
  });

  // ====================================
  // DEFESA DETALHADA
  // ====================================
  const defesaBase = 10 + agilidade;
  const defesa = defesaBase + defesaEquipamento + defesaOutros;

  console.log('🛡️ [DEBUG DEFESA]', {
    agilidade,
    defesaBase: `10 + ${agilidade} = ${defesaBase}`,
    defesaEquipamento,
    defesaOutros,
    defesaTotal: defesa
  });

  // ====================================
  // REDUÇÃO DE DANO (RD)
  // ====================================
  const rd = rdEquipamento + rdOutros;

  console.log('💎 [DEBUG RD]', {
    rdEquipamento,
    rdOutros,
    rdTotal: rd
  });

  // ====================================
  // DESLOCAMENTO (COM PASSIVAS DE AGI)
  // Base: 9m
  // AGI 4: +6m
  // AGI 5: +9m (substituindo o +6m)
  // ====================================
  let deslocamento = 9;
  if (agilidade >= 5) {
    deslocamento += 9;
  } else if (agilidade >= 4) {
    deslocamento += 6;
  }

  console.log('👟 [DEBUG DESLOCAMENTO]', {
    agilidade,
    base: 9,
    bonus: agilidade >= 5 ? 9 : agilidade >= 4 ? 6 : 0,
    deslocamentoTotal: deslocamento
  });

  // ====================================
  // LIMITE DE PE/EA POR RODADA
  // ====================================
  const limitePE_EA = nivel;

  console.log('⚠️ [DEBUG LIMITE PE/EA]', {
    nivel,
    limitePE_EA
  });

  const stats: CalculatedStats = {
    pvMax,
    pvAtual: pvMax,
    peMax,
    peAtual: peMax,
    eaMax,
    eaAtual: eaMax,
    sanMax,
    sanAtual: sanMax,
    defesa,
    defesaBase,
    defesaEquipamento,
    defesaOutros,
    rd,
    rdEquipamento,
    rdOutros,
    deslocamento,
    limitePE_EA,
  };

  console.log('📤 [OUTPUT FINAL]', stats);
  console.log('📊 ==================== FIM CÁLCULO STATS ====================\n');

  return stats;
}

/**
 * Recalcula apenas os valores máximos, preservando porcentagem atual
 * MANTIDO PARA COMPATIBILIDADE
 */
export function recalcularStatsPreservandoAtual(
  classe: ClasseType,
  nivel: number,
  atributos: Attributes,
  grauFeiticeiro: GrauFeiticeiro,
  statsAtuais: CalculatedStats,
  atributoEA: 'intelecto' | 'presenca' = 'intelecto',
  equipamentos: any[] = [],
  defesaEquipamento: number = 0,
  defesaOutros: number = 0,
  rdEquipamento: number = 0,
  rdOutros: number = 0
): CalculatedStats {
  console.log('🔄 [RECALCULAR STATS PRESERVANDO ATUAL]');

  const novosStats = calcularStats(
    classe,
    nivel,
    atributos,
    grauFeiticeiro,
    atributoEA,
    equipamentos,
    defesaEquipamento,
    defesaOutros,
    rdEquipamento,
    rdOutros
  );

  // Calcular porcentagens atuais (com proteção contra divisão por zero)
  const pvPorcentagem = statsAtuais.pvMax > 0 ? statsAtuais.pvAtual / statsAtuais.pvMax : 1;
  const pePorcentagem = statsAtuais.peMax > 0 ? statsAtuais.peAtual / statsAtuais.peMax : 1;
  const eaPorcentagem = statsAtuais.eaMax > 0 ? statsAtuais.eaAtual / statsAtuais.eaMax : 1;
  const sanPorcentagem = statsAtuais.sanMax > 0 ? statsAtuais.sanAtual / statsAtuais.sanMax : 1;

  console.log('📊 [PORCENTAGENS PRESERVADAS]', {
    pvPorcentagem: `${(pvPorcentagem * 100).toFixed(1)}%`,
    pePorcentagem: `${(pePorcentagem * 100).toFixed(1)}%`,
    eaPorcentagem: `${(eaPorcentagem * 100).toFixed(1)}%`,
    sanPorcentagem: `${(sanPorcentagem * 100).toFixed(1)}%`
  });

  return {
    ...novosStats,
    pvAtual: Math.floor(novosStats.pvMax * pvPorcentagem),
    peAtual: Math.floor(novosStats.peMax * pePorcentagem),
    eaAtual: Math.floor(novosStats.eaMax * eaPorcentagem),
    sanAtual: Math.floor(novosStats.sanMax * sanPorcentagem),
  };
}
