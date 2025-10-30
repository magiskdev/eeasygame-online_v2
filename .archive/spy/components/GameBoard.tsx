import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, Phase, LocationCard, Vote, RoundResult } from '../lib/types';

interface GameBoardProps {
  phase: Phase;
  players: Player[];
  location: LocationCard | null;
  vote: Vote;
  result: RoundResult | null;
  revealMode: 'private' | 'public';
  onAccuse: (id: string) => void;
  onCastVote: (voterId: string, up: boolean) => void;
  onResolveVote: () => void;
  onStartRound: () => void;
  onResetAll: () => void;
  isSpy: (id: string) => boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  phase,
  players,
  location,
  vote,
  result,
  revealMode,
  onAccuse,
  onCastVote,
  onResolveVote,
  onStartRound,
  onResetAll,
  isSpy,
}) => {
  if (phase === 'lobby') {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Добро пожаловать в Spy!</h2>
          <p className="text-gray-300">
            Добавьте игроков и начните игру
          </p>
        </div>
        
        {players.length >= 3 && (
          <motion.button
            onClick={onStartRound}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Начать игру
          </motion.button>
        )}
      </div>
    );
  }

  if (phase === 'ended' && result) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">
            {result.winner === 'spies' ? '🕵️' : '👥'}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Победили {result.winner === 'spies' ? 'Шпионы' : 'Горожане'}!
          </h2>
          <p className="text-gray-300 mb-6">
            {getResultText(result)}
          </p>
        </motion.div>
        
        <motion.button
          onClick={onResetAll}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-xl transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Новая игра
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Информация о локации (в публичном режиме) */}
      {revealMode === 'public' && location && (
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="text-sm text-gray-300 mb-2">Локация (видна всем в публичном режиме):</div>
          <div className="text-2xl font-bold">{location.name}</div>
          <div className="text-sm text-gray-400 mt-1">{location.categoryTitle}</div>
        </div>
      )}

      {/* Обвинение */}
      {phase === 'playing' && (
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Обвинить в шпионаже:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {players.map(player => (
              <button
                key={player.id}
                onClick={() => onAccuse(player.id)}
                className="p-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Голосование */}
      {phase === 'voting' && vote.accusedId && (
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">
            Голосование: обвиняется {players.find(p => p.id === vote.accusedId)?.name}
          </h3>
          
          <div className="space-y-3 mb-6">
            {players.filter(p => p.id !== vote.accusedId).map(player => {
              const hasVoted = vote.votes.hasOwnProperty(player.id);
              const votedYes = vote.votes[player.id];
              
              return (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="font-medium">{player.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onCastVote(player.id, true)}
                      className={`px-3 py-1 rounded transition-colors ${
                        hasVoted && votedYes
                          ? 'bg-green-600 text-white'
                          : 'bg-green-600/20 hover:bg-green-600/30 text-green-300'
                      }`}
                      disabled={hasVoted}
                    >
                      За
                    </button>
                    <button
                      onClick={() => onCastVote(player.id, false)}
                      className={`px-3 py-1 rounded transition-colors ${
                        hasVoted && !votedYes
                          ? 'bg-red-600 text-white'
                          : 'bg-red-600/20 hover:bg-red-600/30 text-red-300'
                      }`}
                      disabled={hasVoted}
                    >
                      Против
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={onResolveVote}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Завершить голосование
          </button>
        </div>
      )}
    </div>
  );
};

function getResultText(result: RoundResult): string {
  switch (result.reason) {
    case 'time':
      return 'Время вышло, шпионы остались незамеченными';
    case 'spy_guess':
      return result.winner === 'spies' 
        ? 'Шпион правильно угадал локацию' 
        : 'Шпион неправильно угадал локацию';
    case 'accused_spy':
      return 'Шпиона успешно вычислили и исключили';
    case 'accused_civil':
      return 'Горожанина ошибочно обвинили в шпионаже';
    default:
      return '';
  }
}
