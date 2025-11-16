// src/data/tecnicas-basicas.ts

import { TecnicaBasica, CategoriaTecnica } from '../types/tecnica';

export const TECNICAS_BASICAS: TecnicaBasica[] = [
  // ========================================
  // CATEGORIA: TÉCNICAS DE BARREIRA
  // ========================================
  {
    id: 'barreira_simples',
    nome: 'Barreira Simples',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Barreiras usadas para ocultar, conter ou impedir entrada de pessoas.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de barreiras.', acumulavel: false },
      1: { descricao: 'Até 1 regra. Custo varia (mínimo 2 EA).', custoEA: 2, acumulavel: false },
      2: { descricao: 'Até 2 regras. Custo varia (mínimo 2 EA).', custoEA: 2, acumulavel: false },
      3: { descricao: 'Até 3 regras. Custo varia (mínimo 2 EA).', custoEA: 2, acumulavel: false },
      4: { descricao: 'Até 4 regras. Custo varia (mínimo 2 EA).', custoEA: 2, acumulavel: false },
      5: { descricao: 'Até 5 regras. Custo varia (mínimo 2 EA).', custoEA: 2, acumulavel: false }
    }
  },
  {
    id: 'cortina',
    nome: 'Cortina',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Barreiras vastas que escondem atividade jujutsu de não-feiticeiros e forçam espíritos amaldiçoados a se revelarem.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de barreiras.', acumulavel: false },
      1: { descricao: 'Cortina básica. Custo a partir de 2 EA.', custoEA: 2, acumulavel: false },
      2: { descricao: 'Cortina básica. Custo a partir de 2 EA.', custoEA: 2, acumulavel: false },
      3: { descricao: 'Cortina básica. Custo a partir de 2 EA.', custoEA: 2, acumulavel: false },
      4: { descricao: 'Cortina básica. Custo a partir de 2 EA.', custoEA: 2, acumulavel: false },
      5: { descricao: 'Cortina básica. Custo a partir de 2 EA.', custoEA: 2, acumulavel: false }
    }
  },
  {
    id: 'dominio_simples_ofensivo',
    nome: 'Novo Estilo da Sombra: Domínio Simples',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Foco ofensivo do domínio simples (1,80m). Permite atacar com +5 dentro do domínio.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de barreiras.', acumulavel: false },
      1: { descricao: 'Domínio simples ofensivo. Permite feitiços. +5 ataque dentro. Custo: 2 EA + 1 EA/turno.', custoEA: 2, bonus: '+5 ataque', acumulavel: false },
      2: { descricao: 'Domínio simples ofensivo. Permite feitiços e encantamentos. +5 ataque dentro. Custo: 2 EA + 1 EA/turno.', custoEA: 2, bonus: '+5 ataque', acumulavel: false },
      3: { descricao: 'Domínio simples ofensivo. Permite feitiços e encantamentos. +5 ataque dentro. Custo: 2 EA + 1 EA/turno.', custoEA: 2, bonus: '+5 ataque', acumulavel: false },
      4: { descricao: 'Domínio simples ofensivo. Permite feitiços e encantamentos. +5 ataque dentro. Custo: 2 EA + 1 EA/turno.', custoEA: 2, bonus: '+5 ataque', acumulavel: false },
      5: { descricao: 'Domínio simples ofensivo. Permite feitiços e encantamentos. +5 ataque dentro. Custo: 2 EA + 1 EA/turno.', custoEA: 2, bonus: '+5 ataque', acumulavel: false }
    }
  },
  {
    id: 'expansao_dominio',
    nome: 'Expansão de Domínio',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Domínio inato manifestado com técnica inata imbuída. Garante acerto de todas as técnicas dentro da barreira.',
    grauMinimo: 2,
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de expansão de domínio.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de expansão de domínio.', acumulavel: false },
      2: { descricao: 'Expansão de Domínio disponível. Custo mínimo: 6 EA + 2 PE. Sustentado.', custoEA: 6, custoPE: 2, acumulavel: false },
      3: { descricao: 'Expansão de Domínio disponível. Custo mínimo: 6 EA + 2 PE. Sustentado.', custoEA: 6, custoPE: 2, acumulavel: false },
      4: { descricao: 'Expansão de Domínio disponível. Custo mínimo: 6 EA + 2 PE. Sustentado.', custoEA: 6, custoPE: 2, acumulavel: false },
      5: { descricao: 'Expansão de Domínio disponível. Custo mínimo: 6 EA + 2 PE. Sustentado.', custoEA: 6, custoPE: 2, acumulavel: false }
    }
  },
  {
    id: 'dominio_sem_barreira',
    nome: 'Domínio sem Barreira',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Barreira aberta com área maior ou efeito mais poderoso. Requer grau 2 em Barreira e Reversa.',
    grauMinimo: 2,
    prerequisitos: {
      outrasTecnicas: [
        { categoria: CategoriaTecnica.BARREIRA, grauMinimo: 2 },
        { categoria: CategoriaTecnica.REVERSA, grauMinimo: 2 }
      ]
    },
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de domínio sem barreira.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de domínio sem barreira.', acumulavel: false },
      2: { descricao: 'Domínio sem Barreira disponível. Custo mínimo: 8 EA + 4 PE.', custoEA: 8, custoPE: 4, acumulavel: false },
      3: { descricao: 'Domínio sem Barreira disponível. Custo mínimo: 8 EA + 4 PE.', custoEA: 8, custoPE: 4, acumulavel: false },
      4: { descricao: 'Domínio sem Barreira disponível. Custo mínimo: 8 EA + 4 PE.', custoEA: 8, custoPE: 4, acumulavel: false },
      5: { descricao: 'Domínio sem Barreira disponível. Custo mínimo: 8 EA + 4 PE.', custoEA: 8, custoPE: 4, acumulavel: false }
    }
  },
  {
    id: 'barreira_vazia',
    nome: 'Barreira Vazia',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Zonas vazias delimitadas por hexágonos, regras alteráveis em tempo real. Sem técnica inata imbuída.',
    grauMinimo: 3,
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de barreira vazia.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de barreira vazia.', acumulavel: false },
      2: { descricao: 'Sem conhecimento de barreira vazia.', acumulavel: false },
      3: { descricao: 'Barreira Vazia disponível. Custo mínimo: 4 EA.', custoEA: 4, acumulavel: false },
      4: { descricao: 'Barreira Vazia disponível. Custo mínimo: 4 EA.', custoEA: 4, acumulavel: false },
      5: { descricao: 'Barreira Vazia disponível. Custo mínimo: 4 EA.', custoEA: 4, acumulavel: false }
    }
  },
  {
    id: 'barreira_pura',
    nome: 'Barreira Pura',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Versão superior de barreira. Aumenta precisão de supressão de espíritos. Sem técnica inata imbuída.',
    grauMinimo: 5,
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de barreira pura.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de barreira pura.', acumulavel: false },
      2: { descricao: 'Sem conhecimento de barreira pura.', acumulavel: false },
      3: { descricao: 'Sem conhecimento de barreira pura.', acumulavel: false },
      4: { descricao: 'Sem conhecimento de barreira pura.', acumulavel: false },
      5: { descricao: 'Barreira Pura disponível. Custo mínimo: 8 EA.', custoEA: 8, acumulavel: false }
    }
  },
  {
    id: 'barreira_bon',
    nome: 'Barreira Bon',
    categoria: CategoriaTecnica.BARREIRA,
    descricao: 'Superior à barreira pura. Requer barreira pura existente como base. Regras quase ilimitadas.',
    grauMinimo: 4,
    prerequisitos: {
      outros: ['Requer Barreira Pura já construída como alicerce']
    },
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de barreira bon.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de barreira bon.', acumulavel: false },
      2: { descricao: 'Sem conhecimento de barreira bon.', acumulavel: false },
      3: { descricao: 'Sem conhecimento de barreira bon.', acumulavel: false },
      4: { descricao: 'Barreira Bon disponível. Custo mínimo: 8 EA + 3 PE.', custoEA: 8, custoPE: 3, acumulavel: false },
      5: { descricao: 'Barreira Bon disponível. Custo mínimo: 8 EA + 3 PE.', custoEA: 8, custoPE: 3, acumulavel: false }
    }
  },

  // ========================================
  // CATEGORIA: TÉCNICA AMALDIÇOADA
  // ========================================
  {
    id: 'revestimento_amaldicoado',
    nome: 'Revestimento de Energia Amaldiçoada',
    categoria: CategoriaTecnica.TECNICA_AMALDICOADA,
    descricao: 'Reveste partes do corpo ou equipamentos com energia amaldiçoada para melhorar os atributos deles ou ser capaz de exorcizar maldições sem uma técnica inata.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento do revestimento.', acumulavel: false },
      1: { descricao: 'Revestir ofensivamente: Ao custo de 1 EA, adiciona +1d6 de dano e permite machucar maldições. Acumulativo até 5x.', custoEA: 1, dano: '+1d6', acumulavel: true, maxAcumulacoes: 1 },
      2: { descricao: 'Revestir ofensivamente: Igual ao grau 1. Acumula até 2x.', custoEA: 1, dano: '+1d6', acumulavel: true, maxAcumulacoes: 2 },
      3: { descricao: 'Revestir ofensivamente: Igual ao grau 1. Acumula até 3x.', custoEA: 1, dano: '+1d6', acumulavel: true, maxAcumulacoes: 3 },
      4: { descricao: 'Revestir ofensivamente: Igual ao grau 1. Acumula até 4x.', custoEA: 1, dano: '+1d6', acumulavel: true, maxAcumulacoes: 4 },
      5: { descricao: 'Revestir ofensivamente: Igual ao grau 1. Acumula até 5x. Pode ser usado defensivamente para +3 defesa ou +3 RD.', custoEA: 1, dano: '+1d6', acumulavel: true, maxAcumulacoes: 5 }
    }
  },
  {
    id: 'velocidade_amaldicoada',
    nome: 'Velocidade Amaldiçoada',
    categoria: CategoriaTecnica.TECNICA_AMALDICOADA,
    descricao: '+3 metros no deslocamento e +2 no teste de ataque. Custo: 1 EA e 1 PE. Acumulativo até 5x.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de velocidade amaldiçoada.', acumulavel: false },
      1: { descricao: 'Velocidade Amaldiçoada disponível.', custoEA: 1, custoPE: 1, acumulavel: true, maxAcumulacoes: 1 },
      2: { descricao: 'Velocidade Amaldiçoada disponível.', custoEA: 1, custoPE: 1, acumulavel: true, maxAcumulacoes: 2 },
      3: { descricao: 'Velocidade Amaldiçoada disponível.', custoEA: 1, custoPE: 1, acumulavel: true, maxAcumulacoes: 3 },
      4: { descricao: 'Velocidade Amaldiçoada disponível.', custoEA: 1, custoPE: 1, acumulavel: true, maxAcumulacoes: 4 },
      5: { descricao: 'Velocidade Amaldiçoada disponível.', custoEA: 1, custoPE: 1, acumulavel: true, maxAcumulacoes: 5 }
    }
  },
  {
    id: 'kokusen',
    nome: 'Kokusen',
    categoria: CategoriaTecnica.TECNICA_AMALDICOADA,
    descricao: 'Ataque com energia amaldiçoada que pode aumentar dados de dano e acrescentar bônus caso acerte crítico.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de Kokusen.', acumulavel: false },
      1: { descricao: 'Kokusen permite +2 dados de dano e +1 EA em caso de crítico.', custoEA: 2, custoPE: 0, acumulavel: false },
      2: { descricao: 'Kokusen permite +2 dados de dano e +1 EA em caso de crítico.', custoEA: 2, custoPE: 0, acumulavel: false },
      3: { descricao: 'Kokusen permite +2 dados de dano e +1 EA em caso de crítico.', custoEA: 2, custoPE: 0, acumulavel: false },
      4: { descricao: 'Kokusen permite +2 dados de dano e +1 EA em caso de crítico.', custoEA: 2, custoPE: 0, acumulavel: false },
      5: { descricao: 'Kokusen permite +2 dados de dano e +1 EA em caso de crítico.', custoEA: 2, custoPE: 0, acumulavel: false }
    }
  },
  {
    id: 'voto_vinculativo',
    nome: 'Voto Vinculativo',
    categoria: CategoriaTecnica.TECNICA_AMALDICOADA,
    descricao: 'Pacto ou contrato com energia amaldiçoada com custos de sanidade e energia conforme o tipo de voto.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento sobre votos vinculativos.', acumulavel: false },
      1: { descricao: 'Voto simples: custo 1d3 de sanidade (DT Vontade 10-20).', acumulavel: false },
      2: { descricao: 'Voto complexo: custo 2d4 de sanidade (DT Vontade 20-30).', acumulavel: false },
      3: { descricao: 'Voto complexo: custo 2d4 de sanidade (DT Vontade 20-30).', acumulavel: false },
      4: { descricao: 'Voto extremo: custo 4d8 de sanidade (DT Vontade 30+).', acumulavel: false },
      5: { descricao: 'Voto extremo: custo 4d8 de sanidade (DT Vontade 30+).', acumulavel: false }
    }
  },
  {
    id: 'emissao_energia_amaldicoada',
    nome: 'Emissão de Energia Amaldiçoada',
    categoria: CategoriaTecnica.TECNICA_AMALDICOADA,
    descricao: 'Projéteis ou lasers de energia amaldiçoada para exorcizar ou causar dano.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de emissão de energia amaldiçoada.', acumulavel: false },
      1: { descricao: 'Dispara energia amaldiçoada causando 3+1d3 de dano ao custo de 1 EA.', custoEA: 1, dano: '3+1d3', acumulavel: true, maxAcumulacoes: 1 },
      2: { descricao: 'Dispara energia amaldiçoada causando 3+1d3 de dano ao custo de 1 EA.', custoEA: 1, dano: '3+1d3', acumulavel: true, maxAcumulacoes: 2 },
      3: { descricao: 'Dispara energia amaldiçoada causando 3+1d3 de dano ao custo de 1 EA.', custoEA: 1, dano: '3+1d3', acumulavel: true, maxAcumulacoes: 3 },
      4: { descricao: 'Dispara energia amaldiçoada causando 3+1d3 de dano ao custo de 1 EA.', custoEA: 1, dano: '3+1d3', acumulavel: true, maxAcumulacoes: 4 },
      5: { descricao: 'Dispara energia amaldiçoada causando 3+1d3 de dano ao custo de 1 EA.', custoEA: 1, dano: '3+1d3', acumulavel: true, maxAcumulacoes: 5 }
    }
  },

  // ========================================
  // CATEGORIA: TÉCNICA AMALDIÇOADA REVERSA
  // ========================================
  {
    id: 'energia_reversa_cura',
    nome: 'Energia Amaldiçoada Reversa (RCT)',
    categoria: CategoriaTecnica.REVERSA,
    descricao: 'Processa energia negativa em positiva, multiplicando duas fontes de EA. Cura corpos humanos.',
    grauMinimo: 2,
    prerequisitos: {
      outrasTecnicas: [{ categoria: CategoriaTecnica.TECNICA_AMALDICOADA, grauMinimo: 2 }]
    },
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de RCT.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de RCT.', acumulavel: false },
      2: { descricao: 'RCT disponível. Cura 3+1d6. Pode acumular 1x. Custo: 2 EA.', custoEA: 2, cura: '3+1d6', acumulavel: true, maxAcumulacoes: 1 },
      3: { descricao: 'RCT disponível. Cura 3+1d6. Pode acumular 2x. Custo: 2 EA.', custoEA: 2, cura: '3+1d6', acumulavel: true, maxAcumulacoes: 2 },
      4: { descricao: 'RCT disponível. Cura 3+1d6. Pode acumular 3x. Custo: 2 EA.', custoEA: 2, cura: '3+1d6', acumulavel: true, maxAcumulacoes: 3 },
      5: { descricao: 'RCT disponível. Cura 3+1d6. Pode acumular 5x. Custo: 2 EA. Sustentado: 5+1d8/rodada.', custoEA: 2, cura: '3+1d6 (ou 5+1d8 sustentado)', acumulavel: true, maxAcumulacoes: 5 }
    }
  },
  {
    id: 'reversao_feitico',
    nome: 'Reversão de Feitiço',
    categoria: CategoriaTecnica.REVERSA,
    descricao: 'Usa EA reversa em encantamentos Jujutsu, revertendo o efeito do feitiço (ex: anti-gravidade vira gravidade aumentada).',
    grauMinimo: 2,
    prerequisitos: {
      outrasTecnicas: [{ categoria: CategoriaTecnica.TECNICA_AMALDICOADA, grauMinimo: 2 }]
    },
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de reversão de feitiço.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de reversão de feitiço.', acumulavel: false },
      2: { descricao: 'Reversão de Feitiço disponível. Custo: dobro do EA da técnica inata.', acumulavel: false },
      3: { descricao: 'Reversão de Feitiço disponível. Custo: dobro do EA da técnica inata.', acumulavel: false },
      4: { descricao: 'Reversão de Feitiço disponível. Custo: dobro do EA da técnica inata.', acumulavel: false },
      5: { descricao: 'Reversão de Feitiço disponível. Custo: dobro do EA da técnica inata.', acumulavel: false }
    }
  },
  {
    id: 'revestimento_positivo',
    nome: 'Revestimento de Energia Positiva',
    categoria: CategoriaTecnica.REVERSA,
    descricao: 'Reveste corpo/ferramenta com energia positiva. Extremamente eficaz contra espíritos amaldiçoados.',
    grauMinimo: 4,
    prerequisitos: {
      outrasTecnicas: [{ categoria: CategoriaTecnica.REVERSA, grauMinimo: 4 }]
    },
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de revestimento positivo.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de revestimento positivo.', acumulavel: false },
      2: { descricao: 'Sem conhecimento de revestimento positivo.', acumulavel: false },
      3: { descricao: 'Sem conhecimento de revestimento positivo.', acumulavel: false },
      4: { descricao: 'Revestimento Positivo disponível. +2d8 dano vs espíritos. Pode acumular até grau. Custo: 3 EA + 1 PE.', custoEA: 3, custoPE: 1, dano: '+2d8', acumulavel: true, maxAcumulacoes: 4 },
      5: { descricao: 'Revestimento Positivo disponível. +2d8 dano vs espíritos. Pode acumular até grau. Custo: 3 EA + 1 PE.', custoEA: 3, custoPE: 1, dano: '+2d8', acumulavel: true, maxAcumulacoes: 5 }
    }
  },
  {
    id: 'emissao_positiva',
    nome: 'Emissão de Energia Positiva',
    categoria: CategoriaTecnica.REVERSA,
    descricao: 'Emite/injeta energia positiva diretamente em espíritos, desestabilizando-os.',
    grauMinimo: 5,
    prerequisitos: {
      outrasTecnicas: [{ categoria: CategoriaTecnica.REVERSA, grauMinimo: 5 }]
    },
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de emissão positiva.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de emissão positiva.', acumulavel: false },
      2: { descricao: 'Sem conhecimento de emissão positiva.', acumulavel: false },
      3: { descricao: 'Sem conhecimento de emissão positiva.', acumulavel: false },
      4: { descricao: 'Sem conhecimento de emissão positiva.', acumulavel: false },
      5: { descricao: 'Emissão Positiva disponível. 10+2d8 dano. Pode acumular até 5x. Custo: 5 EA + 1 PE.', custoEA: 5, custoPE: 1, dano: '10+2d8', acumulavel: true, maxAcumulacoes: 5 }
    }
  },

  // ========================================
  // CATEGORIA: TÉCNICAS ANTI-BARREIRA
  // ========================================
  {
    id: 'cesta_oca',
    nome: 'Cesta Oca',
    categoria: CategoriaTecnica.ANTI_BARREIRA,
    descricao: 'Antecessor do domínio simples. Barreira esférica que neutraliza acerto imperdível de domínios. Pode ser destruída.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de técnicas anti-barreira.', acumulavel: false },
      1: { descricao: 'Cesta Oca disponível. Neutraliza acerto garantido. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false },
      2: { descricao: 'Cesta Oca disponível. Neutraliza acerto garantido. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false },
      3: { descricao: 'Cesta Oca disponível. Neutraliza acerto garantido. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false },
      4: { descricao: 'Cesta Oca disponível. Neutraliza acerto garantido. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false },
      5: { descricao: 'Cesta Oca disponível. Neutraliza acerto garantido. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false }
    }
  },
  {
    id: 'dominio_simples_defensivo',
    nome: 'Domínio Simples',
    categoria: CategoriaTecnica.ANTI_BARREIRA,
    descricao: 'Expande pequeno domínio no solo, neutraliza acerto imperdível. Indestrutível diretamente. Permite feitiços/encantamentos conforme grau.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de domínio simples.', acumulavel: false },
      1: { descricao: 'Domínio Simples disponível. Neutraliza acerto garantido. Permite feitiços. +5 defesa. Custo: 2 EA. Sustentado.', custoEA: 2, bonus: '+5 defesa', acumulavel: false },
      2: { descricao: 'Domínio Simples disponível. Neutraliza acerto garantido. Permite feitiços e encantamentos. +5 defesa. Custo: 2 EA. Sustentado.', custoEA: 2, bonus: '+5 defesa', acumulavel: false },
      3: { descricao: 'Domínio Simples disponível. Neutraliza acerto garantido. Permite feitiços e encantamentos. +5 defesa. Custo: 2 EA. Sustentado.', custoEA: 2, bonus: '+5 defesa', acumulavel: false },
      4: { descricao: 'Domínio Simples disponível. Neutraliza acerto garantido. Permite feitiços e encantamentos. +5 defesa. Custo: 2 EA. Sustentado.', custoEA: 2, bonus: '+5 defesa', acumulavel: false },
      5: { descricao: 'Domínio Simples disponível. Neutraliza acerto garantido. Permite feitiços e encantamentos. +5 defesa. Custo: 2 EA. Sustentado.', custoEA: 2, bonus: '+5 defesa', acumulavel: false }
    }
  },
  {
    id: 'amplificacao_dominio',
    nome: 'Amplificação de Domínio',
    categoria: CategoriaTecnica.ANTI_BARREIRA,
    descricao: 'Envolve corpo com fino véu de domínio, anula automaticamente técnicas amaldiçoadas que toquem. Não pode usar técnica inata simultaneamente.',
    grauMinimo: 2,
    prerequisitos: {
      outrasTecnicas: [
        { categoria: CategoriaTecnica.ANTI_BARREIRA, grauMinimo: 2 },
        { categoria: CategoriaTecnica.BARREIRA, grauMinimo: 1 }
      ]
    },
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de amplificação de domínio.', acumulavel: false },
      1: { descricao: 'Sem conhecimento de amplificação de domínio.', acumulavel: false },
      2: { descricao: 'Amplificação de Domínio disponível. Anula técnicas ao tocar. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false },
      3: { descricao: 'Amplificação de Domínio disponível. Anula técnicas ao tocar. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false },
      4: { descricao: 'Amplificação de Domínio disponível. Anula técnicas ao tocar. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false },
      5: { descricao: 'Amplificação de Domínio disponível. Anula técnicas ao tocar. Custo: 1 EA. Sustentado.', custoEA: 1, acumulavel: false }
    }
  },

  // ========================================
  // CATEGORIA: TÉCNICA DE SHIKIGAMI
  // ========================================
  {
    id: 'invocacao_shikigami',
    nome: 'Técnica de Shikigami',
    categoria: CategoriaTecnica.SHIKIGAMI,
    descricao: 'Invoca familiares encarnados pela EA do invocador. Normalmente requer talismãs. Grau 3+ permite invocar sem intermediários.',
    efeitosPorGrau: {
      0: { descricao: 'Sem conhecimento de shikigami.', acumulavel: false },
      1: { descricao: 'Invocação de Shikigami com talismãs/objetos auxiliares. Custo a partir de 1 EA.', custoEA: 1, acumulavel: false },
      2: { descricao: 'Invocação de Shikigami com talismãs/objetos auxiliares. Custo a partir de 1 EA.', custoEA: 1, acumulavel: false },
      3: { descricao: 'Invocação de Shikigami SEM talismãs/auxiliares. Custo a partir de 1 EA.', custoEA: 1, acumulavel: false },
      4: { descricao: 'Invocação de Shikigami SEM talismãs/auxiliares. Custo a partir de 1 EA.', custoEA: 1, acumulavel: false },
      5: { descricao: 'Invocação de Shikigami SEM talismãs/auxiliares. Custo a partir de 1 EA.', custoEA: 1, acumulavel: false }
    }
  }
];

// Função helper para obter técnica por ID
export function getTecnicaById(id: string): TecnicaBasica | undefined {
  return TECNICAS_BASICAS.find(t => t.id === id);
}

// Função helper para obter técnicas por categoria
export function getTecnicasPorCategoria(categoria: CategoriaTecnica): TecnicaBasica[] {
  return TECNICAS_BASICAS.filter(t => t.categoria === categoria);
}

// Função helper para obter descrição de efeito por grau
export function getEfeitoTecnica(tecnicaId: string, grau: number): string {
  const tecnica = getTecnicaById(tecnicaId);
  if (!tecnica) return 'Técnica não encontrada';

  const efeito = tecnica.efeitosPorGrau[grau];
  if (!efeito) return 'Grau inválido';

  return efeito.descricao;
}
