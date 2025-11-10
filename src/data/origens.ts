// src/data/origens.ts - COMPLETO COM TODAS AS ORIGENS

export interface OrigemData {
  id: string;
  nome: string;
  descricao: string;
  periciasTreinadas: string[];
  periciasEscolha?: {
    opcoes: string[];
    quantidade: number;
  };
  requisitos?: string[];
  habilidadeEspecial: string;
}

export const ORIGENS: OrigemData[] = [
  {
    id: 'academico',
    nome: 'Acadêmico',
    descricao: 'Pesquisador ou professor universitário cujos estudos tocaram em assuntos misteriosos.',
    periciasTreinadas: ['Ciências', 'Investigação'],
    habilidadeEspecial: 'Saber é Poder: Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.',
  },
  {
    id: 'agente_saude',
    nome: 'Agente de Saúde',
    descricao: 'Profissional da saúde treinado no atendimento e cuidado de pessoas.',
    periciasTreinadas: ['Intuição', 'Medicina'],
    habilidadeEspecial: 'Técnica Medicinal: Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.',
  },
  {
    id: 'artista',
    nome: 'Artista',
    descricao: 'Ator, músico, escritor, dançarino ou influenciador inspirado por experiências com maldições.',
    periciasTreinadas: ['Artes', 'Enganação'],
    habilidadeEspecial: 'Magnum Opus: Você é famoso por uma de suas obras. Uma vez por missão, pode determinar que um personagem o reconheça. Você recebe +5 em testes de Presença contra aquele personagem.',
  },
  {
    id: 'atleta',
    nome: 'Atleta',
    descricao: 'Competidor em esporte individual ou por equipe com desempenho excepcional.',
    periciasTreinadas: ['Acrobacia', 'Atletismo'],
    habilidadeEspecial: '110%: Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste.',
  },
  {
    id: 'chef',
    nome: 'Chef',
    descricao: 'Cozinheiro amador ou profissional com talento culinário excepcional.',
    periciasTreinadas: ['Fortitude', 'Profissão'],
    habilidadeEspecial: 'Ingrediente Secreto: Em cenas de interlúdio, você pode cozinhar um prato especial. Você e todos os membros do grupo que se alimentarem recebem o benefício de dois pratos.',
  },
  {
    id: 'criminoso',
    nome: 'Criminoso',
    descricao: 'Vivia uma vida fora da lei até ser recrutado pela Escola Técnica Jujutsu.',
    periciasTreinadas: ['Crime', 'Furtividade'],
    habilidadeEspecial: 'O Crime Compensa: No final de uma missão, escolha um item encontrado. Em sua próxima missão, você pode incluí-lo sem que conte em seu limite de itens.',
  },
  {
    id: 'cultista_arrependido',
    nome: 'Cultista Arrependido',
    descricao: 'Ex-membro de um culto que lidava com maldições. Agora luta pelo lado certo.',
    periciasTreinadas: ['Jujutsu', 'Religião'],
    habilidadeEspecial: 'Traços do Outro Lado: Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe.',
  },
  {
    id: 'desgarrado',
    nome: 'Desgarrado',
    descricao: 'Não vivia de acordo com as normas da sociedade. A vida sem confortos o deixou mais forte.',
    periciasTreinadas: ['Fortitude', 'Sobrevivência'],
    habilidadeEspecial: 'Calejado: Você recebe +1 PV por nível.',
  },
  {
    id: 'engenheiro',
    nome: 'Engenheiro',
    descricao: 'Coloca a mão na massa como engenheiro profissional ou inventor de garagem.',
    periciasTreinadas: ['Profissão', 'Tecnologia'],
    habilidadeEspecial: 'Ferramentas Favoritas: Um item a sua escolha (exceto armas) conta como uma categoria abaixo.',
  },
  {
    id: 'executivo',
    nome: 'Executivo',
    descricao: 'Trabalhador de escritório que descobriu algo que não devia.',
    periciasTreinadas: ['Diplomacia', 'Profissão'],
    habilidadeEspecial: 'Processo Otimizado: Sempre que faz um teste de perícia durante um teste estendido ou para revisar documentos, pode pagar 2 PE para receber +5.',
  },
  {
    id: 'magnata',
    nome: 'Magnata',
    descricao: 'Possui muito dinheiro ou patrimônio. Herdeiro de família antiga ou vencedor de loteria amaldiçoada.',
    periciasTreinadas: ['Diplomacia', 'Pilotagem'],
    habilidadeEspecial: 'Patrocinador da Escola: Seu limite de crédito é sempre considerado um acima do atual.',
  },
  {
    id: 'mercenario',
    nome: 'Mercenário',
    descricao: 'Soldado de aluguel acostumado com escoltas e assassinatos.',
    periciasTreinadas: ['Iniciativa', 'Intimidação'],
    habilidadeEspecial: 'Posição de Combate: No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.',
  },
  {
    id: 'militar',
    nome: 'Militar',
    descricao: 'Serviu em força militar e se tornou perito no uso de armas de fogo.',
    periciasTreinadas: ['Pontaria', 'Tática'],
    habilidadeEspecial: 'Para Bellum: Você recebe +2 em rolagens de dano com armas de fogo.',
  },
  {
    id: 'operario',
    nome: 'Operário',
    descricao: 'Trabalhou em emprego braçal com visão pragmática do mundo.',
    periciasTreinadas: ['Fortitude', 'Profissão'],
    habilidadeEspecial: 'Ferramenta de Trabalho: Escolha uma arma simples ou tática que poderia ser ferramenta em sua profissão. Você recebe +1 em testes de ataque, dano e margem de ameaça com ela.',
  },
  {
    id: 'policial',
    nome: 'Policial',
    descricao: 'Membro de força de segurança que se deparou com uma maldição.',
    periciasTreinadas: ['Percepção', 'Pontaria'],
    habilidadeEspecial: 'Patrulha: Você recebe +2 em Defesa.',
  },
  {
    id: 'religioso',
    nome: 'Religioso',
    descricao: 'Devoto ou sacerdote que se dedica a auxiliar pessoas com problemas espirituais.',
    periciasTreinadas: ['Religião', 'Vontade'],
    habilidadeEspecial: 'Acalentar: Você recebe +5 em testes de Religião para acalmar. Quando acalma uma pessoa, ela recebe 1d6 + sua Presença de Sanidade.',
  },
  {
    id: 'servidor_publico',
    nome: 'Servidor Público',
    descricao: 'Carreira em órgão do governo. Descobriu corrupção ligada a maldições.',
    periciasTreinadas: ['Intuição', 'Vontade'],
    habilidadeEspecial: 'Espírito Cívico: Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2.',
  },
  {
    id: 'teorico_conspiração',
    nome: 'Teórico da Conspiração',
    descricao: 'Investigou teorias da conspiração até esbarrar em maldições reais.',
    periciasTreinadas: ['Investigação', 'Jujutsu'],
    habilidadeEspecial: 'Eu Já Sabia: Você não se abala com maldições ou anomalias. Você recebe resistência a dano mental igual ao seu Intelecto.',
  },
  {
    id: 'ti',
    nome: 'T.I.',
    descricao: 'Programador ou engenheiro de software com talento para sistemas informatizados.',
    periciasTreinadas: ['Investigação', 'Tecnologia'],
    habilidadeEspecial: 'Motor de Busca: Sempre que tiver acesso a internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por Tecnologia.',
  },
  {
    id: 'trabalhador_rural',
    nome: 'Trabalhador Rural',
    descricao: 'Trabalhou no campo ou áreas isoladas. Acostumado com natureza e animais.',
    periciasTreinadas: ['Adestramento', 'Sobrevivência'],
    habilidadeEspecial: 'Desbravador: Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5. Não sofre penalidade por terreno difícil.',
  },
  {
    id: 'trambiqueiro',
    nome: 'Trambiqueiro',
    descricao: 'Vivia de golpes, jogatina ilegal e falcatruas.',
    periciasTreinadas: ['Crime', 'Enganação'],
    habilidadeEspecial: 'Impostor: Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por Enganação.',
  },
  {
    id: 'universitario',
    nome: 'Universitário',
    descricao: 'Aluno de faculdade que descobriu algo amaldiçoado na biblioteca do campus.',
    periciasTreinadas: ['Atualidades', 'Investigação'],
    habilidadeEspecial: 'Dedicação: Você recebe +1 PE, e mais 1 PE adicional a cada nível ímpar (3, 5, 7...). Seu limite de PE por turno aumenta em 1.',
  },
  {
    id: 'vitima',
    nome: 'Vítima',
    descricao: 'Encontrou maldições no passado. A experiência foi traumática mas decidiu lutar.',
    periciasTreinadas: ['Reflexos', 'Vontade'],
    habilidadeEspecial: 'Cicatrizes Psicológicas: Você recebe +1 de Sanidade por nível.',
  },
  {
    id: 'mestre_maldicoes',
    nome: 'Mestre de Maldições',
    descricao: 'Ex-terrorista que cometia crimes contra a sociedade Jujutsu. Algo te tirou dessa vida.',
    periciasTreinadas: ['Jujutsu', 'Intimidação'],
    habilidadeEspecial: 'Vivência: Sempre que identificar que está investigando algo relacionado a um mestre de maldição, tem vantagem de +1d20 em Investigação, Percepção e Intuição.',
  },
  {
    id: 'prodigio_cla',
    nome: 'Prodígio do Clã',
    descricao: 'Venceu a loteria genética! Nasceu respeitado dentro e fora do seu clã.',
    periciasTreinadas: ['Jujutsu'],
    periciasEscolha: {
      opcoes: ['Luta', 'Pontaria'],
      quantidade: 1,
    },
    requisitos: ['Ser membro de um dos 3 grandes clãs', 'Receber uma técnica inata hereditária'],
    habilidadeEspecial: 'Queridinho: Inicia a jornada com 30 de prestígio de Clã.',
  },
  {
    id: 'renegado',
    nome: 'Renegado',
    descricao: 'Não venceu a loteria genética. Percebeu as tradições injustas do seu clã e o negou.',
    periciasTreinadas: ['Vontade', 'Sobrevivência'],
    requisitos: ['Ser membro de um dos 3 grandes clãs', 'NÃO receber uma técnica inata hereditária'],
    habilidadeEspecial: 'Ovelha-negra: Inicia com -50 de prestígio de Clã, porém recebe bônus nas rolagens e dano contra membros dos três grandes Clãs.',
  },
];
