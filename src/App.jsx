import React, { useState } from 'react';
import Header from './components/Header';
import Canvas from './components/Canvas/Canvas';
import ElementSidebar from './components/Sidebar/ElementSidebar';
import Properties from './components/Properties/Properties';

const createElement = (id, type, text) => ({
  id,
  type,
  content: { text }
});

const initialSections = [
  {
    id: 'section-1',
    type: 'section',
    settings: {
      backgroundColor: '#ffffff',
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 24,
      paddingRight: 24
    },
    columns: [
      {
        width: 100,
        elements: [createElement('el-1', 'text', 'Welcome to the EDM Builder Studio')]
      }
    ]
  }
];

const App = () => {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [selectedElement, setSelectedElement] = useState(null);
  const [state, setState] = useState({
    settings: { bodyBackgroundColor: '#ffffff', direction: 'ltr' },
    sections: initialSections
  });

  const handleSelectNode = (node, type) => {
    setSelectedElement({ node, id: node.id, type });
  };

  const handleDuplicateSection = (secIndex) => {
    setState((prev) => {
      const nextSections = [...prev.sections];
      const duplicate = JSON.parse(JSON.stringify(nextSections[secIndex]));
      duplicate.id = `${duplicate.id}-copy`;
      nextSections.splice(secIndex + 1, 0, duplicate);
      return { ...prev, sections: nextSections };
    });
  };

  const handleDeleteSection = (secIndex) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== secIndex)
    }));
  };

  const handleDuplicateElement = (sectionId, colIndex, elIndex) => {
    setState((prev) => {
      const nextSections = prev.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const nextColumns = section.columns.map((column, columnIndex) => {
          if (columnIndex !== colIndex) return column;

          const duplicate = JSON.parse(JSON.stringify(column.elements[elIndex]));
          duplicate.id = `${duplicate.id}-copy`;
          return {
            ...column,
            elements: [...column.elements.slice(0, elIndex + 1), duplicate, ...column.elements.slice(elIndex + 1)]
          };
        });

        return { ...section, columns: nextColumns };
      });

      return { ...prev, sections: nextSections };
    });
  };

  const handleDeleteElement = (sectionId, colIndex, elIndex) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          columns: section.columns.map((column, columnIndex) => {
            if (columnIndex !== colIndex) return column;
            return {
              ...column,
              elements: column.elements.filter((_, index) => index !== elIndex)
            };
          })
        };
      })
    }));
  };

  const renderElementNode = (element) => {
    switch (element.type) {
      case 'text':
        return <p className="builder-preview-text">{element.content?.text || 'Text block'}</p>;
      case 'image':
        return <div className="builder-preview-image">Image placeholder</div>;
      case 'button':
        return <button className="builder-preview-button">{element.content?.text || 'Button'}</button>;
      case 'divider':
        return <div className="builder-preview-divider" />;
      default:
        return <p className="builder-preview-text">{element.type}</p>;
    }
  };

  return (
    <div className="app-shell">
      <Header deviceMode={deviceMode} setDeviceMode={setDeviceMode} />

      <main className="app-workspace">
        <ElementSidebar />

        <Canvas
          state={state}
          selectedElement={selectedElement}
          deviceMode={deviceMode}
          onSelectNode={handleSelectNode}
          onDuplicateSection={handleDuplicateSection}
          onDeleteSection={handleDeleteSection}
          onDuplicateElement={handleDuplicateElement}
          onDeleteElement={handleDeleteElement}
          renderElementNode={renderElementNode}
        />

        <Properties selectedElement={selectedElement} />
      </main>
    </div>
  );
};

export default App;