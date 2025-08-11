import { useEffect, useRef } from 'react';
import { KEYBOARD_SHORTCUTS } from '../lib/constants';

interface UseKeyboardControlsProps {
  running: boolean;
  onCorrect: () => void;
  onSkip: () => void;
  onStartPause: () => void;
  onPause: () => void;
}

export function useKeyboardControls({ 
  running, 
  onCorrect, 
  onSkip, 
  onStartPause,
  onPause
}: UseKeyboardControlsProps) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KEYBOARD_SHORTCUTS.CORRECT) {
        e.preventDefault();
        running ? onCorrect() : onStartPause();
      } else if (e.code === KEYBOARD_SHORTCUTS.SKIP) {
        e.preventDefault();
        onSkip();
      } else if (e.code === KEYBOARD_SHORTCUTS.START_PAUSE) {
        e.preventDefault();
        onStartPause();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        if (running) {
          onPause();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [running, onCorrect, onSkip, onStartPause, onPause]);
}
