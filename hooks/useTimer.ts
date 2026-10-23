import { useCallback, useEffect, useRef, useState } from 'react';

// Countdown measured against the wall clock rather than by counting ticks,
// so it stays accurate when the browser throttles a background tab.
export function useTimer(duration: number) {
  const [remainingMs, setRemainingMs] = useState(duration * 1000);
  const [running, setRunning] = useState(false);
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = Math.max(0, (endAtRef.current ?? 0) - Date.now());
      setRemainingMs(left);
      if (left === 0) setRunning(false);
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    setRemainingMs(prev => {
      const from = prev > 0 ? prev : duration * 1000;
      endAtRef.current = Date.now() + from;
      return from;
    });
    setRunning(true);
  }, [duration]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    endAtRef.current = null;
    setRemainingMs(duration * 1000);
  }, [duration]);

  // Changing the length while idle should show the new length immediately.
  useEffect(() => {
    if (!running) setRemainingMs(duration * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const remaining = Math.ceil(remainingMs / 1000);
  const fresh = !running && remainingMs === duration * 1000;
  const finished = remainingMs === 0;

  return { remaining, remainingMs, running, fresh, finished, start, pause, reset };
}
