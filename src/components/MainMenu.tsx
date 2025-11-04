import { useState } from 'react';
import { useAuth } from './AuthContext';
import { RoomManager } from './RoomManager';
import { CharacterManager } from './CharacterManager';
import { CombatTracker } from './CombatTracker';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sword, LogOut, Users, Home, Swords } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MainMenuProps {
  onJoinRoom: (roomCode: string, isDM: boolean) => void;
}

export function MainMenu({ onJoinRoom }: MainMenuProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sword className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-white">Tracker de Combate de RPG</h1>
                <p className="text-slate-400">Gerenciador de Combate do Seno</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-slate-400 text-sm">Conectado como</p>
                <p className="text-white">{user?.user_metadata?.name || user?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={signOut}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="rooms">
                <Home className="w-4 h-4 mr-2" />
                Salas Online
              </TabsTrigger>
              <TabsTrigger value="characters">
                <Users className="w-4 h-4 mr-2" />
                Personagens
              </TabsTrigger>
              <TabsTrigger value="local">
                <Swords className="w-4 h-4 mr-2" />
                Combate Local
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rooms">
              <RoomManager onJoinRoom={onJoinRoom} />
            </TabsContent>

            <TabsContent value="characters">
              <CharacterManager />
            </TabsContent>

            <TabsContent value="local">
              <Card className="p-6 bg-slate-800/50 border-slate-700 mb-6">
                <div className="text-center">
                  <h2 className="text-white mb-2">Modo Local</h2>
                  <p className="text-slate-400 text-sm">
                    Use este modo para jogar sozinho ou em uma única tela
                  </p>
                </div>
              </Card>
              <CombatTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
