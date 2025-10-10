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
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>
      <div 
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-6 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="names-panel-title"
      >
        <div className="flex justify-between items-center mb-6">
            <h2 id="names-panel-title" className="text-2xl font-bold">Manage Names</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close names panel">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="flex-grow flex flex-col">
          <label htmlFor="names-textarea" className="block text-sm font-medium text-slate-700 mb-2">Enter names (one per line):</label>
          <textarea
            id="names-textarea"
            value={namesInput}
            onChange={(e) => onNamesChange(e.target.value)}
            className="w-full flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none"
            placeholder="Enter names here..."
          />
          <button
            onClick={() => {
              onUpdate();
              onClose();
            }}
            className="mt-4 w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
          >
            Update Wheel
          </button>
        </div>
      </div>
    </>
  );
};

export default NamesPanel;
