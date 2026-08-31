import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import CanvasElement from './CanvasElement';

const CanvasSection = ({
  section,
  secIndex,
  selectedElement,
  onSelectNode,
  onDuplicateSection,
  onDeleteSection,
  onDuplicateElement,
  onDeleteElement,
  renderElementNode
}) => {
  const isSelected = selectedElement && selectedElement.id === section.id;

  const sectionStyle = {
    backgroundColor: section.settings?.backgroundColor || '#ffffff',
    paddingTop: `${section.settings?.paddingTop || 0}px`,
    paddingBottom: `${section.settings?.paddingBottom || 0}px`,
    paddingLeft: `${section.settings?.paddingLeft || 0}px`,
    paddingRight: `${section.settings?.paddingRight || 0}px`
  };

  return (
    <div
      className={`canvas-section ${isSelected ? 'selected' : ''}`}
      style={sectionStyle}
      data-id={section.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode(section, 'section');
      }}
    >
      <div className="block-toolbar">
        <span>Section</span>
        <button
          className="toolbar-btn"
          title="Duplicate"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicateSection(secIndex);
          }}
        >
          <Copy size={14} />
        </button>
        <button
          className="toolbar-btn"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteSection(secIndex);
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="canvas-row">
        {section.columns.map((column, colIndex) => (
          <div key={colIndex} className="canvas-col" style={{ width: `${column.width}%` }}>
            {column.elements.map((element, elIndex) => (
              <CanvasElement
                key={element.id || `${section.id}-${colIndex}-${elIndex}`}
                element={element}
                sectionId={section.id}
                colIndex={colIndex}
                elIndex={elIndex}
                isSelected={selectedElement && selectedElement.id === element.id}
                onSelect={onSelectNode}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
                renderElementNode={renderElementNode}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanvasSection;