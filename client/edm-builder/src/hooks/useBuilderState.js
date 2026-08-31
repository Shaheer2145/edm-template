import { useEffect, useMemo, useRef, useState } from 'react';
import { makeElement, makeSection, makeImageState, makePdfState, initialSections } from '../builder-logic/factories';
import { buildPresetState } from '../builder-logic/presets';
import { EmailImporter } from '../services/import';
import { generateId } from '../utils/id';

const HISTORY_LIMIT = 50;

const useBuilderState = () => {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragItem, setDragItem] = useState(null);
  const [state, setState] = useState({
    settings: { bodyBackgroundColor: '#ffffff', direction: 'ltr' },
    sections: initialSections
  });
  const [importRevision, setImportRevision] = useState(0);
  const iframeDocRef = useRef(null);

  // Undo/Redo history (snapshots of the canvas state)
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const snapshotRef = useRef(null);
  const skipHistoryRef = useRef(false);
  const [historyVersion, setHistoryVersion] = useState(0);

  useEffect(() => {
    if (snapshotRef.current === null) {
      snapshotRef.current = state;
      return;
    }
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    if (snapshotRef.current === state) return;
    pastRef.current.push(snapshotRef.current);
    if (pastRef.current.length > HISTORY_LIMIT) pastRef.current.shift();
    futureRef.current = [];
    snapshotRef.current = state;
    setHistoryVersion((prev) => prev + 1);
  }, [state]);

  const { canUndo, canRedo } = useMemo(
    () => ({
      canUndo: pastRef.current.length > 0,
      canRedo: futureRef.current.length > 0
    }),
    // historyVersion forces this memo to re-evaluate whenever the stacks change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [historyVersion]
  );

  const handleUndo = () => {
    if (!pastRef.current.length) return;
    const previous = pastRef.current.pop();
    futureRef.current.push(state);
    snapshotRef.current = previous;
    skipHistoryRef.current = true;
    setImportRevision((prev) => prev + 1);
    setSelectedElement(null);
    setState(previous);
    setHistoryVersion((prev) => prev + 1);
  };

  const handleRedo = () => {
    if (!futureRef.current.length) return;
    const next = futureRef.current.pop();
    pastRef.current.push(state);
    snapshotRef.current = next;
    skipHistoryRef.current = true;
    setImportRevision((prev) => prev + 1);
    setSelectedElement(null);
    setState(next);
    setHistoryVersion((prev) => prev + 1);
  };

  useEffect(() => {
    const isEditableTarget = (target) => {
      if (!target) return false;
      const tag = target.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
    };
    const onKeyDown = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      if (isEditableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
        event.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleDragStartItem = (payload) => setDragItem(payload);

  const handleDragEndItem = () => setDragItem(null);

  const handleDropSection = (insertIndex) => {
    if (!dragItem || dragItem.kind !== 'section') return;
    const newSection = makeSection(dragItem.columns || 1);
    setState((prev) => {
      const nextSections = [...prev.sections];
      const index = Math.max(0, Math.min(insertIndex, nextSections.length));
      nextSections.splice(index, 0, newSection);
      return { ...prev, sections: nextSections };
    });
    setDragItem(null);
    setSelectedElement(null);
  };

  const insertElementIntoSections = (sections, secIndex, colIndex, elIndex, element) =>
    sections.map((section, sIdx) => {
      if (sIdx !== secIndex) return section;
      return {
        ...section,
        columns: section.columns.map((column, cIdx) => {
          if (cIdx !== colIndex) return column;
          const nextElements = [...column.elements];
          const index = Math.max(0, Math.min(elIndex, nextElements.length));
          nextElements.splice(index, 0, element);
          return { ...column, elements: nextElements };
        })
      };
    });

  const handleDropElement = (secIndex, colIndex, elIndex) => {
    if (!dragItem || dragItem.kind !== 'element') return;
    const newElement = makeElement(dragItem.elementType);
    setState((prev) => ({
      ...prev,
      sections: insertElementIntoSections(prev.sections, secIndex, colIndex, elIndex, newElement)
    }));
    setDragItem(null);
    setSelectedElement({ id: newElement.id, type: 'element' });
  };

  const handleDropElementOnEmptyCanvas = () => {
    if (!dragItem || dragItem.kind !== 'element') return;
    const newElement = makeElement(dragItem.elementType);
    const newSection = makeSection(1);
    newSection.columns[0].elements.push(newElement);
    setState((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
    setDragItem(null);
    setSelectedElement({ id: newElement.id, type: 'element' });
  };

  const handleSelectNode = (node, type) => {
    setSelectedElement({ id: node.id, type });
  };

  const handleSelectColumn = (sectionId, colIndex) => {
    setSelectedElement({ id: `${sectionId}-col-${colIndex}`, type: 'column', sectionId, colIndex });
  };

  const handleSelectImportedElement = (elementId) => {
    setSelectedElement({ id: elementId, type: 'element' });
  };

  const handleImportedDocumentReady = (doc) => {
    iframeDocRef.current = doc || null;
  };

  const applyImportedEdit = (element) => {
    const doc = iframeDocRef.current;
    if (doc) EmailImporter.applyElementToDocument(doc, element);
  };

  const serializeImportedDoc = () => {
    const doc = iframeDocRef.current;
    return doc ? EmailImporter.serializeBody(doc) : null;
  };

  const handleImportedFile = (result) => {
    if (!result) return;
    if (result.type === 'html' && result.state) {
      setState(result.state);
      setSelectedElement(null);
      iframeDocRef.current = null;
      setImportRevision((prev) => prev + 1);
    } else if ((result.type === 'image' || result.type === 'pdf') && result.dataUrl) {
      const nextState =
        result.type === 'image'
          ? makeImageState(result.dataUrl, result.fileName)
          : makePdfState(result.dataUrl, result.fileName);
      setState(nextState);
      setSelectedElement(null);
      iframeDocRef.current = null;
    }
  };

  const handleSelectPreset = (presetId) => {
    const presetState = buildPresetState(presetId);
    if (!presetState) return;
    setState(presetState);
    setSelectedElement(null);
    iframeDocRef.current = null;
    setImportRevision((prev) => prev + 1);
  };

  const handleDuplicateSection = (secIndex) => {
    setState((prev) => {
      const nextSections = [...prev.sections];
      const duplicate = JSON.parse(JSON.stringify(nextSections[secIndex]));
      duplicate.id = generateId('section');
      duplicate.columns = duplicate.columns.map((column) => ({
        ...column,
        elements: column.elements.map((element) => ({ ...element, id: generateId('el') }))
      }));
      nextSections.splice(secIndex + 1, 0, duplicate);
      return { ...prev, sections: nextSections };
    });
  };

  const handleDeleteSection = (secIndex) => {
    const deleted = state.sections[secIndex];
    setState((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== secIndex)
    }));
    if (!deleted) return;
    setSelectedElement((prevSelection) => {
      if (!prevSelection) return prevSelection;
      if (prevSelection.type === 'section' && prevSelection.id === deleted.id) return null;
      if (prevSelection.type === 'column' && prevSelection.sectionId === deleted.id) return null;
      if (prevSelection.type === 'element') {
        const wasInside = deleted.columns.some((column) =>
          column.elements.some((element) => element.id === prevSelection.id)
        );
        return wasInside ? null : prevSelection;
      }
      return prevSelection;
    });
  };

  const handleDuplicateColumn = (sectionId, colIndex) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const source = section.columns[colIndex];
        if (!source) return section;
        const duplicate = JSON.parse(JSON.stringify(source));
        duplicate.elements = (duplicate.elements || []).map((element) => ({
          ...element,
          id: generateId('el')
        }));
        const nextColumns = [...section.columns];
        nextColumns.splice(colIndex + 1, 0, duplicate);
        return { ...section, columns: nextColumns };
      })
    }));
  };

  const handleDeleteColumn = (sectionId, colIndex) => {
    const targetSection = state.sections.find((section) => section.id === sectionId);
    if (!targetSection) return;

    // Last column of the section: remove the whole section (Elementor behaviour)
    if (targetSection.columns.length <= 1) {
      const secIndex = state.sections.findIndex((section) => section.id === sectionId);
      if (secIndex !== -1) handleDeleteSection(secIndex);
      return;
    }

    const deletedColumn = targetSection.columns[colIndex];
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        if (section.columns.length <= 1) return section;
        return {
          ...section,
          columns: section.columns.filter((_, index) => index !== colIndex)
        };
      })
    }));
    setSelectedElement((prevSelection) => {
      if (!prevSelection) return prevSelection;
      if (prevSelection.type === 'column' && prevSelection.sectionId === sectionId && prevSelection.colIndex === colIndex) {
        return null;
      }
      if (prevSelection.type === 'element' && deletedColumn) {
        const wasInside = (deletedColumn.elements || []).some((element) => element.id === prevSelection.id);
        return wasInside ? null : prevSelection;
      }
      return prevSelection;
    });
  };

  const handleDuplicateElement = (sectionId, colIndex, elIndex) => {
    setState((prev) => {
      const nextSections = prev.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const nextColumns = section.columns.map((column, columnIndex) => {
          if (columnIndex !== colIndex) return column;

          const duplicate = JSON.parse(JSON.stringify(column.elements[elIndex]));
          duplicate.id = generateId('el');
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

  const handleUpdateElement = (elementId, patch) => {
    if (!elementId || !patch) return;

    // Imported template elements live in elementsMap, not in sections
    if (state.elementsMap && state.elementsMap[elementId]) {
      const existing = state.elementsMap[elementId];
      const updated = {
        ...existing,
        ...(patch.content ? { content: { ...existing.content, ...patch.content } } : {}),
        ...(patch.styles ? { styles: { ...existing.styles, ...patch.styles } } : {})
      };
      setState((prev) => {
        const nextElementsMap = { ...(prev.elementsMap || {}), [elementId]: updated };
        const serialized = serializeImportedDoc();
        return {
          ...prev,
          elementsMap: nextElementsMap,
          ...(serialized != null ? { importedRawHTML: serialized } : {})
        };
      });
      applyImportedEdit(updated);
      return;
    }

    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        columns: section.columns.map((column) => ({
          ...column,
          elements: column.elements.map((element) => {
            if (element.id !== elementId) return element;
            return {
              ...element,
              ...(patch.content ? { content: { ...element.content, ...patch.content } } : {}),
              ...(patch.styles ? { styles: { ...element.styles, ...patch.styles } } : {})
            };
          })
        }))
      }))
    }));
  };

  const handleUpdateSection = (sectionId, patch) => {
    if (!sectionId || !patch) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id !== sectionId
          ? section
          : { ...section, settings: { ...section.settings, ...patch } }
      )
    }));
  };

  const handleUpdateColumn = (sectionId, colIndex, patch) => {
    if (!sectionId || colIndex == null || !patch) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          columns: section.columns.map((column, columnIndex) => {
            if (columnIndex !== colIndex) return column;
            const { width, height, backgroundColor, ...restPatch } = patch;
            const settingsPatch = { ...restPatch };
            if (height !== undefined) settingsPatch.height = height;
            if (backgroundColor !== undefined) settingsPatch.backgroundColor = backgroundColor;
            return {
              ...column,
              ...(width !== undefined ? { width: Math.max(1, Math.min(100, width)) } : {}),
              settings: { ...(column.settings || {}), ...settingsPatch }
            };
          })
        };
      })
    }));
  };

  const handleDeleteElement = (sectionId, colIndex, elIndex) => {
    const deletedSection = state.sections.find((section) => section.id === sectionId);
    const deletedElement = deletedSection?.columns[colIndex]?.elements[elIndex];
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
    if (deletedElement) {
      setSelectedElement((prevSelection) =>
        prevSelection && prevSelection.id === deletedElement.id ? null : prevSelection
      );
    }
  };

  const handleDeleteImportedElement = (elementId) => {
    if (!elementId) return;
    const doc = iframeDocRef.current;
    if (doc) {
      const node = doc.querySelector(`[data-edm-id="${elementId}"]`);
      if (node) node.remove();
    }
    setState((prev) => {
      if (!prev.elementsMap || !prev.elementsMap[elementId]) return prev;
      const nextElementsMap = { ...prev.elementsMap };
      delete nextElementsMap[elementId];
      const serialized = doc ? EmailImporter.serializeBody(doc) : null;
      return {
        ...prev,
        elementsMap: nextElementsMap,
        ...(serialized != null ? { importedRawHTML: serialized } : {})
      };
    });
    setSelectedElement((prevSelection) =>
      prevSelection && prevSelection.id === elementId ? null : prevSelection
    );
  };

  const resolvedSelection = useMemo(() => {
    if (!selectedElement) return null;
    if (selectedElement.type === 'section') {
      const section = state.sections.find((sec) => sec.id === selectedElement.id);
      return section ? { type: 'section', id: section.id, node: section } : null;
    }
    if (selectedElement.type === 'column') {
      const section = state.sections.find((sec) => sec.id === selectedElement.sectionId);
      const column = section ? section.columns[selectedElement.colIndex] : null;
      return column
        ? {
          type: 'column',
          id: selectedElement.id,
          sectionId: selectedElement.sectionId,
          colIndex: selectedElement.colIndex,
          node: column
        }
        : null;
    }
    for (const section of state.sections) {
      for (const column of section.columns) {
        const element = column.elements.find((el) => el.id === selectedElement.id);
        if (element) return { type: 'element', id: element.id, node: element, imported: false };
      }
    }
    const importedElement = state.elementsMap ? state.elementsMap[selectedElement.id] : null;
    if (importedElement) return { type: 'element', id: importedElement.id, node: importedElement, imported: true };
    return null;
  }, [selectedElement, state.sections, state.elementsMap]);

  return {
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
  };
};

export default useBuilderState;
