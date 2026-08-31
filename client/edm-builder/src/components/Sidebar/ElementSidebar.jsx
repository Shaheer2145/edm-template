import React from 'react';
import "../../App.css";
import { Square, Columns2, Columns3, Columns4, Image, MousePointerClick, Minus, ArrowUpDown, Share2, CreditCard } from "lucide-react";

const elementGroups = [
  {
    title: 'Layout Sections',
    items: [
      { label: '1 Column', type: 'section', columns: 1, img: <Square /> },
      { label: '2 Columns', type: 'section', columns: 2, img: <Columns2 /> },
      { label: '3 Columns', type: 'section', columns: 3, img: <Columns3 /> },
      { label: '4 Columns', type: 'section', columns: 4, img: <Columns4 /> }
    ]
  },
  {
    title: 'Content Blocks',
    items: [
      { label: 'Text Block', type: 'element', elementType: 'text', img: <Image /> },
      { label: 'Image', type: 'element', elementType: 'image', img: <Image /> },
      { label: 'Button', type: 'element', elementType: 'button', img: <MousePointerClick /> },
      { label: 'Divider', type: 'element', elementType: 'divider', img: <Minus /> },
      { label: 'Spacer', type: 'element', elementType: 'spacer', img: <ArrowUpDown /> },
      { label: 'Social Links', type: 'element', elementType: 'social', img: <Share2 /> },
      { label: 'Membership-Info', type: 'element', elementType: 'membership', img: <CreditCard /> }
    ]
  }
];

const ElementSidebar = ({ onDragStartItem, onDragEndItem }) => {
  const handleDragStart = (e, item) => {
    const payload = {
      kind: item.type,
      columns: item.columns,
      elementType: item.elementType
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
    if (onDragStartItem) onDragStartItem(payload);
  };

  const handleDragEnd = () => {
    if (onDragEndItem) onDragEndItem();
  };

  return (
    <aside className="sidebar-left">
      <div className="panel-header">
        <h2>Elements</h2>
        <p>Drag elements onto the canvas</p>
      </div>

      <div className="elements-scroll">
        {elementGroups.map((group) => (
          <div className="element-group" key={group.title} >
            <h3>{group.title}</h3>
            <div className="elements-grid">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="drag-item"
                  draggable
                  title={`Drag to canvas: ${item.label}`}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                >
                  <div>{item.img}</div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside >
  );
};

export default ElementSidebar;
