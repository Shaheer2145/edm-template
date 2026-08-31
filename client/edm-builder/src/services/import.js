// Pure HTML Importer & Smart Element Inspector Engine for EDM Builder
export const EmailImporter = {
  referenceImage: null,

  // Parse raw HTML string into state with 100% layout preservation & indexed editable elements
  parseHTML(htmlString) {
    if (!htmlString || htmlString.trim() === '') return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const newState = {
      settings: {
        backgroundColor: "#f4f4f4",
        bodyBackgroundColor: "#ffffff",
        width: 660,
        fontFamily: "Arial, sans-serif",
        textColor: "#333333",
        direction: "ltr",
        customFonts: []
      },
      sections: [],
      importedRawHTML: '',
      importedFullHTML: htmlString,
      elementsMap: {}
    };

    // Detect text reading direction
    const htmlDir = doc.documentElement.getAttribute('dir') || doc.body.getAttribute('dir');
    if (htmlDir) {
      newState.settings.direction = htmlDir.toLowerCase();
    }

    // Outer body background color
    const bodyBg = doc.body.style.backgroundColor || doc.body.getAttribute('bgcolor');
    if (bodyBg) newState.settings.backgroundColor = bodyBg;

    // Find container table for width
    let containerTable = doc.querySelector('table.container') || doc.querySelector('table[width="660"]');
    if (!containerTable) {
      const tables = Array.from(doc.querySelectorAll('table'));
      if (tables.length > 0) {
        tables.sort((a, b) => b.querySelectorAll('tr').length - a.querySelectorAll('tr').length);
        containerTable = tables[0];
      }
    }

    if (containerTable) {
      const containerWidth = parseInt(containerTable.getAttribute('width') || containerTable.style.width || '660');
      if (containerWidth > 300 && containerWidth < 1200) {
        newState.settings.width = containerWidth;
      }
      const containerBg = containerTable.getAttribute('bgcolor') || containerTable.style.backgroundColor;
      if (containerBg) newState.settings.bodyBackgroundColor = containerBg;
    }

    // Index all editable blocks & stamp data-edm-id
    this.indexAndStampElements(doc.body, newState.elementsMap, newState.settings.direction);

    // Save stamped HTML (full document + body) so the interactive preview keeps its data-edm-id stamps
    newState.importedRawHTML = doc.body.innerHTML;
    newState.importedFullHTML = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;

    return newState;
  },

  // Traverse DOM tree, index editable elements, and stamp data-edm-id for click delegation
  indexAndStampElements(bodyNode, elementsMap, globalDirection) {
    if (!bodyNode) return;

    // 1. Membership Tags
    const memTags = Array.from(bodyNode.querySelectorAll('.msdynmkt_personalization'));
    memTags.forEach(mNode => {
      const id = `edm_mem_${Math.random().toString(36).substr(2, 7)}`;
      mNode.setAttribute('data-edm-id', id);
      elementsMap[id] = {
        id: id,
        type: 'membership',
        content: {
          label: 'Membership Number:',
          tag: mNode.innerHTML.trim() || '{{AlfursanMembershipID}}'
        },
        styles: { fontSize: 10, color: '#000000', textAlign: globalDirection === 'rtl' ? 'right' : 'left' }
      };
    });

    // 2. Images
    const images = Array.from(bodyNode.querySelectorAll('img'));
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.includes('data:image/gif')) {
        const id = `edm_img_${Math.random().toString(36).substr(2, 7)}`;
        img.setAttribute('data-edm-id', id);

        const parentLink = img.closest('a');
        const widthAttr = img.getAttribute('width') || img.style.width;
        const parsedW = parseInt(widthAttr || '600');

        elementsMap[id] = {
          id: id,
          type: 'image',
          content: {
            src: src,
            alt: img.getAttribute('alt') || 'Image',
            href: parentLink ? parentLink.getAttribute('href') : ''
          },
          styles: {
            width: parsedW > 10 ? parsedW : 600,
            alignment: 'center'
          }
        };
      }
    });

    // 3. CTA Buttons
    const links = Array.from(bodyNode.querySelectorAll('a'));
    links.forEach(link => {
      if (link.querySelector('img')) return;
      const style = link.getAttribute('style') || '';
      const parentTd = link.closest('td');
      const isBtn = style.includes('background') || style.includes('border-radius') || (parentTd && (parentTd.getAttribute('bgcolor') || parentTd.style.backgroundColor));
      
      if (isBtn && link.textContent.trim().length > 0) {
        const id = `edm_btn_${Math.random().toString(36).substr(2, 7)}`;
        link.setAttribute('data-edm-id', id);

        const bg = (parentTd ? (parentTd.style.backgroundColor || parentTd.getAttribute('bgcolor')) : '') || link.style.backgroundColor || '#6366f1';
        elementsMap[id] = {
          id: id,
          type: 'button',
          content: {
            text: link.textContent.trim(),
            href: link.getAttribute('href') || '#'
          },
          styles: {
            fontSize: parseInt(link.style.fontSize || '16'),
            color: link.style.color || '#ffffff',
            backgroundColor: bg
          }
        };
      }
    });

    // 4. Text Blocks (Headings, Paragraphs, Text Cells)
    const textNodes = Array.from(bodyNode.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, td'));
    textNodes.forEach(tNode => {
      if (tNode.closest('a') || tNode.querySelector('img') || tNode.querySelector('.msdynmkt_personalization') || tNode.querySelector('table')) return;
      const txt = tNode.innerHTML.trim();
      if (txt.length > 0 && !tNode.hasAttribute('data-edm-id')) {
        const id = `edm_txt_${Math.random().toString(36).substr(2, 7)}`;
        tNode.setAttribute('data-edm-id', id);

        elementsMap[id] = {
          id: id,
          type: 'text',
          content: { text: txt },
          styles: {
            fontSize: parseInt(tNode.style.fontSize || '14'),
            color: tNode.style.color || '#000000',
            textAlign: tNode.style.textAlign || tNode.getAttribute('align') || (globalDirection === 'rtl' ? 'right' : 'left')
          }
        };
      }
    });
  },

  // Apply an edited element (from the Properties panel) back onto the stamped DOM node
  applyElementToDocument(doc, element) {
    if (!doc || !element || !element.id) return null;
    const node = doc.querySelector(`[data-edm-id="${element.id}"]`);
    if (!node) return null;

    const content = element.content || {};
    const styles = element.styles || {};

    switch (element.type) {
      case 'text': {
        node.innerHTML = content.text ?? '';
        if (styles.fontSize != null) node.style.fontSize = `${styles.fontSize}px`;
        if (styles.color) node.style.color = styles.color;
        if (styles.textAlign) node.style.textAlign = styles.textAlign;
        if (styles.fontWeight) node.style.fontWeight = styles.fontWeight;
        if (styles.lineHeight) node.style.lineHeight = `${styles.lineHeight}%`;
        break;
      }

      case 'membership': {
        node.innerHTML = content.tag ?? '';
        if (styles.fontSize != null) node.style.fontSize = `${styles.fontSize}px`;
        if (styles.color) node.style.color = styles.color;
        if (styles.textAlign) node.style.textAlign = styles.textAlign;
        if (styles.lineHeight) node.style.lineHeight = `${styles.lineHeight}%`;
        break;
      }

      case 'image': {
        node.setAttribute('src', content.src || '');
        node.setAttribute('alt', content.alt || '');
        if (styles.width != null) {
          node.style.width = `${styles.width}px`;
          node.setAttribute('width', String(styles.width));
        }
        if (styles.borderRadius != null) node.style.borderRadius = `${styles.borderRadius}px`;

        let parentLink = node.closest('a');
        if (content.href) {
          if (parentLink) {
            parentLink.setAttribute('href', content.href);
          } else {
            const anchor = doc.createElement('a');
            anchor.setAttribute('href', content.href);
            anchor.setAttribute('target', '_blank');
            node.parentNode.insertBefore(anchor, node);
            anchor.appendChild(node);
          }
        } else if (parentLink) {
          const wrapsOnlyImage =
            parentLink.textContent.trim() === '' &&
            Array.from(parentLink.children).every((child) => child === node || child.tagName === 'IMG');
          if (wrapsOnlyImage) {
            parentLink.replaceWith(node);
          } else {
            parentLink.removeAttribute('href');
          }
        }

        if (styles.alignment) {
          const parentTd = node.closest('td');
          if (parentTd) {
            parentTd.setAttribute('align', styles.alignment);
            parentTd.style.textAlign = styles.alignment;
          }
        }
        break;
      }

      case 'button': {
        node.textContent = content.text ?? '';
        node.setAttribute('href', content.href || '#');
        if (styles.fontSize != null) node.style.fontSize = `${styles.fontSize}px`;
        if (styles.color) node.style.color = styles.color;
        if (styles.borderRadius != null) node.style.borderRadius = `${styles.borderRadius}px`;
        if (styles.backgroundColor) {
          node.style.backgroundColor = styles.backgroundColor;
          const parentTd = node.closest('td');
          if (parentTd) {
            parentTd.setAttribute('bgcolor', styles.backgroundColor);
            parentTd.style.backgroundColor = styles.backgroundColor;
          }
        }
        if (styles.alignment) {
          const parentTd = node.closest('td');
          if (parentTd) {
            parentTd.setAttribute('align', styles.alignment);
            parentTd.style.textAlign = styles.alignment;
          }
        }
        break;
      }

      default:
        break;
    }

    return node;
  },

  // Serialize the live iframe body back to HTML, stripping editor-only selection classes
  serializeBody(doc) {
    if (!doc || !doc.body) return null;
    const clone = doc.body.cloneNode(true);
    clone.querySelectorAll('[data-edm-id]').forEach((stampedNode) => {
      const className = stampedNode.getAttribute('class') || '';
      if (!className) return;
      const cleaned = className.split(/\s+/).filter((token) => token && !token.startsWith('edm-')).join(' ');
      if (cleaned) stampedNode.setAttribute('class', cleaned);
      else stampedNode.removeAttribute('class');
    });
    return clone.innerHTML;
  },

  // Read uploaded Image file, PDF document, or HTML file
  readReferenceFile(file, callback) {
    if (!file) return;
    
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (fileType.includes('image') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.referenceImage = e.target.result;
        callback({ type: 'image', dataUrl: e.target.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    } else if (fileType.includes('html') || fileName.endsWith('.html') || fileName.endsWith('.htm')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parsedState = this.parseHTML(e.target.result);
        callback({ type: 'html', state: parsedState, fileName: file.name, htmlText: e.target.result });
      };
      reader.readAsText(file);
    } else if (fileType.includes('text') || fileName.endsWith('.txt')) {
      // Wrap plain-text lines into a minimal single-column email template, then reuse the HTML pipeline
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = String(e.target.result || '').split(/\r?\n/);
        const escaped = lines
          .map((line) => `  <p style="font-family:Arial,sans-serif;font-size:14px;color:#333333;margin:0 0 12px;">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || '&nbsp;'}</p>`)
          .join('\n');
        const wrappedHtml = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#ffffff;">
<table width="660" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:#ffffff;">
<tbody>
<tr>
<td style="padding:24px;">
${escaped}
</td>
</tr>
</tbody>
</table>
</body>
</html>`;
        const parsedState = this.parseHTML(wrappedHtml);
        callback({ type: 'html', state: parsedState, fileName: file.name, htmlText: wrappedHtml });
      };
      reader.readAsText(file);
    } else if (fileName.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.referenceImage = e.target.result;
        callback({ type: 'pdf', dataUrl: e.target.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Unsupported file format. Please upload an HTML template (.html), Image (PNG/JPG), or PDF document.");
    }
  }
};
