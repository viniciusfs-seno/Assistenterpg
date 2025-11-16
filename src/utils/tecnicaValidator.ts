// src/utils/tecnicaValidator.ts - VALIDAÇÃO E BÔNUS DE TÉCNICAS BÁSICAS + SECRETAS

import { CategoriaTecnica, ClaType, TrilhaType } from '../types/character';

export interface BonusTecnica {
  categoria: CategoriaTecnica;
  graus: number;
  motivo: string;
}

/**
 * Calcula bônus automáticos de graus de aprimoramento
 */
export function calcularBonusTecnicas(
  nivel: number,
  estudouEscolaTecnica: boolean,
  trilha?: TrilhaType,
  subcaminho?: string,
  cla?: ClaType
): BonusTecnica[] {
  const bonus: BonusTecnica[] = [];

  // ✅ Escola Técnica Jujutsu → +1 Técnica Amaldiçoada
  if (estudouEscolaTecnica) {
    bonus.push({
      categoria: CategoriaTecnica.TECNICA_AMALDICOADA,
      graus: 1,
      motivo: 'Estudou na Escola Técnica Jujutsu'
    });
  }

  // ✅ Mestre de Barreiras → +1 Barreira (nível 2+)
  if (trilha === 'mestre_barreiras' && nivel >= 2) {
    bonus.push({
      categoria: CategoriaTecnica.BARREIRA,
      graus: 1,
      motivo: 'Trilha Mestre de Barreiras (nível 2)'
    });
  }

  // ✅ Mestre de Barreiras (Domínio Perfeito ou Apoio de Campo) → +1 Barreira (nível 18)
  if (
    trilha === 'mestre_barreiras' &&
    nivel >= 18 &&
    (subcaminho === 'dominio_perfeito' || subcaminho === 'apoio_campo')
  ) {
    bonus.push({
      categoria: CategoriaTecnica.BARREIRA,
      graus: 1,
      motivo: `Subcaminho ${subcaminho === 'dominio_perfeito' ? 'Domínio Perfeito' : 'Apoio de Campo'} (nível 18)`
    });
  }

  // ✅ Mestre de Barreiras (Anulador de Barreiras) → +1 Anti-Barreira
  if (trilha === 'mestre_barreiras' && subcaminho === 'anulador_barreiras' && nivel >= 2) {
    bonus.push({
      categoria: CategoriaTecnica.ANTI_BARREIRA,
      graus: 1,
      motivo: 'Subcaminho Anulador de Barreiras'
    });
  }

  return bonus;
}

/**
 * Verifica se o jogador pode adicionar pontos em uma técnica
 */
export function podeAdicionarPontos(
  categoria: CategoriaTecnica,
  grauAtual: number,
  tecnicasAtuais: { [key in CategoriaTecnica]: number },
  cla?: ClaType
): { pode: boolean; motivo?: string } {
  // ✅ Técnica Amaldiçoada → Sem requisito
  if (categoria === CategoriaTecnica.TECNICA_AMALDICOADA) {
    return { pode: true };
  }

  // ✅ Técnica de Barreira → Requer Grau 1 em Técnica Amaldiçoada
  if (categoria === CategoriaTecnica.BARREIRA) {
    if (tecnicasAtuais.tecnica_amaldicoada < 1) {
      return {
        pode: false,
        motivo: 'Requer Grau 1 em Técnica Amaldiçoada'
      };
    }
    return { pode: true };
  }

  // ✅ Técnica Reversa → Requer Grau 2 em Técnica Amaldiçoada
  if (categoria === CategoriaTecnica.REVERSA) {
    if (tecnicasAtuais.tecnica_amaldicoada < 2) {
      return {
        pode: false,
        motivo: 'Requer Grau 2 em Técnica Amaldiçoada'
      };
    }
    return { pode: true };
  }

  // ✅ Anti-Barreira → Requer Grau 1 em Técnica Amaldiçoada
  if (categoria === CategoriaTecnica.ANTI_BARREIRA) {
    if (tecnicasAtuais.tecnica_amaldicoada < 1) {
      return {
        pode: false,
        motivo: 'Requer Grau 1 em Técnica Amaldiçoada'
      };
    }
    return { pode: true };
  }

  // ✅ Shikigami → Requer Grau 1 em Técnica Amaldiçoada
  if (categoria === CategoriaTecnica.SHIKIGAMI) {
    if (tecnicasAtuais.tecnica_amaldicoada < 1) {
      return {
        pode: false,
        motivo: 'Requer Grau 1 em Técnica Amaldiçoada'
      };
    }
    return { pode: true };
  }

  // ✅ NOVO: Técnicas Secretas → Requer Grau 1 em Técnica Amaldiçoada + ser dos 3 grandes clãs
  if (categoria === CategoriaTecnica.TECNICAS_SECRETAS) {
    const tresGrandesClas = ['gojo', 'zenin', 'kamo'];
    
    if (!cla || !tresGrandesClas.includes(cla)) {
      return {
        pode: false,
        motivo: 'Requer pertencer a um dos Três Grandes Clãs (Gojo, Zenin ou Kamo)'
      };
    }

    if (tecnicasAtuais.tecnica_amaldicoada < 1) {
      return {
        pode: false,
        motivo: 'Requer Grau 1 em Técnica Amaldiçoada'
      };
    }

    return { pode: true };
  }

  return { pode: true };
}

/**
 * Aplica bônus automáticos às técnicas
 */
export function aplicarBonusTecnicas(
  tecnicasBase: { [key in CategoriaTecnica]: number },
  bonus: BonusTecnica[]
): { [key in CategoriaTecnica]: number } {
  const tecnicasFinais = { ...tecnicasBase };

  bonus.forEach(b => {
    tecnicasFinais[b.categoria] += b.graus;
  });

  return tecnicasFinais;
}

/**
 * Obtém nome legível da categoria
 */
export function getNomeTecnica(categoria: CategoriaTecnica): string {
  const nomes: Record<CategoriaTecnica, string> = {
    [CategoriaTecnica.TECNICA_AMALDICOADA]: 'Técnica Amaldiçoada',
    [CategoriaTecnica.BARREIRA]: 'Técnica de Barreira',
    [CategoriaTecnica.REVERSA]: 'Técnica Amaldiçoada Reversa',
    [CategoriaTecnica.ANTI_BARREIRA]: 'Técnica Anti-Barreira',
    [CategoriaTecnica.SHIKIGAMI]: 'Técnica de Shikigami',
    [CategoriaTecnica.TECNICAS_SECRETAS]: 'Técnicas Secretas' // ✅ NOVO
  };
  return nomes[categoria];
}
