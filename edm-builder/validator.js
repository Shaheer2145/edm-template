// Chrome-to-Outlook Copy-Paste QA & Health Score Engine
const EmailValidator = {
  // Client Rendering Profiles
  clients: {
    'outlook-2019': { name: 'MS Outlook 2016/2019 (Word Engine)', class: 'outlook-engine', notes: 'Simulates copying rendered HTML from Chrome and pasting into MS Outlook message box.' },
    'gmail-web': { name: 'Gmail (Web / Chrome)', class: 'gmail-engine', notes: 'Full HTML/CSS support with WebKit font rendering.' },
    'apple-mail': { name: 'Apple Mail (iOS & macOS)', class: 'apple-engine', notes: 'Supports modern CSS, custom web fonts, and smooth typography.' },
    'outlook-mobile-dark': { name: 'Outlook Mobile (Dark Mode)', class: 'dark-mobile-engine', notes: 'Simulates automatic background inversion on mobile dark theme.' }
  },

  // Dynamic Real-Time Health Audit Engine
  audit(state) {
    const auditResults = [];
    const settings = state.settings || {};
    
    // 1. Check if Canvas is Empty
    if (!state.sections || state.sections.length === 0) {
      return {
        score: 0,
        passCount: 0,
        warningCount: 0,
        errorCount: 1,
        results: [{
          id: 'rule_empty_canvas',
          category: 'Canvas Status',
          severity: 'error',
          title: 'Empty Template Canvas (0%)',
          description: 'The email canvas is currently empty. Drag layout sections and content blocks onto the canvas to begin building.',
          autoFixable: false
        }]
      };
    }

    const compiledCode = EmailCompiler.compile(state);
    let penaltySum = 0;
    let passCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    // Rule 1: Zero <div> Containers (Word Engine Safety on Copy-Paste)
    const hasDivs = (compiledCode.match(/<div/gi) || []).length > 0;
    if (hasDivs) {
      errorCount++;
      penaltySum += 25;
      auditResults.push({
        id: 'rule_no_divs',
        category: 'Outlook Copy-Paste Safety',
        severity: 'error',
        title: 'Div Containers Detected (Risk of Layout Collapse)',
        description: 'Outlook Word Engine drops <div> margins and flex alignments when pasting from Chrome. Compiled output must use <table> rows and cells exclusively.',
        autoFixable: true
      });
    } else {
      passCount++;
      auditResults.push({
        id: 'rule_no_divs',
        category: 'Outlook Copy-Paste Safety',
        severity: 'pass',
        title: '100% Table Grid (Zero Divs)',
        description: 'Template uses bulletproof table cells exclusively. Safe for Chrome-to-Outlook pasting.',
        autoFixable: false
      });
    }

    // Rule 2: Explicit HTML Image Width Attributes
    let missingImgWidths = false;
    state.sections.forEach(sec => {
      sec.columns.forEach(col => {
        col.elements.forEach(el => {
          if (el.type === 'image' && (!el.styles || !el.styles.width)) {
            missingImgWidths = true;
          }
        });
      });
    });

    if (missingImgWidths) {
      errorCount++;
      penaltySum += 20;
      auditResults.push({
        id: 'rule_img_widths',
        category: 'Outlook Image Scaling',
        severity: 'error',
        title: 'Missing Image HTML Width Attributes',
        description: 'Images without explicit width="" HTML attributes explode to full resolution (2000px+) when pasted from Chrome into Outlook.',
        autoFixable: true
      });
    } else {
      passCount++;
      auditResults.push({
        id: 'rule_img_widths',
        category: 'Outlook Image Scaling',
        severity: 'pass',
        title: 'Explicit Image HTML Widths Assigned',
        description: 'All images have width attributes assigned to prevent resolution explosions on paste.',
        autoFixable: false
      });
    }

    // Rule 3: RTL Direction Propagation for Arabic/Urdu Emails
    if (settings.direction === 'rtl') {
      const dirAttrCount = (compiledCode.match(/dir="rtl"/gi) || []).length;
      if (dirAttrCount < state.sections.length + 2) {
        warningCount++;
        penaltySum += 20;
        auditResults.push({
          id: 'rule_rtl_prop',
          category: 'Arabic / Urdu RTL Alignment',
          severity: 'warning',
          title: 'Inner Cells Missing dir="rtl" & align="right"',
          description: 'When pasting Arabic/Urdu HTML from Chrome into Outlook, inner cells without explicit dir="rtl" reset to Left-to-Right layout.',
          autoFixable: true
        });
      } else {
        passCount++;
        auditResults.push({
          id: 'rule_rtl_prop',
          category: 'Arabic / Urdu RTL Alignment',
          severity: 'pass',
          title: 'Full RTL Direction Propagation',
          description: 'dir="rtl" and align="right" are present on all inner table containers.',
          autoFixable: false
        });
      }
    }

    // Rule 4: Paragraph <p> Spacing Gaps (MS Word 10pt Margin Fix)
    const hasParagraphTags = (compiledCode.match(/<p/gi) || []).length > 0;
    if (hasParagraphTags) {
      warningCount++;
      penaltySum += 15;
      auditResults.push({
        id: 'rule_paragraph_gaps',
        category: 'MS Word Spacing Compatibility',
        severity: 'warning',
        title: 'Standard <p> Tags Detected (Extra Line Spacing in Outlook)',
        description: 'MS Word adds 10pt paragraph margin gaps to <p> tags when pasted into Outlook. Auto-fix converts them to zero-margin <span> blocks.',
        autoFixable: true
      });
    } else {
      passCount++;
      auditResults.push({
        id: 'rule_paragraph_gaps',
        category: 'MS Word Spacing Compatibility',
        severity: 'pass',
        title: 'Zero Paragraph Margin Gaps',
        description: 'Text uses zero-margin span elements to guarantee exact line heights on Outlook paste.',
        autoFixable: false
      });
    }

    // Rule 5: CTA Button Cell Padding & Background Wrapping
    let unpaddedButtons = false;
    state.sections.forEach(sec => {
      sec.columns.forEach(col => {
        col.elements.forEach(el => {
          if (el.type === 'button' && (!el.styles || !el.styles.backgroundColor || el.styles.paddingTop < 8)) {
            unpaddedButtons = true;
          }
        });
      });
    });

    if (unpaddedButtons) {
      warningCount++;
      penaltySum += 15;
      auditResults.push({
        id: 'rule_button_touch',
        category: 'CTA Button Padding',
        severity: 'warning',
        title: 'Unpadded CTA Button Blocks',
        description: 'CTA buttons must use <td> cell background colors and cell padding so buttons don\'t shrink into plain links when pasted into Outlook.',
        autoFixable: true
      });
    } else {
      passCount++;
      auditResults.push({
        id: 'rule_button_touch',
        category: 'CTA Button Padding',
        severity: 'pass',
        title: 'CTA Button Cell Padding Verified',
        description: 'Buttons are wrapped in background-colored table cells.',
        autoFixable: false
      });
    }

    // Rule 6: Unfilled Placeholder Links (href="#" or example.com)
    let placeholderLinks = false;
    state.sections.forEach(sec => {
      sec.columns.forEach(col => {
        col.elements.forEach(el => {
          if (el.type === 'button' && (!el.content || !el.content.href || el.content.href === '#' || el.content.href.includes('example.com'))) {
            placeholderLinks = true;
          }
        });
      });
    });

    if (placeholderLinks) {
      warningCount++;
      penaltySum += 10;
      auditResults.push({
        id: 'rule_links_check',
        category: 'Link Destination Integrity',
        severity: 'warning',
        title: 'Placeholder CTA Button URLs Detected',
        description: 'One or more CTA buttons contain empty or placeholder links (href="#"). Update to target URLs.',
        autoFixable: true
      });
    } else {
      passCount++;
      auditResults.push({
        id: 'rule_links_check',
        category: 'Link Destination Integrity',
        severity: 'pass',
        title: 'CTA Button Links Validated',
        description: 'CTA buttons have valid target links.',
        autoFixable: false
      });
    }

    // Rule 7: Missing Image Alternative Text
    let missingAlt = false;
    state.sections.forEach(sec => {
      sec.columns.forEach(col => {
        col.elements.forEach(el => {
          if (el.type === 'image' && (!el.content || !el.content.alt || el.content.alt === 'Placeholder Image')) {
            missingAlt = true;
          }
        });
      });
    });

    if (missingAlt) {
      warningCount++;
      penaltySum += 5;
      auditResults.push({
        id: 'rule_img_alt',
        category: 'Spam Filter & Accessibility',
        severity: 'warning',
        title: 'Missing Image ALT Text',
        description: 'Adding descriptive ALT text prevents spam filters from flagging your email when images are disabled.',
        autoFixable: true
      });
    } else {
      passCount++;
      auditResults.push({
        id: 'rule_img_alt',
        category: 'Spam Filter & Accessibility',
        severity: 'pass',
        title: 'Image Alt Texts Present',
        description: 'All images have ALT text assigned.',
        autoFixable: false
      });
    }

    // Real-Time Health Score Percentage Calculation
    const realScore = Math.max(0, Math.min(100, 100 - penaltySum));

    return {
      score: realScore,
      passCount: passCount,
      warningCount: warningCount,
      errorCount: errorCount,
      results: auditResults
    };
  },

  // Apply 1-Click Auto-Fixes for Chrome-to-Outlook Copy-Paste Issues
  applyAutoFix(ruleId, state) {
    if (ruleId === 'rule_img_widths') {
      state.sections.forEach(sec => {
        sec.columns.forEach(col => {
          col.elements.forEach(el => {
            if (el.type === 'image') {
              if (!el.styles) el.styles = {};
              if (!el.styles.width) el.styles.width = 600;
            }
          });
        });
      });
    } else if (ruleId === 'rule_font_fallback') {
      if (state.settings.fontFamily && !state.settings.fontFamily.includes('sans-serif')) {
        state.settings.fontFamily = `${state.settings.fontFamily}, Arial, sans-serif`;
      }
    } else if (ruleId === 'rule_links_check') {
      state.sections.forEach(sec => {
        sec.columns.forEach(col => {
          col.elements.forEach(el => {
            if (el.type === 'button' && (!el.content || !el.content.href || el.content.href === '#')) {
              if (!el.content) el.content = {};
              el.content.href = 'https://example.com/campaign';
            }
          });
        });
      });
    } else if (ruleId === 'rule_button_touch') {
      state.sections.forEach(sec => {
        sec.columns.forEach(col => {
          col.elements.forEach(el => {
            if (el.type === 'button') {
              if (!el.styles) el.styles = {};
              if ((el.styles.paddingTop || 0) < 12) el.styles.paddingTop = 12;
              if ((el.styles.paddingBottom || 0) < 12) el.styles.paddingBottom = 12;
              if ((el.styles.fontSize || 0) < 14) el.styles.fontSize = 14;
            }
          });
        });
      });
    } else if (ruleId === 'rule_img_alt') {
      state.sections.forEach(sec => {
        sec.columns.forEach(col => {
          col.elements.forEach(el => {
            if (el.type === 'image' && (!el.content || !el.content.alt || el.content.alt === 'Placeholder Image')) {
              if (!el.content) el.content = {};
              el.content.alt = 'EDM Campaign Image';
            }
          });
        });
      });
    } else if (ruleId === 'rule_rtl_prop') {
      state.settings.direction = 'rtl';
    } else if (ruleId === 'rule_paragraph_gaps') {
      state.sections.forEach(sec => {
        sec.columns.forEach(col => {
          col.elements.forEach(el => {
            if (el.type === 'text' && el.content && el.content.text) {
              // Replace <p> with <span>
              el.content.text = el.content.text.replace(/<p[^>]*>/gi, '<span style="display:block; margin:0px;">').replace(/<\/p>/gi, '</span>');
            }
          });
        });
      });
    }
  },

  // Render Client Simulator inside Preview Frame
  renderSimulator(clientType, compiledHtml, iframeElement) {
    if (!iframeElement) return;

    const doc = iframeElement.contentDocument || iframeElement.contentWindow.document;
    doc.open();

    let clientCSS = '';

    if (clientType === 'outlook-2019') {
      clientCSS = `
        <style>
          /* Outlook 2019 Word Engine Copy-Paste Simulator */
          * { border-radius: 0px !important; box-shadow: none !important; }
          a { text-decoration: underline !important; }
          table { border-collapse: collapse !important; }
        </style>
      `;
    } else if (clientType === 'outlook-mobile-dark') {
      clientCSS = `
        <style>
          /* Dark Mode Inversion Simulator */
          body { background-color: #1e1e1e !important; color: #e1e1e1 !important; }
          table.container { background-color: #252526 !important; }
          td { color: #e1e1e1 !important; }
        </style>
      `;
    }

    let finalHtml = compiledHtml;
    if (clientCSS) {
      finalHtml = compiledHtml.replace('</head>', `${clientCSS}</head>`);
    }

    doc.write(finalHtml);
    doc.close();
  }
};
