import React from 'react';
import Header from './components/Header/index';
import Canvas from './components/Canvas/Canvas';
import ElementSidebar from './components/Sidebar/ElementSidebar';
import Properties from './components/Properties/Properties';
import NavigatorPanel from './components/Navigator/NavigatorPanel';
import renderElementNode from './components/Canvas/renderElementNode';
import useBuilderState from './hooks/useBuilderState';
import "./App.css"


const App = () => {
  const {
    deviceMode,
    setDeviceMode,
    selectedElement,
    setSelectedElement,
    dragItem,
    state,
    setState,
    importRevision,
    resolvedSelection,
    handleDragStartItem,
    handleDragEndItem,
    handleDropSection,
    handleDropElement,
    handleDropElementOnEmptyCanvas,
    handleSelectNode,
    handleSelectColumn,
    handleSelectImportedElement,
    handleImportedDocumentReady,
    handleImportedFile,
    handleSelectPreset,
    handleDuplicateSection,
    handleDeleteSection,
    handleDuplicateColumn,
    handleDeleteColumn,
    handleDuplicateElement,
    handleDeleteElement,
    handleUpdateElement,
    handleUpdateSection,
    handleUpdateColumn,
    handleDeleteImportedElement,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo
  } = useBuilderState();

  return (
    <div className="app-shell">
      <Header
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        state={state}
        setState={setState}
        setSelectedElement={setSelectedElement}
        selectedElement={selectedElement}
        onImport={(result) => {
          console.log("IMPORT RESULT:", result);
          handleImportedFile(result);
        }}
        onSelectPreset={(presetId) => {
          handleSelectPreset(presetId);
        }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <main className="app-workspace">
        <ElementSidebar
          onDragStartItem={handleDragStartItem}
          onDragEndItem={handleDragEndItem}
        />
        <Canvas
          state={state}
          selectedElement={selectedElement}
          deviceMode={deviceMode}
          dragItem={dragItem}
          onSelectNode={handleSelectNode}
          onSelectColumn={handleSelectColumn}
          onDuplicateSection={handleDuplicateSection}
          onDeleteSection={handleDeleteSection}
          onDuplicateColumn={handleDuplicateColumn}
          onDeleteColumn={handleDeleteColumn}
          onDuplicateElement={handleDuplicateElement}
          onDeleteElement={handleDeleteElement}
          onDropSection={handleDropSection}
          onDropElement={handleDropElement}
          onDropElementOnEmptyCanvas={handleDropElementOnEmptyCanvas}
          onDragEndItem={handleDragEndItem}
          renderElementNode={renderElementNode}
          importRevision={importRevision}
          onSelectImportedElement={handleSelectImportedElement}
          onImportedDocumentReady={handleImportedDocumentReady}
        />

        <NavigatorPanel
          sections={state.sections}
          elementsMap={state.elementsMap}
          hasImportedTemplate={Boolean(state.importedRawHTML)}
          importedHtml={state.importedRawHTML || ''}
          selectedElement={selectedElement}
          onSelectSection={(section) => handleSelectNode(section, 'section')}
          onSelectColumn={(sectionId, colIndex) => handleSelectColumn(sectionId, colIndex)}
          onSelectElement={(element) => handleSelectNode(element, 'element')}
          onSelectImportedElement={handleSelectImportedElement}
        />

        <Properties
          selectedElement={resolvedSelection}
          onElementUpdate={handleUpdateElement}
          onSectionUpdate={handleUpdateSection}
          onColumnUpdate={handleUpdateColumn}
          onDeleteImportedElement={handleDeleteImportedElement}
        />
      </main>
    </div>
  );
};

export default App;
