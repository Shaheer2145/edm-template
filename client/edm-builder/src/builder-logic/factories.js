import { generateId } from '../utils/id';

const createElement = (id, type, text) => ({
  id,
  type,
  content: { text }
});

export const makeElement = (type) => {
  const contentByType = {
    text: { text: 'New text block' },
    image: { src: 'https://via.placeholder.com/600x200', alt: 'Image' },
    button: { text: 'Click Here' },
    divider: {},
    spacer: {},
    social: {},
    membership: { label: 'Membership Number:', tag: '{{AlfursanMembershipID}}' },
    pdf: { src: '', fileName: 'Imported PDF' }
  };
  const stylesByType = {
    text: { fontSize: 14, color: '#000000', textAlign: 'left', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
    image: { width: 600, alignment: 'center', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
    button: { fontSize: 16, color: '#ffffff', backgroundColor: '#6366f1', borderRadius: 4, fontWeight: 'bold', alignment: 'center', paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24 },
    spacer: { height: 20 },
    divider: { borderWidth: 1, borderStyle: 'solid', borderColor: '#cccccc', paddingTop: 0, paddingBottom: 0 },
    social: { iconSize: 40 },
    membership: { fontSize: 10, color: '#000000', textAlign: 'left' },
    pdf: { width: 600, height: 800, alignment: 'center', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }
  };
  return {
    id: generateId('el'),
    type,
    content: contentByType[type] || { text: type },
    styles: stylesByType[type] || {}
  };
};

export const makeSection = (columnCount = 1) => {
  const safeCount = Math.max(1, Math.min(4, columnCount));
  const columnWidth = Math.floor(100 / safeCount);
  return {
    id: generateId('section'),
    type: 'section',
    settings: {
      backgroundColor: '#ffffff',
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 24,
      paddingRight: 24,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0
    },
    columns: Array.from({ length: safeCount }, () => ({ width: columnWidth, elements: [] }))
  };
};

export const makeImageState = (dataUrl, fileName = 'Imported Image') => {
  const section = makeSection(1);
  const imageElement = {
    ...makeElement('image'),
    content: { src: dataUrl, alt: fileName, href: '' },
    styles: { width: 600, alignment: 'center', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }
  };
  section.columns[0].elements.push(imageElement);
  return {
    settings: { bodyBackgroundColor: '#ffffff', direction: 'ltr' },
    sections: [section]
  };
};

export const makePdfState = (dataUrl, fileName = 'Imported PDF') => {
  const section = makeSection(1);
  const pdfElement = {
    ...makeElement('pdf'),
    content: { src: dataUrl, fileName },
    styles: { width: 600, height: 800, alignment: 'center', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }
  };
  section.columns[0].elements.push(pdfElement);
  return {
    settings: { bodyBackgroundColor: '#ffffff', direction: 'ltr' },
    sections: [section]
  };
};

export const makeEmptyState = () => ({
  settings: { bodyBackgroundColor: '#ffffff', direction: 'ltr' },
  sections: []
});

export const initialSections = [
  {
    id: 'section-1',
    type: 'section',
    settings: {
      backgroundColor: '#ffffff',
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 24,
      paddingRight: 24
    },
    columns: [
      {
        width: 100,
        elements: [createElement('el-1', 'text', 'Welcome to the EDM Builder Studio')]
      }
    ]
  }
];
