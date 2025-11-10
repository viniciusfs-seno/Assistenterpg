// App.tsx — Sistema v2.0 integrado (mantém estrutura original) - CORRIGIDO

import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { PaginaLogin } from './components/PaginaLogin';
import { PaginaMenuPrincipal } from './components/PaginaMenuPrincipal';
import { TrackerCombateSala } from './components/TrackerCombateSala';
import { CharacterList } from './components/ficha/CharacterList';
import { CharacterCreationWizard } from './components/ficha/CharacterCreationWizard';
import { FichaPersonagemCompleta } from './components/ficha/FichaPersonagemCompleta';
import { Sword } from 'lucide-react';

// Tipo para controlar qual tela mostrar
type AppView = 
  | { type: 'menu' }
  | { type: 'room'; code: string; isDM: boolean }
  | { type: 'characters' }
  | { type: 'character-create' }
  | { type: 'character-view'; characterId: string };

// Componente que controla a navegação interna
function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>({ type: 'menu' });

  // ========== HANDLERS DE NAVEGAÇÃO ==========
  
  // Handler: entrar em uma sala
  const handleJoinRoom = (roomCode: string, isDM: boolean) => {
    setCurrentView({ type: 'room', code: roomCode, isDM });
  };

  // Handler: sair da sala
  const handleLeaveRoom = () => {
    setCurrentView({ type: 'menu' });
  };

  // Handler: ir para lista de personagens
  const handleNavigateToCharacters = () => {
    setCurrentView({ type: 'characters' });
  };

  // Handler: ir para criação de personagem
  const handleNavigateToCharacterCreate = () => {
    setCurrentView({ type: 'character-create' });
  };

  // Handler: ir para visualização de personagem
  const handleNavigateToCharacterView = (characterId: string) => {
    setCurrentView({ type: 'character-view', characterId });
  };

  // Handler: voltar ao menu principal
  const handleBackToMenu = () => {
    setCurrentView({ type: 'menu' });
  };

  // Handler: voltar para lista de personagens
  const handleBackToCharacters = () => {
    setCurrentView({ type: 'characters' });
  };

  // ========== LOADING ==========
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

  // ========== NÃO AUTENTICADO ==========
  if (!user) {
    return <PaginaLogin />;
  }

  // ========== RENDERIZAÇÃO BASEADA NA VIEW ATUAL ==========
  
  // Dentro de uma sala
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

  // Lista de personagens
  if (currentView.type === 'characters') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <CharacterList
            onCreateNew={handleNavigateToCharacterCreate}
            onViewCharacter={handleNavigateToCharacterView}
            onBack={handleBackToMenu}
          />
        </div>
      </div>
    );
  }

  // Criação de personagem - CORRIGIDO: Adicionado background consistente
  if (currentView.type === 'character-create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <CharacterCreationWizard
            onComplete={handleNavigateToCharacterView}
            onCancel={handleBackToCharacters}
          />
        </div>
      </div>
    );
  }

  // Visualização de personagem
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

  // Menu principal (padrão)
  return (
    <PaginaMenuPrincipal 
      onJoinRoom={handleJoinRoom}
      onNavigateToCharacters={handleNavigateToCharacters}
    />
  );
}

// Exporta a aplicação envelopada pelo AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
