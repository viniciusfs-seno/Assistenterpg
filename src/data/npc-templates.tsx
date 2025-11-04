export interface NPCTemplate {
  name: string;
  initiative: number;
  maxHealth: number;
  maxStamina: number;
  description: string;
  category: 'common' | 'elite' | 'boss';
}

export const npcTemplates: NPCTemplate[] = [
  // Common enemies
  {
    name: 'Goblin',
    initiative: 12,
    maxHealth: 15,
    maxStamina: 10,
    description: 'Criatura pequena e astuta',
    category: 'common',
  },
  {
    name: 'Esqueleto',
    initiative: 10,
    maxHealth: 20,
    maxStamina: 5,
    description: 'Morto-vivo sem mente',
    category: 'common',
  },
  {
    name: 'Lobo',
    initiative: 14,
    maxHealth: 18,
    maxStamina: 15,
    description: 'Predador selvagem',
    category: 'common',
  },
  {
    name: 'Bandido',
    initiative: 11,
    maxHealth: 25,
    maxStamina: 12,
    description: 'Criminoso comum',
    category: 'common',
  },
  {
    name: 'Zumbi',
    initiative: 6,
    maxHealth: 30,
    maxStamina: 5,
    description: 'Morto-vivo lento mas resistente',
    category: 'common',
  },
  
  // Elite enemies
  {
    name: 'Orc Guerreiro',
    initiative: 13,
    maxHealth: 50,
    maxStamina: 25,
    description: 'Guerreiro brutal e forte',
    category: 'elite',
  },
  {
    name: 'Lobisomem',
    initiative: 16,
    maxHealth: 60,
    maxStamina: 30,
    description: 'Metamorfo feroz',
    category: 'elite',
  },
  {
    name: 'Cavaleiro Negro',
    initiative: 14,
    maxHealth: 70,
    maxStamina: 35,
    description: 'Guerreiro amaldiçoado',
    category: 'elite',
  },
  {
    name: 'Mago Sombrio',
    initiative: 15,
    maxHealth: 45,
    maxStamina: 50,
    description: 'Conjurador das trevas',
    category: 'elite',
  },
  {
    name: 'Troll',
    initiative: 9,
    maxHealth: 80,
    maxStamina: 20,
    description: 'Gigante regenerador',
    category: 'elite',
  },
  
  // Boss enemies
  {
    name: 'Dragão Vermelho',
    initiative: 18,
    maxHealth: 200,
    maxStamina: 80,
    description: 'Dragão antigo e poderoso',
    category: 'boss',
  },
  {
    name: 'Lich',
    initiative: 17,
    maxHealth: 150,
    maxStamina: 100,
    description: 'Necromante imortal',
    category: 'boss',
  },
  {
    name: 'Demônio Maior',
    initiative: 19,
    maxHealth: 180,
    maxStamina: 90,
    description: 'Entidade do plano inferior',
    category: 'boss',
  },
  {
    name: 'Hidra',
    initiative: 14,
    maxHealth: 220,
    maxStamina: 60,
    description: 'Besta de múltiplas cabeças',
    category: 'boss',
  },
  {
    name: 'Golem de Ferro',
    initiative: 8,
    maxHealth: 250,
    maxStamina: 40,
    description: 'Construto indestrutível',
    category: 'boss',
  },
];
