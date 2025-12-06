import React from 'react';
import { INITIAL_TIME } from '../constants';

interface WinnerModalProps {
  winner: string | null;
  onClose: () => void;
  onStartTimer: () => void;
  timeLeft: number;
  isTimerActive: boolean;
  timerStarted: boolean;
  onTimerReset: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ 
  winner, 
  onClose, 
  onStartTimer, 
  timeLeft, 
  isTimerActive,
  timerStarted,
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
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 m-4 max-w-lg w-full text-center transform transition-all animate-in fade-in zoom-in-95 border-4 border-purple-200">
        <div className="mb-6">
          <p className="text-slate-600 font-semibold text-lg mb-2">🎉 Congratulations!</p>
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 mb-3">
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent my-2 break-words">
              {winner}
            </h2>
          </div>
          <p className="text-slate-700 font-medium text-lg">You're up next! 🎤</p>
        </div>

        {!timerStarted ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={onStartTimer}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ⏱️ Start 60s Timer
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 text-slate-600 font-semibold hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="text-center mb-6 bg-slate-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3" style={{ color: isTimerActive ? '#059669' : '#dc2626' }}>
                {isTimerActive ? '⏱️ Timer Running' : '⏰ Time\'s Up!'}
              </h3>
              <p className="text-7xl sm:text-8xl font-mono font-bold text-slate-800 tracking-wider my-4">
                {minutes}:{seconds}
              </p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-5 mb-6 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={onTimerReset}
                className="w-full py-3 px-6 bg-slate-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                🔄 Reset Timer
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 px-6 text-slate-600 font-semibold hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
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
