// src/components/ficha/wizard/Step3_5Trilha.tsx

import { CharacterCreationData } from '../CharacterCreationWizard';
import { Card } from '../../ui/card';
import { getTrilhasByClasse, getTrilhaById } from '../../../data/trilhas';
import { TrilhaType } from '../../../types/character';
import { AlertCircle } from 'lucide-react';
import { getClasseData } from '../../../data/classes';
import { ORIGENS } from '../../../data/origens';

interface Step3_5TrilhaProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step3_5Trilha({ data, updateData }: Step3_5TrilhaProps) {
  const trilhasDisponiveis = getTrilhasByClasse(data.classe);
  const trilhaSelecionada = data.trilha ? getTrilhaById(data.trilha) : null;

  const handleTrilhaSelect = (trilhaId: TrilhaType) => {
    const trilha = getTrilhaById(trilhaId);
    const trilhaAnterior = data.trilha ? getTrilhaById(data.trilha) : null;
    
    // Limpar subcaminho se não for Mestre de Barreiras
    const updates: Partial<CharacterCreationData> = {
      trilha: trilhaId,
      subcaminhoMestreBarreiras: trilhaId === 'mestre_barreiras' ? data.subcaminhoMestreBarreiras : undefined
    };

    let periciasTreinadas = [...data.periciasTreinadas];

    // REMOVER perícia da trilha anterior se ela tinha requisito
    if (trilhaAnterior?.requisitos && trilhaAnterior.requisitos.includes('Medicina')) {
      // Verifica se Medicina NÃO vem de classe/origem antes de remover
      const classeData = getClasseData(data.classe);
      const origemData = ORIGENS.find(o => o.id === data.origemId);
      
      const medicinaVemDeClasse = classeData?.periciasTreinadas.includes('Medicina') || false;
      const medicinaVemDeOrigem = origemData?.periciasTreinadas.includes('Medicina') || false;
      
      // Só remove se NÃO vier de classe/origem
      if (!medicinaVemDeClasse && !medicinaVemDeOrigem) {
        const indexMedicina = periciasTreinadas.indexOf('Medicina');
        if (indexMedicina > -1) {
          periciasTreinadas.splice(indexMedicina, 1);
        }
      }
    }

    // ADICIONAR perícia da nova trilha se ela tem requisito
    if (trilha?.requisitos && trilha.requisitos.includes('Medicina')) {
      // Adicionar Medicina se ainda não estiver na lista
      if (!periciasTreinadas.includes('Medicina')) {
        periciasTreinadas.push('Medicina');
      }
    }

    updates.periciasTreinadas = periciasTreinadas;

    updateData(updates);
  };

  const handleSubcaminhoSelect = (subcaminhoId: 'dominio_perfeito' | 'anulador_barreiras' | 'apoio_campo') => {
    updateData({ subcaminhoMestreBarreiras: subcaminhoId });
  };

  // Verificar se a trilha pode ser escolhida
  const canSelectTrilha = (trilha: any): { canSelect: boolean; reason?: string } => {
    if (!trilha.requisitos) return { canSelect: true };

    // Verificar se tem requisito de Medicina
    if (trilha.requisitos.includes('Medicina')) {
      const jaTemMedicina = data.periciasTreinadas.includes('Medicina');
      
      if (jaTemMedicina) {
        // Verificar se Medicina vem de classe ou origem (não da trilha atual)
        const classeData = getClasseData(data.classe);
        const origemData = ORIGENS.find(o => o.id === data.origemId);
        
        const medicinaVemDeClasse = classeData?.periciasTreinadas.includes('Medicina') || false;
        const medicinaVemDeOrigem = origemData?.periciasTreinadas.includes('Medicina') || false;
        
        // Verifica também se pode vir de escolha da classe
        let medicinaVemDeEscolhaClasse = false;
        if (classeData?.periciasEscolha) {
          medicinaVemDeEscolhaClasse = classeData.periciasEscolha.some(escolha => 
            escolha.opcoes.includes('Medicina')
          );
        }
        
        // Verifica se pode vir de escolha da origem
        let medicinaVemDeEscolhaOrigem = false;
        if (origemData?.periciasEscolha) {
          medicinaVemDeEscolhaOrigem = origemData.periciasEscolha.opcoes.includes('Medicina');
        }
        
        // Se vem de classe/origem (fixa ou escolha), avisa que já tem
        if (medicinaVemDeClasse || medicinaVemDeOrigem || 
            (medicinaVemDeEscolhaClasse && jaTemMedicina) || 
            (medicinaVemDeEscolhaOrigem && jaTemMedicina)) {
          return {
            canSelect: true,
            reason: 'Você já possui a perícia Medicina (vinda da sua classe ou origem)'
          };
        }
        // Se não vem de classe/origem, não mostra mensagem (provavelmente vem de trilha anterior ou livre)
      } else {
        // Não tem Medicina ainda, vai adicionar
        return { 
          canSelect: true, 
          reason: 'Medicina será adicionada automaticamente às suas perícias livres' 
        };
      }
    }

    return { canSelect: true };
  };

  if (data.nivel < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
        <p style={{ fontSize: '18px', marginBottom: '12px' }}>Trilhas são desbloqueadas no nível 2</p>
        <p style={{ fontSize: '14px' }}>Seu personagem ainda não atingiu o nível necessário para escolher uma trilha.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
        Escolha sua Trilha
      </h2>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
        A partir do nível 2, você pode escolher uma trilha que define sua especialização dentro da classe.
      </p>

      <div style={{ display: 'grid', gap: '16px' }}>
        {trilhasDisponiveis.map((trilha) => {
          const isSelected = data.trilha === trilha.id;
          const { canSelect, reason } = canSelectTrilha(trilha);
          
          return (
            <Card
              key={trilha.id}
              onClick={() => canSelect && handleTrilhaSelect(trilha.id)}
              style={{
                backgroundColor: isSelected ? '#1e293b' : '#0f172a',
                borderColor: isSelected ? '#ef4444' : '#475569',
                borderWidth: '2px',
                padding: '20px',
                cursor: canSelect ? 'pointer' : 'not-allowed',
                opacity: canSelect ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isSelected && canSelect) {
                  e.currentTarget.style.borderColor = '#64748b';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#475569';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#ef4444' : '#475569'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444'
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                    {trilha.nome}
                    {trilha.requisitos && (
                      <span style={{ fontSize: '13px', color: '#fbbf24', marginLeft: '8px' }}>
                        • {trilha.requisitos}
                      </span>
                    )}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px' }}>
                    {trilha.descricao}
                  </p>

                  {reason && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '10px', 
                      backgroundColor: '#1e293b', 
                      borderRadius: '6px',
                      borderLeft: '3px solid #fbbf24',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <AlertCircle style={{ width: '16px', height: '16px', color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '13px', color: '#fbbf24' }}>{reason}</span>
                    </div>
                  )}
                  
                  {isSelected && trilha.habilidades.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', marginBottom: '8px' }}>
                        Habilidades da Trilha:
                      </h4>
                      {trilha.habilidades.map((hab) => (
                        <div key={hab.nivel} style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>
                            Nível {hab.nivel}:
                          </span>
                          <span style={{ fontSize: '13px', color: '#e2e8f0', marginLeft: '6px' }}>
                            {hab.nome}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Subcaminhos para Mestre de Barreiras */}
      {data.trilha === 'mestre_barreiras' && trilhaSelecionada?.subcaminhos && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
            Escolha seu Subcaminho
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {trilhaSelecionada.subcaminhos.map((subcaminho) => {
              const isSelected = data.subcaminhoMestreBarreiras === subcaminho.id;
              
              return (
                <Card
                  key={subcaminho.id}
                  onClick={() => handleSubcaminhoSelect(subcaminho.id as any)}
                  style={{
                    backgroundColor: isSelected ? '#1e293b' : '#0f172a',
                    borderColor: isSelected ? '#8b5cf6' : '#475569',
                    borderWidth: '2px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#8b5cf6' : '#475569'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#8b5cf6'
                          }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>
                        {subcaminho.nome}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                        {subcaminho.descricao}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      <br></br>
    </div>
  );
}
