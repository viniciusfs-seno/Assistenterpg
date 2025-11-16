// src/data/trilhas.ts

import { TrilhaType, ClasseType } from '../types/character';

export interface HabilidadeTrilha {
  nivel: number;
  nome: string;
  descricao: string;
}

export interface TrilhaData {
  id: TrilhaType;
  nome: string;
  classe: ClasseType;
  descricao: string;
  requisitos?: string;
  habilidades: HabilidadeTrilha[];
  subcaminhos?: {
    id: string;
    nome: string;
    descricao: string;
    habilidades: HabilidadeTrilha[];
  }[];
}

export const TRILHAS: TrilhaData[] = [
  // ==================== COMBATENTE ====================
  {
    id: 'aniquilador',
    nome: 'Aniquilador',
    classe: 'combatente',
    descricao: 'Você é treinado para abater alvos com eficiência e velocidade. Suas armas são suas melhores amigas e você cuida tão bem delas quanto de seus companheiros de equipe. Talvez até melhor.',
    habilidades: [
      {
        nivel: 2,
        nome: 'A Favorita',
        descricao: 'Escolha uma arma de até alcance curto para ser sua favorita, como katana ou uma escopeta. A categoria da arma escolhida é reduzida em I, podendo alterar A Favorita uma entre missões ou em interlúdios especiais.',
      },
      {
        nivel: 8,
        nome: 'Técnica Secreta',
        descricao: 'A categoria da arma favorita passa a ser reduzida em II. Quando faz um ataque com ela, você pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Você pode adicionar mais efeitos gastando +2 PE por efeito adicional.\n\nAmplo: O ataque pode atingir um alvo adicional em seu alcance e adjacente ao original (use o mesmo teste de ataque para ambos).\n\nMaldição poderosa: Se revestir a arma com energia amaldiçoada, aumenta um passo dos dados de dano da arma (ex: 1d6 -> 1d8).\n\nDestruidor: Aumenta o multiplicador de crítico da arma em +1.',
      },
      {
        nivel: 13,
        nome: 'Técnica Sublime',
        descricao: 'Você adiciona os seguintes efeitos à lista de sua Técnica Secreta:\n\nLetal: Aumenta a margem de ameaça em +2. Você pode escolher este efeito duas vezes para aumentar a margem de ameaça em +5.\n\nPerfurante: Ignora até 5 pontos de resistência a dano de qualquer tipo do alvo.\n\nEnergia extra: Pode adicionar +1 acúmulo de energia amaldiçoada na arma ignorando pre-requisitos e o gasto de energia amaldiçoada.',
      },
      {
        nivel: 18,
        nome: 'Máquina de Matar',
        descricao: 'A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.',
      },
    ],
  },
  {
    id: 'guerreiro',
    nome: 'Guerreiro',
    classe: 'combatente',
    descricao: 'Você treinou sua musculatura e movimentos a ponto de transformar seu corpo em uma verdadeira arma. Com golpes corpo a corpo tão poderosos quanto uma bala, você encara os perigos de frente.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Técnica Letal',
        descricao: 'Você recebe um aumento de +2 na margem de ameaça com todos os seus ataques corpo a corpo.',
      },
      {
        nivel: 8,
        nome: 'Revidar',
        descricao: 'Sempre que bloquear um ataque, você pode gastar uma reação e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou.',
      },
      {
        nivel: 13,
        nome: 'Força Opressora',
        descricao: 'Quando acerta um ataque corpo a corpo, você pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como ação livre. Se escolher empurrar, recebe um bônus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, você pode gastar 1 PE para fazer um ataque adicional contra o alvo caído.',
      },
      {
        nivel: 18,
        nome: 'Potência Máxima',
        descricao: 'Quando usa seu Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, você recebe +10 no ataque e +30 no dano.',
      },
    ],
  },
  {
    id: 'operacoes_especiais',
    nome: 'Operações Especiais',
    classe: 'combatente',
    descricao: 'Você é um combatente eficaz. Suas ações são calculadas e otimizadas sempre antevendo os movimentos inimigos e se posicionando da maneira mais inteligente no campo de batalha.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Iniciativa Aprimorada',
        descricao: 'Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada.',
      },
      {
        nivel: 8,
        nome: 'Ataque Extra',
        descricao: 'Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional.',
      },
      {
        nivel: 13,
        nome: 'Surto de Adrenalina',
        descricao: 'Uma vez por rodada, você pode gastar 4 PE para realizar uma ação completa adicional.',
      },
      {
        nivel: 18,
        nome: 'Sempre Alerta',
        descricao: 'Você recebe uma ação completa adicional no início de cada cena de combate e tem +5 em reações.',
      },
    ],
  },
  {
    id: 'tropa_choque',
    nome: 'Tropa de Choque',
    classe: 'combatente',
    descricao: 'Você é duro na queda. Treinou seu corpo para resistir a traumas físicos, tornando-o praticamente inquebrável, e por isso não teme se colocar entre seus aliados e o perigo.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Casca Grossa',
        descricao: 'Você recebe +1 PV para cada Nível e, quando faz um bloqueio, soma seu Vigor na resistência a dano recebida. Além disso, quando se reveste de energia amaldiçoada, recebe +1 na defesa.',
      },
      {
        nivel: 8,
        nome: 'Cai Dentro',
        descricao: 'Sempre que um oponente em alcance curto ataca um de seus aliados, você pode gastar uma reação e 1 PE para fazer com que esse oponente faça um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar você em vez de seu aliado. Este poder só funciona se você puder ser efetivamente atacado e estiver no alcance do ataque (por exemplo, adjacente a um oponente atacando em corpo a corpo ou dentro do alcance de uma arma de ataque à distância). Um oponente que passe no teste de Vontade não pode ser afetado por seu poder Cai Dentro até o final da cena.',
      },
      {
        nivel: 13,
        nome: 'Duro de Matar',
        descricao: 'Ao sofrer dano não Jujutsu, você pode gastar uma reação de 2 PE para reduzir esse dano à metade. Por mais 1 PE você pode usar esta habilidade para reduzir dano de Jujutsu. Além disso, quando se reveste de energia amaldiçoada, recebe +2 na defesa.',
      },
      {
        nivel: 18,
        nome: 'Inquebrável',
        descricao: 'Enquanto estiver machucado, você recebe +5 na Defesa e resistência a dano 5. Enquanto estiver morrendo, em vez do normal, você não fica indefeso e ainda pode realizar ações. Você ainda segue as regras de morte normalmente.',
      },
    ],
  },
  {
    id: 'arma_maldita',
    nome: 'Arma Maldita',
    classe: 'combatente',
    descricao: 'Alguns xamãs preferem ficar fechados em suas bibliotecas estudando livros e feitiços. Outros preferem investigar fenômenos paranormais em sua fonte. Já você, prefere usar o Jujutsu como uma arma. Você aprendeu e dominou técnicas de luta mesclando suas habilidades de conjuração com suas capacidades de combate.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Arma Amaldiçoada',
        descricao: 'Você recebe 1 grau de aprimoramento em Técnica Amaldiçoada. Além disso, quando conjurar um revestimento ofensivo em uma arma, você pode usar apenas Jujutsu, em vez de Luta ou Pontaria, para testes de ataque com a arma amaldiçoada.',
      },
      {
        nivel: 8,
        nome: 'Gladiador Amaldiçoado',
        descricao: 'Sempre que acerta um ataque a curta distância em um inimigo, você recebe 2 PE e 2 EA temporários. Você pode ganhar um máximo de PE/EA temporários por cena igual ao seu limite de PE/EA. PE/EA temporários desaparecem no final da cena.',
      },
      {
        nivel: 13,
        nome: 'Conjuração Marcial',
        descricao: 'Uma vez por rodada, quando você lança um feitiço, pode gastar 2 PE para fazer um ataque a curta distância como uma ação livre.',
      },
      {
        nivel: 18,
        nome: 'Maldição Permanente',
        descricao: 'Faz com que uma arma de curta-distância da sua escolha acumule maldições, não permitindo que a energia amaldiçoada imbuída nela se dissipe após uma cena. O limite de maldições em uma arma depende da categoria dela.',
      },
    ],
  },

  // ==================== SENTINELA ====================
  {
    id: 'brigadeiro',
    nome: 'Brigadeiro',
    classe: 'sentinela',
    descricao: 'Para aqueles que são disciplinados e preferem um combate controlado de média a longa distância, e destruir os alvos sem se arriscar a chegar muito perto, esse é o caminho ideal.',
    habilidades: [
      {
        nivel: 2,
        nome: 'A Favorita',
        descricao: 'Escolha uma arma de alcance médio para ser a sua favorita, como fuzil ou uma metralhadora. A categoria da arma escolhida é reduzida em I.',
      },
      {
        nivel: 8,
        nome: 'Técnica Secreta',
        descricao: 'A categoria da arma favorita passa a ser reduzida em II e perde penalidade das rajadas se for uma arma automática. Quando faz um ataque com ela, você pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Você pode adicionar mais efeitos gastando +2 PE por efeito adicional.\n\nAmplo: O ataque pode atingir um alvo adicional em seu alcance e adjacente ao original (use o mesmo teste de ataque para ambos).\n\nDestruidor: Aumenta o multiplicador de crítico da arma em +1.',
      },
      {
        nivel: 13,
        nome: 'Técnica Sublime',
        descricao: 'Você adiciona os seguintes efeitos à lista de sua Técnica Secreta:\n\nLetal: Aumenta a margem de ameaça em +2. Você pode escolher este efeito duas vezes para aumentar a margem de ameaça em +5.\n\nPerfurante: Ignora até 5 pontos de resistência a dano de qualquer tipo do alvo.',
      },
      {
        nivel: 18,
        nome: 'Máquina de Matar',
        descricao: 'A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.',
      },
    ],
  },
  {
    id: 'atirador_elite',
    nome: 'Atirador de Elite',
    classe: 'sentinela',
    descricao: 'Um tiro, uma morte. Ao contrário dos combatentes, você é perito em neutralizar ameaças de longe, terminando uma briga antes mesmo que ela comece. Você trata sua arma como uma ferramenta de precisão, sendo capaz de executar façanhas incríveis.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Mira de Elite',
        descricao: 'Você recebe proficiência com armas de fogo que usam balas longas e soma seu Intelecto em rolagens de dano com essas armas.',
      },
      {
        nivel: 8,
        nome: 'Disparo Letal',
        descricao: 'Quando faz a ação de mirar você pode gastar 1 PE para aumentar em +2 a margem de ameaça do próximo ataque que fizer até o final de seu próximo turno.',
      },
      {
        nivel: 13,
        nome: 'Disparo Impactante',
        descricao: 'Se estiver usando uma arma de fogo com calibre grosso ou imbuídas de Energia Amaldiçoada você pode gastar 2 PE para fazer as manobras derrubar, desarmar, empurrar e quebrar usando um ataque a distância.',
      },
      {
        nivel: 18,
        nome: 'Atirar para Matar',
        descricao: 'Quando faz um acerto crítico com uma arma de fogo, você causa dano máximo, sem precisar rolar dados.',
      },
    ],
  },
  {
    id: 'conduite',
    nome: 'Conduíte',
    classe: 'sentinela',
    descricao: 'Você domina os aspectos fundamentais da conjuração de feitiços e é capaz de aumentar o alcance e velocidade de suas conjurações. Conforme seu Nível aumenta você se torna capaz de interferir com os feitiços de outros xamãs.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Ampliar feitiço',
        descricao: 'Quando lança um feitiço, você pode gastar +2 EA para aumentar seu alcance em um passo (de curto para médio, de médio para longo ou de longo para extremo) ou aumenta sua área de efeito em ½.',
      },
      {
        nivel: 8,
        nome: 'Acelerar feitiço',
        descricao: 'Uma vez por rodada, você pode aumentar o custo de um feitiço em 2 PE e 2 EA para reduzir o tipo da ação em 1. (ex: ação padrão para ação de movimento).',
      },
      {
        nivel: 13,
        nome: 'Anular feitiço',
        descricao: 'Quando for alvo de um feitiço, você pode gastar uma quantidade de EA e PE igual ao custo pago por esse feitiço e fazer um teste oposto de Jujutsu contra o conjurador. Se vencer, você anula o feitiço, dissipando a energia amaldiçoada, cancelando todos os seus efeitos (só funciona durante a conjuração do feitiço).',
      },
      {
        nivel: 18,
        nome: 'Canalizar o Jujutsu',
        descricao: 'Você é capaz de alterar um feitiço que está sendo conjurado por rodada, podendo aumentar ou reduzir o alcance em um passo, aumentar ou reduzir a quantidade de objetos ou seres afetados em até o dobro ou a metade e aumentar a eficácia do feitiço, seja aumentando o dano ou aprimorando seus efeitos.',
      },
    ],
  },
  {
    id: 'comandante_campo',
    nome: 'Comandante de Campo',
    classe: 'sentinela',
    descricao: 'Sem um oficial, uma batalha não passa de uma briga de bar. Você é treinado para coordenar e auxiliar seus companheiros em combate, tomando decisões rápidas e tirando melhor proveito da situação e do talento de seus aliados.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Inspirar Confiança',
        descricao: 'Sua liderança inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste recém realizado.',
      },
      {
        nivel: 8,
        nome: 'Estrategista',
        descricao: 'Você pode direcionar aliados em alcance médio. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles ganham uma ação de movimento adicional.',
      },
      {
        nivel: 13,
        nome: 'Brecha na Guarda',
        descricao: 'Uma vez por rodada, quando um aliado causar dano em um inimigo que esteja em seu alcance médio, você pode gastar uma reação e 2 PE para que você ou outro aliado em alcance médio faça um ataque adicional contra o mesmo inimigo. Além disso, o número de alvos de Inspirar Confiança aumenta para dois.',
      },
      {
        nivel: 18,
        nome: 'Oficial Comandante',
        descricao: 'Você pode gastar uma ação padrão e 5 PE ou EA para que cada aliado que você possa ver ou falar em alcance médio receba uma ação completa adicional no próximo turno dele.',
      },
    ],
  },
  {
    id: 'especialista_shikigami',
    nome: 'Especialista em Shikigami',
    classe: 'sentinela',
    descricao: 'Xamãs jujutsu costumam ser criaturas muito solitárias, para quebrar esse padrão, os especialistas em Shikigami tem como foco principal criar familiares de energia amaldiçoada com grande variedade de funções e habilidades.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Chamariz',
        descricao: 'Recebe +1 no grau de aprimoramento da Técnica de Shikigami, além de ser capaz de invocar o(s) Shikigamis como ação de movimento.',
      },
      {
        nivel: 8,
        nome: 'O melhor amigo do homem',
        descricao: 'Sempre que está em alcance curto do seu Shikigami, recebe +1d20 em rolagens relacionadas a 2 atributos da escolha do usuário. Além disso, reduz o custo de invocação de um Shikigami (ou enxame) pela metade.',
      },
      {
        nivel: 13,
        nome: 'Sinergia',
        descricao: 'Uma vez por rodada quando seu Shikigami atacar um alvo, um personagem da sua escolha recebe um ataque de oportunidade (contanto que o alvo esteja no alcance do ataque desse personagem), recebendo +1d20 na rolagem deste ataque.',
      },
      {
        nivel: 18,
        nome: 'Antes ele do que eu',
        descricao: 'Uma vez por rodada, seu Shikigami pode se colocar como o alvo de um ataque. Além disso, aumenta a quantidade de atributos em "O melhor amigo do homem" para 3 e o bônus de "Sinergia" para +2d20.',
      },
    ],
  },

  // ==================== ESPECIALISTA ====================
  {
    id: 'infiltrador',
    nome: 'Infiltrador',
    classe: 'especialista',
    descricao: 'Você é um perito em infiltração e sabe neutralizar alvos desprevenidos sem causar alarde. Combinando talento acrobático, destreza manual e conhecimento técnico você é capaz de superar qualquer barreira de defesa, mesmo quando a missão parece impossível.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Ataque Furtivo',
        descricao: 'Você sabe atingir os pontos vitais de um inimigo distraído. Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que você esteja flanqueando, você pode gastar 1 PE para causar +1d8 pontos de dano do mesmo tipo da arma. No Nível 8 o dano adicional aumenta para +2d8, no Nível 13 aumenta para +3d8 e no Nível 18 aumenta para +4d8.',
      },
      {
        nivel: 8,
        nome: 'Gatuno',
        descricao: 'Você recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade (veja a perícia Furtividade).',
      },
      {
        nivel: 13,
        nome: 'Assassinar',
        descricao: 'Você pode gastar uma ação de movimento e 3 PE para analisar um alvo em alcance curto. Até o fim de seu próximo turno, seu primeiro Ataque Furtivo que causar dano a ele tem seus dados de dano extras dessa habilidade dobrados. Além disso, se sofrer dano de seu ataque, o alvo fica inconsciente ou morrendo, à sua escolha (Fortitude DT Agi evita).',
      },
      {
        nivel: 18,
        nome: 'Sombra Fugaz',
        descricao: 'Quando faz um teste de Furtividade após atacar ou fazer outra ação chamativa, você pode gastar 3 PE para não sofrer a penalidade de teste.',
      },
    ],
  },
  {
    id: 'medico_campo',
    nome: 'Médico de Campo',
    classe: 'especialista',
    descricao: 'Você é treinado em técnicas de primeiros socorros e tratamento de emergência, o que torna você um membro valioso para qualquer grupo de agentes. Ao contrário dos profissionais de saúde convencionais, você está acostumado com o campo de batalha e sabe tomar decisões rápidas no meio do caos. Além de tudo, recebe 1 grau de aprimoramento em Técnica Amaldiçoada Reversa, ignorando pré-requisitos.',
    requisitos: 'Treinado em Medicina',
    habilidades: [
      {
        nivel: 2,
        nome: 'Paramédico',
        descricao: 'Com o kit médico você pode usar uma ação padrão e 2 PE para curar 3+2d10 pontos de vida de um aliado adjacente. Você pode curar +1d10 PV respectivamente em Nível 8, Nível 13 e Nível 18, gastando +1 PE por dado adicional de cura. Sem o kit médico, é necessário gastar +1 EA por dado adicional para curar.',
      },
      {
        nivel: 8,
        nome: 'Equipe de Trauma',
        descricao: 'Com o kit médico você pode usar uma ação padrão e 2 PE para remover uma condição negativa (exceto morrendo) de um aliado adjacente. Sem o kit médico, é necessário gastar 1 EA por condição negativa removida.',
      },
      {
        nivel: 13,
        nome: 'Resgate',
        descricao: 'Uma vez por rodada, se estiver em alcance curto de um aliado machucado ou morrendo, você pode se aproximar do aliado com uma ação livre (desde que seja capaz de fazê-lo usando seu deslocamento normal). Além disso, sempre que curar PV ou remover condições do aliado, você e o aliado recebem +5 na Defesa até o início de seu próximo turno. Por fim, para você, o total de espaços ocupados por carregar um personagem é reduzido pela metade.',
      },
      {
        nivel: 18,
        nome: 'Reanimação',
        descricao: 'Uma vez por cena, você pode gastar uma ação completa e 10 PE e 5 EA para trazer de volta a vida um personagem que tenha morrido na mesma cena (exceto danos muito absurdos, como perder 60% do corpo).',
      },
    ],
  },
  {
    id: 'tecnico',
    nome: 'Técnico',
    classe: 'especialista',
    descricao: 'Sua principal habilidade é a manutenção e reparo do valioso equipamento que seu time carrega em missão. Seu conhecimento técnico também permite que improvise ferramentas com o que tiver à disposição e sabote os itens usados por seus inimigos.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Inventário Otimizado',
        descricao: 'Você soma seu Intelecto à sua Força para calcular sua capacidade de carga. Por exemplo, se você tem Força 1 e Intelecto 3, seu inventário tem 20 espaços.',
      },
      {
        nivel: 8,
        nome: 'Remendão',
        descricao: 'Você pode gastar uma ação completa e 1 PE ou 1 EA para remover a condição quebrado de um equipamento adjacente até o final da cena. Além disso, qualquer equipamento geral tem sua categoria reduzida em I para você.',
      },
      {
        nivel: 13,
        nome: 'Improvisar',
        descricao: 'Você pode improvisar equipamentos com materiais ao seu redor e itens que você tem acesso, unindo equipamentos com armas para incrementar seus efeitos e funcionalidades de forma efetiva, até mesmo criando Kits de Perícia ou Itens normais em Ferramentas Amaldiçoadas. O custo de PE vai variar de acordo com a categoria do item almejado, sendo 2 PE + 1 PE p/ nível da categoria, se o improviso envolve itens amaldiçoados, o custo fica 2 PE + 1 EA por categoria do item almejado. O item dura até o fim da cena, depois se torna inútil.',
      },
      {
        nivel: 18,
        nome: 'Preparado para Tudo',
        descricao: 'Você sempre tem o que precisa para qualquer situação. Sempre que precisar de um item qualquer (exceto armas), pode gastar uma ação de movimento e 3 PE por categoria do item para lembrar que colocou ele no fundo da bolsa! Depois de encontrado, o item segue normalmente as regras de inventário.',
      },
    ],
  },
  {
    id: 'graduado',
    nome: 'Graduado',
    classe: 'especialista',
    descricao: 'Você foca seus estudos em se tornar um conjurador versátil e poderoso, conhecendo mais feitiços que os outros xamãs e sendo capaz de torná-los mais difíceis de serem resistidos. Seu objetivo é desvendar e dominar os segredos do Jujutsu, custe o que custar.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Saber Ampliado',
        descricao: 'Você recebe um grau de aprimoramento para utilizar, e nos níveis 6, 9, 12, 15 e 18 recebe um novo grau de aprimoramento extra para utilizar.',
      },
      {
        nivel: 8,
        nome: 'Grimório e Marca Páginas Ritualístico',
        descricao: 'Você cria um grimório especial, que armazena seus feitiços e encantamentos mais importantes. Podendo aumentar a eficiência deles (aumentando a DT em 5) caso conjure a partir do Grimório. Conjurar encantamentos e feitiços pelo Grimório exige puxar o Grimório para suas mãos e utilizar 1 PE + 1 EA extra no feitiço ou encantamento que deseja. Colocar um marca-páginas ritualístico na página de um dos feitiços permite que, uma vez por cena, você possa conjurar ele como ação livre, sem gesticular ou puxar o Grimório, ao custo de 2 PE + 2 EA.',
      },
      {
        nivel: 13,
        nome: 'Feitiços Eficientes',
        descricao: 'A DT para resistir a todos os seus feitiços aumenta em +5.',
      },
      {
        nivel: 18,
        nome: 'Feitiçaria Clássica',
        descricao: 'Se conjurar os feitiços pelo Grimório, a DT para resistir a eles aumenta em +10, além de receber um segundo marca-páginas. Também reduz a DT para fazer votos vinculativos em 5.',
      },
    ],
  },
  {
    id: 'flagelador',
    nome: 'Flagelador',
    classe: 'especialista',
    descricao: 'Sentimentos negativos são ótimos catalisadores Jujutsu e você aprendeu a transformá-la diretamente em poder para seus feitiços. Quando se torna especialmente poderoso, consegue usar a dor e o sofrimento de seus inimigos como instrumento de seus feitiços xamãs.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Poder do Flagelo',
        descricao: 'Ao conjurar um feitiço, você pode gastar seus próprios pontos de vida para pagar o custo em pontos de esforço ou energia amaldiçoada, à taxa de 1,5 PV por PE/EA pago, arredondando para baixo na soma final.',
      },
      {
        nivel: 8,
        nome: 'Abraçar a Dor',
        descricao: 'Sempre que sofrer dano de Jujutsu você pode gastar uma reação e 2 PE para reduzir esse dano à metade e, além disso, transformar cada 10 de dano sofrido em 1 EA.',
      },
      {
        nivel: 13,
        nome: 'Absorver Agonia',
        descricao: 'Sempre que reduz um ou mais inimigos a 0 PV com um feitiço, você recebe uma quantidade de PE e EA e limite de PE/EA que varia quanto ao grau daquela maldição ou xamã.',
      },
      {
        nivel: 18,
        nome: 'Sentimento Tangível',
        descricao: 'Você tem a capacidade de enxergar o fluxo de energia amaldiçoada de forma muito precisa, além de influenciar ele, sempre que sentimentos negativos forem identificados na sua presença, você recebe +2 de EA e limite de EA temporários até o fim da cena.',
      },
    ],
  },
  {
    id: 'mestre_barreiras',
    nome: 'Mestre de Barreiras',
    classe: 'especialista',
    descricao: 'Alguns Xamãs têm proficiência maior no uso de revestimentos amaldiçoados, técnica reversa, mas você não, você domina o uso da técnica base responsável por manter os pilares da comunidade jujutsu estáveis no Japão. Reduz a categoria da Âncora de Barreira em 1.',
    habilidades: [
      {
        nivel: 2,
        nome: 'Cobertura',
        descricao: 'Você recebe 1 grau de aprimoramento em técnicas de barreira, e pode escolher entre 3 caminhos: Domínio Perfeito, Anulador de Barreiras ou Apoio de Campo.',
      },
    ],
    subcaminhos: [
      {
        id: 'dominio_perfeito',
        nome: 'Domínio Perfeito',
        descricao: 'Caminho para aqueles que querem aprimorar a própria expansão de domínio ao máximo e realizar feitos considerados impossíveis para os demais xamãs.',
        habilidades: [
          {
            nivel: 8,
            nome: 'Cabo de Guerra',
            descricao: 'Sempre que entra em um cabo de guerra de domínios, recebe +1d20 e +5 na rolagem de Jujutsu da disputa. E, caso perca a disputa, pode tentar levantar o Domínio novamente sem penalidade.',
          },
          {
            nivel: 13,
            nome: 'Isso acaba aqui',
            descricao: 'Caso o acerto garantido da sua técnica inata tenha sucesso dentro da expansão de domínio, você pode gastar +2 PE e +2 de EA para aumentar consideravelmente a eficácia do efeito.',
          },
          {
            nivel: 18,
            nome: 'Chega de Limitações',
            descricao: 'Você finalmente conseguiu entender a base das técnicas jujutsu para expansões de Domínio, recebe +1 de grau de aprimoramento na Técnicas de Barreiras e se tiver pelo menos 1 de grau de aprimoramento em Técnica Amaldiçoada Reversa, você ganha a capacidade de usar a Reversão de Feitiço no seu Domínio, criando um domínio sem barreiras.',
          },
        ],
      },
      {
        id: 'anulador_barreiras',
        nome: 'Anulador de Barreiras',
        descricao: 'Caminho para aqueles que querem ser os melhores quando se tratam de habilidades anti-domínio, se o ápice de um combate de feiticeiros for o cabo de guerra entre domínios, você será a tesoura que rompe a corda.',
        habilidades: [
          {
            nivel: 8,
            nome: 'A tesoura',
            descricao: 'Sempre que algum ser expande o Domínio contra você, você pode escolher utilizar uma técnica anti-domínio como ação livre, sem uso de PEs.',
          },
          {
            nivel: 13,
            nome: 'Eu posso fazer isso o dia inteiro',
            descricao: 'Você recebe um grau de aprimoramento em técnicas Anti-Domínio e é capaz de manter a sua Amplificação de Domínio ativa por metade do custo dela em EA (também na sustentação) e sem o custo de PEs.',
          },
          {
            nivel: 18,
            nome: 'É você quem está preso comigo',
            descricao: 'Enquanto utiliza técnicas Anti-Domínio, recebe +1 em todos os atributos e +5 na defesa, e, caso vença algum ser dentro da própria expansão de Domínio, recebe +1d6 de limite PE/EA e atuais temporários até o fim da cena.',
          },
        ],
      },
      {
        id: 'apoio_campo',
        nome: 'Apoio de Campo',
        descricao: 'Caminho para aqueles que buscam um ideal mais flexível e cooperativo, aprimorando barreiras para apoiar a si mesmo e principalmente os outros, conseguindo realizar configurações complexas de barreira sem tanta dificuldade. Nesse caminho, apenas aqueles com grande ambição e criatividade prosperam.',
        habilidades: [
          {
            nivel: 8,
            nome: 'Ajudinha',
            descricao: 'Quando você levanta uma cortina numa área, seus aliados podem re-rolar um dado por rodada em qualquer teste realizado dentro da cortina.',
          },
          {
            nivel: 13,
            nome: 'Suporte de Campo',
            descricao: 'Para cada PE e EA adicionado ao levantar uma cortina adicionar uma das seguintes regras: +1 dado de dano em testes de ataque dos seus aliados, +5 na defesa dos seus aliados, +3 no limite de PE/EA dos seus aliados, +1 dado na rolagem de testes que não são ataques.',
          },
          {
            nivel: 18,
            nome: 'Versátil',
            descricao: 'Recebe +1 grau de aprimoramento para feitiços de barreiras. Você se torna capaz de criar barreiras vazias dentro das suas cortinas, ignorando pré-requisitos, alterando elas como quiser, criando caminhos para auxiliar seus aliados, dificultando para os inimigos. Qualquer um dentro das suas barreiras vazias será afetado com +2 ou -2 dados nas rolagens de qualquer perícia da sua escolha.',
          },
        ],
      },
    ],
  },
];

export function getTrilhasByClasse(classe: ClasseType): TrilhaData[] {
  return TRILHAS.filter(t => t.classe === classe);
}

export function getTrilhaById(id: TrilhaType): TrilhaData | undefined {
  return TRILHAS.find(t => t.id === id);
}
