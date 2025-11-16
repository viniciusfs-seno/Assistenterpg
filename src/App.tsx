import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { PaginaLogin } from './components/PaginaLogin';
import { PaginaMenuPrincipal } from './components/PaginaMenuPrincipal';
import { TrackerCombateSala } from './components/TrackerCombateSala';
import { CharacterList } from './components/ficha/CharacterList';
import { CharacterCreationWizard } from './components/ficha/CharacterCreationWizard';
import { FichaPersonagemCompleta } from './components/ficha/FichaPersonagemCompleta';
import { Sword } from 'lucide-react';

type AppView = 
  | { type: 'menu' }
  | { type: 'room'; code: string; isDM: boolean }
  | { type: 'characters' }
  | { type: 'character-create' }
  | { type: 'character-view'; characterId: string };

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>({ type: 'menu' });
  const [characterListRefresh, setCharacterListRefresh] = useState(0);

  // Handlers de navegação
  const handleJoinRoom = (roomCode: string, isDM: boolean) => {
    setCurrentView({ type: 'room', code: roomCode, isDM });
  };

  const handleLeaveRoom = () => {
    setCurrentView({ type: 'menu' });
  };

  const handleNavigateToCharacters = () => {
    setCurrentView({ type: 'characters' });
  };

  const handleNavigateToCharacterCreate = () => {
    setCurrentView({ type: 'character-create' });
  };

  const handleNavigateToCharacterView = (characterId: string) => {
    setCurrentView({ type: 'character-view', characterId });
  };

  const handleBackToMenu = () => {
    setCurrentView({ type: 'menu' });
  };

  const handleBackToCharacters = () => {
    setCurrentView({ type: 'characters' });
  };

  // Novo handler para atualizar lista de personagens após criação
  const handleCharacterCreated = (characterId: string) => {
    setCharacterListRefresh(r => r + 1);
    setCurrentView({ type: 'character-view', characterId });
  };

  // Loading e autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Sword className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <PaginaLogin />;
  }

  // Renderiza conteúdo baseado na view atual
  if (currentView.type === 'room') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sword className="w-8 h-8 text-red-500" />
              <h1 className="text-white">Tracker de Combate de RPG</h1>
              <Sword className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-slate-400">Gerenciador de Combate do Seno</p>
          </div>
          <TrackerCombateSala
            roomCode={currentView.code}
            isDM={currentView.isDM}
            onLeaveRoom={handleLeaveRoom}
          />
        </div>
      </div>
    );
  }

  if (currentView.type === 'characters') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <CharacterList
            onSelectCharacter={handleNavigateToCharacterView}
            onCreateNew={handleNavigateToCharacterCreate}
            refreshTrigger={characterListRefresh}
          />
        </div>
      </div>
    );
  }

  if (currentView.type === 'character-create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <CharacterCreationWizard
            onComplete={handleCharacterCreated}
            onCancel={handleBackToCharacters}
          />
        </div>
      </div>
    );
  }

  if (currentView.type === 'character-view') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <FichaPersonagemCompleta 
            characterId={currentView.characterId}
            onBack={handleBackToCharacters}
          />
        </div>
      </div>
    );
  }

  return (
    <PaginaMenuPrincipal 
      onJoinRoom={handleJoinRoom}
      onNavigateToCharacters={handleNavigateToCharacters}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
