// Original renderer logic preserved for later integration.
(function () {
  const app = window.EDMBuilder = window.EDMBuilder || {};

  function renderCanvas() {
    updateHealthBadge();
    const root = document.getElementById('canvas-root');
    const container = document.getElementById('canvas-container');

    if (!root || !container) return;

    root.innerHTML = '';
    root.dir = state.settings.direction || 'ltr';

    if (state.importedRawHTML) {
      container.classList.remove('empty-canvas');
      container.style.backgroundColor = state.settings.bodyBackgroundColor || '#ffffff';
      root.innerHTML = state.importedRawHTML;
      return;
    }

    if (state.sections.length === 0) {
      container.classList.add('empty-canvas');
      container.style.backgroundColor = '';
      root.innerHTML = `
        <div class="canvas-empty-state">
          <h3>Your Email Canvas is Empty</h3>
          <p>Drag a layout section here to get started</p>
        </div>
      `;
      return;
    }

    container.classList.remove('empty-canvas');
    container.style.backgroundColor = state.settings.bodyBackgroundColor || '#ffffff';

    state.sections.forEach((sec, secIndex) => {
      const sectionEl = document.createElement('div');
      sectionEl.className = 'canvas-section';
      sectionEl.dataset.id = sec.id;
      sectionEl.style.backgroundColor = sec.settings.backgroundColor || '#ffffff';
      sectionEl.style.paddingTop = `${sec.settings.paddingTop || 0}px`;
      sectionEl.style.paddingBottom = `${sec.settings.paddingBottom || 0}px`;
      sectionEl.style.paddingLeft = `${sec.settings.paddingLeft || 0}px`;
      sectionEl.style.paddingRight = `${sec.settings.paddingRight || 0}px`;
      sectionEl.innerHTML = '<div class="block-toolbar"><span>Section</span></div>';

      const rowEl = document.createElement('div');
      rowEl.className = 'canvas-row';

      sec.columns.forEach((col, colIndex) => {
        const colEl = document.createElement('div');
        colEl.className = 'canvas-col';
        colEl.style.width = `${col.width}%`;

        col.elements.forEach((el, elIndex) => {
          const itemEl = document.createElement('div');
          itemEl.className = 'canvas-element';
          itemEl.dataset.id = el.id;
          itemEl.innerHTML = `<div class="block-toolbar"><span>${el.type.toUpperCase()}</span></div><div class="element-content-wrapper"></div>`;
          const contentWrapper = itemEl.querySelector('.element-content-wrapper');
          renderElementNode(el, contentWrapper);
          colEl.appendChild(itemEl);
        });

        rowEl.appendChild(colEl);
      });

      sectionEl.appendChild(rowEl);
      root.appendChild(sectionEl);
    });
  }

  function renderElementNode(el, wrapper) {
    const styles = el.styles || {};
    const content = el.content || {};
    const font = styles.fontFamily || state.settings.fontFamily || 'Arial, sans-serif';

    switch (el.type) {
      case 'text':
        wrapper.innerHTML = `
          <div class="editable-text-wrapper" style="font-family:${font}; font-size:${styles.fontSize || 14}px; color:${styles.color || '#000000'}; text-align:${styles.textAlign || 'left'};">
            ${content.text || 'Double click to edit text'}
          </div>
        `;
        break;
      case 'image':
        wrapper.innerHTML = `
          <div style="text-align:${styles.alignment || 'center'}">
            <img src="${content.src || 'https://via.placeholder.com/600x200'}" alt="${content.alt || ''}" style="width:${styles.width || 600}px; max-width:100%; height:auto; display:inline-block; border-radius:${styles.borderRadius || 0}px;" />
          </div>
        `;
        break;
      case 'button':
        wrapper.innerHTML = `
          <div style="text-align:${styles.alignment || 'center'};">
            <a href="#" style="display:inline-block; padding:${styles.paddingTop || 12}px ${styles.paddingRight || 24}px; background-color:${styles.backgroundColor || '#6366f1'}; color:${styles.color || '#ffffff'}; border-radius:${styles.borderRadius || 4}px; font-family:${font}; font-size:${styles.fontSize || 16}px; font-weight:${styles.fontWeight || 'bold'}; text-decoration:none;">
              ${content.text || 'Click Here'}
            </a>
          </div>
        `;
        break;
      default:
        wrapper.innerHTML = `<div>${content.text || el.type}</div>`;
    }
  }

  app.renderCanvas = renderCanvas;
  app.renderElementNode = renderElementNode;
  window.renderCanvas = renderCanvas;
  window.renderElementNode = renderElementNode;
})();
