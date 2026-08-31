import React from 'react';

const Properties = ({ selectedElement }) => {
  const isSection = selectedElement?.type === 'section';
  const isElement = selectedElement?.type === 'element';

  return (
    <aside className="sidebar-right">
      <div className="panel-header">
        <h2>Properties</h2>
        <p id="inspector-subtitle">
          {selectedElement ? `${selectedElement.type.toUpperCase()}: ${selectedElement.id}` : 'Select an element to customize'}
        </p>
      </div>

      <div className="inspector-tabs">
        <button className="tab-btn active">Content</button>
        <button className="tab-btn">Style</button>
      </div>

      <div className="inspector-scroll">
        {!selectedElement ? (
          <div className="inspector-empty">
            <p>Click on any layout section or content block in the canvas to edit its properties.</p>
          </div>
        ) : (
          <div className="inspector-form">
            {isSection && (
              <div className="property-card">
                <h3>Section settings</h3>
                <label>Background color</label>
                <input type="color" defaultValue="#ffffff" />
                <label>Padding</label>
                <input type="number" defaultValue="24" />
              </div>
            )}

            {isElement && (
              <div className="property-card">
                <h3>Element settings</h3>
                <label>Content</label>
                <textarea defaultValue="Editable content goes here" />
                <label>Text align</label>
                <select defaultValue="left">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Properties;