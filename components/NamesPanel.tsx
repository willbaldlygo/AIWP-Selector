import React from 'react';

interface NamesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  namesInput: string;
  onNamesChange: (value: string) => void;
  onUpdate: () => void;
}

const NamesPanel: React.FC<NamesPanelProps> = ({ isOpen, onClose, namesInput, onNamesChange, onUpdate }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-gradient-to-br from-white to-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-6 flex flex-col border-r-4 border-purple-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="names-panel-title"
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-200">
          <h2 id="names-panel-title" className="text-2xl font-bold text-slate-800">📝 Manage Names</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 transition-all"
            aria-label="Close names panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow flex flex-col">
          <label htmlFor="names-textarea" className="block text-sm font-semibold text-slate-700 mb-2">
            Enter participant names (one per line):
          </label>
          <textarea
            id="names-textarea"
            value={namesInput}
            onChange={(e) => onNamesChange(e.target.value)}
            className="w-full flex-grow p-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none font-mono text-sm shadow-inner"
            placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana..."
          />
          <button
            onClick={() => {
              onUpdate();
              onClose();
            }}
            className="mt-5 w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ✅ Update Wheel
          </button>
        </div>
      </div>
    </>
  );
};

export default NamesPanel;
