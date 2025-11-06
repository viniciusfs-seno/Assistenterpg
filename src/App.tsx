// App.tsx — Comentários em PT-BR adicionados sem alterar a lógica

import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { PaginaLogin } from './components/PaginaLogin';
import { PaginaMenuPrincipal } from './components/PaginaMenuPrincipal';
import { TrackerCombateSala } from './components/TrackerCombateSala';
import { Sword } from 'lucide-react';

// Componente que controla a navegação interna com base no estado de autenticação e da sala atual
function AppContent() {
  // Obtém usuário e estado de carregamento do contexto de autenticação (Supabase)
  const { user, loading } = useAuth();

  // Controla a sala atual (roomCode) e se o usuário atua como Mestre (DM)
  const [currentRoom, setCurrentRoom] = useState<{ code: string; isDM: boolean } | null>(null);

  // Handler: entrar em uma sala (define o código e se é DM)
  const handleJoinRoom = (roomCode: string, isDM: boolean) => {
    setCurrentRoom({ code: roomCode, isDM });
  };

  // Handler: sair da sala atual e voltar ao menu principal
  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  // Estado global de autenticação ainda carregando: mostra splash/loading simples
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

  // Não autenticado: renderiza tela de login
  if (!user) {
    return <PaginaLogin />;
  }

  // Dentro de uma sala: renderiza o tracker sincronizado por sala (tempo real via polling no serverless)
  if (currentRoom) {
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
            roomCode={currentRoom.code}
            isDM={currentRoom.isDM}
            onLeaveRoom={handleLeaveRoom}
          />
        </div>
      </div>
    );
  }

  // Fora de sala: renderiza menu principal com abas de Salas, Personagens e modo Local
  return <PaginaMenuPrincipal onJoinRoom={handleJoinRoom} />;
}

// Exporta a aplicação envelopada pelo AuthProvider para disponibilizar o contexto de auth
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
