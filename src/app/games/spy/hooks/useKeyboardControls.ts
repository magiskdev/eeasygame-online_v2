import { useEffect } from 'react';
import type { Phase } from '../lib/types';

interface UseKeyboardControlsProps {
  phase: Phase;
  running: boolean;
  onStartRound: () => void;
  onStopTimer: () => void;
  onResetAll: () => void;
  onToggleHowToPlay: () => void;
  onToggleSettings: () => void;
  onToggleLog: () => void;
}

export function useKeyboardControls({
  phase,
  running,
  onStartRound,
  onStopTimer,
  onResetAll,
  onToggleHowToPlay,
  onToggleSettings,
  onToggleLog,
}: UseKeyboardControlsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Игнорируем, если фокус на input или textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (phase === 'lobby') {
            onStartRound();
          } else if (phase === 'playing' && running) {
            onStopTimer();
          }
          break;
        case 'KeyR':
          event.preventDefault();
          onResetAll();
          break;
        case 'KeyH':
          event.preventDefault();
          onToggleHowToPlay();
          break;
        case 'KeyS':
          event.preventDefault();
          onToggleSettings();
          break;
        case 'KeyL':
          event.preventDefault();
          onToggleLog();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    phase,
    running,
    onStartRound,
    onStopTimer,
    onResetAll,
    onToggleHowToPlay,
    onToggleSettings,
    onToggleLog,
  ]);
}
