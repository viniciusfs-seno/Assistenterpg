// src/types/character.ts

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
  { nome: 'Acrobacia', atributoBase: 'agilidade' as const, treinada: false, kit: false, carga: true },
  { nome: 'Adestramento', atributoBase: 'presenca' as const, treinada: true, kit: false, carga: false },
  { nome: 'Artes', atributoBase: 'presenca' as const, treinada: false, kit: false, carga: false },
  { nome: 'Atletismo', atributoBase: 'forca' as const, treinada: false, kit: false, carga: true },
  { nome: 'Atualidades', atributoBase: 'intelecto' as const, treinada: false, kit: false, carga: false },
  { nome: 'Ciências', atributoBase: 'intelecto' as const, treinada: true, kit: false, carga: false },
  { nome: 'Crime', atributoBase: 'agilidade' as const, treinada: true, kit: true, carga: false },
  { nome: 'Diplomacia', atributoBase: 'presenca' as const, treinada: false, kit: false, carga: false },
  { nome: 'Enganação', atributoBase: 'presenca' as const, treinada: false, kit: false, carga: false },
  { nome: 'Fortitude', atributoBase: 'vigor' as const, treinada: false, kit: false, carga: true },
  { nome: 'Furtividade', atributoBase: 'agilidade' as const, treinada: false, kit: false, carga: true },
  { nome: 'Iniciativa', atributoBase: 'agilidade' as const, treinada: false, kit: false, carga: true },
  { nome: 'Intimidação', atributoBase: 'presenca' as const, treinada: false, kit: false, carga: false },
  { nome: 'Intuição', atributoBase: 'presenca' as const, treinada: false, kit: false, carga: false },
  { nome: 'Investigação', atributoBase: 'intelecto' as const, treinada: false, kit: false, carga: false },
  { nome: 'Jujutsu', atributoBase: 'intelecto' as const, treinada: true, kit: false, carga: false },
  { nome: 'Luta', atributoBase: 'forca' as const, treinada: false, kit: false, carga: true },
  { nome: 'Medicina', atributoBase: 'intelecto' as const, treinada: true, kit: true, carga: false },
  { nome: 'Percepção', atributoBase: 'presenca' as const, treinada: false, kit: false, carga: false },
  { nome: 'Pilotagem', atributoBase: 'agilidade' as const, treinada: true, kit: false, carga: false },
  { nome: 'Pontaria', atributoBase: 'agilidade' as const, treinada: false, kit: false, carga: true },
  { nome: 'Profissão', atributoBase: 'intelecto' as const, treinada: true, kit: false, carga: false },
  { nome: 'Reflexos', atributoBase: 'agilidade' as const, treinada: false, kit: false, carga: true },
  { nome: 'Religião', atributoBase: 'presenca' as const, treinada: true, kit: false, carga: false },
  { nome: 'Sobrevivência', atributoBase: 'intelecto' as const, treinada: false, kit: false, carga: false },
  { nome: 'Tática', atributoBase: 'intelecto' as const, treinada: true, kit: false, carga: false },
  { nome: 'Vontade', atributoBase: 'presenca' as const, treinada: false, kit: false, carga: false },
];

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
  
  // Combate
  defesa: number;
  defesaBase: number; // 10 + AGI
  defesaEquipamento: number;
  defesaOutros: number;
  
  rd: number;
  rdEquipamento: number;
  rdOutros: number;
  
  // Movimento
  deslocamento: number;
  
  // Limite por rodada
  limitePE_EA: number; // = nivel
  
  // Estados críticos
  morrendo: number; // 0-4
  enlouquecendo: number; // 0-3
}

// Fórmulas de cálculo por classe
export const CLASS_STATS = {
  combatente: {
    pvInicial: 20,
    pvPorNivel: (vig: number) => 4 + vig,
    peInicial: 3,
    pePorNivel: (pre: number) => 3 + pre,
    eaInicial: 3,
    eaPorNivel: (intOuPre: number) => 3 + intOuPre,
    sanInicial: 12,
    sanPorNivel: 3,
  },
  sentinela: {
    pvInicial: 16,
    pvPorNivel: (vig: number) => 2 + vig,
    peInicial: 3,
    pePorNivel: (pre: number) => 3 + pre,
    eaInicial: 4,
    eaPorNivel: (intOuPre: number) => 4 + intOuPre,
    sanInicial: 12,
    sanPorNivel: 4,
  },
  especialista: {
    pvInicial: 16,
    pvPorNivel: (vig: number) => 3 + vig,
    peInicial: 3,
    pePorNivel: (pre: number) => 3 + pre,
    eaInicial: 4,
    eaPorNivel: (intOuPre: number) => 4 + intOuPre,
    sanInicial: 16,
    sanPorNivel: 4,
  },
} as const;

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
  origemId: string;
  
  // Jujutsu
  cla: ClaType;
  tecnicaInataId: string;
  
  // Características (calculadas mas salvas para performance)
  stats: CharacterStats;
  
  // Prestígio
  grauFeiticeiro: GrauFeiticeiro;
  pontosPrestígio: number;
  prestigioCla?: number; // apenas para 3 grandes clãs
  
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

export interface CharacterSpell {
  id: string;
  characterId: string;
  spellCategory: 'tecnica_amaldicoada' | 'barreira' | 'reversa' | 'anti_barreira' | 'shikigami';
  spellName: string;
  grauAprimoramento: number; // 0-5
}

export interface CharacterInventoryItem {
  id: string;
  characterId: string;
  equipmentId: string;
  quantidade: number;
  equipado: boolean;
}

export interface CharacterProficiency {
  id: string;
  characterId: string;
  proficiencyType: 'armas_simples' | 'armas_taticas' | 'armas_pesadas' | 'armas_amaldicoadas';
}

// ============= HELPERS DE CÁLCULO =============

export function calcularStats(
  nivel: number,
  classe: ClasseType,
  atributos: Attributes,
  poderes: CharacterPower[],
  equipamentos: CharacterInventoryItem[]
): CharacterStats {
  const classStats = CLASS_STATS[classe];
  
  // Calcular máximos
  const pvMax = classStats.pvInicial + atributos.vigor + 
                (classStats.pvPorNivel(atributos.vigor) * (nivel - 1));
  
  const peMax = classStats.peInicial + atributos.presenca + 
                (classStats.pePorNivel(atributos.presenca) * (nivel - 1));
  
  const intOuPre = Math.max(atributos.intelecto, atributos.presenca);
  const eaMax = classStats.eaInicial + intOuPre + 
                (classStats.eaPorNivel(intOuPre) * (nivel - 1));
  
  const sanMax = classStats.sanInicial + (classStats.sanPorNivel * (nivel - 1));
  
  // Defesa base
  const defesaBase = 10 + atributos.agilidade;
  
  return {
    pvAtual: pvMax,
    pvMax,
    peAtual: peMax,
    peMax,
    eaAtual: eaMax,
    eaMax,
    sanAtual: sanMax,
    sanMax,
    defesa: defesaBase,
    defesaBase,
    defesaEquipamento: 0, // calcular baseado em equipamentos
    defesaOutros: 0,
    rd: 0,
    rdEquipamento: 0,
    rdOutros: 0,
    deslocamento: 9,
    limitePE_EA: nivel,
    morrendo: 0,
    enlouquecendo: 0,
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
  cla?: ClaType;
  descricao: string;
  // passiva foi REMOVIDO (não existe mais)
}

export interface PoderClasseData {
  id: string;
  nome: string;
  descricao: string;
  prerequisitos: string[];
}
