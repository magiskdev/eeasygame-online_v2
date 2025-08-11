import { useEffect } from 'react';

interface UseTimerProps {
  seconds: number;
  running: boolean;
  onTimeUp: () => void;
  onTick: (seconds: number) => void;
}

export function useTimer({ seconds, running, onTimeUp, onTick }: UseTimerProps) {
  useEffect(() => {
    if (!running) return;
    
    if (seconds <= 0) {
      onTimeUp();
      return;
    }
    
    const id = setTimeout(() => {
      onTick(seconds - 1);
    }, 1000);
    
    return () => clearTimeout(id);
  }, [running, seconds, onTimeUp, onTick]);
}
