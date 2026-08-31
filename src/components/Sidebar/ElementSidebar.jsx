import React from 'react';

const elementGroups = [
  {
    title: 'Layout Sections',
    items: [
      { label: '1 Column', type: 'section', columns: 1 },
      { label: '2 Columns', type: 'section', columns: 2 },
      { label: '3 Columns', type: 'section', columns: 3 },
      { label: '4 Columns', type: 'section', columns: 4 }
    ]
  },
  {
    title: 'Content Blocks',
    items: [
      { label: 'Text Block', type: 'element', elementType: 'text' },
      { label: 'Image', type: 'element', elementType: 'image' },
      { label: 'Button', type: 'element', elementType: 'button' },
      { label: 'Divider', type: 'element', elementType: 'divider' },
      { label: 'Spacer', type: 'element', elementType: 'spacer' },
      { label: 'Social Links', type: 'element', elementType: 'social' }
    ]
  }
];

const ElementSidebar = () => {
  return (
    <aside className="sidebar-left">
      <div className="panel-header">
        <h2>Elements</h2>
        <p>Drag elements onto the canvas</p>
      </div>

      <div className="elements-scroll">
        {elementGroups.map((group) => (
          <div className="element-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="elements-grid">
              {group.items.map((item) => (
                <div key={item.label} className="drag-item" draggable>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ElementSidebar;
