interface GameControlsProps {
  running: boolean;
  canSkip: boolean;
  winner: boolean;
  seconds: number;
  onStart: () => void;
  onCorrect: () => void;
  onSkip: () => void;
  onEnd: () => void;
  onResume: () => void;
}

export function GameControls({
  running,
  canSkip,
  winner,
  seconds,
  onStart,
  onCorrect,
  onSkip,
  onEnd,
  onResume,
}: GameControlsProps) {
  if (winner) {
    return null;
  }

  if (!running) {
    return (
      <div className="flex justify-center">
        <button 
          className="btn btn-primary text-xl px-8 py-3"
          onClick={seconds > 0 && seconds < 60 ? onResume : onStart}
        >
          {seconds > 0 && seconds < 60 ? 'Продолжить ход' : 'Начать ход'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <button 
        className="btn btn-success text-lg px-6 py-2"
        onClick={onCorrect}
      >
        Отгадали! (Пробел)
      </button>
      
      <button 
        className={`btn text-lg px-6 py-2 ${canSkip ? 'btn-warning' : 'btn-disabled'}`}
        onClick={onSkip}
        disabled={!canSkip}
      >
        Пропуск (→)
      </button>
      
      <button 
        className="btn btn-danger text-lg px-6 py-2"
        onClick={onEnd}
      >
        Завершить ход (Enter)
      </button>
    </div>
  );
}
