// src/components/ficha/CharacterCreationWizard.tsx - COM SUPORTE A BÔNUS EXTRAS

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useCharacter } from '../../hooks/useCharacter';
import { ClasseType, ClaType, Attributes, GrauFeiticeiro, GrauTreinamento } from '../../types/character';
import { getClasseData } from '../../data/classes';
import { ORIGENS } from '../../data/origens';
import { supabase } from '../../utils/supabase/client';
import { Step1Basico } from './wizard/Step1Basico';
import { Step2ClasseOrigem } from './wizard/Step2ClasseOrigem';
import { Step3ClaTecnica } from './wizard/Step3ClaTecnica';
import { Step4Atributos } from './wizard/Step4Atributos';
import { Step5Pericias } from './wizard/Step5Pericias';
import { Step6Revisao } from './wizard/Step6Revisao';

export interface CharacterCreationData {
  nome: string;
  idade?: number;
  nivel: number;
  grauFeiticeiro: GrauFeiticeiro;
  jogador?: string;
  descricao?: string;
  classe: ClasseType;
  origemId: string;
  cla: ClaType;
  tecnicaInataId: string;
  atributos: Attributes;
  periciasTreinadas: string[];
  periciasBonusExtra?: { [pericia: string]: number }; // NOVO
}

interface CharacterCreationWizardProps {
  onComplete: (characterId: string) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Básico', description: 'Informações principais' },
  { id: 2, title: 'Classe & Origem', description: 'Escolha sua base' },
  { id: 3, title: 'Clã & Técnica', description: 'Sua linhagem' },
  { id: 4, title: 'Atributos', description: 'Distribua pontos' },
  { id: 5, title: 'Perícias', description: 'Especializações' },
  { id: 6, title: 'Revisão', description: 'Confira tudo' },
];

export function CharacterCreationWizard({ onComplete, onCancel }: CharacterCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const { createCharacter } = useCharacter();

  const [data, setData] = useState<CharacterCreationData>({
    nome: '',
    nivel: 1,
    grauFeiticeiro: 'grau_4' as GrauFeiticeiro,
    classe: 'combatente' as ClasseType,
    origemId: 'academico',
    cla: 'sem_cla' as ClaType,
    tecnicaInataId: '',
    atributos: {
      agilidade: 1,
      forca: 1,
      intelecto: 1,
      presenca: 1,
      vigor: 1,
    },
    periciasTreinadas: [],
    periciasBonusExtra: {},
  });

  const updateData = (updates: Partial<CharacterCreationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
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
          const periciasBase = origem.periciasTreinadas.length;
          const classePericiasTotal = (classeData?.periciasTreinadas.length || 0) + (classeData?.periciasEscolha?.length || 0);
          const periciasEsperadas = periciasBase + classePericiasTotal + origem.periciasEscolha.quantidade;
          
          return data.periciasTreinadas.length >= periciasEsperadas;
        }
        
        return true;
      
      case 3:
        return !!(data.cla && data.tecnicaInataId);
      
      case 4:
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
      
      case 5:
        return data.periciasTreinadas.length > 0;
      
      case 6:
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
        const periciasBase = origem.periciasTreinadas.length;
        const classePericiasTotal = (classeData?.periciasTreinadas.length || 0) + (classeData?.periciasEscolha?.length || 0);
        const periciasEsperadas = periciasBase + classePericiasTotal + origem.periciasEscolha.quantidade;
        const periciasOrigemEscolhidas = data.periciasTreinadas.length - periciasBase - classePericiasTotal;
        
        if (data.periciasTreinadas.length < periciasEsperadas) {
          return `Você precisa escolher ${origem.periciasEscolha.quantidade} perícia(s) da origem. Escolhidas: ${periciasOrigemEscolhidas}/${origem.periciasEscolha.quantidade}`;
        }
      }
    }
    return '';
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 6) {
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
      // 1. Criar personagem
      const characterId = await createCharacter({
        nome: data.nome,
        idade: data.idade,
        nivel: data.nivel,
        grauFeiticeiro: data.grauFeiticeiro,
        jogador: data.jogador,
        descricao: data.descricao,
        classe: data.classe,
        trilha: null,
        origemId: data.origemId,
        cla: data.cla,
        tecnicaInataId: data.tecnicaInataId,
        atributos: data.atributos,
        pontosPrestígio: 0,
        prestigioCla: 0,
        avatarUrl: null,
        alinhamento: null,
      });

      // 2. Salvar perícias COM bônus extras
      const periciasParaSalvar = data.periciasTreinadas.map(periciaNome => {
        const bonusExtra = data.periciasBonusExtra?.[periciaNome] || 0;
        
        return {
          character_id: characterId,
          skill_name: periciaNome,
          grau_treinamento: GrauTreinamento.TREINADO,
          outros: bonusExtra, // SALVANDO O BÔNUS EXTRA AQUI
        };
      });

      if (periciasParaSalvar.length > 0) {
        const { error: skillsError } = await supabase
          .from('character_skills')
          .insert(periciasParaSalvar);

        if (skillsError) {
          console.error('Erro ao salvar perícias:', skillsError);
          throw skillsError;
        }
      }

      onComplete(characterId);
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      alert('Erro ao criar personagem. Tente novamente.');
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
        return <Step4Atributos data={data} updateData={updateData} />;
      case 5:
        return <Step5Pericias data={data} updateData={updateData} />;
      case 6:
        return <Step6Revisao data={data} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / 6) * 100;
  const validationError = getValidationError();

  return (
    <Card className="bg-slate-900 border-slate-700 p-6 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl text-white">Criar Personagem</CardTitle>
          <span className="text-sm text-slate-400">
            Passo {currentStep} de 6
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`text-center ${
                step.id === currentStep ? 'text-red-500 font-semibold' : ''
              } ${step.id < currentStep ? 'text-green-500' : ''}`}
            >
              {step.id < currentStep && <CheckCircle className="w-4 h-4 inline mr-1" />}
              {step.title}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="mt-6">
        {renderStep()}

        {validationError && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{validationError}</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </Button>

          {currentStep < 6 ? (
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
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {creating ? 'Criando...' : 'Criar Personagem'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
