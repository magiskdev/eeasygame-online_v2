import type { Team } from '../lib/types';

interface GameHeaderProps {
  round: number;
  activeTeam: Team;
  onHowToPlay: () => void;
  onSettings: () => void;
  onReset: () => void;
}

export function GameHeader({
  round,
  activeTeam,
  onHowToPlay,
  onSettings,
  onReset,
}: GameHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold">Alias</h1>
        <p className="text-gray-400 text-sm">
          Раунд: <span className="font-mono tabular-nums">{round}</span> · Сейчас ходит:{" "}
          <span className="text-blue-300">{activeTeam.name}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn" onClick={onHowToPlay}>
          Как играть
        </button>
        <button className="btn" onClick={onSettings}>
          Настройки
        </button>
        <button className="btn" onClick={onReset}>
          Сброс
        </button>
      </div>
    </header>
  );
}
