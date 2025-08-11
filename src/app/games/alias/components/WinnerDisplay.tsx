import { motion } from "framer-motion";
import type { Team } from '../lib/types';

interface WinnerDisplayProps {
  winner: Team;
}

export function WinnerDisplay({ winner }: WinnerDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card text-center space-y-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
    >
      <div className="text-6xl">🏆</div>
      
      <div>
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          Победа!
        </h2>
        <p className="text-xl">
          Команда <span className="font-bold text-yellow-300">{winner.name}</span> 
          {" "}набрала <span className="font-bold">{winner.score}</span> очков!
        </p>
      </div>
      
      <div className="text-sm text-gray-400">
        Поздравляем с победой! 🎉
      </div>
    </motion.div>
  );
}
