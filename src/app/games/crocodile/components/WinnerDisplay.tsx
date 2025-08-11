"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../lib/types';

interface WinnerDisplayProps {
  winner: Team | null;
  goalPoints: number;
}

export function WinnerDisplay({ winner, goalPoints }: WinnerDisplayProps) {
  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="card border-2 border-green-500/50"
        >
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">Победа!</div>
            <div className="text-gray-300">
              {winner.name} достигли цели в {goalPoints} очков 🎉
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
