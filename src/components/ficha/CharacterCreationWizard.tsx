// src/components/ficha/CharacterCreationWizard.tsx - CORRIGIDO COM TÉCNICAS

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useCharacter } from '../../hooks/useCharacter';
import { ClasseType, ClaType, Attributes, GrauTreinamento, TrilhaType, CategoriaTecnica, GrauFeiticeiro, ProficienciaType } from '../../types/character';
import { getClasseData, calcularPericiasLivres } from '../../data/classes';
import { ORIGENS } from '../../data/origens';
import { supabase } from '../../utils/supabase/client';
import { Step1Basico } from './wizard/Step1Basico';
import { Step2ClasseOrigem } from './wizard/Step2ClasseOrigem';
import { Step3ClaTecnica } from './wizard/Step3ClaTecnica';
import { Step3_5Trilha } from './wizard/Step3_5Trilha';
import { Step4Atributos } from './wizard/Step4Atributos';
import { Step5Pericias } from './wizard/Step5Pericias';
import { Step7Poderes } from './wizard/Step7Poderes';
import { Step6Revisao } from './wizard/Step6Revisao';
import { Step8Tecnicas } from './wizard/Step8Tecnicas';
import { gerarMapaPericiaGrados } from '../../types/character';
import { calcularBeneficiosPrestigio } from '../../utils/prestigio';
import { calcularQuantidadePoderesDisponiveis } from '../../utils/poderValidator';
import { calcularBonusPoderes } from '../../utils/poderEffects';
import { calcularBonusTecnicas } from '../../utils/tecnicaValidator'; // ✅ IMPORTAÇÃO

export interface CharacterCreationData {
  grauFeiticeiro: GrauFeiticeiro;
  nome: string;
  idade?: number;
  nivel: number;
  pontosPrestígio: number;
  prestigioCla?: number;
  jogador?: string;
  descricao?: string;
  classe: ClasseType;
  origemId: string;
  cla: ClaType;
  tecnicaInataId: string;
  atributos: Attributes;
  atributoEA: 'intelecto' | 'presenca';
  estudouEscolaTecnica?: boolean;
  periciasTreinadas: string[];
  periciasBonusExtra?: { [pericia: string]: number };
  periciaGrados?: { [nome: string]: GrauTreinamento };
  trilha?: TrilhaType;
  subcaminhoMestreBarreiras?: 'dominio_perfeito' | 'anulador_barreiras' | 'apoio_campo';
  poderesIds: string[];
  tecnicasBasicas: { [categoria in CategoriaTecnica]: number };
}

interface CharacterCreationWizardProps {
  onComplete: (characterId: string) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Básico', description: 'Informações principais' },
  { id: 2, title: 'Classe & Origem', description: 'Escolha sua base' },
  { id: 3, title: 'Clã & Técnica', description: 'Sua linhagem' },
  { id: 4, title: 'Trilha', description: 'Especialização' },
  { id: 5, title: 'Atributos', description: 'Distribua pontos' },
  { id: 6, title: 'Perícias', description: 'Especializações' },
  { id: 7, title: 'Poderes', description: 'Habilidades especiais' },
  { id: 8, title: 'Técnicas Básicas', description: 'Aprimore suas técnicas' },
  { id: 9, title: 'Revisão', description: 'Confira tudo' },
];

export function CharacterCreationWizard({ onComplete, onCancel }: CharacterCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const { createCharacter } = useCharacter();

  const [data, setData] = useState<CharacterCreationData>({
    nome: '',
    nivel: 1,
    pontosPrestígio: 0,
    prestigioCla: 0,
    classe: 'combatente' as ClasseType,
    origemId: 'academico',
    cla: 'sem_cla' as ClaType,
    tecnicaInataId: '',
    grauFeiticeiro: 'grau_4' as GrauFeiticeiro,
    atributos: {
      agilidade: 1,
      forca: 1,
      intelecto: 1,
      presenca: 1,
      vigor: 1,
    },
    atributoEA: 'intelecto',
    estudouEscolaTecnica: false,
    periciasTreinadas: [],
    periciasBonusExtra: {},
    periciaGrados: {},
    poderesIds: [],
    tecnicasBasicas: {
      tecnica_amaldicoada: 0,
      barreira: 0,
      reversa: 0,
      anti_barreira: 0,
      shikigami: 0,
      tecnicas_secretas: 0,
    }
  });

  const updateData = (updates: Partial<CharacterCreationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const calcularPontosAprimoramentoDisponiveis = (nivel: number) => {
    const niveisComPonto = [2, 8, 14, 18];
    return niveisComPonto.filter(n => nivel >= n).length;
  };

  // ✅ NOVA FUNÇÃO: Calcular pontos GASTOS (sem bônus)
  const calcularPontosGastosTecnicas = (): number => {
    const bonus = calcularBonusTecnicas(
      data.nivel,
      data.estudouEscolaTecnica || false,
      data.trilha as any,
      data.subcaminhoMestreBarreiras,
      data.cla as any
    );

    return Object.entries(data.tecnicasBasicas || {}).reduce((acc, [categoria, grau]) => {
      const bonusNaCategoria = bonus
        .filter(b => b.categoria === categoria as CategoriaTecnica)
        .reduce((sum, b) => sum + b.graus, 0);
      
      const pontosGastos = Math.max(0, grau - bonusNaCategoria);
      return acc + pontosGastos;
    }, 0);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return data.nome.trim().length > 0;
      case 2:
        if (!data.classe || !data.origemId) return false;

        const classeData = getClasseData(data.classe);
        if (classeData?.periciasEscolha) {
          const periciasClasse = classeData.periciasTreinadas;
          const escolhasNecessarias = classeData.periciasEscolha.length;
          const periciasEscolhidasClasse = data.periciasTreinadas.filter(p =>
            !periciasClasse.includes(p) &&
            classeData.periciasEscolha!.some(e => e.opcoes.includes(p))
          );

          if (periciasEscolhidasClasse.length < escolhasNecessarias) {
            return false;
          }
        }

        const origem = ORIGENS.find(o => o.id === data.origemId);
        if (origem?.periciasEscolha) {
          const perciasBase = origem.periciasTreinadas.length;
          const classePericiasTotal = (classeData?.periciasTreinadas.length || 0) + (classeData?.periciasEscolha?.length || 0);
          const periciasEsperadas = perciasBase + classePericiasTotal + origem.periciasEscolha.quantidade;

          return data.periciasTreinadas.length >= periciasEsperadas;
        }
        return true;
      case 3:
        return !!(data.cla && data.tecnicaInataId);
      case 4:
        if (data.nivel < 2) return true;
        if (!data.trilha) return false;
        if (data.trilha === 'mestre_barreiras' && !data.subcaminhoMestreBarreiras) return false;
        return true;
      case 5:
        const totalPontos = Object.values(data.atributos).reduce((a, b) => a + b, 0);
        const basePontos = 5;
        const calcularPontosDisponiveis = (nivel: number) => {
          let pontos = 4;
          if (nivel >= 4) pontos++;
          if (nivel >= 7) pontos++;
          if (nivel >= 10) pontos++;
          if (nivel >= 13) pontos++;
          if (nivel >= 16) pontos++;
          if (nivel >= 19) pontos++;
          return pontos;
        };
        const esperado = basePontos + calcularPontosDisponiveis(data.nivel);
        return totalPontos === esperado;
      case 6: {
        const classeDataStep6 = getClasseData(data.classe);
        const periciasLivresTotal = calcularPericiasLivres(data.classe, data.atributos.intelecto);
        const periciasGarantidas = data.periciasTreinadas;

        const periciasGarantidasReais = new Set<string>();

        (classeDataStep6?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));

        const origemDataStep6 = ORIGENS.find(o => o.id === data.origemId);
        (origemDataStep6?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));

        if (classeDataStep6?.periciasEscolha) {
          classeDataStep6.periciasEscolha.forEach(escolha => {
            escolha.opcoes.forEach(opcao => {
              if (periciasGarantidas.includes(opcao)) {
                periciasGarantidasReais.add(opcao);
              }
            });
          });
        }

        if (origemDataStep6?.periciasEscolha) {
          origemDataStep6.periciasEscolha.opcoes.forEach(opcao => {
            if (periciasGarantidas.includes(opcao)) {
              periciasGarantidasReais.add(opcao);
            }
          });
        }

        if (data.estudouEscolaTecnica === true) {
          periciasGarantidasReais.add('Jujutsu');
        }

        const periciasLivresEscolhidas = periciasGarantidas.filter(p => !periciasGarantidasReais.has(p));

        return periciasLivresEscolhidas.length === periciasLivresTotal;
      }

      case 7:
        const quantidadePoderes = calcularQuantidadePoderesDisponiveis(data.nivel);
        return data.poderesIds.length === quantidadePoderes;
      case 8:
        // ✅ CORRIGIDO: Valida apenas pontos GASTOS (sem bônus)
        const pontosDisponiveis = calcularPontosAprimoramentoDisponiveis(data.nivel);
        const pontosGastos = calcularPontosGastosTecnicas();
        return pontosGastos <= pontosDisponiveis;
      case 9:
        return true;
      default:
        return true;
    }
  };

  const getValidationError = (): string => {
    if (currentStep === 2) {
      if (!data.classe) return 'Selecione uma classe';
      if (!data.origemId) return 'Selecione uma origem';

      const classeData = getClasseData(data.classe);
      const origem = ORIGENS.find(o => o.id === data.origemId);

      if (classeData?.periciasEscolha) {
        const periciasClasse = classeData.periciasTreinadas;
        const escolhasNecessarias = classeData.periciasEscolha.length;
        const periciasEscolhidasClasse = data.periciasTreinadas.filter(p =>
          !periciasClasse.includes(p) &&
          classeData.periciasEscolha!.some(e => e.opcoes.includes(p))
        );

        if (periciasEscolhidasClasse.length < escolhasNecessarias) {
          return `Você precisa escolher ${escolhasNecessarias} perícia(s) da classe. Escolhidas: ${periciasEscolhidasClasse.length}/${escolhasNecessarias}`;
        }
      }

      if (origem?.periciasEscolha) {
        const perciasBase = origem.periciasTreinadas.length;
        const classePericiasTotal = (classeData?.periciasTreinadas.length || 0) + (classeData?.periciasEscolha?.length || 0);
        const periciasEsperadas = perciasBase + classePericiasTotal + origem.periciasEscolha.quantidade;
        const periciasOrigemEscolhidas = data.periciasTreinadas.length - perciasBase - classePericiasTotal;

        if (data.periciasTreinadas.length < periciasEsperadas) {
          return `Você precisa escolher ${origem.periciasEscolha.quantidade} perícia(s) da origem. Escolhidas: ${periciasOrigemEscolhidas}/${origem.periciasEscolha.quantidade}`;
        }
      }
    }

    if (currentStep === 4) {
      if (data.nivel >= 2 && !data.trilha) {
        return 'Escolha uma trilha para personagens de nível 2 ou superior';
      }
      if (data.trilha === 'mestre_barreiras' && !data.subcaminhoMestreBarreiras) {
        return 'Escolha um subcaminho para a trilha Mestre de Barreiras';
      }
    }

    if (currentStep === 6) {
      const classeData = getClasseData(data.classe);
      const periciasLivresTotal = calcularPericiasLivres(data.classe, data.atributos.intelecto);
      const periciasGarantidas = data.periciasTreinadas;

      const periciasGarantidasReais = new Set<string>();

      (classeData?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));

      const origemData = ORIGENS.find(o => o.id === data.origemId);
      (origemData?.periciasTreinadas || []).forEach(p => periciasGarantidasReais.add(p));

      if (classeData?.periciasEscolha) {
        classeData.periciasEscolha.forEach(escolha => {
          escolha.opcoes.forEach(opcao => {
            if (periciasGarantidas.includes(opcao)) {
              periciasGarantidasReais.add(opcao);
            }
          });
        });
      }

      if (origemData?.periciasEscolha) {
        origemData.periciasEscolha.opcoes.forEach(opcao => {
          if (periciasGarantidas.includes(opcao)) {
            periciasGarantidasReais.add(opcao);
          }
        });
      }

      if (data.estudouEscolaTecnica === true) {
        periciasGarantidasReais.add('Jujutsu');
      }

      const periciasLivresEscolhidas = periciasGarantidas.filter(p => !periciasGarantidasReais.has(p));

      if (periciasLivresEscolhidas.length < periciasLivresTotal) {
        return `Você precisa escolher todas as ${periciasLivresTotal} perícia(s) livre(s). Escolhidas: ${periciasLivresEscolhidas.length}/${periciasLivresTotal}`;
      }
    }

    if (currentStep === 7) {
      const quantidadePoderes = calcularQuantidadePoderesDisponiveis(data.nivel);
      if (data.poderesIds.length < quantidadePoderes) {
        return `Você precisa escolher ${quantidadePoderes} poder(es). Escolhidos: ${data.poderesIds.length}/${quantidadePoderes}`;
      }
    }

    if (currentStep === 8) {
      // ✅ CORRIGIDO: Valida apenas pontos GASTOS (sem bônus)
      const pontosDisponiveis = calcularPontosAprimoramentoDisponiveis(data.nivel);
      const pontosGastos = calcularPontosGastosTecnicas();
      if (pontosGastos > pontosDisponiveis) {
        return `Você está usando mais pontos de aprimoramento (${pontosGastos}) do que o permitido para seu nível (${pontosDisponiveis}).`;
      }
    }

    return '';
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCreate = async () => {
    if (!canProceed()) return;

    setCreating(true);

    try {
      console.log('🚀 Iniciando criação do personagem...', { nome: data.nome });

      const periciaGrados = gerarMapaPericiaGrados(data.periciasTreinadas);
      const beneficiosPrestigio = calcularBeneficiosPrestigio(data.pontosPrestígio || 0);
      const subcaminhoFinal = data.trilha === 'mestre_barreiras' ? data.subcaminhoMestreBarreiras : undefined;

      const bonusPoderes = calcularBonusPoderes(data.poderesIds, data.nivel);
      console.log('🛡️ [PROFICIÊNCIAS DETECTADAS]', bonusPoderes.proficienciasGanhas);

      const characterId = await createCharacter({
        nome: data.nome,
        idade: data.idade,
        nivel: data.nivel,
        grauFeiticeiro: beneficiosPrestigio.grauFeiticeiro,
        jogador: data.jogador,
        descricao: data.descricao,
        classe: data.classe,
        trilha: data.trilha || null,
        subcaminhoMestreBarreiras: subcaminhoFinal || null,
        origemId: data.origemId,
        cla: data.cla,
        tecnicaInataId: data.tecnicaInataId,
        atributos: data.atributos,
        atributoEA: data.atributoEA,
        estudouEscolaTecnica: data.estudouEscolaTecnica || false,
        pontosPrestígio: data.pontosPrestígio || 0,
        prestigioCla: data.prestigioCla || 0,
        avatarUrl: null,
        alinhamento: null,
        periciaGrados,
        periciasBonusExtra: data.periciasBonusExtra || {},
        poderesIds: data.poderesIds || [],
        proficiencias: bonusPoderes.proficienciasGanhas,
        tecnicasBasicas: data.tecnicasBasicas || {
          tecnica_amaldicoada: 0,
          barreira: 0,
          reversa: 0,
          anti_barreira: 0,
          shikigami: 0,
          tecnicas_secretas: 0,
        }
      });

      console.log('✅ Personagem criado:', { characterId });

      if (data.periciasTreinadas.length > 0) {
        const periciasParaSalvar = data.periciasTreinadas.map(periciaNome => {
          const bonusExtra = data.periciasBonusExtra?.[periciaNome] || 0;
          return {
            character_id: characterId,
            skill_name: periciaNome,
            grau_treinamento: GrauTreinamento.TREINADO,
            outros: bonusExtra,
          };
        });

        console.log('💾 Salvando perícias...', { count: periciasParaSalvar.length });

        const { error: skillsError } = await supabase
          .from('character_skills')
          .insert(periciasParaSalvar);

        if (skillsError) {
          console.error('❌ Erro ao salvar perícias:', skillsError);
          throw new Error('Erro ao salvar perícias: ' + skillsError.message);
        }

        console.log('✅ Perícias salvas com sucesso');
      }

      if (data.poderesIds.length > 0) {
        const poderesParaSalvar = data.poderesIds.map(poderId => ({
          character_id: characterId,
          power_id: poderId,
          nivel_obtido: data.nivel,
        }));

        console.log('💾 Salvando poderes...', { count: poderesParaSalvar.length });

        const { error: powersError } = await supabase
          .from('character_powers')
          .insert(poderesParaSalvar);

        if (powersError) {
          console.error('❌ Erro ao salvar poderes:', powersError);
          throw new Error('Erro ao salvar poderes: ' + powersError.message);
        }

        console.log('✅ Poderes salvos com sucesso');
      }

      if (bonusPoderes.proficienciasGanhas.length > 0) {
        const proficienciasParaSalvar = bonusPoderes.proficienciasGanhas.map(prof => ({
          character_id: characterId,
          proficiency_type: prof,
        }));

        console.log('💾 Salvando proficiências...', { count: proficienciasParaSalvar.length });

        const { error: profError } = await supabase
          .from('character_proficiencies')
          .insert(proficienciasParaSalvar);

        if (profError) {
          console.error('❌ Erro ao salvar proficiências:', profError);
          throw new Error('Erro ao salvar proficiências: ' + profError.message);
        }

        console.log('✅ Proficiências salvas com sucesso');
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      onComplete(characterId);
    } catch (error: any) {
      console.error('❌ Erro ao criar personagem:', error);
      const errorMessage = error?.message || 'Erro desconhecido ao criar personagem';
      alert(`Erro ao criar personagem:\n\n${errorMessage}\n\nTente novamente.`);
    } finally {
      setCreating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Basico data={data} updateData={updateData} />;
      case 2:
        return <Step2ClasseOrigem data={data} updateData={updateData} />;
      case 3:
        return <Step3ClaTecnica data={data} updateData={updateData} />;
      case 4:
        return <Step3_5Trilha data={data} updateData={updateData} />;
      case 5:
        return <Step4Atributos data={data} updateData={updateData} />;
      case 6:
        return <Step5Pericias data={data} updateData={updateData} />;
      case 7:
        return <Step7Poderes data={data} updateData={updateData} />;
      case 8:
        return (
          <Step8Tecnicas 
            nivel={data.nivel} 
            estudouEscolaTecnica={data.estudouEscolaTecnica || false}
            trilha={data.trilha}
            subcaminho={data.subcaminhoMestreBarreiras}
            cla={data.cla}
            tecnicasAtuais={data.tecnicasBasicas} 
            onUpdate={(novas) => updateData({ tecnicasBasicas: novas })} 
          />
        );
      case 9:
        return <Step6Revisao data={data} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / 9) * 100;
  const validationError = getValidationError();

  return (
    <Card className="bg-slate-900 border-slate-700 p-6 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl text-white">✨ Criar Personagem</CardTitle>
          <span className="text-sm" style={{ color: '#cbd5e1' }}>
            Passo {currentStep} de 9
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between mt-2 gap-1">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            
            return (
              <div
                key={`step-${step.id}`}
                className="flex flex-col items-center"
                style={{ flex: '1 1 0' }}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs mt-1 text-center ${
                    isCurrent ? 'text-red-500 font-semibold' : isCompleted ? 'text-green-500' : 'text-slate-400'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="mt-6">
        {renderStep()}

        {validationError && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm" style={{ color: '#fca5a5' }}>{validationError}</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            disabled={creating}
            className="bg-slate-600 border-slate-600 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </Button>

          {currentStep < 9 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!canProceed() || creating}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 min-w-[200px]"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Criar Personagem
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
