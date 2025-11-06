// RoladorDados.tsx — Comentários em PT-BR sem alterar a lógica original

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Dices } from 'lucide-react';

interface DiceRollerProps {
  onRoll?: (result: number) => void;
}

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  // Simula a rolagem de 1d20 com pequena animação e emite o resultado
  const rollDice = () => {
    setRolling(true);
    setResult(null);

    // Delay para animar e depois sortear o valor final
    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 20) + 1;
      setResult(rolled);
      setRolling(false);
      onRoll?.(rolled);
    }, 600);
  };

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="flex items-center gap-4">
        <Button
          onClick={rollDice}
          disabled={rolling}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Dices className="w-4 h-4 mr-2" />
          Rolar D20
        </Button>

        <AnimatePresence mode="wait">
          {rolling && (
            <motion.div
              key="rolling"
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 360,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                duration: 0.6,
                rotate: { repeat: Infinity, duration: 0.3, ease: "linear" }
              }}
              className="flex items-center justify-center w-16 h-16 rounded-lg bg-indigo-600 text-white"
            >
              <Dices className="w-8 h-8" />
            </motion.div>
          )}
          
          {result !== null && !rolling && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`flex items-center justify-center w-16 h-16 rounded-lg ${
                result === 20
                  ? 'bg-green-600'
                  : result === 1
                  ? 'bg-red-600'
                  : 'bg-indigo-600'
              } text-white`}
            >
              <span className="text-2xl">{result}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {result !== null && !rolling && (
          <div className="text-slate-300">
            {result === 20 && <span className="text-green-400">Acerto Crítico! 🎯</span>}
            {result === 1 && <span className="text-red-400">Falha Crítica! 💥</span>}
            {result !== 20 && result !== 1 && <span>Resultado: {result}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
