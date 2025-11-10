// src/utils/periciaConflictResolver.ts - NOVO ARQUIVO

import { getClasseData } from '../data/classes';
import { ORIGENS } from '../data/origens';
import { ClasseType } from '../types/character';

interface PericiaConflictResult {
  periciasDuplicadas: string[]; // Perícias que aparecem em classe E origem (fixas)
  bonusExtras: { [pericia: string]: number }; // Mapa de bônus +2
  escolhasAutomaticas: { [pericias: string]: string }; // Mapeia escolha forçada
}

/**
 * Detecta conflitos entre perícias de classe e origem
 */
export function detectarConflitoPericias(
  classeId: ClasseType,
  origemId: string,
  escolhasClasse: string[], // Perícias escolhidas pelo usuário na classe
  escolhasOrigem: string[]  // Perícias escolhidas pelo usuário na origem
): PericiaConflictResult {
  const classeData = getClasseData(classeId);
  const origemData = ORIGENS.find(o => o.id === origemId);

  const result: PericiaConflictResult = {
    periciasDuplicadas: [],
    bonusExtras: {},
    escolhasAutomaticas: {},
  };

  if (!classeData || !origemData) return result;

  // Perícias FIXAS da classe e origem
  const periciasFixasClasse = classeData.periciasTreinadas || [];
  const periciasFixasOrigem = origemData.periciasTreinadas || [];

  // CENÁRIO 2: Detectar perícias fixas duplicadas
  const duplicadasFixas = periciasFixasClasse.filter(p => 
    periciasFixasOrigem.includes(p)
  );

  duplicadasFixas.forEach(pericia => {
    result.periciasDuplicadas.push(pericia);
    result.bonusExtras[pericia] = 2; // +2 de bônus
  });

  // CENÁRIO 3: Detectar conflitos em escolhas
  // Verificar se há sobreposição entre opções de escolha
  if (classeData.periciasEscolha && origemData.periciasEscolha) {
    classeData.periciasEscolha.forEach((escolhaClasse, indiceClasse) => {
      const opcoesDaClasse = escolhaClasse.opcoes;
      const opcoesDaOrigem = origemData.periciasEscolha!.opcoes;

      // Verificar se há interseção
      const opcoesComuns = opcoesDaClasse.filter(p => opcoesDaOrigem.includes(p));

      if (opcoesComuns.length > 0) {
        // Há conflito! Se o usuário escolher uma na classe, a origem deve escolher a outra
        const escolhidaNaClasse = escolhasClasse[indiceClasse];

        if (escolhidaNaClasse && opcoesComuns.includes(escolhidaNaClasse)) {
          // Forçar a escolha da alternativa na origem
          const alternativasOrigem = opcoesDaOrigem.filter(p => p !== escolhidaNaClasse);
          
          if (alternativasOrigem.length > 0) {
            result.escolhasAutomaticas[origemId] = alternativasOrigem[0];
          }
        }
      }
    });
  }

  return result;
}

/**
 * Calcula o total de perícias treinadas considerando duplicações
 */
export function consolidarPericias(
  classeId: ClasseType,
  origemId: string,
  escolhasClasse: string[],
  escolhasOrigem: string[]
): {
  pericias: string[];
  bonusExtras: { [pericia: string]: number };
} {
  const classeData = getClasseData(classeId);
  const origemData = ORIGENS.find(o => o.id === origemId);

  const pericias = new Set<string>();
  const bonusExtras: { [pericia: string]: number } = {};

  if (!classeData || !origemData) {
    return { pericias: [], bonusExtras: {} };
  }

  // Adicionar perícias fixas da classe
  (classeData.periciasTreinadas || []).forEach(p => pericias.add(p));

  // Adicionar perícias fixas da origem
  (origemData.periciasTreinadas || []).forEach(p => {
    if (pericias.has(p)) {
      // Duplicação! Adicionar +2
      bonusExtras[p] = (bonusExtras[p] || 0) + 2;
    }
    pericias.add(p);
  });

  // Adicionar escolhas da classe
  escolhasClasse.forEach(p => {
    if (p) pericias.add(p);
  });

  // Adicionar escolhas da origem
  escolhasOrigem.forEach(p => {
    if (p) {
      if (pericias.has(p)) {
        // Duplicação em escolha! Adicionar +2
        bonusExtras[p] = (bonusExtras[p] || 0) + 2;
      }
      pericias.add(p);
    }
  });

  return {
    pericias: Array.from(pericias),
    bonusExtras,
  };
}
