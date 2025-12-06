import React from 'react';
import { INITIAL_TIME } from '../constants';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
  onStart: () => void;
  onReset: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, isActive, onStart, onReset }) => {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const progress = (timeLeft / INITIAL_TIME) * 100;
  
  let progressColor = 'bg-green-500';
  if (timeLeft <= 10) progressColor = 'bg-red-500 animate-pulse';
  else if (timeLeft <= 30) progressColor = 'bg-yellow-500';


  return (
    <div className="w-full max-w-sm p-5 sm:p-7 bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="text-center mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">⏱️ Presentation Timer</h2>
        <p className="text-6xl sm:text-7xl lg:text-8xl font-mono font-bold text-slate-800 tracking-wider my-5">
          {minutes}:{seconds}
        </p>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-4 mb-5 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onStart}
          disabled={isActive || timeLeft === 0}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isActive ? '▶️ Running...' : '▶️ Start Timer'}
        </button>
        <button
          onClick={onReset}
          className="py-3 px-5 bg-slate-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          🔄
        </button>
      </div>
    </div>
  );
};

export default Timer;
