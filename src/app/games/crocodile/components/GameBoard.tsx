"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { CrocWord } from '../lib/dictionaries';

interface GameBoardProps {
  current?: CrocWord;
  hidden: boolean;
  hintVisible: boolean;
  turnScore: number;
  allowHints: boolean;
  difficultyScoring: boolean;
  currentPoints: (word: CrocWord) => number;
}

export function GameBoard({ 
  current, 
  hidden, 
  hintVisible, 
  turnScore, 
  allowHints,
  difficultyScoring,
  currentPoints 
}: GameBoardProps) {
  if (!current) {
    return (
      <div className="card text-center">
        <div className="text-gray-400 text-lg">
          Нет доступных слов
        </div>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400', 
    hard: 'text-red-400'
  };

  const difficultyLabels = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно'
  };

  return (
    <div className="card text-center space-y-4">
      {/* Слово */}
      <div className="min-h-[120px] flex items-center justify-center">
        {hidden ? (
          <div className="text-gray-500 text-xl">
            Слово скрыто
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
          >
            <div className="text-3xl font-bold">
              {current.text}
            </div>
            {current.category && (
              <div className="text-gray-400 text-sm">
                Категория: {current.category}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Информация о слове */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className={`font-semibold ${difficultyColors[current.difficulty]}`}>
          {difficultyLabels[current.difficulty]}
        </div>
        {difficultyScoring && (
          <div className="text-gray-300">
            Очков: <span className="font-mono tabular-nums font-semibold">
              {currentPoints(current)}
            </span>
          </div>
        )}
        <div className="text-blue-400">
          Счет хода: <span className="font-mono tabular-nums font-semibold">
            {turnScore}
          </span>
        </div>
      </div>

      {/* Подсказка */}
      {allowHints && hintVisible && current.hint && !hidden && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
        >
          <div className="text-yellow-400 text-sm font-semibold mb-1">
            💡 Подсказка:
          </div>
          <div className="text-gray-300 text-sm">
            {current.hint}
          </div>
        </motion.div>
      )}
    </div>
  );
}
