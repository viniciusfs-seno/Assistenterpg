import { useState, useEffect } from 'react';
import { Character } from '../../types/character';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Trash2, Eye, Edit2, RefreshCw } from 'lucide-react';
import { useCharacterList } from '../../hooks/useCharacter';
import { getClasseData } from '../../data/classes';
import { FichaPersonagemCompleta } from './FichaPersonagemCompleta';
import { supabase } from '../../utils/supabase/client';

interface CharacterListProps {
  onCreateNew: () => void;
  onSelectCharacter: (characterId: string) => void;  // Ajustado para id string
  onViewCharacter?: (character: Character) => void;
  refreshTrigger?: number;
}

export function CharacterList({ 
  onCreateNew, 
  onSelectCharacter, 
  onViewCharacter,
  refreshTrigger 
}: CharacterListProps) {
  const { characters, loading, reloadCharacters } = useCharacterList();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      reloadCharacters();
    }
  }, [refreshTrigger, reloadCharacters]);

  const handleDelete = async (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      setDeletingId(id);
      
      try {
        const { error } = await supabase
          .from('characters')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await reloadCharacters();
      } catch (error) {
        console.error('Erro ao deletar personagem:', error);
        alert('Erro ao deletar personagem');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadCharacters();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleCloseView = () => setViewingCharacter(null);
  const handleCloseEdit = () => setEditingCharacter(null);

  if (viewingCharacter) {
    return (
      <FichaPersonagemCompleta
        character={viewingCharacter}
        onBack={handleCloseView}
        viewMode="detailed"
      />
    );
  }

  if (editingCharacter) {
    return (
      <FichaPersonagemCompleta
        character={editingCharacter}
        onBack={handleCloseEdit}
        onEdit={() => {}}
        viewMode="detailed"
      />
    );
  }

  const safeCharacters = characters ?? [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '24px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
              Meus Personagens
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8' }}>
              Gerencie seus feiticeiros de Jujutsu Kaisen
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              backgroundColor: '#334155',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: refreshing ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#334155';
            }}
          >
            <RefreshCw 
              style={{ 
                width: '18px', 
                height: '18px',
                animation: refreshing ? 'spin 1s linear infinite' : 'none'
              }} 
            />
            Atualizar
          </button>
        </div>
      </div>

      {/* BOTÃO CRIAR NOVO */}
      <Button
        onClick={onCreateNew}
        style={{
          backgroundColor: '#ef4444',
          color: '#ffffff',
          border: 'none',
          padding: '16px 32px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(239, 68, 68, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ef4444';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Plus style={{ width: '20px', height: '20px' }} />
        Criar Novo Personagem
      </Button>

      {/* LOADING STATE */}
      {loading && (
        <Card
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
            padding: '48px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⏳</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            Carregando personagens...
          </h3>
        </Card>
      )}

      {/* EMPTY STATE */}
      {!loading && safeCharacters.length === 0 && (
        <Card
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
            padding: '48px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>👤</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            Nenhum personagem criado
          </h3>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
            Clique em "Criar Novo Personagem" para começar sua jornada
          </p>
          <Button
            onClick={onCreateNew}
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Criar Primeiro Personagem
          </Button>
        </Card>
      )}

      {/* LISTA DE PERSONAGENS */}
      {!loading && safeCharacters.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {safeCharacters.map((character) => {
            const classeData = getClasseData(character.classe);
            const isDeleting = deletingId === character.id;

            return (
              <Card
                key={character.id}
                style={{
                  backgroundColor: '#1e293b',
                  borderColor: '#475569',
                  padding: '24px',
                  opacity: isDeleting ? 0 : 1,
                  transform: isDeleting ? 'scale(0.9)' : 'scale(1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectCharacter(character.id)}  // Corrigido para passar o ID corretamente
              >
                {/* HEADER DO CARD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                      {character.nome}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                      {classeData?.nome} • Nível {character.nivel}
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Nv. {character.nivel}
                  </div>
                </div>

                {/* RECURSOS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <ResourceBar
                    label="PV"
                    current={character.stats.pvAtual}
                    max={character.stats.pvMax}
                    color="#ef4444"
                  />
                  <ResourceBar
                    label="PE"
                    current={character.stats.peAtual}
                    max={character.stats.peMax}
                    color="#3b82f6"
                  />
                  <ResourceBar
                    label="SAN"
                    current={character.stats.sanAtual}
                    max={character.stats.sanMax}
                    color="#8b5cf6"
                  />
                </div>

                {/* ATRIBUTOS */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: '#0f172a',
                    borderRadius: '8px'
                  }}
                >
                  <AttributeBadge label="AGI" value={character.atributos.agilidade} />
                  <AttributeBadge label="FOR" value={character.atributos.forca} />
                  <AttributeBadge label="INT" value={character.atributos.intelecto} />
                  <AttributeBadge label="PRE" value={character.atributos.presenca} />
                  <AttributeBadge label="VIG" value={character.atributos.vigor} />
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingCharacter(character);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; }}
                  >
                    <Eye style={{ width: '16px', height: '16px' }} />
                    Visualizar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCharacter(character);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#16a34a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#22c55e'; }}
                  >
                    <Edit2 style={{ width: '16px', height: '16px' }} />
                    Editar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(character.id, character.nome);
                    }}
                    style={{
                      backgroundColor: '#475569',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#475569'; }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ResourceBar({ label, current, max, color }: any) {
  const percentage = Math.min(100, (current / max) * 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color }}>{current}/{max}</span>
      </div>
      <div style={{ height: '6px', backgroundColor: '#0f172a', borderRadius: '999px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: color,
            transition: 'width 0.3s'
          }}
        />
      </div>
    </div>
  );
}

function AttributeBadge({ label, value }: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px', fontWeight: '600' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>{value}</div>
    </div>
  );
}
