import React, { useState, useRef } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import "../../App.css";

const CanvasElement = ({
  element,
  sectionId,
  colIndex,
  elIndex,
  isSelected,
  dragItem,
  onSelect,
  onDuplicate,
  onDelete,
  onDropAt,
  renderElementNode
}) => {
  const [dropPos, setDropPos] = useState(null);
  const depthRef = useRef(0);
  const canDrop = dragItem?.kind === 'element';

  const handleDragEnter = () => {
    if (!canDrop) return;
    depthRef.current += 1;
  };

  const handleDragOver = (e) => {
    if (!canDrop) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
    setDropPos((prev) => (prev === pos ? prev : pos));
  };

  const handleDragLeave = () => {
    depthRef.current -= 1;
    if (depthRef.current <= 0) {
      depthRef.current = 0;
      setDropPos(null);
    }
  };

  const handleDrop = (e) => {
    if (!canDrop) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    depthRef.current = 0;
    setDropPos(null);
    onDropAt(before);
  };

  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      data-id={element.id}
      data-sec-id={sectionId}
      data-col-index={colIndex}
      data-el-index={elIndex}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element, 'element');
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dropPos === 'top' && <div className="drop-indicator" />}
      <div className="block-toolbar">
        <span>{element.type.toUpperCase()}</span>
        <button
          className="toolbar-btn"
          title="Duplicate"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(sectionId, colIndex, elIndex);
          }}
        >
          <Copy size={14} />
        </button>
        <button
          className="toolbar-btn"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sectionId, colIndex, elIndex);
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="element-content-wrapper">
        {renderElementNode(element)}
      </div>
      {dropPos === 'bottom' && <div className="drop-indicator" />}
    </div>
  );
};

export default CanvasElement;
