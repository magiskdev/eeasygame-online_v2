import { motion } from "framer-motion";

interface GameBoardProps {
  currentWord: string;
  seconds: number;
  turnScore: number;
  skipsLeft: number;
  running: boolean;
  onPause?: () => void;
  onResume?: () => void;
}

export function GameBoard({
  currentWord,
  seconds,
  turnScore,
  skipsLeft,
  running,
  onPause,
  onResume,
}: GameBoardProps) {
  return (
    <div className="card text-center space-y-4">
      {/* Таймер с кнопкой паузы */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-6xl font-bold text-blue-400 font-mono tabular-nums">
          {seconds}
        </div>
        {seconds > 0 && (onPause || onResume) && running && (
          <button
            className="btn btn-secondary text-sm px-3 py-2 flex items-center gap-2"
            onClick={onPause}
          >
            <span>⏸️</span>
            <span>Пауза</span>
          </button>
        )}
      </div>

      {/* Текущее слово */}
      <motion.div
        key={currentWord}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold min-h-[3rem] flex items-center justify-center"
      >
        <span className="text-4xl font-bold min-h-[3rem] flex items-center justify-center">{currentWord}</span>
      </motion.div>

      {/* Статистика хода */}
      <div className="flex justify-center gap-6 text-lg">
        <div>
          Очки за ход: <span className="text-green-400 font-bold font-mono tabular-nums">{turnScore}</span>
        </div>
        <div>
          Пропусков: <span className="text-yellow-400 font-bold font-mono tabular-nums">{skipsLeft}</span>
        </div>
      </div>
    </div>
  );
}
