import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

const CanvasElement = ({
  element,
  sectionId,
  colIndex,
  elIndex,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  renderElementNode
}) => {
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
    >
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
    </div>
  );
};

export default CanvasElement;
