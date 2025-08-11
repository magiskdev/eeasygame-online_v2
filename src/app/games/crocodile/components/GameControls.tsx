"use client";

import React from 'react';
import type { GameState, GameActions } from '../lib/types';

interface GameControlsProps {
  gameState: GameState;
  gameActions: GameActions;
  minusOnSkip: boolean;
}

export function GameControls({ gameState, gameActions, minusOnSkip }: GameControlsProps) {
  const { running, skipsLeft, hidden } = gameState;
  const { startTurn, endTurn, onCorrect, onSkip, toggleWordVisibility } = gameActions;

  if (running) {
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          className="btn btn-primary"
          onClick={onCorrect}
          title="Пробел"
        >
          Отгадали
        </button>
        <button
          className="btn"
          onClick={onSkip}
          disabled={skipsLeft <= 0}
          title="→"
        >
          Пропуск{minusOnSkip ? " (-1)" : ""} ({skipsLeft})
        </button>
        <button
          className="btn"
          onClick={toggleWordVisibility}
          title="H"
        >
          Показать слово (H)
        </button>
        <button 
          className="btn" 
          onClick={endTurn} 
          title="Enter"
        >
          Завершить ход
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <button
        className="btn btn-primary"
        onClick={startTurn}
        title="Пробел / Enter"
      >
        Старт
      </button>
    </div>
  );
}
