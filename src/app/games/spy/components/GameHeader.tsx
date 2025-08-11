import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../lib/utils';
import type { Phase } from '../lib/types';

interface GameHeaderProps {
  phase: Phase;
  seconds: number;
  playersCount: number;
  spiesCount: number;
  onHowToPlay: () => void;
  onSettings: () => void;
  onLog: () => void;
  onReset: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  phase,
  seconds,
  playersCount,
  spiesCount,
  onHowToPlay,
  onSettings,
  onLog,
  onReset,
}) => {
  const getPhaseText = () => {
    switch (phase) {
      case 'lobby':
        return 'Лобби';
      case 'playing':
        return 'Игра идет';
      case 'voting':
        return 'Голосование';
      case 'ended':
        return 'Игра окончена';
      default:
        return '';
    }
  };

  const getTimerColor = () => {
    if (phase !== 'playing') return 'text-white';
    if (seconds <= 30) return 'text-red-400';
    if (seconds <= 60) return 'text-yellow-400';
    return 'text-white';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
      {/* Левая часть - информация об игре */}
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-300">
          <div className="font-medium">{getPhaseText()}</div>
          {phase !== 'lobby' && (
            <div className="text-xs">
              Игроков: {playersCount} | Шпионов: {spiesCount}
            </div>
          )}
        </div>
        
        {phase === 'playing' && (
          <motion.div
            className={`text-2xl font-mono font-bold ${getTimerColor()}`}
            animate={seconds <= 10 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: seconds <= 10 ? Infinity : 0 }}
          >
            {formatTime(seconds)}
          </motion.div>
        )}
      </div>

      {/* Правая часть - кнопки управления */}
      <div className="flex items-center gap-2">
        <button
          onClick={onHowToPlay}
          className="px-3 py-1.5 text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors"
          title="Как играть (H)"
        >
          Правила
        </button>
        
        <button
          onClick={onSettings}
          className="px-3 py-1.5 text-sm bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors"
          title="Настройки (S)"
        >
          Настройки
        </button>
        
        <button
          onClick={onLog}
          className="px-3 py-1.5 text-sm bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-lg transition-colors"
          title="Лог раунда (L)"
        >
          История
        </button>
        
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
          title="Сбросить игру (R)"
        >
          Сброс
        </button>
      </div>
    </div>
  );
};
