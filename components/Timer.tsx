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
    <div className="w-full max-w-sm p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
      <div className="text-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-700">Timer</h2>
        <p className="text-5xl sm:text-6xl lg:text-7xl font-mono font-bold text-slate-800 tracking-wider my-4">{minutes}:{seconds}</p>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 sm:h-4 mb-4 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onStart}
          disabled={isActive || timeLeft === 0}
          className="flex-1 py-2.5 sm:py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isActive ? 'Running...' : 'Start Timer'}
        </button>
        <button
          onClick={onReset}
          className="py-2.5 sm:py-3 px-4 bg-slate-500 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
