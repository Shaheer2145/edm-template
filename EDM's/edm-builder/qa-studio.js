// 3-Step Guided QA & Outlook Studio Engine
const QAStudio = {
  currentStep: 'step-ref', // 'step-ref', 'step-compare', 'step-health'
  referenceImage: null,
  opacity: 0.5,
  isDiffMode: false,
  checklist: [
    { id: 'chk_logo', label: 'Header & Logo Placement', checked: false },
    { id: 'chk_banner', label: 'Main Banner Dimensions & Aspect Ratio', checked: false },
    { id: 'chk_typography', label: 'Font Family, Sizes & Line Spacing', checked: false },
    { id: 'chk_direction', label: 'Text Direction (LTR / RTL Flow)', checked: false },
    { id: 'chk_buttons', label: 'Button Colors, Padding & Radius', checked: false },
    { id: 'chk_footer', label: 'Social Icons & Unsubscribe Footer Links', checked: false }
  ],

  // Initialize 3-Step Studio Wizard
  init(referenceImgSrc, compiledHtml) {
    if (referenceImgSrc) {
      this.setReferenceImage(referenceImgSrc);
    } else if (!this.referenceImage) {
      this.setReferenceImage('https://via.placeholder.com/660x900?text=Click+Upload+Reference+Design+to+Select+Image+or+PDF');
    }

    // Render Live Template HTML into QA preview frame
    const previewFrame = document.getElementById('qa-preview-frame');
    if (previewFrame && compiledHtml) {
      const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
      doc.open();
      doc.write(compiledHtml);
      doc.close();
    }

    this.bindRefUploader();
    this.bindAutoFixAll();
    this.goToStep(this.currentStep || 'step-ref');
  },

  // Set Reference Design Image across all steps
  setReferenceImage(src) {
    this.referenceImage = src;
    EmailImporter.referenceImage = src;

    const refImg1 = document.getElementById('qa-reference-img');
    const refImg2 = document.getElementById('qa-reference-img-split');
    const overlayImg = document.getElementById('qa-overlay-img');

    if (refImg1) refImg1.src = src;
    if (refImg2) refImg2.src = src;
    if (overlayImg) overlayImg.src = src;

    // Show floating reference banner on main editor if valid
    const banner = document.getElementById('reference-banner');
    if (banner && src && !src.includes('placeholder.com')) {
      banner.classList.remove('hidden');
    }
  },

  // Direct reference file upload inside QA Studio
  bindRefUploader() {
    const btnRefUpload = document.getElementById('btn-qa-upload-ref');
    const refFileInput = document.getElementById('qa-ref-file-input');

    if (btnRefUpload && refFileInput) {
      btnRefUpload.onclick = () => refFileInput.click();
      refFileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
          EmailImporter.readReferenceFile(e.target.files[0], (res) => {
            if (res.type === 'image' || res.type === 'pdf') {
              this.setReferenceImage(res.dataUrl);
            } else if (res.type === 'html' && res.state) {
              state = res.state;
              renderCanvas();
              updateInspector();
              const compiled = EmailCompiler.compile(state);
              this.init(null, compiled);
            }
          });
        }
      };
    }
  },

  // Bind Auto-Fix All button
  bindAutoFixAll() {
    const btnAutoFix = document.getElementById('btn-autofix-all');
    if (btnAutoFix) {
      btnAutoFix.onclick = () => {
        const rules = ['rule_img_widths', 'rule_font_fallback', 'rule_links_check', 'rule_font_legibility', 'rule_img_alt', 'rule_rtl_prop'];
        rules.forEach(r => EmailValidator.applyAutoFix(r, state));
        renderCanvas();
        renderAuditorResults();
        alert("All Outlook and email compatibility fixes applied successfully!");
      };
    }
  },

  // 3-Step Wizard Navigation
  goToStep(stepName) {
    this.currentStep = stepName;

    // Update wizard step buttons
    document.querySelectorAll('.qa-step-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.step === stepName) btn.classList.add('active');
    });

    // Update panels
    document.querySelectorAll('.qa-step-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    const targetPanel = document.getElementById(`panel-${stepName}`);
    if (targetPanel) targetPanel.classList.remove('hidden');

    const compiledHtml = EmailCompiler.compile(state);

    if (stepName === 'step-compare') {
      const previewFrame = document.getElementById('qa-preview-frame');
      if (previewFrame && compiledHtml) {
        const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        doc.open();
        doc.write(compiledHtml);
        doc.close();
      }
    } else if (stepName === 'step-health') {
      renderAuditorResults();
    }
  },

  // Update Opacity Slider for Overlay Diff mode
  setOpacity(val) {
    this.opacity = parseFloat(val);
    this.updateOverlayStyle();
  },

  // Toggle Difference blend mode
  toggleDiffMode(enabled) {
    this.isDiffMode = enabled;
    this.updateOverlayStyle();
  },

  updateOverlayStyle() {
    const overlayImgEl = document.getElementById('qa-overlay-img');
    const label = document.getElementById('qa-opacity-val');
    
    if (overlayImgEl) {
      overlayImgEl.style.opacity = this.opacity;
      if (this.isDiffMode) {
        overlayImgEl.style.mixBlendMode = 'difference';
        overlayImgEl.style.filter = 'invert(1)';
      } else {
        overlayImgEl.style.mixBlendMode = 'normal';
        overlayImgEl.style.filter = 'none';
      }
    }

    if (label) {
      label.textContent = `${Math.round(this.opacity * 100)}%`;
    }
  }
};
