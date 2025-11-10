// PaginaMenuPrincipal.tsx — PADRÃO ORIGINAL RESTAURADO

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { GerenciadorSala } from './GerenciadorSala';
import { GerenciadorPersonagem } from './GerenciadorPersonagem';
import { TrackerCombate } from './TrackerCombate';
import { PerfilUsuario } from './PerfilUsuario';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sword, LogOut, Users, Home, Swords, User, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface MainMenuProps {
  onJoinRoom: (roomCode: string, isDM: boolean) => void;
  onNavigateToCharacters: () => void;
}

export function PaginaMenuPrincipal({ 
  onJoinRoom,
  onNavigateToCharacters 
}: MainMenuProps) {
  const { user, profile, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header com identidade do app e sessão */}
        <div className="mb-8">
          {/* LINHA 1: Título centralizado + Perfil direita */}
          <div className="flex items-center justify-between mb-4">
            {/* Título à esquerda (ocupa espaço central) */}
            <div className="flex items-center gap-3 flex-1">
              <Sword className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-white">Tracker de Combate de RPG</h1>
                <p className="text-slate-400">Gerenciador de Combate do Seno</p>
              </div>
            </div>
            
            {/* Perfil à direita */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-slate-400 text-sm">Conectado como</p>
                <p className="text-white font-semibold">
                  {profile?.nickname || user?.email?.split('@')[0] || 'Usuário'}
                </p>
              </div>
              {/* Botão de Perfil */}
              <Button
                variant="outline"
                onClick={() => setShowProfile(true)}
                className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
              {/* Botão de Sair */}
              <Button
                variant="outline"
                onClick={signOut}
                className="bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo principal com abas de navegação (4 ABAS) */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="rooms" className="w-full">
            {/* TABS INLINE (LADO A LADO) - SEM GRID */}
            <div className="mb-6">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-slate-800 p-1 text-slate-400 w-full">
                <TabsTrigger value="rooms" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <Home className="w-4 h-4 mr-2" />
                  Salas Online
                </TabsTrigger>
                <TabsTrigger value="characters" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Personagens v1.0
                </TabsTrigger>
                <TabsTrigger value="fichas" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Fichas v2.0
                </TabsTrigger>
                <TabsTrigger value="local" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <Swords className="w-4 h-4 mr-2" />
                  Combate Local
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Abas: Salas (online) */}
            <TabsContent value="rooms">
              <GerenciadorSala onJoinRoom={onJoinRoom} />
            </TabsContent>

            {/* Abas: Personagens v1.0 (CRUD antigo - mantido) */}
            <TabsContent value="characters">
              <GerenciadorPersonagem />
            </TabsContent>

            {/* Abas: Fichas v2.0 (NOVO - Sistema completo) */}
            <TabsContent value="fichas">
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-white text-2xl font-bold mb-2">
                    Sistema de Fichas v2.0
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Sistema completo de criação e gerenciamento de personagens do Jujutsu Kaisen RPG
                  </p>
                  <Button
                    onClick={onNavigateToCharacters}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Acessar Fichas
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Abas: Combate local (sem sincronização com sala) */}
            <TabsContent value="local">
              <Card className="p-6 bg-slate-800/50 border-slate-700 mb-6">
                <div className="text-center">
                  <h2 className="text-white text-xl font-bold mb-2">Modo Local</h2>
                  <p className="text-slate-400 text-sm">
                    Use este modo para jogar sozinho ou em uma única tela
                  </p>
                </div>
              </Card>
              <TrackerCombate />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de Perfil */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <User className="w-6 h-6" />
              Meu Perfil
            </DialogTitle>
          </DialogHeader>
          <PerfilUsuario />
        </DialogContent>
      </Dialog>
    </div>
  );
}
