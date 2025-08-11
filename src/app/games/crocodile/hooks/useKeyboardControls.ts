"use client";

import { useEffect } from 'react';
import type { GameState, GameActions } from '../lib/types';

interface UseKeyboardControlsProps {
  gameState: GameState;
  gameActions: GameActions;
}

export function useKeyboardControls({ gameState, gameActions }: UseKeyboardControlsProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Игнорируем если фокус на input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ": // Пробел
          e.preventDefault();
          if (gameState.running) {
            gameActions.onCorrect();
          } else {
            gameActions.startTurn();
          }
          break;
        case "Enter":
          e.preventDefault();
          if (gameState.running) {
            gameActions.endTurn();
          } else {
            gameActions.startTurn();
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (gameState.running && gameState.skipsLeft > 0) {
            gameActions.onSkip();
          }
          break;
        case "h":
        case "H":
          e.preventDefault();
          if (gameState.running) {
            gameActions.toggleWordVisibility();
          }
          break;
        case "r":
        case "R":
          e.preventDefault();
          if (!gameState.running) {
            gameActions.resetGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, gameActions]);
}
