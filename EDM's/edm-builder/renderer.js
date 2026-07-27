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

      root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, td').forEach((tNode) => {
        if (!tNode.querySelector('table') && !tNode.querySelector('img') && tNode.textContent.trim().length > 0) {
          tNode.contentEditable = 'true';
          tNode.style.outline = 'none';
          tNode.addEventListener('blur', () => {
            state.importedRawHTML = root.innerHTML;
          });
        }
      });

      root.onclick = (e) => {
        e.stopPropagation();
        const target = e.target.closest('[data-edm-id]') || e.target;
        const edmId = target.getAttribute ? target.getAttribute('data-edm-id') : null;

        if (edmId && state.elementsMap && state.elementsMap[edmId]) {
          const item = state.elementsMap[edmId];
          selectNode(item, 'element');
          root.querySelectorAll('.edm-selected-highlight').forEach((el) => el.classList.remove('edm-selected-highlight'));
          target.classList.add('edm-selected-highlight');
        }
      };
      return;
    }

    if (state.sections.length === 0) {
      container.classList.add('empty-canvas');
      container.style.backgroundColor = '';
      root.innerHTML = `
        <div class="canvas-empty-state">
          <i data-lucide="plus-circle" class="empty-icon"></i>
          <h3>Your Email Canvas is Empty</h3>
          <p>Drag a layout section here to get started</p>
        </div>
      `;
      lucide.createIcons();
      if (typeof app.setupCanvasDropZones === 'function') {
        app.setupCanvasDropZones();
      }
      return;
    }

    container.classList.remove('empty-canvas');
    container.style.backgroundColor = state.settings.bodyBackgroundColor || '#ffffff';

    state.sections.forEach((sec, secIndex) => {
      const sectionEl = document.createElement('div');
      sectionEl.className = 'canvas-section';
      sectionEl.dataset.id = sec.id;
      if (selectedElement && selectedElement.id === sec.id) {
        sectionEl.classList.add('selected');
      }

      sectionEl.style.backgroundColor = sec.settings.backgroundColor || '#ffffff';
      sectionEl.style.paddingTop = `${sec.settings.paddingTop || 0}px`;
      sectionEl.style.paddingBottom = `${sec.settings.paddingBottom || 0}px`;
      sectionEl.style.paddingLeft = `${sec.settings.paddingLeft || 0}px`;
      sectionEl.style.paddingRight = `${sec.settings.paddingRight || 0}px`;

      sectionEl.innerHTML = `
        <div class="block-toolbar">
          <span>Section</span>
          <button class="toolbar-btn btn-duplicate-section" title="Duplicate"><i data-lucide="copy"></i></button>
          <button class="toolbar-btn btn-delete-section" title="Delete"><i data-lucide="trash-2"></i></button>
        </div>
      `;

      const rowEl = document.createElement('div');
      rowEl.className = 'canvas-row';

      sec.columns.forEach((col, colIndex) => {
        const colEl = document.createElement('div');
        colEl.className = 'canvas-col';
        colEl.style.width = `${col.width}%`;
        colEl.dataset.secId = sec.id;
        colEl.dataset.colIndex = colIndex;

        col.elements.forEach((el, elIndex) => {
          const itemEl = document.createElement('div');
          itemEl.className = 'canvas-element';
          itemEl.dataset.id = el.id;
          itemEl.dataset.secId = sec.id;
          itemEl.dataset.colIndex = colIndex;
          itemEl.dataset.elIndex = elIndex;
          itemEl.draggable = true;

          if (selectedElement && selectedElement.id === el.id) {
            itemEl.classList.add('selected');
          }

          itemEl.innerHTML = `
            <div class="block-toolbar">
              <span>${el.type.toUpperCase()}</span>
              <button class="toolbar-btn btn-duplicate-el" title="Duplicate"><i data-lucide="copy"></i></button>
              <button class="toolbar-btn btn-delete-el" title="Delete"><i data-lucide="trash-2"></i></button>
            </div>
            <div class="element-content-wrapper"></div>
          `;

          const contentWrapper = itemEl.querySelector('.element-content-wrapper');
          renderElementNode(el, contentWrapper);

          itemEl.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            draggedItem = {
              source: 'canvas',
              type: 'element',
              elementId: el.id,
              sectionId: sec.id,
              colIndex,
              elIndex
            };
          });

          itemEl.addEventListener('click', (e) => {
            e.stopPropagation();
            selectNode(el, 'element');
          });

          itemEl.querySelector('.btn-duplicate-el').addEventListener('click', (e) => {
            e.stopPropagation();
            app.duplicateElement(sec.id, colIndex, elIndex);
          });

          itemEl.querySelector('.btn-delete-el').addEventListener('click', (e) => {
            e.stopPropagation();
            app.deleteElement(sec.id, colIndex, elIndex);
          });

          colEl.appendChild(itemEl);
        });

        rowEl.appendChild(colEl);
      });

      sectionEl.appendChild(rowEl);

      sectionEl.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('canvas-section')) {
          draggedItem = {
            source: 'canvas',
            type: 'section',
            sectionId: sec.id,
            secIndex
          };
        }
      });

      sectionEl.addEventListener('click', (e) => {
        if (e.target === sectionEl || e.target === rowEl || e.target.classList.contains('canvas-col')) {
          e.stopPropagation();
          selectNode(sec, 'section');
        }
      });

      sectionEl.querySelector('.btn-duplicate-section').addEventListener('click', (e) => {
        e.stopPropagation();
        app.duplicateSection(secIndex);
      });

      sectionEl.querySelector('.btn-delete-section').addEventListener('click', (e) => {
        e.stopPropagation();
        app.deleteSection(secIndex);
      });

      root.appendChild(sectionEl);
    });

    lucide.createIcons();
    if (typeof app.setupCanvasDropZones === 'function') {
      app.setupCanvasDropZones();
    }
    updateHealthBadge();
  }

  function selectNode(node, nodeType) {
    selectedElement = {
      node,
      id: node.id,
      type: nodeType
    };

    document.querySelectorAll('.canvas-section, .canvas-element').forEach((el) => {
      el.classList.remove('selected');
      if (el.dataset.id === node.id) {
        el.classList.add('selected');
      }
    });

    updateInspector();
  }

  function renderElementNode(el, wrapper) {
    const styles = el.styles || {};
    const content = el.content || {};
    const font = styles.fontFamily || state.settings.fontFamily || 'Arial, sans-serif';

    wrapper.style.paddingTop = `${styles.paddingTop || 0}px`;
    wrapper.style.paddingBottom = `${styles.paddingBottom || 0}px`;
    wrapper.style.paddingLeft = `${styles.paddingLeft || 0}px`;
    wrapper.style.paddingRight = `${styles.paddingRight || 0}px`;

    const fontStyle = styles.fontStyle ? `font-style:${styles.fontStyle};` : '';
    const transformStyle = styles.textTransform ? `text-transform:${styles.textTransform};` : '';
    const letterSpacing = styles.letterSpacing ? `letter-spacing:${styles.letterSpacing}px;` : '';
    const textBgColor = styles.backgroundColor ? `background-color:${styles.backgroundColor};` : '';

    switch (el.type) {
      case 'smart_html':
        wrapper.innerHTML = `
          <div class="smart-html-wrapper" style="outline:none;">
            ${content.html || content.text || ''}
          </div>
        `;
        wrapper.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, td').forEach((tNode) => {
          if (!tNode.querySelector('table') && !tNode.querySelector('img') && tNode.textContent.trim().length > 0) {
            tNode.contentEditable = 'true';
            tNode.style.outline = 'none';
            tNode.addEventListener('blur', () => {
              content.html = wrapper.querySelector('.smart-html-wrapper').innerHTML;
            });
            tNode.addEventListener('input', () => {
              content.html = wrapper.querySelector('.smart-html-wrapper').innerHTML;
            });
          }
        });
        break;

      case 'html_block':
      case 'raw_html':
        wrapper.innerHTML = `
          <div class="editable-text-wrapper" contenteditable="true" style="outline:none;">
            ${content.html || content.text || ''}
          </div>
        `;
        const htmlDiv = wrapper.querySelector('.editable-text-wrapper');
        htmlDiv.addEventListener('blur', () => {
          content.html = htmlDiv.innerHTML;
          content.text = htmlDiv.innerHTML;
        });
        htmlDiv.addEventListener('input', () => {
          content.html = htmlDiv.innerHTML;
          content.text = htmlDiv.innerHTML;
        });
        break;

      case 'text':
        wrapper.innerHTML = `
          <div class="editable-text-wrapper" contenteditable="true"
               style="font-family:${font}; font-size:${styles.fontSize || 14}px; color:${styles.color || '#000000'}; line-height:${styles.lineHeight || 120}%; text-align:${styles.textAlign || 'left'}; font-weight:${styles.fontWeight || 'normal'}; ${fontStyle} ${transformStyle} ${letterSpacing} ${textBgColor}">
            ${content.text || 'Double click to edit text'}
          </div>
        `;
        const textDiv = wrapper.querySelector('.editable-text-wrapper');
        textDiv.addEventListener('blur', () => {
          content.text = textDiv.innerHTML;
        });
        textDiv.addEventListener('input', () => {
          content.text = textDiv.innerHTML;
        });
        break;

      case 'image':
        let imgBorder = '';
        if (styles.borderWidth && styles.borderColor) {
          imgBorder = `border:${styles.borderWidth}px ${styles.borderStyle || 'solid'} ${styles.borderColor};`;
        }
        wrapper.innerHTML = `
          <div style="text-align:${styles.alignment || 'center'}">
            <img src="${content.src || 'https://via.placeholder.com/600x200'}" alt="${content.alt || ''}"
                 style="width:${styles.width || 600}px; max-width:100%; height:auto; display:inline-block; border-radius:${styles.borderRadius || 0}px; ${imgBorder}" />
          </div>
        `;
        break;

      case 'button':
        let btnBorder = '';
        if (styles.borderWidth && styles.borderColor) {
          btnBorder = `border:${styles.borderWidth}px ${styles.borderStyle || 'solid'} ${styles.borderColor};`;
        }
        wrapper.innerHTML = `
          <div style="text-align:${styles.alignment || 'center'};">
            <a href="#" onclick="event.preventDefault();"
               style="display:inline-block; padding:${styles.paddingTop || 12}px ${styles.paddingRight || 24}px; background-color:${styles.backgroundColor || '#6366f1'}; color:${styles.color || '#ffffff'}; border-radius:${styles.borderRadius || 4}px; font-family:${font}; font-size:${styles.fontSize || 16}px; font-weight:${styles.fontWeight || 'bold'}; text-decoration:none; ${btnBorder}">
              ${content.text || 'Click Here'}
            </a>
          </div>
        `;
        break;

      case 'spacer':
        wrapper.innerHTML = `
          <div style="height:${styles.height || 20}px; font-size:1px;">&nbsp;</div>
        `;
        break;

      case 'divider':
        wrapper.innerHTML = `
          <div style="border-top:${styles.borderWidth || 1}px ${styles.borderStyle || 'solid'} ${styles.borderColor || '#cccccc'}; height:1px; font-size:1px;">&nbsp;</div>
        `;
        break;

      case 'social':
        let iconsHtml = '';
        Object.keys(content).forEach((key) => {
          const url = content[key];
          if (url && EmailCompiler.socialIcons[key]) {
            iconsHtml += `
              <img src="${EmailCompiler.socialIcons[key]}" alt="${key}" width="${styles.iconSize || 40}" style="margin: 0 7px; display:inline-block;" />
            `;
          }
        });
        if (iconsHtml === '') {
          iconsHtml = `<span style="font-size:11px; color:#999;">(No active social links)</span>`;
        }
        wrapper.innerHTML = `
          <div style="text-align:${styles.alignment || 'center'}">
            ${iconsHtml}
          </div>
        `;
        break;

      case 'membership':
        wrapper.innerHTML = `
          <div style="font-family:${font}; font-size:${styles.fontSize || 10}px; color:${styles.color || '#000000'}; text-align:${styles.textAlign || 'left'}; line-height: 110%; font-weight:${styles.fontWeight || 'normal'}; ${fontStyle} ${transformStyle} ${letterSpacing}">
            <span style="display:block; margin:0px;">${content.label || 'Membership Number:'}</span>
            <span style="display:block; margin:0px; font-weight:bold;"><span class="msdynmkt_personalization">${content.tag || '{{AlfursanMembershipID}}'}</span></span>
          </div>
        `;
        break;
    }
  }

  app.renderCanvas = renderCanvas;
  app.renderElementNode = renderElementNode;
  app.selectNode = selectNode;
  window.renderCanvas = renderCanvas;
  window.renderElementNode = renderElementNode;
  window.selectNode = selectNode;
})();
