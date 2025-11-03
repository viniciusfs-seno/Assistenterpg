import { useState } from 'react';
import { CombatTracker } from './components/CombatTracker';
import { Sword } from 'lucide-react';

export default function App() {
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
        <CombatTracker />
      </div>
    </div>
  );
}
