"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export function usePerMoveTimer(init: number) {
  const [seconds, setSeconds] = useState(init);
  const [running, setRunning] = useState(false);
  const id = useRef<number | null>(null);

  const start = useCallback(() => {
    if (id.current) return;
    setRunning(true);
    id.current = window.setInterval(() => setSeconds((s) => s - 1), 1000);
  }, []);
  const stop = useCallback(() => {
    setRunning(false);
    if (id.current) {
      clearInterval(id.current);
      id.current = null;
    }
  }, []);
  const resetTo = useCallback((n: number) => setSeconds(n), []);
  useEffect(
    () => () => {
      if (id.current) clearInterval(id.current);
    },
    []
  );
  return { seconds, running, start, stop, resetTo };
}
