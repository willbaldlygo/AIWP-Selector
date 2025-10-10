import React from 'react';
import { INITIAL_TIME } from '../constants';

interface WinnerModalProps {
  winner: string | null;
  onClose: () => void;
  onStartTimer: () => void;
  timeLeft: number;
  isTimerActive: boolean;
  onTimerReset: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ 
  winner, 
  onClose, 
  onStartTimer, 
  timeLeft, 
  isTimerActive,
  onTimerReset 
}) => {
  if (!winner) return null;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = (timeLeft / INITIAL_TIME) * 100;
  
  let progressColor = 'bg-green-500';
  if (timeLeft <= 10) progressColor = 'bg-red-500 animate-pulse';
  else if (timeLeft <= 30) progressColor = 'bg-yellow-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-md w-full text-center transform transition-all animate-in fade-in zoom-in-95">
        <p className="text-slate-500 font-medium">Congratulations to</p>
        <h2 className="text-5xl font-extrabold text-teal-500 my-4 break-words">{winner}</h2>
        <p className="text-slate-600 mb-8">You've been selected!</p>
        
        {!isTimerActive ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={onStartTimer}
              className="w-full py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
            >
              Start 60s Timer
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 text-slate-500 font-medium hover:text-slate-800 transition-colors mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-700 mb-2">Timer Running</h3>
              <p className="text-7xl font-mono font-bold text-slate-800 tracking-wider my-4">
                {minutes}:{seconds}
              </p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 mb-6 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={onTimerReset}
                className="w-full py-3 px-4 bg-slate-500 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors"
              >
                Reset Timer
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 px-4 text-slate-500 font-medium hover:text-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnerModal;
