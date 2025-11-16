import { useCharacter } from '../../hooks/useCharacter';
import { CompleteCharacterSheet } from './CompleteCharacterSheet';
import { Character } from '../../types/character';

interface FichaPersonagemCompletaProps {
  characterId?: string;
  character?: Character | null;
  onBack: () => void;
  onEdit?: () => void;
  viewMode?: 'simple' | 'detailed'; 
}

export function FichaPersonagemCompleta({
  characterId,
  character: characterProp,
  onBack,
  onEdit,
  viewMode = 'detailed'
}: FichaPersonagemCompletaProps) {
  const { character, loading, error } = useCharacter(characterId);

  const characterToShow = character || characterProp;

  if (loading) {
    return <div style={{ color: '#fff', padding: 24, textAlign: 'center' }}>Carregando personagem...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: 24, textAlign: 'center' }}>Erro ao carregar personagem: {error}</div>;
  }

  if (!characterToShow || !characterToShow.classe) {
    return <div style={{ color: '#fff', padding: 24, textAlign: 'center' }}>Personagem não encontrado</div>;
  }

  return (
    <CompleteCharacterSheet
      character={characterToShow}
      onBack={onBack}
      onEdit={onEdit}
      viewMode={viewMode}
    />
  );
}
