import React from 'react';

interface RosterPanelProps {
  waiting: string[];
  done: string[];
  onMarkDone: (name: string) => void;
  onPutBack: (name: string) => void;
}

// Two lists the teacher can fix with one click: someone volunteered
// (mark as done) or someone was picked while away (put back).
const RosterPanel: React.FC<RosterPanelProps> = ({ waiting, done, onMarkDone, onPutBack }) => (
  <section className="card roster">
    <div className="roster__col">
      <h2 className="roster__title">
        Still to go <span className="count">{waiting.length}</span>
      </h2>
      <ul className="roster__list">
        {waiting.map(name => (
          <li key={name}>
            <button type="button" className="pill" onClick={() => onMarkDone(name)} title="Mark as done without spinning">
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
    <div className="roster__col">
      <h2 className="roster__title">
        Done <span className="count">{done.length}</span>
      </h2>
      <ul className="roster__list">
        {done.map(name => (
          <li key={name}>
            <button type="button" className="pill pill--done" onClick={() => onPutBack(name)} title="Put back on the wheel">
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default RosterPanel;
