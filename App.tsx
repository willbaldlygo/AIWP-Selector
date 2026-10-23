import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Wheel from './components/Wheel';
import SpeakerPanel from './components/SpeakerPanel';
import RosterPanel from './components/RosterPanel';
import NamesEditor from './components/NamesEditor';
import { useStoredState } from './hooks/useStoredState';
import { useTimer } from './hooks/useTimer';
import { DEFAULT_DURATION, REDUCED_SPIN_MS, SAMPLE_NAMES, SPIN_MS, STORAGE_KEYS } from './constants';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const App: React.FC = () => {
  const [roster, setRoster] = useStoredState<string[]>(STORAGE_KEYS.roster, SAMPLE_NAMES);
  // Names that have had their turn, in the order they were picked.
  const [done, setDone] = useStoredState<string[]>(STORAGE_KEYS.done, []);
  const [duration, setDuration] = useStoredState<number>(STORAGE_KEYS.duration, DEFAULT_DURATION);

  const [pick, setPick] = useState<string | null>(null);
  const [spinTarget, setSpinTarget] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const spinTimeoutRef = useRef<number | null>(null);

  const timer = useTimer(duration);
  const isSpinning = spinTarget !== null;
  const spinMs = prefersReducedMotion() ? REDUCED_SPIN_MS : SPIN_MS;

  const doneSet = useMemo(() => new Set(done), [done]);
  const waiting = useMemo(() => roster.filter(n => !doneSet.has(n)), [roster, doneSet]);
  // The latest pick stays on the wheel (highlighted) until the next spin, so
  // the pointer still lands on their slice instead of the wheel redrawing
  // under it. They are already out of the draw.
  const wheelNames = useMemo(
    () => roster.filter(n => !doneSet.has(n) || n === pick),
    [roster, doneSet, pick]
  );

  const spin = useCallback(() => {
    if (isSpinning || waiting.length === 0) return;

    const target = waiting[Math.floor(Math.random() * waiting.length)];
    const index = waiting.indexOf(target);
    const slice = 360 / waiting.length;
    // Land somewhere inside the slice, not always dead centre.
    const jitter = (Math.random() - 0.5) * slice * 0.7;
    const landAt = 360 - (index * slice + slice / 2 + jitter);

    setPick(null);
    setSpinTarget(target);
    timer.reset();
    setRotation(prev => {
      const current = ((prev % 360) + 360) % 360;
      const delta = ((landAt - current + 360) % 360) + 360 * (prefersReducedMotion() ? 1 : 4);
      return prev + delta;
    });

    // A timeout rather than transitionend: the latter never fires if the
    // tab is hidden or the transition is interrupted.
    spinTimeoutRef.current = window.setTimeout(() => {
      setDone(prev => (prev.includes(target) ? prev : [...prev, target]));
      setPick(target);
      setSpinTarget(null);
      spinTimeoutRef.current = null;
    }, spinMs);
  }, [isSpinning, waiting, timer, setDone, spinMs]);

  useEffect(() => () => {
    if (spinTimeoutRef.current !== null) window.clearTimeout(spinTimeoutRef.current);
  }, []);

  const putBack = useCallback(
    (name: string) => {
      setDone(prev => prev.filter(n => n !== name));
      if (name === pick) {
        setPick(null);
        timer.reset();
      }
    },
    [pick, setDone, timer]
  );

  const markDone = useCallback(
    (name: string) => setDone(prev => (prev.includes(name) ? prev : [...prev, name])),
    [setDone]
  );

  const newRound = useCallback(() => {
    setDone([]);
    setPick(null);
    timer.reset();
  }, [setDone, timer]);

  const saveNames = useCallback(
    (names: string[]) => {
      setRoster(names);
      // Keep progress for anyone still on the list.
      setDone(prev => prev.filter(n => names.includes(n)));
      if (pick && !names.includes(pick)) setPick(null);
      setEditorOpen(false);
    },
    [pick, setDone, setRoster]
  );

  // Keyboard: Space spins, T starts/pauses the timer. Space spins even when
  // a button has focus, since that is usually just the last thing clicked.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editorOpen || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [contenteditable]')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        spin();
      } else if (e.key === 't' || e.key === 'T') {
        if (timer.running) timer.pause();
        else timer.start();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editorOpen, spin, timer]);

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="topbar__title">Spin &amp; Time</h1>
        <div className="topbar__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setEditorOpen(true)}>
            Edit names
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={newRound}
            disabled={done.length === 0 || isSpinning}
            title="Put everyone back on the wheel"
          >
            New round
          </button>
        </div>
      </header>

      <main className="layout">
        <div className="layout__wheel">
          <Wheel
            names={wheelNames}
            rotation={rotation}
            spinMs={spinMs}
            isSpinning={isSpinning}
            highlight={pick}
            onSpin={spin}
          />
        </div>

        <div className="layout__side">
          <SpeakerPanel
            pick={pick}
            isSpinning={isSpinning}
            remainingCount={waiting.length}
            totalCount={roster.length}
            onSpin={spin}
            onPutBack={() => pick && putBack(pick)}
            onNewRound={newRound}
            timer={timer}
            duration={duration}
            onDurationChange={setDuration}
          />
          <RosterPanel waiting={waiting} done={done} onMarkDone={markDone} onPutBack={putBack} />
        </div>
      </main>

      <NamesEditor open={editorOpen} roster={roster} onSave={saveNames} onClose={() => setEditorOpen(false)} />
    </div>
  );
};

export default App;
