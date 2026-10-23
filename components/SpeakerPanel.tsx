import React from 'react';
import { TIMER_OPTIONS } from '../constants';

interface SpeakerPanelProps {
  pick: string | null;
  isSpinning: boolean;
  remainingCount: number;
  totalCount: number;
  onSpin: () => void;
  onPutBack: () => void;
  onNewRound: () => void;
  timer: {
    remaining: number;
    remainingMs: number;
    running: boolean;
    fresh: boolean;
    finished: boolean;
    start: () => void;
    pause: () => void;
    reset: () => void;
  };
  duration: number;
  onDurationChange: (seconds: number) => void;
}

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const SpeakerPanel: React.FC<SpeakerPanelProps> = ({
  pick,
  isSpinning,
  remainingCount,
  totalCount,
  onSpin,
  onPutBack,
  onNewRound,
  timer,
  duration,
  onDurationChange,
}) => {
  const allDone = totalCount > 0 && remainingCount === 0 && !isSpinning;
  const progress = timer.remainingMs / (duration * 1000);
  const timerState = timer.finished ? 'is-finished' : timer.remaining <= 10 && !timer.fresh ? 'is-low' : '';

  let heading: React.ReactNode;
  if (isSpinning) heading = <p className="speaker__name speaker__name--muted">Spinning…</p>;
  else if (pick) heading = <p className="speaker__name">{pick}</p>;
  else if (allDone) heading = <p className="speaker__name speaker__name--muted">Everyone's had a turn</p>;
  else if (totalCount === 0) heading = <p className="speaker__name speaker__name--muted">Add some names to begin</p>;
  else heading = <p className="speaker__name speaker__name--muted">Who's next?</p>;

  return (
    <section className="card speaker" aria-live="polite">
      <p className="eyebrow">{pick && !isSpinning ? 'Over to you' : 'Up next'}</p>
      {heading}

      <div className="speaker__actions">
        {allDone ? (
          <button type="button" className="btn btn--primary" onClick={onNewRound}>
            Start a new round
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={onSpin}
            disabled={isSpinning || remainingCount === 0}
          >
            {pick ? 'Spin again' : 'Spin'}
            <kbd>Space</kbd>
          </button>
        )}
        {pick && !isSpinning && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onPutBack}
            title="Return this name to the wheel, e.g. if they're away or want to pass"
          >
            Put back on wheel
          </button>
        )}
      </div>

      <div className={`timer ${timerState}`}>
        <div className="timer__row">
          <span className="timer__digits">{timer.finished ? "Time's up" : formatTime(timer.remaining)}</span>
          <div className="timer__controls">
            {timer.running ? (
              <button type="button" className="btn btn--small" onClick={timer.pause}>
                Pause <kbd>T</kbd>
              </button>
            ) : (
              <button type="button" className="btn btn--small" onClick={timer.start}>
                {timer.fresh || timer.finished ? 'Start timer' : 'Resume'} <kbd>T</kbd>
              </button>
            )}
            {!timer.fresh && (
              <button type="button" className="btn btn--small btn--ghost" onClick={timer.reset}>
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="timer__bar" aria-hidden="true">
          <div className="timer__fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="timer__lengths" role="group" aria-label="Timer length">
          {TIMER_OPTIONS.map(s => (
            <button
              key={s}
              type="button"
              className={s === duration ? 'chip is-active' : 'chip'}
              onClick={() => onDurationChange(s)}
              disabled={timer.running}
              aria-pressed={s === duration}
            >
              {s < 60 ? `${s}s` : formatTime(s)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakerPanel;
