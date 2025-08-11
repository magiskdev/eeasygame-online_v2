import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, LocationCard } from '../lib/types';

interface PlayerCardProps {
  player: Player;
  role: 'spy' | 'civil';
  location: LocationCard | null;
  revealed: boolean;
  onToggle: () => void;
  revealMode: 'private' | 'public';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  role,
  location,
  revealed,
  onToggle,
  revealMode,
}) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-lg">{player.name}</div>
        <button
          onClick={onToggle}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            revealed
              ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300'
              : 'bg-green-600/20 hover:bg-green-600/30 text-green-300'
          }`}
        >
          {revealed ? 'Скрыть' : 'Показать'}
        </button>
      </div>
      
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-black/30 border border-white/10"
          >
            {role === 'spy' ? (
              <div className="text-center">
                <div className="text-3xl mb-2">🕵️</div>
                <div className="text-red-400 font-bold text-lg mb-1">ВЫ ШПИОН</div>
                {revealMode === 'private' && location && (
                  <div className="text-sm text-gray-300">
                    Локацию не знаете. Попытайтесь её выяснить!
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-blue-400 font-bold text-lg mb-1">ВЫ ГОРОЖАНИН</div>
                <div className="text-sm text-gray-300 mb-2">Ваша локация:</div>
                <div className="text-white font-semibold text-lg">
                  {location?.name || '—'}
                </div>
                {location && (
                  <div className="text-xs text-gray-400 mt-1">
                    {location.categoryTitle}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
