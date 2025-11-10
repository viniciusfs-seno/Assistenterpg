import React from 'react';
import { FichaPersonagem } from './components/FichaPersonagem'; // Ajuste o path conforme seu projeto

export function TesteFicha() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <FichaPersonagem />
    </div>
  );
}
