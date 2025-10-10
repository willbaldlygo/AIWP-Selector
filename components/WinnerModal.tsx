import React from 'react';

interface WinnerModalProps {
  winner: string | null;
  onClose: () => void;
  onStartTimer: () => void;
  onReAdd: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose, onStartTimer, onReAdd }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-md w-full text-center transform transition-all animate-in fade-in zoom-in-95">
        <p className="text-slate-500 font-medium">Congratulations to</p>
        <h2 className="text-5xl font-extrabold text-teal-500 my-4 break-words">{winner}</h2>
        <p className="text-slate-600 mb-8">You've been selected!</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              onStartTimer();
              onClose();
            }}
            className="w-full py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
          >
            Start 60s Timer
          </button>
          <button
            onClick={onReAdd}
            className="w-full py-3 px-4 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
          >
            Add Name Back to Wheel
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-slate-500 font-medium hover:text-slate-800 transition-colors mt-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
