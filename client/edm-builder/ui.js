// some change left


(function () {
  const app = window.EDMBuilder = window.EDMBuilder || {};

  function loadCustomFontCSS(name, url) {
    if (!name || !url) return;
    const cleanName = name.replace(/['"\s]/g, '');
    let link = document.querySelector(`link[data-font-name="${cleanName}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.dataset.fontName = cleanName;
      link.href = url;
      document.head.appendChild(link);
    }
  }

  function loadPresetTemplate(presetName) {
    if (presetName === 'empty-scratch') {
      state = {
        settings: {
          backgroundColor: '#f4f4f4',
          bodyBackgroundColor: '#ffffff',
          width: 660,
          fontFamily: 'Arial, sans-serif',
          textColor: '#333333',
          direction: 'ltr',
          customFonts: []
        },
        sections: []
      };
      selectedElement = null;
      renderCanvas();
      updateInspector();
      return;
    }

    if (Presets[presetName]) {
      state = JSON.parse(JSON.stringify(Presets[presetName]));
      if (state.settings.customFonts) {
        state.settings.customFonts.forEach((font) => {
          loadCustomFontCSS(font.name, font.url);
        });
      }
      selectedElement = null;
      renderCanvas();
      updateInspector();
    }
  }

  function setupEventListeners() {
    document.querySelectorAll('.device-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.device-btn').forEach((b) => b.classList.remove('active'));
        const btnEl = e.currentTarget;
        btnEl.classList.add('active');
        const device = btnEl.dataset.device;
        const container = document.getElementById('canvas-container');
        container.classList.remove('desktop-view', 'tablet-view', 'mobile-view');
        container.classList.add(`${device}-view`);
      });
    });

    document.querySelectorAll('.drag-item').forEach((item) => {
      item.addEventListener('dragstart', (e) => {
        const type = item.dataset.type;
        if (type === 'section') {
          draggedItem = {
            source: 'sidebar',
            type: 'section',
            columnsCount: parseInt(item.dataset.columns || '1')
          };
        } else {
          draggedItem = {
            source: 'sidebar',
            type: 'element',
            elementType: item.dataset.elementType
          };
        }
        e.dataTransfer.effectAllowed = 'copy';
      });
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the entire canvas?')) {
        state.sections = [];
        selectedElement = null;
        renderCanvas();
        updateInspector();
      }
    });

    document.getElementById('btn-presets').addEventListener('click', () => {
      document.getElementById('modal-presets').classList.remove('hidden');
    });

    document.getElementById('btn-export').addEventListener('click', () => {
      const htmlCode = EmailCompiler.compile(state);
      document.getElementById('code-output').value = htmlCode;
      document.getElementById('modal-export').classList.remove('hidden');
    });

    document.getElementById('btn-import').addEventListener('click', () => {
      document.getElementById('modal-import').classList.remove('hidden');
    });

    const fileInput = document.getElementById('file-input');
    const dropzone = document.getElementById('upload-dropzone');
    const btnBrowse = document.getElementById('btn-browse-file');

    if (btnBrowse && fileInput) {
      btnBrowse.addEventListener('click', () => fileInput.click());
    }
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', (e) => {
        if (e.target !== btnBrowse) fileInput.click();
      });
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          handleImportFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleImportFile(e.target.files[0]);
        }
      });
    }

    const btnQaStudio = document.getElementById('btn-qa-studio');
    if (btnQaStudio) {
      btnQaStudio.addEventListener('click', () => openQAStudio());
    }

    const btnOpenQaRef = document.getElementById('btn-open-qa-from-banner');
    if (btnOpenQaRef) {
      btnOpenQaRef.addEventListener('click', () => openQAStudio());
    }

    const btnRemoveRef = document.getElementById('btn-remove-ref');
    if (btnRemoveRef) {
      btnRemoveRef.addEventListener('click', () => {
        EmailImporter.referenceImage = null;
        document.getElementById('reference-banner').classList.add('hidden');
      });
    }

    const clientSelect = document.getElementById('client-select');
    if (clientSelect) {
      clientSelect.addEventListener('change', (e) => {
        const compiledHtml = EmailCompiler.compile(state);
        const frame = document.getElementById('validator-client-frame');
        EmailValidator.renderSimulator(e.target.value, compiledHtml, frame);
      });
    }

    document.querySelectorAll('.modal-close').forEach((closeBtn) => {
      closeBtn.addEventListener('click', (e) => {
        e.currentTarget.closest('.modal-overlay').classList.add('hidden');
      });
    });

    document.querySelectorAll('.preset-card').forEach((card) => {
      card.addEventListener('click', () => {
        const presetName = card.dataset.preset;
        loadPresetTemplate(presetName);
        document.getElementById('modal-presets').classList.add('hidden');
      });
    });

    const btnCopy = document.getElementById('btn-copy-code');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const textarea = document.getElementById('code-output');
        textarea.select();
        document.execCommand('copy');
        const origHtml = btnCopy.innerHTML;
        btnCopy.innerHTML = '<i data-lucide="check"></i><span>Copied!</span>';
        lucide.createIcons();
        setTimeout(() => {
          btnCopy.innerHTML = origHtml;
          lucide.createIcons();
        }, 2000);
      });
    }

    const btnDownload = document.getElementById('btn-download-html');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        const htmlCode = EmailCompiler.compile(state);
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'edm-email-template.html';
        link.click();
      });
    }

    document.querySelectorAll('.tab-btn').forEach((tabBtn) => {
      tabBtn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach((tb) => tb.classList.remove('active'));
        e.currentTarget.classList.add('active');
        selectedTab = e.currentTarget.dataset.tab;
        updateInspectorFields();
      });
    });

    document.getElementById('canvas-container').addEventListener('click', (e) => {
      if (e.target === document.getElementById('canvas-container') || e.target === document.getElementById('canvas-root')) {
        selectedElement = null;
        document.querySelectorAll('.canvas-section, .canvas-element').forEach((el) => el.classList.remove('selected'));
        updateInspector();
      }
    });
  }

  function initApp() {
    setupEventListeners();
    loadPresetTemplate('empty-scratch');
  }

  function handleImportFile(file) {
    EmailImporter.readReferenceFile(file, (res) => {
      if (res.type === 'html') {
        if (res.state) {
          state = res.state;
          selectedElement = null;
          renderCanvas();
          updateInspector();
          document.getElementById('modal-import').classList.add('hidden');
          alert(`Successfully imported HTML template: ${res.fileName}`);
        }
      } else if (res.type === 'image' || res.type === 'pdf') {
        document.getElementById('reference-banner').classList.remove('hidden');
        document.getElementById('modal-import').classList.add('hidden');
        QAStudio.setReferenceImage(res.dataUrl);
        openQAStudio();
      }
    });
  }

  function openQAStudio() {
    const compiledHtml = EmailCompiler.compile(state);
    const refSrc = EmailImporter.referenceImage || QAStudio.referenceImage || 'https://via.placeholder.com/660x900?text=Click+Upload+Reference+Design+to+Select+Image+or+PDF';
    QAStudio.init(refSrc, compiledHtml);
    updateHealthBadge();
    document.getElementById('modal-qa-studio').classList.remove('hidden');
  }

  function openValidatorStudio() {
    const compiledHtml = EmailCompiler.compile(state);
    const frame = document.getElementById('validator-client-frame');
    const clientType = document.getElementById('client-select').value || 'outlook-2019';
    EmailValidator.renderSimulator(clientType, compiledHtml, frame);
    renderAuditorResults();
    document.getElementById('modal-validator').classList.remove('hidden');
  }

  function renderAuditorResults() {
    const audit = EmailValidator.audit(state);
    const container = document.getElementById('auditor-results-list');
    const scorePill = document.getElementById('validator-score-badge');
    const bigScore = document.getElementById('health-big-score');
    const summaryTitle = document.getElementById('health-summary-title');
    const summaryDesc = document.getElementById('health-summary-desc');

    if (bigScore) {
      bigScore.textContent = `${audit.score}%`;
      if (audit.score >= 90) {
        bigScore.style.color = '#10b981';
        bigScore.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        bigScore.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
        if (summaryTitle) summaryTitle.textContent = 'Outlook Compatibility Verified';
        if (summaryDesc) summaryDesc.textContent = 'Your code is 100% table-based and safe for Outlook desktop copying and sending.';
      } else if (audit.score >= 70) {
        bigScore.style.color = '#f59e0b';
        bigScore.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        bigScore.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
        if (summaryTitle) summaryTitle.textContent = 'Minor Outlook Warnings Detected';
        if (summaryDesc) summaryDesc.textContent = 'The template has minor items that can be auto-fixed for 100% Outlook compatibility.';
      } else {
        bigScore.style.color = '#ef4444';
        bigScore.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        bigScore.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        if (summaryTitle) summaryTitle.textContent = 'Outlook Compatibility Issues Found';
        if (summaryDesc) summaryDesc.textContent = 'Template contains formatting issues. Click Auto-Fix All to resolve automatically.';
      }
    }

    if (scorePill) {
      scorePill.textContent = `Outlook Score: ${audit.score}%`;
      if (audit.score >= 90) {
        scorePill.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
        scorePill.style.color = '#10b981';
      } else if (audit.score >= 70) {
        scorePill.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
        scorePill.style.color = '#f59e0b';
      } else {
        scorePill.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        scorePill.style.color = '#ef4444';
      }
    }

    if (!container) return;
    container.innerHTML = '';

    audit.results.forEach((res) => {
      const card = document.createElement('div');
      card.className = `audit-card audit-${res.severity}`;
      let fixBtnHtml = '';
      if (res.autoFixable) {
        fixBtnHtml = `<button class="btn-autofix" data-rule="${res.id}">⚡ Auto-Fix Code</button>`;
      }
      card.innerHTML = `
        <div class="audit-card-head">
          <span class="audit-card-title">${res.title}</span>
          <span class="audit-badge">${res.severity}</span>
        </div>
        <div class="audit-card-desc">${res.description}</div>
        ${fixBtnHtml}
      `;

      if (res.autoFixable) {
        card.querySelector('.btn-autofix').addEventListener('click', () => {
          EmailValidator.applyAutoFix(res.id, state);
          renderCanvas();
          renderAuditorResults();
          const frame = document.getElementById('validator-client-frame');
          const clientType = document.getElementById('client-select').value;
          EmailValidator.renderSimulator(clientType, EmailCompiler.compile(state), frame);
        });
      }

      container.appendChild(card);
    });
  }

  function updateHealthBadge() {
    const badge = document.getElementById('badge-health');
    if (!badge) return;
    const audit = EmailValidator.audit(state);
    badge.textContent = `${audit.score}%`;
    badge.classList.remove('status-good', 'status-warning', 'status-error');
    if (audit.score >= 90) {
      badge.classList.add('status-good');
    } else if (audit.score >= 70) {
      badge.classList.add('status-warning');
    } else {
      badge.classList.add('status-error');
    }
  }

  app.loadCustomFontCSS = loadCustomFontCSS;
  app.loadPresetTemplate = loadPresetTemplate;
  app.setupEventListeners = setupEventListeners;
  app.initApp = initApp;
  app.handleImportFile = handleImportFile;
  app.openQAStudio = openQAStudio;
  app.openValidatorStudio = openValidatorStudio;
  app.renderAuditorResults = renderAuditorResults;
  app.updateHealthBadge = updateHealthBadge;

  window.loadCustomFontCSS = loadCustomFontCSS;
  window.loadPresetTemplate = loadPresetTemplate;
  window.setupEventListeners = setupEventListeners;
  window.initApp = initApp;
  window.handleImportFile = handleImportFile;
  window.openQAStudio = openQAStudio;
  window.openValidatorStudio = openValidatorStudio;
  window.renderAuditorResults = renderAuditorResults;
  window.updateHealthBadge = updateHealthBadge;
})();
