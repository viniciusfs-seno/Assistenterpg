// RoladorDados.tsx — Comentários em PT-BR sem alterar a lógica original

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { Dices, Settings } from 'lucide-react';

interface DiceRollerProps {
  onRoll?: (result: number) => void;
}

interface RollResult {
  dice: number[];
  best: number;
  sum: number;
}

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [result, setResult] = useState<number | null>(null);
  const [customResult, setCustomResult] = useState<RollResult | null>(null);
  const [rolling, setRolling] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [numDice, setNumDice] = useState('1');
  const [numFaces, setNumFaces] = useState('20');

  // Simula a rolagem de 1d20 com pequena animação e emite o resultado
  const rollDice = () => {
    setRolling(true);
    setResult(null);
    setCustomResult(null);

    // Delay para animar e depois sortear o valor final
    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 20) + 1;
      setResult(rolled);
      setRolling(false);
      onRoll?.(rolled);
    }, 600);
  };

  const rollCustom = () => {
    const dice = parseInt(numDice) || 1;
    const faces = parseInt(numFaces) || 20;

    if (dice < 1 || dice > 100 || faces < 2 || faces > 1000) {
      alert('Valores inválidos. Use 1-100 dados e 2-1000 faces.');
      return;
    }

    setRolling(true);
    setResult(null);
    setCustomResult(null);

    setTimeout(() => {
      const rolls: number[] = [];
      for (let i = 0; i < dice; i++) {
        rolls.push(Math.floor(Math.random() * faces) + 1);
      }
      
      const sum = rolls.reduce((acc, val) => acc + val, 0);
      const best = Math.max(...rolls);

      setCustomResult({ dice: rolls, best, sum });
      setRolling(false);
      onRoll?.(sum);
    }, 600);
  };

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            onClick={rollDice}
            disabled={rolling}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Dices className="w-4 h-4 mr-2" />
            Rolar D20
          </Button>

          <Button
            onClick={() => setShowCustom(!showCustom)}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showCustom ? 'Ocultar' : 'Rolagem Personalizada'}
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

        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 border-t border-slate-700 pt-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="num-dice" className="text-slate-300">Número de Dados</Label>
                <Input
                  id="num-dice"
                  type="number"
                  min="1"
                  max="100"
                  value={numDice}
                  onChange={(e) => setNumDice(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="num-faces" className="text-slate-300">Faces por Dado</Label>
                <Input
                  id="num-faces"
                  type="number"
                  min="2"
                  max="1000"
                  value={numFaces}
                  onChange={(e) => setNumFaces(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <Button
              onClick={rollCustom}
              disabled={rolling}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Dices className="w-4 h-4 mr-2" />
              Rolar {numDice}d{numFaces}
            </Button>
          </motion.div>
        )}

        {customResult && !rolling && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Resultado Total:</span>
              <span className="text-2xl text-white">{customResult.sum}</span>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-slate-400">Rolagens individuais:</span>
              <div className="flex flex-wrap gap-2">
                {customResult.dice.map((roll, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded ${
                      roll === customResult.best
                        ? 'bg-green-600 text-white ring-2 ring-green-400'
                        : 'bg-slate-600 text-slate-200'
                    }`}
                  >
                    {roll}
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-500">
                <span className="text-green-400">Verde</span> = Melhor resultado
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
