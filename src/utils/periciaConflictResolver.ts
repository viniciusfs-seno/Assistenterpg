// src/utils/periciaConflictResolver.ts - COM SUPORTE À ESCOLA TÉCNICA

import { getClasseData } from '../data/classes';
import { ORIGENS } from '../data/origens';
import { ClasseType } from '../types/character';

interface PericiaConflictResult {
  periciasDuplicadas: string[];
  bonusExtras: { [pericia: string]: number };
  escolhasAutomaticas: { [pericias: string]: string };
}

/**
 * Detecta conflitos entre perícias de classe e origem
 */
export function detectarConflitoPericias(
  classeId: ClasseType,
  origemId: string,
  escolhasClasse: string[],
  escolhasOrigem: string[]
): PericiaConflictResult {
  const classeData = getClasseData(classeId);
  const origemData = ORIGENS.find(o => o.id === origemId);

  const result: PericiaConflictResult = {
    periciasDuplicadas: [],
    bonusExtras: {},
    escolhasAutomaticas: {},
  };

  if (!classeData || !origemData) return result;

  const periciasFixasClasse = classeData.periciasTreinadas || [];
  const periciasFixasOrigem = origemData.periciasTreinadas || [];

  const duplicadasFixas = periciasFixasClasse.filter(p => 
    periciasFixasOrigem.includes(p)
  );

  duplicadasFixas.forEach(pericia => {
    result.periciasDuplicadas.push(pericia);
    result.bonusExtras[pericia] = 2;
  });

  if (classeData.periciasEscolha && origemData.periciasEscolha) {
    classeData.periciasEscolha.forEach((escolhaClasse, indiceClasse) => {
      const opcoesDaClasse = escolhaClasse.opcoes;
      const opcoesDaOrigem = origemData.periciasEscolha!.opcoes;

      const opcoesComuns = opcoesDaClasse.filter(p => opcoesDaOrigem.includes(p));

      if (opcoesComuns.length > 0) {
        const escolhidaNaClasse = escolhasClasse[indiceClasse];

        if (escolhidaNaClasse && opcoesComuns.includes(escolhidaNaClasse)) {
          const alternativasOrigem = opcoesDaOrigem.filter(p => p !== escolhidaNaClasse);
          
          if (alternativasOrigem.length > 0) {
            result.escolhasAutomaticas[origemId] = alternativasOrigem;
          }
        }
      }
    });
  }

  return result;
}

/**
 * Resolve conflitos automáticos quando a origem fixa conflita com escolhas da classe
 */
export function resolverConflitosAutomaticos(
  classeId: ClasseType,
  origemId: string,
  escolhasClasse: string[]
): string[] {
  const classeData = getClasseData(classeId);
  const origemData = ORIGENS.find(o => o.id === origemId);

  if (!classeData || !origemData || !classeData.periciasEscolha) {
    return escolhasClasse;
  }

  const periciasFixasOrigem = origemData.periciasTreinadas || [];
  const novasEscolhas = [...escolhasClasse];

  classeData.periciasEscolha.forEach((escolha, indice) => {
    const escolhidaAtual = novasEscolhas[indice];
    
    if (escolhidaAtual && periciasFixasOrigem.includes(escolhidaAtual)) {
      const alternativas = escolha.opcoes.filter(p => 
        !periciasFixasOrigem.includes(p) &&
        !novasEscolhas.includes(p)
      );
      
      if (alternativas.length > 0) {
        novasEscolhas[indice] = alternativas[0];
      }
    }
  });

  return novasEscolhas;
}

/**
 * Calcula o total de perícias treinadas considerando duplicações
 * ATUALIZADO: Suporta perícia Jujutsu automática da Escola Técnica
 */
export function consolidarPericias(
  classeId: ClasseType,
  origemId: string,
  escolhasClasse: string[],
  escolhasOrigem: string[],
  estudouEscolaTecnica: boolean = false
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
      bonusExtras[p] = (bonusExtras[p] || 0) + 2;
    }
    pericias.add(p);
  });

  // Adicionar escolhas da classe
  escolhasClasse.forEach(p => {
    if (p) {
      if (pericias.has(p)) {
        bonusExtras[p] = (bonusExtras[p] || 0) + 2;
      }
      pericias.add(p);
    }
  });

  // Adicionar escolhas da origem
  escolhasOrigem.forEach(p => {
    if (p) {
      if (pericias.has(p)) {
        bonusExtras[p] = (bonusExtras[p] || 0) + 2;
      }
      pericias.add(p);
    }
  });

  // 🎓 NOVO: Adicionar perícia Jujutsu da Escola Técnica
  if (estudouEscolaTecnica) {
    const PERICIA_JUJUTSU = 'Jujutsu';
    
    if (pericias.has(PERICIA_JUJUTSU)) {
      // Conflito! Personagem já tem Jujutsu de classe/origem
      // Adicionar +2 de bônus
      bonusExtras[PERICIA_JUJUTSU] = (bonusExtras[PERICIA_JUJUTSU] || 0) + 2;
    } else {
      // Adicionar Jujutsu gratuitamente
      pericias.add(PERICIA_JUJUTSU);
    }
  }

  return {
    pericias: Array.from(pericias),
    bonusExtras,
  };
}
