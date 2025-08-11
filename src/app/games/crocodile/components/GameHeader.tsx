"use client";

import React from 'react';
import type { Team } from '../lib/types';

interface GameHeaderProps {
  round: number;
  activeTeam: Team;
  seconds: number;
  running: boolean;
  onHowToPlay: () => void;
  onSettings: () => void;
  onReset: () => void;
  onLog: () => void;
}

export function GameHeader({ 
  round, 
  activeTeam, 
  seconds, 
  running,
  onHowToPlay,
  onSettings,
  onReset,
  onLog
}: GameHeaderProps) {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPresenter = () => {
    if (!activeTeam.presenters || activeTeam.presenters.length === 0) {
      return 'Нет игроков';
    }
    return activeTeam.presenters[activeTeam.currentPresenterIndex] || 'Не выбран';
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Крокодил</h1>
        <p className="text-gray-400 text-sm">
          Раунд: <span className="font-mono tabular-nums">{round}</span> · Ходит:{" "}
          <span className="text-blue-300">{activeTeam.name}</span> · Время:{" "}
          <span className={`font-mono tabular-nums font-semibold ${
            running 
              ? seconds <= 10 
                ? 'text-red-400' 
                : 'text-green-400'
              : 'text-gray-400'
          }`}>
            {formatTime(seconds)}
          </span>
        </p>
        <p className="text-gray-500 text-xs">
          Ведущий: <span className="text-yellow-300 font-medium">{getCurrentPresenter()}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn" onClick={onHowToPlay}>
          Как играть
        </button>
        <button className="btn" onClick={onSettings}>
          Настройки
        </button>
        <button className="btn" onClick={onLog}>
          История
        </button>
        {!running && (
          <button className="btn" onClick={onReset} title="R">
            Сброс
          </button>
        )}
      </div>
    </header>
  );
}
