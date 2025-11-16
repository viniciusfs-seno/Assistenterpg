import { ProficienciaType } from '../types/character';

export interface ProficienciaData {
  id: ProficienciaType;
  nome: string;
  categoria: 'arma' | 'protecao' | 'item_amaldicoado';
  subcategoria?: 'corpo_a_corpo' | 'disparo' | 'fogo' | 'tatica' | 'amaldicoada' | 'pesada';
  descricao: string;
  penalidade: string;
}

export const PROFICIENCIAS: ProficienciaData[] = [
  // ===== ARMAS SIMPLES =====
  {
    id: ProficienciaType.ARMAS_SIMPLES,
    nome: 'Armas Simples',
    categoria: 'arma',
    descricao: 'Proficiência com armas simples como facas, bastões e armas improvisadas.',
    penalidade: '-2d20 nos testes de ataque com armas simples.',
  },
  // ===== ARMAS TÁTICAS =====
  {
    id: ProficienciaType.ARMAS_TATICAS,
    nome: 'Armas Táticas',
    categoria: 'arma',
    descricao: 'Proficiência com armas táticas como espadas, pistolas e rifles.',
    penalidade: '-2d20 nos testes de ataque com armas táticas.',
  },
  // ===== SUBCATEGORIAS DE ARMAS TÁTICAS =====
  {
    id: ProficienciaType.ARMAS_TATICAS_CORPO_A_CORPO,
    nome: 'Armas Táticas (Corpo a Corpo)',
    categoria: 'arma',
    subcategoria: 'corpo_a_corpo',
    descricao: 'Proficiência com armas táticas corpo a corpo como espadas, machados e lanças.',
    penalidade: '-2d20 nos testes de ataque com armas táticas corpo a corpo.',
  },
  {
    id: ProficienciaType.ARMAS_TATICAS_DISPARO,
    nome: 'Armas Táticas (Disparo)',
    categoria: 'arma',
    subcategoria: 'disparo',
    descricao: 'Proficiência com armas táticas de disparo (não de fogo) como bestas e arcos.',
    penalidade: '-2d20 nos testes de ataque com armas táticas de disparo.',
  },
  {
    id: ProficienciaType.ARMAS_TATICAS_FOGO,
    nome: 'Armas Táticas (Fogo)',
    categoria: 'arma',
    subcategoria: 'fogo',
    descricao: 'Proficiência com armas táticas de fogo como pistolas, revólveres e rifles.',
    penalidade: '-2d20 nos testes de ataque com armas táticas de fogo.',
  },
  // ===== ARMAS PESADAS =====
  {
    id: ProficienciaType.ARMAS_PESADAS,
    nome: 'Armas Pesadas',
    categoria: 'arma',
    subcategoria: 'pesada',
    descricao: 'Proficiência com armas pesadas como metralhadoras, lançadores e armas de cerco.',
    penalidade: '-2d20 nos testes de ataque com armas pesadas.',
  },
  // ===== ARMAS AMALDIÇOADAS =====
  {
    id: ProficienciaType.ARMAS_AMALDICOADAS,
    nome: 'Armas Amaldiçoadas',
    categoria: 'arma',
    subcategoria: 'amaldicoada',
    descricao: 'Proficiência com armas imbuídas de energia amaldiçoada.',
    penalidade: '-2d20 nos testes de ataque com armas amaldiçoadas (acumula com falta de proficiência da categoria base).',
  },
  // ===== PROTEÇÕES =====
  {
    id: ProficienciaType.PROTECOES_LEVES,
    nome: 'Proteções Leves',
    categoria: 'protecao',
    descricao: 'Proficiência com proteções leves como coletes táticos e armaduras leves.',
    penalidade: '-2d20 em testes baseados em Força e Agilidade.',
  },
  {
    id: ProficienciaType.PROTECOES_PESADAS,
    nome: 'Proteções Pesadas',
    categoria: 'protecao',
    subcategoria: 'pesada',
    descricao: 'Proficiência com proteções pesadas como armaduras completas e exoesqueletos.',
    penalidade: '-2d20 em testes baseados em Força e Agilidade.',
  },
  // ===== ITENS AMALDIÇOADOS =====
  {
    id: ProficienciaType.ITENS_AMALDICOADOS,
    nome: 'Itens Amaldiçoados',
    categoria: 'item_amaldicoado',
    descricao: 'Proficiência com itens imbuídos de energia amaldiçoada. Inclui armas, proteções e equipamentos amaldiçoados.',
    penalidade: 'Armas: -2d20 nos testes de ataque (acumula). Proteções: -2d20 em testes de Força/Agilidade (acumula). Equipamentos: Teste de Vontade DT 20 ou sofre 1d6 de dano de sanidade.',
  },
];


export function getProficienciaById(id: ProficienciaType | string): ProficienciaData | undefined {
  return PROFICIENCIAS.find(p => p.id === id);
}

export function getProficienciasByCategoria(categoria: 'arma' | 'protecao' | 'item_amaldicoado'): ProficienciaData[] {
  return PROFICIENCIAS.filter(p => p.categoria === categoria);
}

// Função para verificar se o personagem tem a proficiência (com suporte a subcategorias)
export function temProficiencia(
  proficienciasPersonagem: ProficienciaType[],
  proficienciaRequerida: ProficienciaType | string
): boolean {
  if (proficienciasPersonagem.includes(proficienciaRequerida as ProficienciaType)) {
    return true;
  }

  const profReq = getProficienciaById(proficienciaRequerida);

  if (profReq?.subcategoria) {
    // Se é subcategoria, verifica se tem a categoria pai
    if (profReq.categoria === 'arma') {
      if (proficienciasPersonagem.includes(ProficienciaType.ARMAS_TATICAS)) {
        return true;
      }
    }
  }

  return false;
}
