import React, { useEffect, useRef, useState } from 'react';

interface NamesEditorProps {
  open: boolean;
  roster: string[];
  onSave: (names: string[]) => void;
  onClose: () => void;
}

export const parseNames = (text: string) => {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const line of text.split(/[\n,]/)) {
    const name = line.trim();
    const key = name.toLowerCase();
    if (name && !seen.has(key)) {
      seen.add(key);
      names.push(name);
    }
  }
  return names;
};

const NamesEditor: React.FC<NamesEditorProps> = ({ open, roster, onSave, onClose }) => {
  const [text, setText] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setText(roster.join('\n'));
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, roster]);

  const parsed = parseNames(text);
  const lineCount = text.split(/[\n,]/).filter(l => l.trim()).length;
  const duplicates = lineCount - parsed.length;

  return (
    <dialog ref={dialogRef} className="editor" onClose={onClose} onCancel={onClose}>
      <form
        method="dialog"
        onSubmit={() => onSave(parsed)}
      >
        <h2>Class list</h2>
        <p className="editor__hint">
          One name per line (or paste a comma-separated list). Saved in this browser only.
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={14}
          autoFocus
          spellCheck={false}
          aria-label="Names, one per line"
        />
        <p className="editor__meta">
          {parsed.length} {parsed.length === 1 ? 'name' : 'names'}
          {duplicates > 0 && ` · ${duplicates} duplicate${duplicates === 1 ? '' : 's'} ignored — add a surname initial to tell people apart`}
        </p>
        <div className="editor__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Save names
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default NamesEditor;
