import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import '../../App.css';

const HistoryControls = ({ onUndo, onRedo, canUndo, canRedo }) => {
    return (
        <div className="history-controls">
            <button
                className="history-btn"
                title="Undo (Ctrl+Z)"
                disabled={!canUndo}
                onClick={onUndo}
            >
                <Undo2 size={18} />
            </button>
            <button
                className="history-btn"
                title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                disabled={!canRedo}
                onClick={onRedo}
            >
                <Redo2 size={18} />
            </button>
        </div>
    );
};

export default HistoryControls;
