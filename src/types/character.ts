// src/types/character.ts - COMPLETO E CORRIGIDO

import { calcularBonusPoderes } from '../utils/poderEffects';
import { calcularStats as calcularStatsImpl, CalculatedStats } from '../utils/statsCalculator';

// ============= ENUMS E CONSTANTES =============

export enum ClasseType {
  COMBATENTE = 'combatente',
  SENTINELA = 'sentinela',
  ESPECIALISTA = 'especialista',
}

export enum TrilhaType {
  // Combatente
  ANIQUILADOR = 'aniquilador',
  GUERREIRO = 'guerreiro',
  OPERACOES_ESPECIAIS = 'operacoes_especiais',
  TROPA_CHOQUE = 'tropa_choque',
  ARMA_MALDITA = 'arma_maldita',
  // Sentinela
  BRIGADEIRO = 'brigadeiro',
  ATIRADOR_ELITE = 'atirador_elite',
  CONDUITE = 'conduite',
  COMANDANTE_CAMPO = 'comandante_campo',
  ESPECIALISTA_SHIKIGAMI = 'especialista_shikigami',
  // Especialista
  INFILTRADOR = 'infiltrador',
  MEDICO_CAMPO = 'medico_campo',
  TECNICO = 'tecnico',
  GRADUADO = 'graduado',
  FLAGELADOR = 'flagelador',
  MESTRE_BARREIRAS = 'mestre_barreiras',
}

export enum ClaType {
  // Três Grandes Clãs
  GOJO = 'gojo',
  ZENIN = 'zenin',
  KAMO = 'kamo',
  // Outros Clãs
  OKKOTSU = 'okkotsu',
  INUMAKI = 'inumaki',
  KUGISAKI = 'kugisaki',
  SUGURU = 'suguru',
  KASUMI = 'kasumi',
  FUJIWARA = 'fujiwara',
  IJICHI = 'ijichi',
  HASABA = 'hasaba',
  KINJI = 'kinji',
  RYOMEN = 'ryomen',
  KENTO = 'kento',
  RAM = 'ram',
  HAGANEZUKA = 'haganezuka',
  SEM_CLA = 'sem_cla',
}

export enum GrauFeiticeiro {
  GRAU_4 = 'grau_4',
  GRAU_3 = 'grau_3',
  GRAU_2 = 'grau_2',
  GRAU_SEMI_1 = 'grau_semi_1',
  GRAU_1 = 'grau_1',
  GRAU_ESPECIAL = 'grau_especial',
}

export enum GrauTreinamento {
  DESTREINADO = 0,
  TREINADO = 5,
  GRADUADO = 10,
  VETERANO = 15,
  EXPERT = 20,
}

// ✅ CORRIGIDO: Proficiências expandidas
export enum ProficienciaType {
  // Armas Base
  ARMAS_SIMPLES = 'armas_simples',
  ARMAS_TATICAS = 'armas_taticas',
  ARMAS_PESADAS = 'armas_pesadas',

  // ✅ NOVO: Subcategorias de Armas Táticas
  ARMAS_TATICAS_CORPO_A_CORPO = 'armas_taticas_corpo_a_corpo',
  ARMAS_TATICAS_DISPARO = 'armas_taticas_disparo',
  ARMAS_TATICAS_FOGO = 'armas_taticas_fogo',

  // ✅ NOVO: Armas Amaldiçoadas
  ARMAS_AMALDICOADAS = 'armas_amaldicoadas',

  // Proteções
  PROTECOES_LEVES = 'protecoes_leves',
  PROTECOES_PESADAS = 'protecoes_pesadas',

  // Itens Amaldiçoados
  ITENS_AMALDICOADOS = 'itens_amaldicoados',
}

// NOVOS ENUMS PARA PRESTÍGIO
export enum LimiteCredito {
  BAIXO = 'baixo',
  MEDIO = 'medio',
  ALTO = 'alto',
  ILIMITADO = 'ilimitado',
}

export enum PrestigioClaClassificacao {
  NENHUM = 'nenhum',
  BAIXO = 'baixo',
  MEDIO = 'medio',
  ALTO = 'alto',
  LIDER = 'lider',
}

// ============= NOVO: CATEGORIAS DE TÉCNICAS BÁSICAS =============

export enum CategoriaTecnica {
  TECNICA_AMALDICOADA = 'tecnica_amaldicoada',
  BARREIRA = 'barreira',
  REVERSA = 'reversa',
  ANTI_BARREIRA = 'anti_barreira',
  SHIKIGAMI = 'shikigami',
  TECNICAS_SECRETAS = 'tecnicas_secretas', // ✅ NOVO
}

// ============= ATRIBUTOS =============

export interface Attributes {
  agilidade: number; // 0-7
  forca: number;
  intelecto: number;
  presenca: number;
  vigor: number;
}

// ============= PERÍCIAS =============

export interface Skill {
  nome: string;
  atributoBase: keyof Attributes;
  grau: GrauTreinamento;
  outros: number; // bônus de poderes, equipamentos, etc
}

// Lista completa das 27 perícias
export const PERICIAS_BASE = [
  { nome: 'Acrobacia', atributoBase: 'agilidade' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Adestramento', atributoBase: 'presenca' as const, somenteComTreinamento: true, kit: false, carga: false },
  { nome: 'Artes', atributoBase: 'presenca' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Atletismo', atributoBase: 'forca' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Atualidades', atributoBase: 'intelecto' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Ciências', atributoBase: 'intelecto' as const, somenteComTreinamento: true, kit: false, carga: false },
  { nome: 'Crime', atributoBase: 'agilidade' as const, somenteComTreinamento: true, kit: true, carga: false },
  { nome: 'Diplomacia', atributoBase: 'presenca' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Enganação', atributoBase: 'presenca' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Fortitude', atributoBase: 'vigor' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Furtividade', atributoBase: 'agilidade' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Iniciativa', atributoBase: 'agilidade' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Intimidação', atributoBase: 'presenca' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Intuição', atributoBase: 'presenca' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Investigação', atributoBase: 'intelecto' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Jujutsu', atributoBase: 'intelecto' as const, somenteComTreinamento: true, kit: false, carga: false },
  { nome: 'Luta', atributoBase: 'forca' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Medicina', atributoBase: 'intelecto' as const, somenteComTreinamento: true, kit: true, carga: false },
  { nome: 'Percepção', atributoBase: 'presenca' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Pilotagem', atributoBase: 'agilidade' as const, somenteComTreinamento: true, kit: false, carga: false },
  { nome: 'Pontaria', atributoBase: 'agilidade' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Profissão', atributoBase: 'intelecto' as const, somenteComTreinamento: true, kit: false, carga: false },
  { nome: 'Reflexos', atributoBase: 'agilidade' as const, somenteComTreinamento: false, kit: false, carga: true },
  { nome: 'Religião', atributoBase: 'presenca' as const, somenteComTreinamento: true, kit: false, carga: false },
  { nome: 'Sobrevivência', atributoBase: 'intelecto' as const, somenteComTreinamento: false, kit: false, carga: false },
  { nome: 'Tática', atributoBase: 'intelecto' as const, somenteComTreinamento: true, kit: false, carga: false },
  { nome: 'Vontade', atributoBase: 'presenca' as const, somenteComTreinamento: false, kit: false, carga: false },
];

// Helper que inicializa todas as perícias com grau adequado para personagem novo
export function gerarMapaPericiaGrados(periciasTreinadas: string[]): { [nome: string]: GrauTreinamento } {
  const mapa: { [nome: string]: GrauTreinamento } = {};
  for (const pericia of PERICIAS_BASE) {
    mapa[pericia.nome] = periciasTreinadas.includes(pericia.nome) ? GrauTreinamento.TREINADO : GrauTreinamento.DESTREINADO;
  }
  return mapa;
}

// ============= PRESTÍGIO =============

export interface LimiteItens {
  categoria4: number;
  categoria3: number;
  categoria2: number;
  categoria1: number;
  especial: number;
}

export interface BeneficiosPrestigio {
  grauFeiticeiro: GrauFeiticeiro;
  grauFeiticeiroLabel: string;
  limiteCredito: LimiteCredito;
  limiteCreditoLabel: string;
  limiteItens: LimiteItens;
}

// ============= CARACTERÍSTICAS DERIVADAS =============

export interface CharacterStats {
  // Recursos
  pvAtual: number;
  pvMax: number;
  peAtual: number;
  peMax: number;
  eaAtual: number;
  eaMax: number;
  sanAtual: number;
  sanMax: number;

  // Combate - Defesa Detalhada
  defesa: number; // Total
  defesaBase: number; // 10 + AGI
  defesaEquipamento: number;
  defesaOutros: number;

  // RD (Redução de Dano)
  rd: number; // Total
  rdEquipamento: number;
  rdOutros: number;

  // Movimento
  deslocamento: number;

  // Limite por rodada (CORRIGIDO)
  limitePE_EA: number; // = nivel

  // Estados críticos
  morrendo: number; // 0-4
  enlouquecendo: number; // 0-3
}

// ============= FICHA COMPLETA =============

export interface Character {
  // Identidade
  id: string;
  userId: string;
  nome: string;
  idade?: number;
  descricao?: string;
  avatarUrl?: string;
  jogador?: string;
  alinhamento?: string;

  // Sistema Base
  atributos: Attributes;
  nivel: number; // 1-20
  classe: ClasseType;
  trilha?: TrilhaType; // null até nível 2
  subcaminhoMestreBarreiras?: string; // apenas para Mestre de Barreiras
  origemId: string;
  proficiencias?: ProficienciaType[];

  // Jujutsu
  cla: ClaType;
  tecnicaInataId: string;

  // NOVO: Escolha do atributo para cálculo de EA
  atributoEA: 'intelecto' | 'presenca';

  // NOVO: Se estudou na Escola Técnica Jujutsu (ganha perícia Jujutsu de graça)
  estudouEscolaTecnica?: boolean;

  // Características (calculadas mas salvas para performance)
  stats: CharacterStats;

  // Grau de treinamento de todas as perícias
  periciaGrados: { [nome: string]: GrauTreinamento };
  // Bônus extras (opcional, pode ser omitido)
  periciasBonusExtra?: { [pericia: string]: number };

  // Prestígio
  grauFeiticeiro: GrauFeiticeiro;
  pontosPrestígio: number;
  prestigioCla?: number; // apenas para 3 grandes clãs

  // Poderes de classe
  poderesIds: string[]; // IDs dos poderes escolhidos

  // NOVO: Técnicas Básicas (Graus de Aprimoramento)
  tecnicasBasicas: { [categoria in CategoriaTecnica]: number }; // categoria → grau (0-5)

  // Meta
  createdAt: string;
  updatedAt: string;
}

// ============= TABELAS RELACIONADAS =============

export interface CharacterSkill {
  id: string;
  characterId: string;
  skillName: string;
  grauTreinamento: GrauTreinamento;
  outros: number; // bônus extras
}

export interface CharacterPower {
  id: string;
  characterId: string;
  powerId: string;
  nivelObtido: number;
}

// ATUALIZADO: Interface para técnicas básicas
export interface CharacterTechnique {
  id: string;
  characterId: string;
  categoria: CategoriaTecnica;
  grauAprimoramento: number; // 0-5
}

export interface CharacterInventoryItem {
  id: string;
  characterId: string;
  equipmentId: string;
  item?: any; // ✅ FUTURO: Tipagem completa de Item
  quantidade: number;
  equipado: boolean;
}

export interface CharacterProficiency {
  id: string;
  characterId: string;
  proficiencyType: ProficienciaType;
}

// ============= HELPERS DE CÁLCULO =============

/**
 * Calcula todos os stats do personagem
 * ✅ CORRIGIDO: Usa implementação de statsCalculator.ts
 */
export function calcularStats(
  nivel: number,
  classe: ClasseType,
  atributos: Attributes,
  atributoEA: 'intelecto' | 'presenca',
  poderesIds: string[] = [],
  equipamentos: CharacterInventoryItem[] = []
): CharacterStats {
  console.log('🔄 [character.ts] Chamando calcularStats', {
    nivel,
    classe,
    atributos,
    atributoEA,
    poderesIds,
    equipamentos: equipamentos.length
  });

  // GrauFeiticeiro placeholder (mantido por compatibilidade, não usado no cálculo)
  const grauFeiticeiro = GrauFeiticeiro.GRAU_4;

  // ✅ Chamar implementação real de statsCalculator.ts
  // Equipamentos serão calculados automaticamente pela função
  const stats: CalculatedStats = calcularStatsImpl(
    classe,
    nivel,
    atributos,
    grauFeiticeiro,
    atributoEA,
    equipamentos, // ✅ Já preparado para suportar equipamentos
    0, // defesaEquipamento (calculado automaticamente)
    0, // defesaOutros
    0, // rdEquipamento (calculado automaticamente)
    0  // rdOutros
  );

  console.log('✅ [character.ts] Stats calculados', stats);

  // Converter CalculatedStats para CharacterStats (são compatíveis)
  return {
    pvAtual: stats.pvAtual,
    pvMax: stats.pvMax,
    peAtual: stats.peAtual,
    peMax: stats.peMax,
    eaAtual: stats.eaAtual,
    eaMax: stats.eaMax,
    sanAtual: stats.sanAtual,
    sanMax: stats.sanMax,
    defesa: stats.defesa,
    defesaBase: stats.defesaBase,
    defesaEquipamento: stats.defesaEquipamento,
    defesaOutros: stats.defesaOutros,
    rd: stats.rd,
    rdEquipamento: stats.rdEquipamento,
    rdOutros: stats.rdOutros,
    deslocamento: stats.deslocamento,
    limitePE_EA: stats.limitePE_EA,
    morrendo: Math.floor(stats.pvMax / 2),
    enlouquecendo: Math.floor(stats.sanMax / 2),
  };
}

// ============= HELPERS PARA TÉCNICAS =============

/**
 * Calcula quantos pontos de aprimoramento o personagem tem disponível
 * Ganha 1 ponto nos níveis: 2, 8, 14, 18
 */
export function calcularPontosAprimoramentoDisponiveis(nivel: number): number {
  const niveisComPonto = [2, 8, 14, 18];
  return niveisComPonto.filter(n => nivel >= n).length;
}

/**
 * Inicializa técnicas básicas com grau 0
 */
export function inicializarTecnicasBasicas(): { [categoria in CategoriaTecnica]: number } {
  return {
    [CategoriaTecnica.TECNICA_AMALDICOADA]: 0,
    [CategoriaTecnica.BARREIRA]: 0,
    [CategoriaTecnica.REVERSA]: 0,
    [CategoriaTecnica.ANTI_BARREIRA]: 0,
    [CategoriaTecnica.SHIKIGAMI]: 0,
    [CategoriaTecnica.TECNICAS_SECRETAS]: 0, // ✅ NOVO
  };
}

// ============= DADOS ESTÁTICOS =============

export interface OrigemData {
  id: string;
  nome: string;
  descricao: string;
  periciasTreinadas: string[];
  habilidadeEspecial: string;
  requisitos?: string[];
}

export interface TecnicaInataData {
  id: string;
  nome: string;
  tipo: 'hereditaria' | 'nao_hereditaria';
  cla: ClaType | ClaType[] | null;
  descricao: string;
  requisitos?: string;
}
