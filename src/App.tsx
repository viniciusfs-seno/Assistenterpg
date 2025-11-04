import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginPage } from './components/PaginaLogin';
import { MainMenu } from './components/PaginaMenuPrincipal';
import { RoomCombatTracker } from './components/TrackerCombateSala'
import { Sword } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentRoom, setCurrentRoom] = useState<{ code: string; isDM: boolean } | null>(null);

  const handleJoinRoom = (roomCode: string, isDM: boolean) => {
    setCurrentRoom({ code: roomCode, isDM });
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

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
    return <LoginPage />;
  }

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
          <RoomCombatTracker
            roomCode={currentRoom.code}
            isDM={currentRoom.isDM}
            onLeaveRoom={handleLeaveRoom}
          />
        </div>
      </div>
    );
  }

  return <MainMenu onJoinRoom={handleJoinRoom} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
