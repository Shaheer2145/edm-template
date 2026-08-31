import React, { useState, useRef } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import CanvasElement from './CanvasElement';
import "../../App.css";

const CanvasColumn = ({
  column,
  colIndex,
  secIndex,
  sectionId,
  columnCount,
  dragItem,
  onDropElement,
  selectedElement,
  onSelectNode,
  onSelectColumn,
  onDuplicateColumn,
  onDeleteColumn,
  onDuplicateElement,
  onDeleteElement,
  renderElementNode
}) => {
  const [over, setOver] = useState(false);
  const depthRef = useRef(0);
  const canDrop = dragItem?.kind === 'element';
  const settings = column.settings || {};
  const isColumnSelected =
    selectedElement?.type === 'column' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.colIndex === colIndex;

  const className = ['canvas-col'];
  if (isColumnSelected) className.push('selected');
  if (canDrop) className.push('drop-target');
  if (canDrop && over) className.push('drag-over');

  return (
    <div
      className={className.join(' ')}
      style={{
        flex: `${column.width || 100} 1 0%`,
        width: `${column.width || 100}%`,
        minHeight: settings.height ? `${settings.height}px` : undefined,
        backgroundColor: settings.backgroundColor || undefined,
        paddingTop: `${settings.paddingTop ?? 0}px`,
        paddingBottom: `${settings.paddingBottom ?? 0}px`,
        paddingLeft: `${settings.paddingLeft ?? 0}px`,
        paddingRight: `${settings.paddingRight ?? 0}px`
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectColumn) onSelectColumn(sectionId, colIndex);
      }}
      onDragEnter={() => {
        if (!canDrop) return;
        depthRef.current += 1;
        setOver(true);
      }}
      onDragOver={(e) => {
        if (!canDrop) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={() => {
        depthRef.current -= 1;
        if (depthRef.current <= 0) {
          depthRef.current = 0;
          setOver(false);
        }
      }}
      onDrop={(e) => {
        if (!canDrop) return;
        e.preventDefault();
        e.stopPropagation();
        depthRef.current = 0;
        setOver(false);
        onDropElement(secIndex, colIndex, column.elements.length);
      }}
    >
      <div className="block-toolbar column-toolbar">
        <span>Column {colIndex + 1}</span>
        <button
          className="toolbar-btn"
          title="Duplicate column"
          onClick={(e) => {
            e.stopPropagation();
            if (onDuplicateColumn) onDuplicateColumn(sectionId, colIndex);
          }}
        >
          <Copy size={14} />
        </button>
        <button
          className="toolbar-btn"
          title={columnCount <= 1 ? 'Delete column (removes the section)' : 'Delete column'}
          onClick={(e) => {
            e.stopPropagation();
            if (onDeleteColumn) onDeleteColumn(sectionId, colIndex);
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {column.elements.map((element, elIndex) => (
        <CanvasElement
          key={element.id || `${secIndex}-${colIndex}-${elIndex}`}
          element={element}
          sectionId={sectionId}
          colIndex={colIndex}
          elIndex={elIndex}
          isSelected={selectedElement && selectedElement.id === element.id}
          dragItem={dragItem}
          onSelect={onSelectNode}
          onDuplicate={onDuplicateElement}
          onDelete={onDeleteElement}
          onDropAt={(before) => onDropElement(secIndex, colIndex, before ? elIndex : elIndex + 1)}
          renderElementNode={renderElementNode}
        />
      ))}
    </div>
  );
};

const CanvasSection = ({
  section,
  secIndex,
  selectedElement,
  dragItem,
  onSelectNode,
  onSelectColumn,
  onDuplicateSection,
  onDeleteSection,
  onDuplicateColumn,
  onDeleteColumn,
  onDuplicateElement,
  onDeleteElement,
  onDropElement,
  onDropSection,
  renderElementNode
}) => {
  const isSelected = selectedElement && selectedElement.id === section.id;
  const [sectionDropPos, setSectionDropPos] = useState(null);
  const sectionDepthRef = useRef(0);
  const canDropSection = dragItem?.kind === 'section';

  const handleSectionDragEnter = () => {
    if (!canDropSection) return;
    sectionDepthRef.current += 1;
  };

  const handleSectionDragOver = (e) => {
    if (!canDropSection) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
    setSectionDropPos((prev) => (prev === pos ? prev : pos));
  };

  const handleSectionDragLeave = () => {
    sectionDepthRef.current -= 1;
    if (sectionDepthRef.current <= 0) {
      sectionDepthRef.current = 0;
      setSectionDropPos(null);
    }
  };

  const handleSectionDrop = (e) => {
    if (!canDropSection) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    sectionDepthRef.current = 0;
    setSectionDropPos(null);
    onDropSection(before ? secIndex : secIndex + 1);
  };

  const sectionStyle = {
    backgroundColor: section.settings?.backgroundColor || '#ffffff',
    paddingTop: `${section.settings?.paddingTop || 0}px`,
    paddingBottom: `${section.settings?.paddingBottom || 0}px`,
    paddingLeft: `${section.settings?.paddingLeft || 0}px`,
    paddingRight: `${section.settings?.paddingRight || 0}px`,
    marginTop: `${section.settings?.marginTop || 0}px`,
    marginRight: `${section.settings?.marginRight || 0}px`,
    marginBottom: `${section.settings?.marginBottom || 0}px`,
    marginLeft: `${section.settings?.marginLeft || 0}px`
  };

  const sectionClassName = [
    'canvas-section',
    isSelected ? 'selected' : '',
    canDropSection && sectionDropPos ? 'section-drop-hover' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={sectionClassName}
      style={sectionStyle}
      data-id={section.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode(section, 'section');
      }}
      onDragEnter={handleSectionDragEnter}
      onDragOver={handleSectionDragOver}
      onDragLeave={handleSectionDragLeave}
      onDrop={handleSectionDrop}
    >
      {sectionDropPos === 'top' && <div className="drop-indicator section-insert-indicator" />}
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
        {section.columns.map((col, colIndex) => (
          <CanvasColumn
            key={colIndex}
            column={col}
            colIndex={colIndex}
            secIndex={secIndex}
            sectionId={section.id}
            columnCount={section.columns.length}
            dragItem={dragItem}
            onDropElement={onDropElement}
            selectedElement={selectedElement}
            onSelectNode={onSelectNode}
            onSelectColumn={onSelectColumn}
            onDuplicateColumn={onDuplicateColumn}
            onDeleteColumn={onDeleteColumn}
            onDuplicateElement={onDuplicateElement}
            onDeleteElement={onDeleteElement}
            renderElementNode={renderElementNode}
          />
        ))}
      </div>
      {sectionDropPos === 'bottom' && <div className="drop-indicator section-insert-indicator" />}
    </div>
  );
};

export default CanvasSection;
