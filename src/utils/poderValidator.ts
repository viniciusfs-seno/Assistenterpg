// src/utils/poderValidator.ts - CORREÇÃO DEFINITIVA FUNCIONANDO 100%

import { Poder } from '../types/poder';
import { CharacterCreationData } from '../components/ficha/CharacterCreationWizard';
import { GrauTreinamento } from '../types/character';

export interface ValidacaoResultado {
  valido: boolean;
  motivos: string[];
}

/**
 * Normaliza nome de perícia para comparação case-insensitive e sem acentos
 */
function normalizarNome(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
}

export function validarPreRequisitos(
  poder: Poder,
  character: CharacterCreationData,
  poderesJaEscolhidos: string[]
): ValidacaoResultado {
  const motivos: string[] = [];

  if (!poder.prerequisitos) {
    return { valido: true, motivos: [] };
  }

  const pre = poder.prerequisitos;

  // ===== Validar nível =====
  if (pre.nivel && character.nivel < pre.nivel) {
    motivos.push(`Requer nível ${pre.nivel} (você tem ${character.nivel})`);
  }

  // ===== Validar atributos =====
  if (pre.atributos && pre.atributos.length > 0) {
    // Verifica se é requisito "OU" baseado no campo "outros"
    const isAtributoOU = pre.outros?.some(o => 
      o.toLowerCase().includes('ou') && 
      pre.atributos!.some(a => o.toLowerCase().includes(a.atributo))
    );

    if (isAtributoOU) {
      // ✅ OU: Pelo menos UM atributo deve atender
      const algumAtende = pre.atributos.some(req => {
        const valorAtual = character.atributos[req.atributo];
        return valorAtual >= req.valor;
      });

      if (!algumAtende) {
        const nomes = pre.atributos.map(a => {
          const nome = a.atributo.charAt(0).toUpperCase() + a.atributo.slice(1);
          return `${nome} ${a.valor}`;
        }).join(' OU ');
        motivos.push(`Requer ${nomes}`);
      }
    } else {
      // ✅ E: TODOS os atributos devem atender
      pre.atributos.forEach(req => {
        const valorAtual = character.atributos[req.atributo];
        if (valorAtual < req.valor) {
          const nomeAtributo = req.atributo.charAt(0).toUpperCase() + req.atributo.slice(1);
          motivos.push(`Requer ${nomeAtributo} ${req.valor} (você tem ${valorAtual})`);
        }
      });
    }
  }

  // ===== Validar perícias =====
  if (pre.pericias && pre.pericias.length > 0) {
    const grauMap: { [key: string]: number } = {
      'treinado': GrauTreinamento.TREINADO,
      'graduado': GrauTreinamento.GRADUADO,
      'veterano': GrauTreinamento.VETERANO,
      'expert': GrauTreinamento.EXPERT
    };

    // Verifica se é requisito "OU" baseado no campo "outros"
    const isPericiaOU = pre.outros?.some(o => 
      o.toLowerCase().includes('ou') && 
      pre.pericias!.some(p => o.toLowerCase().includes(p.pericia.toLowerCase()))
    );

    if (isPericiaOU) {
      // ✅ OU: Pelo menos UMA perícia deve atender
      const algumAtende = pre.pericias.some(req => {
        const periciaReqNormalizada = normalizarNome(req.pericia);

        // Verificar se está treinada
        const estaTreinada = character.periciasTreinadas.some(p => 
          normalizarNome(p) === periciaReqNormalizada
        );

        if (!estaTreinada) {
          return false;
        }

        // Se não especificou nível, apenas estar treinada é suficiente
        if (!req.nivel) {
          return true;
        }

        // Verificar grau específico (só se periciaGrados existir)
        if (character.periciaGrados && Object.keys(character.periciaGrados).length > 0) {
          const grauRequerido = grauMap[req.nivel];
          const periciaKey = Object.keys(character.periciaGrados).find(
            p => normalizarNome(p) === periciaReqNormalizada
          );

          if (periciaKey) {
            const grauAtual = character.periciaGrados[periciaKey];
            return grauAtual >= grauRequerido;
          }
          return false;
        }

        // No wizard (sem periciaGrados), assume TREINADO
        return req.nivel === 'treinado';
      });

      if (!algumAtende) {
        const nomes = pre.pericias.map(p => p.pericia).join(' OU ');
        motivos.push(`Requer treinamento em ${nomes}`);
      }
    } else {
      // ✅ E: TODAS as perícias devem atender
      pre.pericias.forEach(req => {
        const periciaReqNormalizada = normalizarNome(req.pericia);

        // Verificar se está treinada
        const estaTreinada = character.periciasTreinadas.some(p => 
          normalizarNome(p) === periciaReqNormalizada
        );

        if (!estaTreinada) {
          motivos.push(`Requer treinamento em ${req.pericia}`);
          return;
        }

        // Se não especificou nível, apenas estar treinada é suficiente
        if (!req.nivel) {
          return;
        }

        // Verificar grau específico (só se periciaGrados existir)
        if (character.periciaGrados && Object.keys(character.periciaGrados).length > 0) {
          const grauRequerido = grauMap[req.nivel];
          const periciaKey = Object.keys(character.periciaGrados).find(
            p => normalizarNome(p) === periciaReqNormalizada
          );

          if (periciaKey) {
            const grauAtual = character.periciaGrados[periciaKey];
            if (grauAtual < grauRequerido) {
              motivos.push(`Requer ${req.nivel} em ${req.pericia}`);
            }
          } else {
            motivos.push(`Requer ${req.nivel} em ${req.pericia}`);
          }
        } else {
          // No wizard (sem periciaGrados), exige apenas treinado
          if (req.nivel !== 'treinado') {
            motivos.push(`Requer ${req.nivel} em ${req.pericia}`);
          }
        }
      });
    }
  }

  // ===== Validar poderes pré-requisito =====
  if (pre.poderes && pre.poderes.length > 0) {
    pre.poderes.forEach(req => {
      if (!poderesJaEscolhidos.includes(req.poderId)) {
        const nomePoderRequerido = req.poderId
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        motivos.push(`Requer o poder: ${nomePoderRequerido}`);
      }
    });
  }

  return {
    valido: motivos.length === 0,
    motivos
  };
}

/**
 * Calcula quantos poderes o personagem pode escolher por nível
 */
export function calcularQuantidadePoderesDisponiveis(nivel: number): number {
  // Poderes disponíveis nos níveis: 1, 3, 6, 9, 12, 15, 18
  const niveisComPoder = [1, 3, 6, 9, 12, 15, 18];
  return niveisComPoder.filter(n => nivel >= n).length;
}
