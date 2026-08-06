(function () {
  const app = window.EDMBuilder = window.EDMBuilder || {};

  function setupCanvasDropZones() {
    const root = document.getElementById('canvas-root');
    if (!root) return;

    root.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (draggedItem && draggedItem.type === 'section') {
        root.classList.add('drag-over');
      }
    });

    root.addEventListener('dragleave', () => {
      root.classList.remove('drag-over');
    });

    root.addEventListener('drop', (e) => {
      root.classList.remove('drag-over');
      if (!draggedItem || draggedItem.type !== 'section') return;

      if (draggedItem.source === 'sidebar') {
        const newSec = {
          id: generateId('sec'),
          settings: {
            backgroundColor: '#ffffff',
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 20,
            paddingRight: 20
          },
          columns: Array.from({ length: draggedItem.columnsCount }, () => ({
            width: Math.round(100 / draggedItem.columnsCount),
            elements: []
          }))
        };
        state.sections.push(newSec);
      } else if (draggedItem.source === 'canvas') {
        const secIndex = draggedItem.secIndex;
        const section = state.sections.splice(secIndex, 1)[0];
        state.sections.push(section);
      }

      draggedItem = null;
      renderCanvas();
    });

    document.querySelectorAll('.canvas-col').forEach((colEl) => {
      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedItem && draggedItem.type === 'element') {
          colEl.classList.add('drag-over');
        }
      });

      colEl.addEventListener('dragleave', () => {
        colEl.classList.remove('drag-over');
      });

      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        colEl.classList.remove('drag-over');

        if (!draggedItem || draggedItem.type !== 'element') return;

        const targetSecId = colEl.dataset.secId;
        const targetColIdx = parseInt(colEl.dataset.colIndex);
        const targetSec = state.sections.find((s) => s.id === targetSecId);
        if (!targetSec) return;

        const targetCol = targetSec.columns[targetColIdx];

        if (draggedItem.source === 'sidebar') {
          const newEl = JSON.parse(JSON.stringify(ELEMENT_DEFAULTS[draggedItem.elementType]));
          newEl.id = generateId('el');
          targetCol.elements.push(newEl);
        } else if (draggedItem.source === 'canvas') {
          const srcSec = state.sections.find((s) => s.id === draggedItem.sectionId);
          if (!srcSec) return;
          const srcCol = srcSec.columns[draggedItem.colIndex];
          const el = srcCol.elements.splice(draggedItem.elIndex, 1)[0];
          targetCol.elements.push(el);
        }

        draggedItem = null;
        renderCanvas();
      });
    });
  }

  function duplicateSection(secIndex) {
    const clone = JSON.parse(JSON.stringify(state.sections[secIndex]));
    clone.id = generateId('sec');
    clone.columns.forEach((col) => {
      col.elements.forEach((el) => {
        el.id = generateId('el');
      });
    });
    state.sections.splice(secIndex + 1, 0, clone);
    renderCanvas();
  }

  function duplicateElement(secId, colIndex, elIndex) {
    const sec = state.sections.find((s) => s.id === secId);
    if (!sec) return;
    const col = sec.columns[colIndex];
    const clone = JSON.parse(JSON.stringify(col.elements[elIndex]));
    clone.id = generateId('el');
    col.elements.splice(elIndex + 1, 0, clone);
    renderCanvas();
  }

  function deleteSection(secIndex) {
    if (confirm('Delete this section?')) {
      state.sections.splice(secIndex, 1);
      selectedElement = null;
      renderCanvas();
      updateInspector();
    }
  }

  function deleteElement(secId, colIndex, elIndex) {
    const sec = state.sections.find((s) => s.id === secId);
    if (!sec) return;
    const col = sec.columns[colIndex];
    col.elements.splice(elIndex, 1);
    selectedElement = null;
    renderCanvas();
    updateInspector();
  }

  app.setupCanvasDropZones = setupCanvasDropZones;
  app.duplicateSection = duplicateSection;
  app.duplicateElement = duplicateElement;
  app.deleteSection = deleteSection;
  app.deleteElement = deleteElement;
  window.setupCanvasDropZones = setupCanvasDropZones;
  window.duplicateSection = duplicateSection;
  window.duplicateElement = duplicateElement;
  window.deleteSection = deleteSection;
  window.deleteElement = deleteElement;
})();
