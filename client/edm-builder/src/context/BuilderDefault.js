export function generateId(prefix = 'item') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export const INITIAL_SETTINGS = {
    backgroundColor: '#140404',
    bodyBackgroundColor: '#ffffff',
    width: 660,
    fontFamily: 'Arial, sans-serif',
    textColor: '#333333',
    direction: 'ltr',
    customFonts: []

};

var selectedElement = null;
var selectedTab = 'content';
var draggedItem = null;
export const ELEMENT_DEFAULTS = {
    text: {
        type: 'text',
        content: { text: 'New Text Block. Click to edit content directly on the canvas or use the sidebar properties.' },
        styles: { fontSize: 14, color: '#333333', textAlign: 'left', lineHeight: 130, fontWeight: 'normal', paddingTop: 10, paddingBottom: 10, paddingLeft: 0, paddingRight: 0, letterSpacing: 0, textTransform: 'none', fontStyle: 'normal', fontFamily: 'Arial, sans-serif' }
    },
    image: {
        type: 'image',
        content: {
            src: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80',
            alt: 'Placeholder Image',
            href: ''
        },
        styles: { width: 600, alignment: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 0, paddingRight: 0, borderRadius: 0, borderWidth: 0, borderStyle: 'solid', borderColor: '#cccccc' }
    },
    button: {
        type: 'button',
        content: { text: 'Click Here', href: 'https://example.com' },
        styles: { fontSize: 16, color: '#ffffff', backgroundColor: '#6366f1', borderRadius: 6, alignment: 'center', paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24, fontWeight: 'bold', borderWidth: 0, borderStyle: 'solid', borderColor: '#4f46e5', fontFamily: 'Arial, sans-serif' }
    },
    spacer: {
        type: 'spacer',
        content: {},
        styles: { height: 20 }
    },
    divider: {
        type: 'divider',
        content: {},
        styles: { borderWidth: 1, borderStyle: 'solid', borderColor: '#e2e8f0', paddingTop: 10, paddingBottom: 10 }
    },
    social: {
        type: 'social',
        content: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', twitter: 'https://twitter.com' },
        styles: { iconSize: 32, alignment: 'center', paddingTop: 10, paddingBottom: 10 }
    },
    membership: {
        type: 'membership',
        content: { label: 'Membership Number:', tag: '{{AlfursanMembershipID}}' },
        styles: { fontSize: 10, color: '#000000', textAlign: 'left', lineHeight: 110, fontWeight: 'normal', paddingTop: 10, paddingBottom: 10, letterSpacing: 0, textTransform: 'none', fontStyle: 'normal', fontFamily: 'Arial, sans-serif' }
    }
};