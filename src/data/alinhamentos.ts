// src/data/alinhamentos.ts - DADOS DOS ALINHAMENTOS

export enum AlinhamentoType {
  LEAL_BOM = 'leal_bom',
  NEUTRO_BOM = 'neutro_bom',
  CAOTICO_BOM = 'caotico_bom',
  LEAL_NEUTRO = 'leal_neutro',
  NEUTRO = 'neutro',
  CAOTICO_NEUTRO = 'caotico_neutro',
  LEAL_MAU = 'leal_mau',
  NEUTRO_MAU = 'neutro_mau',
  CAOTICO_MAU = 'caotico_mau',
}

export interface AlinhamentoData {
  id: AlinhamentoType;
  sigla: string;
  nome: string;
  categoria: 'Bom' | 'Neutro' | 'Mau';
  tendencia: 'Leal' | 'Neutro' | 'Caótico';
  descricao: string;
  exemplo: string;
  cor: string;
  restricao?: string;
}

export const ALINHAMENTOS: AlinhamentoData[] = [
  {
    id: AlinhamentoType.LEAL_BOM,
    sigla: 'LB',
    nome: 'Leal e Bom',
    categoria: 'Bom',
    tendencia: 'Leal',
    cor: '#3b82f6', // Azul
    descricao: 'Pessoas Leais e Bondosas fazem o que é esperado de uma pessoa justa, respeitando a lei e sacrificando-se para ajudar os necessitados. Cumprem suas promessas e dizem a verdade. São intolerantes com o mal; mesmo sendo capazes de perdão e compaixão, acreditam que todo crime precisa ser punido.',
    exemplo: 'Diante de uma criança faminta roubando um pedaço de pão, vai explicar que roubar é errado, comprar comida para ela e sua família, e então levá-la até um guarda da milícia para receber sua punição.'
  },
  {
    id: AlinhamentoType.NEUTRO_BOM,
    sigla: 'NB',
    nome: 'Neutro e Bom',
    categoria: 'Bom',
    tendencia: 'Neutro',
    cor: '#10b981', // Verde
    descricao: 'São pessoas de bom coração, que sentem prazer com a felicidade de outros. Colaboram com as autoridades, mas não se sentem obrigadas a fazê-lo — acham que ajudar o próximo é mais importante que seguir ordens ou leis.',
    exemplo: 'Diante de uma criança faminta roubando um pedaço de pão, ajuda tanto a criança quanto o comerciante roubado. Não tentará punir a criança (talvez apenas dar-lhe um bom susto).'
  },
  {
    id: AlinhamentoType.CAOTICO_BOM,
    sigla: 'CB',
    nome: 'Caótico e Bom',
    categoria: 'Bom',
    tendencia: 'Caótico',
    cor: '#8b5cf6', // Roxo
    descricao: 'São espíritos livres que promovem o bem, mas preferem seguir seus próprios instintos e convicções, em vez de confiar em regras pré-estabelecidas. Não acham errado mentir, trapacear e roubar para trazer bem-estar a outros menos afortunados.',
    exemplo: 'Diante de uma criança roubando pão, ajuda a encobrir a fuga da criança. Pode até orientá-la a roubar de comerciantes ricos e inescrupulosos, e dividir seu roubo com outros famintos.'
  },
  {
    id: AlinhamentoType.LEAL_NEUTRO,
    sigla: 'LN',
    nome: 'Leal e Neutro',
    categoria: 'Neutro',
    tendencia: 'Leal',
    cor: '#0ea5e9', // Ciano
    descricao: 'Pessoas metódicas e disciplinadas, que obedecem às leis e cumprem suas promessas a qualquer custo. Alguns adotam uma disciplina pessoal, enquanto outros tentam impor suas normas a todos. Sua sinceridade pode ser dura; dizem o que pensam, mesmo quando a verdade pode magoar.',
    exemplo: 'Diante de uma criança faminta roubando pão, vai impedir o roubo e avisar a família da criança ou levar a criança às autoridades.'
  },
  {
    id: AlinhamentoType.NEUTRO,
    sigla: 'N',
    nome: 'Neutro',
    categoria: 'Neutro',
    tendencia: 'Neutro',
    cor: '#94a3b8', // Cinza
    descricao: 'Indivíduos indiferentes e fracos em suas convicções, sem grandes preocupações morais. Ou então lutam ativamente pelo equilíbrio entre bem, mal, lei e caos. Usam simples bom senso para tomar decisões, e no geral fazem aquilo que parece ser uma boa ideia.',
    exemplo: 'Diante da criança que rouba pão, uma pessoa verdadeiramente neutra em geral não se envolve, a menos que tenha alguma ligação pessoal com a criança ou o comerciante.'
  },
  {
    id: AlinhamentoType.CAOTICO_NEUTRO,
    sigla: 'CN',
    nome: 'Caótico e Neutro',
    categoria: 'Neutro',
    tendencia: 'Caótico',
    cor: '#f59e0b', // Laranja
    descricao: 'Fazem o que bem entendem, quando bem entendem, sem se importar com o que outros pensam. Valorizam a própria liberdade, mas sem preocupação pela liberdade dos outros. São impacientes e imprevisíveis, mas quase nunca decidem fazer algo que traga prejuízo para si mesmo.',
    exemplo: 'Diante de uma criança roubando pão, faz o que parecer mais divertido. Talvez ajude na fuga da criança, ou aproveite a distração para pegar seu próprio pedaço.'
  },
  {
    id: AlinhamentoType.LEAL_MAU,
    sigla: 'LM',
    nome: 'Leal e Mau',
    categoria: 'Mau',
    tendencia: 'Leal',
    cor: '#dc2626', // Vermelho escuro
    descricao: 'Vilões que acreditam que ordem, tradições e códigos de conduta são mais importantes que liberdade e dignidade. Seguem leis pessoais ou impostas, sentindo-se seguros ao fazê-lo, mesmo causando sofrimento alheio. São metódicos e organizados.',
    exemplo: 'Diante da criança faminta roubando pão, trataria de castigar o pequeno ladrão ali mesmo — ou entregá-lo à milícia para receber a punição mais severa! Levantaria uma tempestade num copo d\'água apenas para ver a criança sofrer.'
  },
  {
    id: AlinhamentoType.NEUTRO_MAU,
    sigla: 'NM',
    nome: 'Neutro e Mau',
    categoria: 'Mau',
    tendencia: 'Neutro',
    cor: '#7c2d12', // Marrom escuro
    descricao: 'São egoístas e mesquinhos, colocando a si mesmos sempre em primeiro lugar. Pegam o que quer, pouco importando quem precisa roubar ou matar. Adotam regras para quebrá-las em seu próprio benefício no minuto seguinte.',
    exemplo: 'Diante da criança roubando pão, ameaça entregá-la à milícia se não obedecer. Pode chantagear seus pais, tomando tudo que possuem, e quando a família achar ter se livrado dele, aparece com os guardas para também ganhar a recompensa.'
  },
  {
    id: AlinhamentoType.CAOTICO_MAU,
    sigla: 'CM',
    nome: 'Caótico e Mau',
    categoria: 'Mau',
    tendencia: 'Caótico',
    cor: '#450a0a', // Vermelho muito escuro
    descricao: 'Verdadeiramente cruéis, tirando prazer do sofrimento alheio. Torturam e matam por diversão. São brutais, violentos e imprevisíveis, capazes de qualquer coisa. É quase impossível que vivam em sociedade. Têm dificuldade em fazer planos e só trabalham em equipe quando obrigados.',
    exemplo: 'Diante da criança roubando pão, irá atacar a criança, o mercador, os guardas, todos, pois só quer ver o circo pegar fogo.',
    restricao: '⚠️ PROIBIDO para personagens de jogadores sem permissão expressa do Mestre e do grupo. Desaconselhável para a maioria das campanhas.'
  },
];

export function getAlinhamentoById(id: AlinhamentoType): AlinhamentoData | undefined {
  return ALINHAMENTOS.find(a => a.id === id);
}

export function getAlinhamentoBySigla(sigla: string): AlinhamentoData | undefined {
  return ALINHAMENTOS.find(a => a.sigla === sigla);
}
