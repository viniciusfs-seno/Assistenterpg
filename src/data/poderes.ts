// src/data/poderes.ts - COMPLETO E CORRIGIDO COM PROFICIÊNCIAS

import { Poder } from '../types/poder';

export const PODERES: Poder[] = [
  // ========== COMBATE CORPO A CORPO ==========
  {
    id: 'armamento_pesado',
    nome: 'Armamento Pesado',
    descricao: 'Você recebe proficiência com armas pesadas.',
    tipo: 'passivo',
    categoria: 'combate_corpo_a_corpo',
    prerequisitos: {
      atributos: [{ atributo: 'forca', valor: 2 }]
    },
    efeitos: ['Proficiência com armas pesadas'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: 'Proficiência com armas pesadas'
      }
    ],
    tags: ['proficiencia', 'arma']
  },
  {
    id: 'artista_marcial',
    nome: 'Artista Marcial',
    descricao: 'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em nível 7, o dano aumenta para 1d8 e, em nível 14, para 1d10.',
    tipo: 'passivo',
    categoria: 'combate_corpo_a_corpo',
    efeitos: [
      'Ataques desarmados: 1d6 de dano',
      'Nível 7: 1d8 de dano',
      'Nível 14: 1d10 de dano',
      'Pode causar dano letal',
      'Conta como arma ágil'
    ],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 6,
        condicao: 'nivelminimo',
        nivelMinimo: 1,
        descricao: 'Ataques desarmados: 1d6'
      },
      {
        tipo: 'outro',
        valor: 8,
        condicao: 'nivelminimo',
        nivelMinimo: 7,
        descricao: 'Ataques desarmados: 1d8'
      },
      {
        tipo: 'outro',
        valor: 10,
        condicao: 'nivelminimo',
        nivelMinimo: 14,
        descricao: 'Ataques desarmados: 1d10'
      }
    ],
    tags: ['desarmado', 'dano', 'escalonamento']
  },
  {
    id: 'ataque_oportunidade',
    nome: 'Ataque de Oportunidade',
    descricao: 'Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele.',
    tipo: 'manual',
    categoria: 'combate_corpo_a_corpo',
    efeitos: ['Ataque de oportunidade ao custo de 1 PE'],
    tags: ['reacao', 'controle']
  },
  {
    id: 'combater_duas_armas',
    nome: 'Combater com Duas Armas',
    descricao: 'Se estiver usando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –2 em todos os testes de ataque até o seu próximo turno.',
    tipo: 'manual',
    categoria: 'combate_corpo_a_corpo',
    prerequisitos: {
      atributos: [{ atributo: 'agilidade', valor: 3 }],
      pericias: [{ pericia: 'Luta', nivel: 'treinado' }]
    },
    efeitos: ['Ataque duplo com penalidade -2'],
    tags: ['ataque', 'dual']
  },
  {
    id: 'combate_defensivo',
    nome: 'Combate Defensivo',
    descricao: 'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –2 em todos os testes de ataque, mas recebe +5 na Defesa.',
    tipo: 'manual',
    categoria: 'combate_corpo_a_corpo',
    prerequisitos: {
      atributos: [{ atributo: 'intelecto', valor: 2 }]
    },
    efeitos: ['-2 ataque, +5 Defesa'],
    tags: ['defesa', 'tatico']
  },
  {
    id: 'golpe_demolidor',
    nome: 'Golpe Demolidor',
    descricao: 'Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma.',
    tipo: 'manual',
    categoria: 'combate_corpo_a_corpo',
    prerequisitos: {
      atributos: [{ atributo: 'forca', valor: 2 }],
      pericias: [{ pericia: 'Luta', nivel: 'treinado' }]
    },
    efeitos: ['+2 dados de dano contra objetos ao custo de 1 PE'],
    tags: ['dano', 'objeto']
  },
  {
    id: 'golpe_pesado',
    nome: 'Golpe Pesado',
    descricao: 'O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo.',
    tipo: 'passivo',
    categoria: 'combate_corpo_a_corpo',
    efeitos: ['+1 dado de dano corpo a corpo'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: '+1 dado de dano corpo a corpo'
      }
    ],
    tags: ['dano', 'corpo_a_corpo']
  },
  {
    id: 'protecao_pesada',
    nome: 'Proteção Pesada',
    descricao: 'Você recebe proficiência com Proteções Pesadas.',
    tipo: 'passivo',
    categoria: 'combate_corpo_a_corpo',
    prerequisitos: { nivel: 6 },
    efeitos: ['Proficiência com proteções pesadas'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: 'Proficiência com proteções pesadas'
      }
    ],
    tags: ['proficiencia', 'armadura']
  },
  {
    id: 'reflexos_defensivos',
    nome: 'Reflexos Defensivos',
    descricao: 'Você recebe +2 em Defesa e em testes de resistência.',
    tipo: 'passivo',
    categoria: 'combate_corpo_a_corpo',
    prerequisitos: {
      atributos: [{ atributo: 'agilidade', valor: 2 }]
    },
    efeitos: ['+2 Defesa', '+2 testes de resistência'],
    efeitosPassivos: [
      {
        tipo: 'bonusdefesa',
        valor: 2,
        condicao: 'sempre'
      }
    ],
    tags: ['defesa', 'resistencia']
  },
  {
    id: 'tanque_guerra',
    nome: 'Tanque de Guerra',
    descricao: 'Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2.',
    tipo: 'passivo',
    categoria: 'combate_corpo_a_corpo',
    prerequisitos: {
      poderes: [{ poderId: 'protecao_pesada' }]
    },
    efeitos: ['+2 Defesa com proteção pesada', '+2 RD com proteção pesada'],
    efeitosPassivos: [
      {
        tipo: 'bonusdefesa',
        valor: 2,
        condicao: 'sempre',
        descricao: 'Com proteção pesada'
      },
      {
        tipo: 'bonusrd',
        valor: 2,
        condicao: 'sempre',
        descricao: 'Com proteção pesada'
      }
    ],
    tags: ['defesa', 'armadura', 'rd']
  },

  // ========== COMBATE À DISTÂNCIA ==========
  {
    id: 'balistica_avancada',
    nome: 'Balística Avançada',
    descricao: 'Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com essas armas.',
    tipo: 'passivo',
    categoria: 'combate_distancia',
    efeitos: ['Proficiência com armas táticas de fogo', '+2 dano com armas de fogo'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: 'Proficiência com armas táticas de fogo'
      },
      {
        tipo: 'outro',
        valor: 2,
        condicao: 'sempre',
        descricao: '+2 dano com armas de fogo'
      }
    ],
    tags: ['proficiencia', 'arma', 'dano']
  },
  {
    id: 'saque_rapido',
    nome: 'Saque Rápido',
    descricao: 'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre.',
    tipo: 'passivo',
    categoria: 'combate_distancia',
    prerequisitos: {
      pericias: [{ pericia: 'Iniciativa', nivel: 'treinado' }]
    },
    efeitos: ['Sacar/guardar como ação livre', 'Recarregar como ação livre 1x/rodada'],
    tags: ['acao', 'velocidade']
  },
  {
    id: 'segurar_gatilho',
    nome: 'Segurar o Gatilho',
    descricao: 'Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE e, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante.',
    tipo: 'manual',
    categoria: 'combate_distancia',
    prerequisitos: { nivel: 12 },
    efeitos: ['Ataque extra progressivo ao custo de 2 PE, 4 PE, 6 PE...'],
    tags: ['ataque', 'multiplo', 'pe']
  },
  {
    id: 'tiro_certeiro',
    nome: 'Tiro Certeiro',
    descricao: 'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar).',
    tipo: 'passivo',
    categoria: 'combate_distancia',
    prerequisitos: {
      pericias: [{ pericia: 'Pontaria', nivel: 'treinado' }]
    },
    efeitos: ['+AGI no dano à distância', 'Ignora penalidade em combate corpo a corpo'],
    tags: ['dano', 'precisao']
  },
  {
    id: 'tiro_cobertura',
    nome: 'Tiro de Cobertura',
    descricao: 'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um personagem no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque.',
    tipo: 'manual',
    categoria: 'combate_distancia',
    efeitos: ['Teste Pontaria vs Vontade', 'Impede movimento e -5 ataque'],
    tags: ['controle', 'medo', 'pe']
  },

  // ========== PODERES TÁTICOS ==========
  {
    id: 'incansavel',
    nome: 'Incansável',
    descricao: 'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste.',
    tipo: 'manual',
    categoria: 'tatico',
    efeitos: ['Ação de investigação extra com FOR/AGI ao custo de 2 PE'],
    tags: ['investigacao', 'pe']
  },
  {
    id: 'presteza_atletica',
    nome: 'Presteza Atlética',
    descricao: 'Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +2 no teste.',
    tipo: 'manual',
    categoria: 'tatico',
    efeitos: ['Substituir atributo por FOR/AGI ao custo de 1 PE', '+2 para aliado'],
    tags: ['suporte', 'investigacao', 'pe']
  },
  {
    id: 'sentido_tatico',
    nome: 'Sentido Tático',
    descricao: 'Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena.',
    tipo: 'manual',
    categoria: 'tatico',
    prerequisitos: {
      atributos: [{ atributo: 'intelecto', valor: 2 }],
      pericias: [
        { pericia: 'Percepcao', nivel: 'treinado' },
        { pericia: 'Tatica', nivel: 'treinado' }
      ]
    },
    efeitos: ['+INT em Defesa e resistências ao custo de 2 PE'],
    tags: ['defesa', 'analise', 'pe']
  },

  // ========== PODERES DE ESPECIALISTA ==========
  {
    id: 'conhecimento_aplicado',
    nome: 'Conhecimento Aplicado',
    descricao: 'Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int.',
    tipo: 'manual',
    categoria: 'especialista',
    prerequisitos: {
      atributos: [{ atributo: 'intelecto', valor: 2 }]
    },
    efeitos: ['Usar INT em qualquer perícia ao custo de 2 PE'],
    tags: ['pericia', 'versatilidade', 'pe']
  },
  {
    id: 'hacker',
    nome: 'Hacker',
    descricao: 'Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa.',
    tipo: 'passivo',
    categoria: 'especialista',
    prerequisitos: {
      pericias: [{ pericia: 'Tecnologia', nivel: 'treinado' }]
    },
    efeitos: ['+5 em Tecnologia (hackear)', 'Hackear como ação completa'],
    efeitosPassivos: [
      {
        tipo: 'bonuspericia',
        valor: 5,
        alvo: 'Tecnologia',
        condicao: 'sempre',
        descricao: 'Apenas para hackear'
      }
    ],
    tags: ['tecnologia', 'velocidade']
  },
  {
    id: 'maos_rapidas',
    nome: 'Mãos Rápidas',
    descricao: 'Ao fazer um teste de Crime, você pode pagar 1 PE para fazê-lo como uma ação livre.',
    tipo: 'manual',
    categoria: 'especialista',
    prerequisitos: {
      atributos: [{ atributo: 'agilidade', valor: 3 }],
      pericias: [{ pericia: 'Crime', nivel: 'treinado' }]
    },
    efeitos: ['Crime como ação livre ao custo de 1 PE'],
    tags: ['crime', 'velocidade', 'pe']
  },
  {
    id: 'mochila_utilidades',
    nome: 'Mochila de Utilidades',
    descricao: 'Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos.',
    tipo: 'passivo',
    categoria: 'especialista',
    efeitos: ['1 item reduz categoria e espaço'],
    tags: ['item', 'inventario']
  },
  {
    id: 'movimento_tatico',
    nome: 'Movimento Tático',
    descricao: 'Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno.',
    tipo: 'manual',
    categoria: 'especialista',
    prerequisitos: {
      pericias: [{ pericia: 'Atletismo', nivel: 'treinado' }]
    },
    efeitos: ['Ignorar terreno difícil ao custo de 1 PE'],
    tags: ['movimento', 'pe']
  },
  {
    id: 'na_trilha_certa',
    nome: 'Na Trilha Certa',
    descricao: 'Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +2 no próximo teste. Os custos e os bônus são cumulativos.',
    tipo: 'manual',
    categoria: 'especialista',
    efeitos: ['Bônus cumulativo em investigação ao custo de PE'],
    tags: ['investigacao', 'cumulativo', 'pe']
  },
  {
    id: 'nerd',
    nome: 'Nerd',
    descricao: 'Você é um repositório de conhecimento útil (e inútil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena.',
    tipo: 'manual',
    categoria: 'especialista',
    efeitos: ['Informação útil 1x/cena ao custo de 2 PE'],
    tags: ['conhecimento', 'utilidade', 'pe']
  },
  {
    id: 'ninja_urbano',
    nome: 'Ninja Urbano',
    descricao: 'Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com essas armas.',
    tipo: 'passivo',
    categoria: 'especialista',
    efeitos: ['Proficiência com armas táticas', '+2 dano com armas táticas'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: 'Proficiência com armas táticas corpo a corpo e disparo'
      },
      {
        tipo: 'outro',
        valor: 2,
        condicao: 'sempre',
        descricao: '+2 dano com armas táticas'
      }
    ],
    tags: ['proficiencia', 'arma', 'dano']
  },
  {
    id: 'pensamento_agil',
    nome: 'Pensamento Ágil',
    descricao: 'Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional.',
    tipo: 'manual',
    categoria: 'especialista',
    efeitos: ['Ação extra de investigação ao custo de 2 PE'],
    tags: ['investigacao', 'pe']
  },
  {
    id: 'perito_explosivos',
    nome: 'Perito em Explosivos',
    descricao: 'Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto.',
    tipo: 'passivo',
    categoria: 'especialista',
    efeitos: ['+INT na DT de explosivos', 'Excluir INT alvos de explosão'],
    tags: ['explosivo', 'controle']
  },
  {
    id: 'primeira_impressao',
    nome: 'Primeira Impressão',
    descricao: 'Você recebe +4 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena.',
    tipo: 'passivo',
    categoria: 'especialista',
    efeitos: ['+4 no primeiro teste social por cena'],
    tags: ['social', 'primeiro']
  },

  // ========== PODERES JUJUTSU ==========
  {
    id: 'armamento_amaldicoado',
    nome: 'Armamento Amaldiçoado',
    descricao: 'Você recebe proficiência com armas amaldiçoadas.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      pericias: [
        { pericia: 'Luta', nivel: 'treinado' },
        { pericia: 'Pontaria', nivel: 'treinado' }
      ],
      outros: ['Treinado em Luta OU Pontaria']
    },
    efeitos: ['Proficiência com armas amaldiçoadas'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: 'Proficiência com armas amaldiçoadas'
      }
    ],
    tags: ['proficiencia', 'arma']
  },
  {
    id: 'mira_certeira',
    nome: 'Mira Certeira',
    descricao: 'Você sempre sabe onde acertar seus disparos, aumenta as rolagens de dano de ataques à distância em +1 dado.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    efeitos: ['+1 dado de dano à distância'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: '+1 dado de dano à distância'
      }
    ],
    tags: ['dano', 'distancia']
  },
  {
    id: 'jujutsu_capacitado',
    nome: 'Jujutsu Capacitado',
    descricao: 'Em todos os níveis ímpares recebe +1 de EA. A cada três níveis recebe +1 de limite de PE/EA.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'intelecto', valor: 3 }],
      pericias: [{ pericia: 'Jujutsu', nivel: 'treinado' }]
    },
    efeitos: ['+1 EA em níveis ímpares', '+1 limite PE/EA a cada 3 níveis'],
    efeitosPassivos: [
      {
        tipo: 'bonusea',
        valor: 1,
        condicao: 'nivelimpar',
        descricao: '+1 EA em níveis ímpares'
      },
      {
        tipo: 'bonuslimitepeea',
        valor: 1,
        condicao: 'acada3niveis',
        descricao: '+1 limite a cada 3 níveis'
      }
    ],
    tags: ['ea', 'escalonamento', 'limite']
  },
  {
    id: 'grau_treinamento',
    nome: 'Grau de Treinamento',
    descricao: 'A partir do nível 3 pode +10 (Graduado), a partir do nível 9 pode +15 (Veterano) e a partir do nível 16 pode +20 (Expert).',
    tipo: 'passivo',
    categoria: 'jujutsu',
    efeitos: [
      'Nível 3: +10 perícias (Graduado)',
      'Nível 9: +15 perícias (Veterano)',
      'Nível 16: +20 perícias (Expert)'
    ],
    tags: ['pericia', 'escalonamento']
  },
  {
    id: 'jujutsu_bruto',
    nome: 'Jujutsu Bruto',
    descricao: 'Mais um dado de dano em rolagens envolvendo energia amaldiçoada.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    efeitos: ['+1 dado de dano com EA'],
    efeitosPassivos: [
      {
        tipo: 'outro',
        valor: 1,
        condicao: 'sempre',
        descricao: '+1 dado de dano com EA'
      }
    ],
    tags: ['dano', 'ea']
  },
  {
    id: 'ferramentas_amaldicoadas',
    nome: 'Ferramentas Amaldiçoadas',
    descricao: 'Reduz a categoria de um item amaldiçoado e pode usá-lo sem pagar o seu custo de PE.',
    tipo: 'manual',
    categoria: 'jujutsu',
    efeitos: ['Reduz categoria de 1 item amaldiçoado', 'Usa item sem custo de PE'],
    tags: ['item', 'economia']
  },
  {
    id: 'shikigami_favorito',
    nome: 'Shikigami Favorito',
    descricao: 'Reduz em 1 o custo de EA para invocar um Shikigami específico, além de reduzir o tipo de invocação (ação completa > padrão > reação > ação livre).',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      pericias: [{ pericia: 'Jujutsu', nivel: 'treinado' }]
    },
    efeitos: ['-1 EA para invocar shikigami específico', 'Reduz tipo de ação'],
    tags: ['shikigami', 'ea', 'velocidade']
  },
  {
    id: 'genio_kokusen',
    nome: 'Gênio do Kokusen',
    descricao: 'Todos os seus acertos críticos naturais se tornam Kokusen, drenando automaticamente 3 de PE ao acertar.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      pericias: [{ pericia: 'Jujutsu', nivel: 'treinado' }],
      outros: ['Grau de Aprimoramento 2 em técnica amaldiçoada']
    },
    efeitos: ['Críticos naturais viram Kokusen', 'Drena 3 PE do alvo'],
    tags: ['critico', 'kokusen', 'dreno']
  },
  {
    id: 'lutador_focado',
    nome: 'Lutador Focado',
    descricao: 'Você vai ficando mais concentrado na luta, ao acertar um primeiro Kokusen, todos os seus acertos críticos (mesmo não-naturais) se tornam Kokusen, drenando automaticamente 4 PE e restaurando 2 EA.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [
        { atributo: 'forca', valor: 3 },
        { atributo: 'agilidade', valor: 3 }
      ],
      poderes: [{ poderId: 'genio_kokusen' }],
      outros: ['3 em força OU agilidade']
    },
    efeitos: ['Todos críticos viram Kokusen após 1º', 'Drena 4 PE', 'Restaura 2 EA'],
    tags: ['critico', 'kokusen', 'dreno', 'ea']
  },
  {
    id: 'emissao_anormal',
    nome: 'Emissão Anormal',
    descricao: 'Você tem uma capacidade de liberar mais energia amaldiçoada do que os outros em técnicas de emissão. Consegue utilizar Emissão de Energia Amaldiçoada combinado com ataques a distância (como ação livre), e causa o dobro de dano dos dados na Emissão, além de +2 no teste de ataque.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'presenca', valor: 3 }],
      pericias: [
        { pericia: 'Jujutsu', nivel: 'treinado' },
        { pericia: 'Pontaria', nivel: 'treinado' }
      ],
      outros: ['Grau de Aprimoramento 2 em técnica amaldiçoada']
    },
    efeitos: ['Emissão como ação livre', 'Dobro de dano na Emissão', '+2 teste de ataque'],
    tags: ['emissao', 'dano', 'acao']
  },
  {
    id: 'feiticeiro_intuitivo',
    nome: 'Feiticeiro Intuitivo',
    descricao: 'Seus testes de Jujutsu são rolados com Presença agora.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      pericias: [
        { pericia: 'Jujutsu', nivel: 'treinado' },
        { pericia: 'Intuição', nivel: 'treinado' }
      ]
    },
    efeitos: ['Jujutsu usa PRE ao invés de INT'],
    tags: ['atributo', 'presenca']
  },
  {
    id: 'perito_votos',
    nome: 'Perito em Votos',
    descricao: 'Para você, usar votos vinculativos é natural, as ideias surgem na sua mente e você apenas sabe como executá-las. Utiliza Intuição ao invés de Vontade ao realizar votos vinculativos e recebe +5 em Intuição.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'presenca', valor: 3 }],
      poderes: [{ poderId: 'feiticeiro_intuitivo' }]
    },
    efeitos: ['Votos usam Intuição ao invés de Vontade', '+5 em Intuição'],
    efeitosPassivos: [
      {
        tipo: 'bonuspericia',
        valor: 5,
        alvo: 'Intuição',
        condicao: 'sempre'
      }
    ],
    tags: ['voto', 'intuicao']
  },
  {
    id: 'complexidade_inata',
    nome: 'Complexidade Inata',
    descricao: 'Aumenta DT para resistir aos seus feitiços e efeitos deles em 3.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      pericias: [{ pericia: 'Jujutsu', nivel: 'treinado' }]
    },
    efeitos: ['+3 na DT dos seus feitiços'],
    tags: ['dt', 'feitico']
  },
  {
    id: 'especialista_tecnica',
    nome: 'Especialista na Técnica',
    descricao: 'Reduz o custo dos feitiços da sua técnica inata em 1 EA.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      poderes: [{ poderId: 'complexidade_inata' }]
    },
    efeitos: ['-1 EA no custo da técnica inata'],
    tags: ['ea', 'economia', 'tecnica_inata']
  },
  {
    id: 'aura_resistente',
    nome: 'Aura Resistente',
    descricao: 'Seu corpo tem tendência a resistir mais às técnicas amaldiçoadas, recebendo +5 de resistência à Jujutsu.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'vigor', valor: 2 }]
    },
    efeitos: ['+5 resistência à Jujutsu'],
    tags: ['resistencia', 'defesa']
  },
  {
    id: 'aura_impenetravel',
    nome: 'Aura Impenetrável',
    descricao: 'Seu corpo está fora da curva, por algum motivo, não é qualquer um que consegue te machucar com energia amaldiçoada, recebe +10 de resistência a Jujutsu.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'vigor', valor: 3 }],
      outros: ['Corpo Especial']
    },
    efeitos: ['+10 resistência à Jujutsu'],
    tags: ['resistencia', 'defesa', 'especial']
  },
  {
    id: 'textura_oleosa',
    nome: 'Textura Oleosa',
    descricao: 'Você se especializou em esquivas, sua energia amaldiçoada recebe uma característica oleosa. Quando se reveste de energia, recebe um bônus de +5 em Reflexos.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'agilidade', valor: 3 }],
      pericias: [{ pericia: 'Reflexos', nivel: 'graduado' }]
    },
    efeitos: ['+5 Reflexos ao se revestir'],
    efeitosPassivos: [
      {
        tipo: 'bonuspericia',
        valor: 5,
        alvo: 'Reflexos',
        condicao: 'sempre',
        descricao: 'Ao se revestir de EA'
      }
    ],
    tags: ['reflexos', 'esquiva', 'revestimento']
  },
  {
    id: 'entendido_jujutsu',
    nome: 'Entendido de Jujutsu',
    descricao: 'Você tem um conhecimento a mais em Jujutsu e como a energia amaldiçoada funciona, reduz o dano de sanidade proveniente de votos vinculativos pela metade.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'intelecto', valor: 3 }]
    },
    efeitos: ['Dano de SAN de votos reduzido em 50%'],
    tags: ['sanidade', 'voto', 'reducao']
  },
  {
    id: 'jujutsu_ferro',
    nome: 'Jujutsu de Ferro',
    descricao: 'Você se especializou em bloqueios, sua energia amaldiçoada recebe uma característica firme. Quando se reveste de energia, recebe um bônus de +5 de Fortitude.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'vigor', valor: 3 }],
      pericias: [{ pericia: 'Fortitude', nivel: 'graduado' }]
    },
    efeitos: ['+5 Fortitude ao se revestir'],
    efeitosPassivos: [
      {
        tipo: 'bonuspericia',
        valor: 5,
        alvo: 'Fortitude',
        condicao: 'sempre',
        descricao: 'Ao se revestir de EA'
      }
    ],
    tags: ['fortitude', 'bloqueio', 'revestimento']
  },
  {
    id: 'treinamento_especifico',
    nome: 'Treinamento Específico',
    descricao: 'Você ganha um grau de aprimoramento para alguma técnica.',
    tipo: 'manual',
    categoria: 'jujutsu',
    efeitos: ['+1 grau de aprimoramento em 1 técnica'],
    tags: ['aprimoramento', 'tecnica']
  },

  // ========== PODERES AMALDIÇOADOS (ADAPTADOS) ==========
  {
    id: 'envolto_misterio',
    nome: 'Envolto em Mistério',
    descricao: 'Sua aparência e postura assombrosas o permitem manipular e assustar pessoas ignorantes ou supersticiosas. Você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Jujutsu.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    efeitos: ['+5 Enganação contra não-feiticeiros', '+5 Intimidação contra não-feiticeiros'],
    tags: ['social', 'medo']
  },
  {
    id: 'fluxo_poder',
    nome: 'Fluxo de Poder',
    descricao: 'Você pode manter dois efeitos sustentados de técnicas ativos simultaneamente com apenas uma ação livre, pagando o custo de cada efeito separadamente.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: { nivel: 12 },
    efeitos: ['Manter 2 efeitos sustentados simultaneamente'],
    tags: ['sustentado', 'multiplo']
  },
  {
    id: 'guiado_amaldicoado',
    nome: 'Guiado pelo Amaldiçoado',
    descricao: 'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional.',
    tipo: 'manual',
    categoria: 'jujutsu',
    efeitos: ['Ação de investigação extra ao custo de 2 PE'],
    tags: ['investigacao', 'pe']
  },
  {
    id: 'identificacao_amaldicoada',
    nome: 'Identificação Amaldiçoada',
    descricao: 'Você recebe +10 em testes de Jujutsu para identificar criaturas, objetos ou técnicas.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    efeitos: ['+10 Jujutsu para identificação'],
    efeitosPassivos: [
      {
        tipo: 'bonuspericia',
        valor: 10,
        alvo: 'Jujutsu',
        condicao: 'sempre',
        descricao: 'Apenas para identificação'
      }
    ],
    tags: ['identificacao', 'conhecimento']
  },
  {
    id: 'intuicao_amaldicoada',
    nome: 'Intuição Amaldiçoada',
    descricao: 'Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (à sua escolha).',
    tipo: 'passivo',
    categoria: 'jujutsu',
    efeitos: ['+INT ou +PRE em facilitar investigação'],
    tags: ['investigacao', 'suporte']
  },
  {
    id: 'tecnica_potente',
    nome: 'Técnica Potente',
    descricao: 'Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de suas técnicas.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    prerequisitos: {
      atributos: [{ atributo: 'intelecto', valor: 2 }]
    },
    efeitos: ['+INT no dano de técnicas', '+INT na cura de técnicas'],
    tags: ['dano', 'cura', 'intelecto']
  },
  {
    id: 'tecnica_predileta',
    nome: 'Técnica Predileta',
    descricao: 'Escolha uma técnica que você conhece. Você reduz em –1 PE o custo da técnica. Essa redução se acumula com reduções fornecidas por outras fontes.',
    tipo: 'manual',
    categoria: 'jujutsu',
    efeitos: ['-1 PE no custo de 1 técnica específica'],
    tags: ['pe', 'economia', 'tecnica']
  },
  {
    id: 'tatuagem_ritualistica',
    nome: 'Tatuagem Ritualística',
    descricao: 'Símbolos marcados em sua pele reduzem em –1 PE o custo de técnicas de alcance pessoal que têm você como alvo.',
    tipo: 'passivo',
    categoria: 'jujutsu',
    efeitos: ['-1 PE em técnicas pessoais'],
    tags: ['pe', 'economia', 'pessoal']
  }
];

// Funções utilitárias
export function getPoderById(id: string): Poder | undefined {
  return PODERES.find(p => p.id === id);
}

export function getPoderesPorCategoria(categoria: string): Poder[] {
  return PODERES.filter(p => p.categoria === categoria);
}

export function getPoderesPorTipo(tipo: string): Poder[] {
  return PODERES.filter(p => p.tipo === tipo);
}
