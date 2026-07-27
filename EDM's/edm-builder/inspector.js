(function () {
  const app = window.EDMBuilder = window.EDMBuilder || {};

  function updateInspector() {
    const emptyPanel = document.getElementById('inspector-empty');
    const tabsPanel = document.getElementById('inspector-tabs');
    const formPanel = document.getElementById('inspector-form');
    const titleText = document.getElementById('inspector-subtitle');

    if (!selectedElement) {
      emptyPanel.classList.remove('hidden');
      tabsPanel.classList.add('hidden');
      formPanel.classList.add('hidden');
      titleText.textContent = 'Select an element to customize';
      return;
    }

    emptyPanel.classList.add('hidden');
    tabsPanel.classList.remove('hidden');
    formPanel.classList.remove('hidden');
    titleText.textContent = `${selectedElement.type.toUpperCase()}: ${selectedElement.id}`;

    updateInspectorFields();
  }

  function getFontOptions(currentVal) {
    let options = `
      <option value="Arial, sans-serif" ${currentVal === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
      <option value="Georgia, serif" ${currentVal === 'Georgia, serif' ? 'selected' : ''}>Georgia</option>
      <option value="'Times New Roman', serif" ${currentVal === "'Times New Roman', serif" ? 'selected' : ''}>Times New Roman</option>
      <option value="Verdana, sans-serif" ${currentVal === 'Verdana, sans-serif' ? 'selected' : ''}>Verdana</option>
      <option value="Helvetica, sans-serif" ${currentVal === 'Helvetica, sans-serif' ? 'selected' : ''}>Helvetica</option>
      <option value="'Courier New', monospace" ${currentVal === "'Courier New', monospace" ? 'selected' : ''}>Courier New</option>
      <option value="Tahoma, sans-serif" ${currentVal === 'Tahoma, sans-serif' ? 'selected' : ''}>Tahoma</option>
    `;

    if (state.settings.customFonts) {
      state.settings.customFonts.forEach((font) => {
        const val = `'${font.name}', sans-serif`;
        options += `<option value="${val}" ${currentVal === val ? 'selected' : ''}>${font.name} (Custom)</option>`;
      });
    }
    return options;
  }

  function updateInspectorFields() {
    const form = document.getElementById('inspector-form');
    form.innerHTML = '';

    const node = selectedElement.node;
    const type = selectedElement.type;

    if (selectedTab === 'content') {
      if (type === 'section') {
        let customFontListHtml = '';
        if (state.settings.customFonts && state.settings.customFonts.length > 0) {
          state.settings.customFonts.forEach((font, idx) => {
            customFontListHtml += `
              <li style="display:flex; justify-content:between; align-items:center; margin-bottom:4px; background:rgba(255,255,255,0.03); padding:4px 8px; border-radius:4px;">
                <span>${font.name}</span>
                <button type="button" class="btn-delete-font" data-idx="${idx}" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:10px;">Remove</button>
              </li>
            `;
          });
        } else {
          customFontListHtml = '<li style="font-style:italic; font-size:10px;">No custom fonts added yet.</li>';
        }

        form.innerHTML = `
          <div class="form-group">
            <label>Global Layout Settings</label>
            <div class="form-group">
              <label>Template Canvas Width (px)</label>
              <input type="number" id="g-width" class="form-control" value="${state.settings.width}">
            </div>
            <div class="form-group">
              <label>Outer Background Color</label>
              <div class="color-picker-wrapper">
                <input type="color" id="g-bg" class="color-input" value="${state.settings.backgroundColor}">
                <input type="text" id="g-bg-text" class="form-control" value="${state.settings.backgroundColor}">
              </div>
            </div>
            <div class="form-group">
              <label>Body Background Color</label>
              <div class="color-picker-wrapper">
                <input type="color" id="g-body-bg" class="color-input" value="${state.settings.bodyBackgroundColor}">
                <input type="text" id="g-body-bg-text" class="form-control" value="${state.settings.bodyBackgroundColor}">
              </div>
            </div>
            <div class="form-group">
              <label>Text Reading Direction</label>
              <select id="g-direction" class="form-control">
                <option value="ltr" ${state.settings.direction === 'ltr' ? 'selected' : ''}>Left to Right (LTR)</option>
                <option value="rtl" ${state.settings.direction === 'rtl' ? 'selected' : ''}>Right to Left (RTL)</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-top:15px; border-top:1px solid var(--border-color); padding-top:15px;">
            <label style="font-weight:bold; color:var(--accent-light);">Add Web Font (Google Fonts)</label>
            <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
              <input type="text" id="font-name" class="form-control" placeholder="Font Name (e.g. Cairo)">
              <input type="text" id="font-url" class="form-control" placeholder="Google Fonts CSS stylesheet URL">
              <button id="btn-add-font" type="button" class="btn btn-primary" style="padding:6px 12px; font-size:12px; justify-content:center;">Add Custom Font</button>
            </div>
            <label style="font-weight:500; margin-top:12px; display:block;">Registered Web Fonts</label>
            <ul id="custom-fonts-list" style="margin-top:6px; font-size:11px; color:var(--text-muted); list-style:none; padding-left:0;">
              ${customFontListHtml}
            </ul>
          </div>
        `;

        bindInput('g-width', (val) => { state.settings.width = parseInt(val); renderCanvas(); });
        bindColorInput('g-bg', 'g-bg-text', (val) => { state.settings.backgroundColor = val; renderCanvas(); });
        bindColorInput('g-body-bg', 'g-body-bg-text', (val) => { state.settings.bodyBackgroundColor = val; renderCanvas(); });
        bindSelect('g-direction', (val) => { state.settings.direction = val; renderCanvas(); });

        document.getElementById('btn-add-font').addEventListener('click', () => {
          const name = document.getElementById('font-name').value.trim();
          const url = document.getElementById('font-url').value.trim();
          if (!name || !url) {
            alert('Please enter both the Font Family Name and the stylesheet CSS URL.');
            return;
          }
          if (!state.settings.customFonts) state.settings.customFonts = [];
          state.settings.customFonts.push({ name, url });
          loadCustomFontCSS(name, url);
          renderCanvas();
          updateInspectorFields();
        });

        form.querySelectorAll('.btn-delete-font').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.idx);
            state.settings.customFonts.splice(idx, 1);
            renderCanvas();
            updateInspectorFields();
          });
        });
      } else if (type === 'element') {
        const elType = node.type;
        if (elType === 'smart_html') {
          let subItemsHtml = '';
          if (node.content.subItems && node.content.subItems.length > 0) {
            subItemsHtml = `<div class="form-group"><label style="font-weight:600; color:var(--accent-light);">Indexed Editable Items:</label><ul style="font-size:11px; padding-left:14px; margin-top:6px; color:var(--text-muted); line-height:1.6;">`;
            node.content.subItems.forEach((sub) => {
              if (sub.type === 'image') subItemsHtml += `<li>🖼️ <strong>Image:</strong> ${sub.alt || 'Banner'} (${sub.width}px)</li>`;
              else if (sub.type === 'button') subItemsHtml += `<li>🔘 <strong>Button:</strong> ${sub.text}</li>`;
              else if (sub.type === 'text') subItemsHtml += `<li>📝 <strong>Text:</strong> "${sub.text.replace(/<[^>]*>/g, '').substr(0, 35)}..."</li>`;
              else if (sub.type === 'membership') subItemsHtml += `<li>💳 <strong>Membership:</strong> ${sub.tag}</li>`;
            });
            subItemsHtml += '</ul></div>';
          }

          form.innerHTML = `
            ${subItemsHtml}
            <div class="form-group">
              <label>HTML Content Code</label>
              <textarea id="val-text" class="form-control" style="height:180px;">${node.content.html || ''}</textarea>
            </div>
          `;
          bindInput('val-text', (val) => { node.content.html = val; renderCanvas(); });
        } else if (elType === 'text' || elType === 'html_block' || elType === 'raw_html') {
          form.innerHTML = `
            <div class="form-group">
              <label>HTML / Text Content</label>
              <textarea id="val-text" class="form-control" style="height:160px;">${node.content.html || node.content.text || ''}</textarea>
            </div>
          `;
          bindInput('val-text', (val) => { node.content.html = val; node.content.text = val; renderCanvas(); });
        } else if (elType === 'image') {
          form.innerHTML = `
            <div class="form-group">
              <label>Image Source URL</label>
              <input type="text" id="val-src" class="form-control" value="${node.content.src || ''}">
            </div>
            <div class="form-group">
              <label>Alternative Text</label>
              <input type="text" id="val-alt" class="form-control" value="${node.content.alt || ''}">
            </div>
            <div class="form-group">
              <label>Link Destination URL (onClick)</label>
              <input type="text" id="val-href" class="form-control" value="${node.content.href || ''}">
            </div>
          `;
          bindInput('val-src', (val) => { node.content.src = val; renderCanvas(); });
          bindInput('val-alt', (val) => { node.content.alt = val; renderCanvas(); });
          bindInput('val-href', (val) => { node.content.href = val; renderCanvas(); });
        } else if (elType === 'button') {
          form.innerHTML = `
            <div class="form-group">
              <label>Button Text</label>
              <input type="text" id="val-btn-text" class="form-control" value="${node.content.text || ''}">
            </div>
            <div class="form-group">
              <label>Destination URL</label>
              <input type="text" id="val-btn-href" class="form-control" value="${node.content.href || ''}">
            </div>
          `;
          bindInput('val-btn-text', (val) => { node.content.text = val; renderCanvas(); });
          bindInput('val-btn-href', (val) => { node.content.href = val; renderCanvas(); });
        } else if (elType === 'social') {
          form.innerHTML = `
            <div class="form-group"><label>Facebook URL</label><input type="text" id="val-soc-fb" class="form-control" value="${node.content.facebook || ''}"></div>
            <div class="form-group"><label>Instagram URL</label><input type="text" id="val-soc-ig" class="form-control" value="${node.content.instagram || ''}"></div>
            <div class="form-group"><label>Twitter/X URL</label><input type="text" id="val-soc-tw" class="form-control" value="${node.content.twitter || ''}"></div>
            <div class="form-group"><label>YouTube URL</label><input type="text" id="val-soc-yt" class="form-control" value="${node.content.youtube || ''}"></div>
            <div class="form-group"><label>LinkedIn URL</label><input type="text" id="val-soc-li" class="form-control" value="${node.content.linkedin || ''}"></div>
            <div class="form-group"><label>Snapchat URL</label><input type="text" id="val-soc-sc" class="form-control" value="${node.content.snapchat || ''}"></div>
            <div class="form-group"><label>Telegram URL</label><input type="text" id="val-soc-tg" class="form-control" value="${node.content.telegram || ''}"></div>
            <div class="form-group"><label>TikTok URL</label><input type="text" id="val-soc-tk" class="form-control" value="${node.content.tiktok || ''}"></div>
          `;
          bindInput('val-soc-fb', (val) => { node.content.facebook = val; renderCanvas(); });
          bindInput('val-soc-ig', (val) => { node.content.instagram = val; renderCanvas(); });
          bindInput('val-soc-tw', (val) => { node.content.twitter = val; renderCanvas(); });
          bindInput('val-soc-yt', (val) => { node.content.youtube = val; renderCanvas(); });
          bindInput('val-soc-li', (val) => { node.content.linkedin = val; renderCanvas(); });
          bindInput('val-soc-sc', (val) => { node.content.snapchat = val; renderCanvas(); });
          bindInput('val-soc-tg', (val) => { node.content.telegram = val; renderCanvas(); });
          bindInput('val-soc-tk', (val) => { node.content.tiktok = val; renderCanvas(); });
        } else if (elType === 'membership') {
          form.innerHTML = `
            <div class="form-group"><label>Label Prefix</label><input type="text" id="val-mem-label" class="form-control" value="${node.content.label || ''}"></div>
            <div class="form-group"><label>Personalization Tag</label><input type="text" id="val-mem-tag" class="form-control" value="${node.content.tag || ''}"></div>
          `;
          bindInput('val-mem-label', (val) => { node.content.label = val; renderCanvas(); });
          bindInput('val-mem-tag', (val) => { node.content.tag = val; renderCanvas(); });
        } else {
          form.innerHTML = '<p style="font-size:12px; color:var(--text-muted);">This element has no content fields.</p>';
        }
      }
    } else if (selectedTab === 'style') {
      const styles = node.styles || {};
      if (type === 'section') {
        form.innerHTML = `
          <div class="form-group"><label>Section Background Color</label><div class="color-picker-wrapper"><input type="color" id="style-bg" class="color-input" value="${node.settings.backgroundColor || '#ffffff'}"><input type="text" id="style-bg-text" class="form-control" value="${node.settings.backgroundColor || '#ffffff'}"></div></div>
          <div class="form-group"><label>Padding Top</label><div class="slider-group"><input type="range" id="style-pad-t" min="0" max="100" value="${node.settings.paddingTop || 0}"><span class="slider-value" id="style-pad-t-val">${node.settings.paddingTop || 0}px</span></div></div>
          <div class="form-group"><label>Padding Bottom</label><div class="slider-group"><input type="range" id="style-pad-b" min="0" max="100" value="${node.settings.paddingBottom || 0}"><span class="slider-value" id="style-pad-b-val">${node.settings.paddingBottom || 0}px</span></div></div>
          <div class="form-group"><label>Padding Left (Gutter)</label><div class="slider-group"><input type="range" id="style-pad-l" min="0" max="100" value="${node.settings.paddingLeft || 0}"><span class="slider-value" id="style-pad-l-val">${node.settings.paddingLeft || 0}px</span></div></div>
          <div class="form-group"><label>Padding Right (Gutter)</label><div class="slider-group"><input type="range" id="style-pad-r" min="0" max="100" value="${node.settings.paddingRight || 0}"><span class="slider-value" id="style-pad-r-val">${node.settings.paddingRight || 0}px</span></div></div>
        `;
        bindColorInput('style-bg', 'style-bg-text', (val) => { node.settings.backgroundColor = val; renderCanvas(); });
        bindSlider('style-pad-t', 'style-pad-t-val', (val) => { node.settings.paddingTop = parseInt(val); renderCanvas(); });
        bindSlider('style-pad-b', 'style-pad-b-val', (val) => { node.settings.paddingBottom = parseInt(val); renderCanvas(); });
        bindSlider('style-pad-l', 'style-pad-l-val', (val) => { node.settings.paddingLeft = parseInt(val); renderCanvas(); });
        bindSlider('style-pad-r', 'style-pad-r-val', (val) => { node.settings.paddingRight = parseInt(val); renderCanvas(); });
      } else if (type === 'element') {
        const elType = node.type;
        let paddingFields = `
          <div class="form-group"><label>Padding Top</label><div class="slider-group"><input type="range" id="style-pad-t" min="0" max="80" value="${styles.paddingTop || 0}"><span class="slider-value" id="style-pad-t-val">${styles.paddingTop || 0}px</span></div></div>
          <div class="form-group"><label>Padding Bottom</label><div class="slider-group"><input type="range" id="style-pad-b" min="0" max="80" value="${styles.paddingBottom || 0}"><span class="slider-value" id="style-pad-b-val">${styles.paddingBottom || 0}px</span></div></div>
          <div class="form-group"><label>Padding Left</label><div class="slider-group"><input type="range" id="style-pad-l" min="0" max="80" value="${styles.paddingLeft || 0}"><span class="slider-value" id="style-pad-l-val">${styles.paddingLeft || 0}px</span></div></div>
          <div class="form-group"><label>Padding Right</label><div class="slider-group"><input type="range" id="style-pad-r" min="0" max="80" value="${styles.paddingRight || 0}"><span class="slider-value" id="style-pad-r-val">${styles.paddingRight || 0}px</span></div></div>
        `;

        if (elType === 'text' || elType === 'membership') {
          form.innerHTML = `
            <div class="form-group"><label>Font Family</label><select id="style-font" class="form-control">${getFontOptions(styles.fontFamily)}</select></div>
            <div class="form-group"><label>Text Color</label><div class="color-picker-wrapper"><input type="color" id="style-color" class="color-input" value="${styles.color || '#000000'}"><input type="text" id="style-color-text" class="form-control" value="${styles.color || '#000000'}"></div></div>
            <div class="form-group"><label>Background Color</label><div class="color-picker-wrapper"><input type="color" id="style-text-bg" class="color-input" value="${styles.backgroundColor || '#ffffff'}"><input type="text" id="style-text-bg-text" class="form-control" value="${styles.backgroundColor || ''}"></div></div>
            <div class="form-group"><label>Font Size</label><div class="slider-group"><input type="range" id="style-size" min="8" max="72" value="${styles.fontSize || 14}"><span class="slider-value" id="style-size-val">${styles.fontSize || 14}px</span></div></div>
            <div class="form-group"><label>Line Height (%)</label><div class="slider-group"><input type="range" id="style-lh" min="100" max="250" step="5" value="${styles.lineHeight || 120}"><span class="slider-value" id="style-lh-val">${styles.lineHeight || 120}%</span></div></div>
            <div class="form-group"><label>Letter Spacing (px)</label><div class="slider-group"><input type="range" id="style-ls" min="-2" max="15" step="1" value="${styles.letterSpacing || 0}"><span class="slider-value" id="style-ls-val">${styles.letterSpacing || 0}px</span></div></div>
            <div class="form-group"><label>Text Alignment</label><div class="align-options"><button class="align-btn ${styles.textAlign === 'left' ? 'active' : ''}" id="align-left" data-align="left"><i data-lucide="align-left"></i></button><button class="align-btn ${styles.textAlign === 'center' ? 'active' : ''}" id="align-center" data-align="center"><i data-lucide="align-center"></i></button><button class="align-btn ${styles.textAlign === 'right' ? 'active' : ''}" id="align-right" data-align="right"><i data-lucide="align-right"></i></button></div></div>
            <div class="form-row"><div class="form-group"><label>Font Weight</label><select id="style-weight" class="form-control"><option value="normal" ${styles.fontWeight === 'normal' ? 'selected' : ''}>Normal</option><option value="bold" ${styles.fontWeight === 'bold' ? 'selected' : ''}>Bold</option><option value="300" ${styles.fontWeight === '300' ? 'selected' : ''}>Light (300)</option><option value="500" ${styles.fontWeight === '500' ? 'selected' : ''}>Medium (500)</option><option value="700" ${styles.fontWeight === '700' ? 'selected' : ''}>Bold (700)</option><option value="800" ${styles.fontWeight === '800' ? 'selected' : ''}>Extra Bold (800)</option></select></div><div class="form-group"><label>Font Style</label><select id="style-font-italic" class="form-control"><option value="normal" ${styles.fontStyle === 'normal' ? 'selected' : ''}>Normal</option><option value="italic" ${styles.fontStyle === 'italic' ? 'selected' : ''}>Italic</option></select></div></div>
            <div class="form-group"><label>Text Transform</label><select id="style-transform" class="form-control"><option value="none" ${styles.textTransform === 'none' ? 'selected' : ''}>None</option><option value="uppercase" ${styles.textTransform === 'uppercase' ? 'selected' : ''}>Uppercase</option><option value="lowercase" ${styles.textTransform === 'lowercase' ? 'selected' : ''}>Lowercase</option><option value="capitalize" ${styles.textTransform === 'capitalize' ? 'selected' : ''}>Capitalize</option></select></div>
          ` + paddingFields;
          bindSelect('style-font', (val) => { styles.fontFamily = val; renderCanvas(); });
          bindColorInput('style-color', 'style-color-text', (val) => { styles.color = val; renderCanvas(); });
          bindColorInput('style-text-bg', 'style-text-bg-text', (val) => { styles.backgroundColor = val; renderCanvas(); });
          bindSlider('style-size', 'style-size-val', (val) => { styles.fontSize = parseInt(val); renderCanvas(); });
          bindSlider('style-lh', 'style-lh-val', (val) => { styles.lineHeight = parseInt(val); renderCanvas(); });
          bindSlider('style-ls', 'style-ls-val', (val) => { styles.letterSpacing = parseInt(val); renderCanvas(); });
          bindAlign('textAlign', (val) => { styles.textAlign = val; renderCanvas(); });
          bindSelect('style-weight', (val) => { styles.fontWeight = val; renderCanvas(); });
          bindSelect('style-font-italic', (val) => { styles.fontStyle = val; renderCanvas(); });
          bindSelect('style-transform', (val) => { styles.textTransform = val; renderCanvas(); });
        } else if (elType === 'image') {
          form.innerHTML = `
            <div class="form-group"><label>Image Width (px)</label><div class="slider-group"><input type="range" id="style-img-w" min="50" max="660" step="10" value="${styles.width || 600}"><span class="slider-value" id="style-img-w-val">${styles.width || 600}px</span></div></div>
            <div class="form-group"><label>Alignment</label><div class="align-options"><button class="align-btn ${styles.alignment === 'left' ? 'active' : ''}" id="align-left" data-align="left"><i data-lucide="align-left"></i></button><button class="align-btn ${styles.alignment === 'center' ? 'active' : ''}" id="align-center" data-align="center"><i data-lucide="align-center"></i></button><button class="align-btn ${styles.alignment === 'right' ? 'active' : ''}" id="align-right" data-align="right"><i data-lucide="align-right"></i></button></div></div>
            <div class="form-group"><label>Border Radius (px)</label><div class="slider-group"><input type="range" id="style-img-radius" min="0" max="100" value="${styles.borderRadius || 0}"><span class="slider-value" id="style-img-radius-val">${styles.borderRadius || 0}px</span></div></div>
            <div class="form-group" style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:12px;"><label style="font-weight:bold;">Border Settings</label><div class="form-row" style="margin-top:6px;"><div class="form-group"><label>Width (px)</label><input type="number" id="style-border-w" class="form-control" value="${styles.borderWidth || 0}"></div><div class="form-group"><label>Style</label><select id="style-border-type" class="form-control"><option value="solid" ${styles.borderStyle === 'solid' ? 'selected' : ''}>Solid</option><option value="dashed" ${styles.borderStyle === 'dashed' ? 'selected' : ''}>Dashed</option><option value="dotted" ${styles.borderStyle === 'dotted' ? 'selected' : ''}>Dotted</option></select></div></div><div class="form-group" style="margin-top:8px;"><label>Border Color</label><div class="color-picker-wrapper"><input type="color" id="style-border-color" class="color-input" value="${styles.borderColor || '#cccccc'}"><input type="text" id="style-border-color-text" class="form-control" value="${styles.borderColor || '#cccccc'}"></div></div></div>
          ` + paddingFields;
          bindSlider('style-img-w', 'style-img-w-val', (val) => { styles.width = parseInt(val); renderCanvas(); });
          bindAlign('alignment', (val) => { styles.alignment = val; renderCanvas(); });
          bindSlider('style-img-radius', 'style-img-radius-val', (val) => { styles.borderRadius = parseInt(val); renderCanvas(); });
          bindInput('style-border-w', (val) => { styles.borderWidth = parseInt(val || '0'); renderCanvas(); });
          bindSelect('style-border-type', (val) => { styles.borderStyle = val; renderCanvas(); });
          bindColorInput('style-border-color', 'style-border-color-text', (val) => { styles.borderColor = val; renderCanvas(); });
        } else if (elType === 'button') {
          form.innerHTML = `
            <div class="form-group"><label>Font Family</label><select id="style-font" class="form-control">${getFontOptions(styles.fontFamily)}</select></div>
            <div class="form-group"><label>Button Background Color</label><div class="color-picker-wrapper"><input type="color" id="style-btn-bg" class="color-input" value="${styles.backgroundColor || '#6366f1'}"><input type="text" id="style-btn-bg-text" class="form-control" value="${styles.backgroundColor || '#6366f1'}"></div></div>
            <div class="form-group"><label>Text Color</label><div class="color-picker-wrapper"><input type="color" id="style-btn-color" class="color-input" value="${styles.color || '#ffffff'}"><input type="text" id="style-btn-color-text" class="form-control" value="${styles.color || '#ffffff'}"></div></div>
            <div class="form-group"><label>Font Size</label><div class="slider-group"><input type="range" id="style-btn-size" min="10" max="32" value="${styles.fontSize || 16}"><span class="slider-value" id="style-btn-size-val">${styles.fontSize || 16}px</span></div></div>
            <div class="form-group"><label>Border Radius (px)</label><div class="slider-group"><input type="range" id="style-btn-radius" min="0" max="30" value="${styles.borderRadius || 4}"><span class="slider-value" id="style-btn-radius-val">${styles.borderRadius || 4}px</span></div></div>
            <div class="form-group"><label>Alignment</label><div class="align-options"><button class="align-btn ${styles.alignment === 'left' ? 'active' : ''}" id="align-left" data-align="left"><i data-lucide="align-left"></i></button><button class="align-btn ${styles.alignment === 'center' ? 'active' : ''}" id="align-center" data-align="center"><i data-lucide="align-center"></i></button><button class="align-btn ${styles.alignment === 'right' ? 'active' : ''}" id="align-right" data-align="right"><i data-lucide="align-right"></i></button></div></div>
            <div class="form-group" style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:12px;"><label style="font-weight:bold;">Border Settings</label><div class="form-row" style="margin-top:6px;"><div class="form-group"><label>Width (px)</label><input type="number" id="style-btn-border-w" class="form-control" value="${styles.borderWidth || 0}"></div><div class="form-group"><label>Style</label><select id="style-btn-border-type" class="form-control"><option value="solid" ${styles.borderStyle === 'solid' ? 'selected' : ''}>Solid</option><option value="dashed" ${styles.borderStyle === 'dashed' ? 'selected' : ''}>Dashed</option><option value="dotted" ${styles.borderStyle === 'dotted' ? 'selected' : ''}>Dotted</option></select></div></div><div class="form-group" style="margin-top:8px;"><label>Border Color</label><div class="color-picker-wrapper"><input type="color" id="style-btn-border-color" class="color-input" value="${styles.borderColor || '#4f46e5'}"><input type="text" id="style-btn-border-color-text" class="form-control" value="${styles.borderColor || '#4f46e5'}"></div></div></div>
          ` + paddingFields;
          bindSelect('style-font', (val) => { styles.fontFamily = val; renderCanvas(); });
          bindColorInput('style-btn-bg', 'style-btn-bg-text', (val) => { styles.backgroundColor = val; renderCanvas(); });
          bindColorInput('style-btn-color', 'style-btn-color-text', (val) => { styles.color = val; renderCanvas(); });
          bindSlider('style-btn-size', 'style-btn-size-val', (val) => { styles.fontSize = parseInt(val); renderCanvas(); });
          bindSlider('style-btn-radius', 'style-btn-radius-val', (val) => { styles.borderRadius = parseInt(val); renderCanvas(); });
          bindAlign('alignment', (val) => { styles.alignment = val; renderCanvas(); });
          bindInput('style-btn-border-w', (val) => { styles.borderWidth = parseInt(val || '0'); renderCanvas(); });
          bindSelect('style-btn-border-type', (val) => { styles.borderStyle = val; renderCanvas(); });
          bindColorInput('style-btn-border-color', 'style-btn-border-color-text', (val) => { styles.borderColor = val; renderCanvas(); });
        } else if (elType === 'spacer') {
          form.innerHTML = `
            <div class="form-group"><label>Spacer Height (px)</label><div class="slider-group"><input type="range" id="style-spacer-h" min="5" max="150" step="5" value="${styles.height || 20}"><span class="slider-value" id="style-spacer-h-val">${styles.height || 20}px</span></div></div>
          `;
          bindSlider('style-spacer-h', 'style-spacer-h-val', (val) => { styles.height = parseInt(val); renderCanvas(); });
        } else if (elType === 'divider') {
          form.innerHTML = `
            <div class="form-group"><label>Line Thickness (px)</label><div class="slider-group"><input type="range" id="style-div-w" min="1" max="10" value="${styles.borderWidth || 1}"><span class="slider-value" id="style-div-w-val">${styles.borderWidth || 1}px</span></div></div>
            <div class="form-group"><label>Line Color</label><div class="color-picker-wrapper"><input type="color" id="style-div-color" class="color-input" value="${styles.borderColor || '#cccccc'}"><input type="text" id="style-div-color-text" class="form-control" value="${styles.borderColor || '#cccccc'}"></div></div>
            <div class="form-group"><label>Line Style</label><select id="style-div-type" class="form-control"><option value="solid" ${styles.borderStyle === 'solid' ? 'selected' : ''}>Solid</option><option value="dashed" ${styles.borderStyle === 'dashed' ? 'selected' : ''}>Dashed</option><option value="dotted" ${styles.borderStyle === 'dotted' ? 'selected' : ''}>Dotted</option></select></div>
          ` + paddingFields;
          bindSlider('style-div-w', 'style-div-w-val', (val) => { styles.borderWidth = parseInt(val); renderCanvas(); });
          bindColorInput('style-div-color', 'style-div-color-text', (val) => { styles.borderColor = val; renderCanvas(); });
          bindSelect('style-div-type', (val) => { styles.borderStyle = val; renderCanvas(); });
        } else if (elType === 'social') {
          form.innerHTML = `
            <div class="form-group"><label>Icon Dimensions (px)</label><div class="slider-group"><input type="range" id="style-soc-size" min="16" max="64" step="4" value="${styles.iconSize || 32}"><span class="slider-value" id="style-soc-size-val">${styles.iconSize || 32}px</span></div></div>
            <div class="form-group"><label>Alignment</label><div class="align-options"><button class="align-btn ${styles.alignment === 'left' ? 'active' : ''}" id="align-left" data-align="left"><i data-lucide="align-left"></i></button><button class="align-btn ${styles.alignment === 'center' ? 'active' : ''}" id="align-center" data-align="center"><i data-lucide="align-center"></i></button><button class="align-btn ${styles.alignment === 'right' ? 'active' : ''}" id="align-right" data-align="right"><i data-lucide="align-right"></i></button></div></div>
          ` + paddingFields;
          bindSlider('style-soc-size', 'style-soc-size-val', (val) => { styles.iconSize = parseInt(val); renderCanvas(); });
          bindAlign('alignment', (val) => { styles.alignment = val; renderCanvas(); });
        }

        bindSlider('style-pad-t', 'style-pad-t-val', (val) => { styles.paddingTop = parseInt(val); renderCanvas(); });
        bindSlider('style-pad-b', 'style-pad-b-val', (val) => { styles.paddingBottom = parseInt(val); renderCanvas(); });
        bindSlider('style-pad-l', 'style-pad-l-val', (val) => { styles.paddingLeft = parseInt(val); renderCanvas(); });
        bindSlider('style-pad-r', 'style-pad-r-val', (val) => { styles.paddingRight = parseInt(val); renderCanvas(); });
      }
    }

    lucide.createIcons();
  }

  function bindInput(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => callback(e.target.value));
    }
  }

  function bindSelect(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => callback(e.target.value));
    }
  }

  function bindColorInput(pickerId, textId, callback) {
    const picker = document.getElementById(pickerId);
    const text = document.getElementById(textId);
    if (picker && text) {
      picker.addEventListener('input', (e) => {
        text.value = e.target.value;
        callback(e.target.value);
      });
      text.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          picker.value = e.target.value;
          callback(e.target.value);
        }
      });
    }
  }

  function bindSlider(sliderId, valueLabelId, callback) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(valueLabelId);
    if (slider && label) {
      slider.addEventListener('input', (e) => {
        const suffix = sliderId.includes('lh') ? '%' : 'px';
        label.textContent = `${e.target.value}${suffix}`;
        callback(e.target.value);
      });
    }
  }

  function bindAlign(styleProp, callback) {
    ['left', 'center', 'right'].forEach((align) => {
      const btn = document.getElementById(`align-${align}`);
      if (btn) {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.align-btn').forEach((b) => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          callback(align);
        });
      }
    });
  }

  app.updateInspector = updateInspector;
  app.getFontOptions = getFontOptions;
  app.updateInspectorFields = updateInspectorFields;
  app.bindInput = bindInput;
  app.bindSelect = bindSelect;
  app.bindColorInput = bindColorInput;
  app.bindSlider = bindSlider;
  app.bindAlign = bindAlign;

  window.updateInspector = updateInspector;
  window.getFontOptions = getFontOptions;
  window.updateInspectorFields = updateInspectorFields;
  window.bindInput = bindInput;
  window.bindSelect = bindSelect;
  window.bindColorInput = bindColorInput;
  window.bindSlider = bindSlider;
  window.bindAlign = bindAlign;
})();
