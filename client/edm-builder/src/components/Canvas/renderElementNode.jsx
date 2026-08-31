import React from 'react';
import parse, { domToReact } from 'html-react-parser';

const cssStringToObject = (cssText) => {
  const styleObject = {};
  if (!cssText) return styleObject;
  String(cssText)
    .split(';')
    .forEach((declaration) => {
      const colonIndex = declaration.indexOf(':');
      if (colonIndex === -1) return;
      const property = declaration.slice(0, colonIndex).trim();
      const value = declaration.slice(colonIndex + 1).trim();
      if (!property || !value) return;
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      styleObject[camelCaseProperty] = value;
    });
  return styleObject;
};

const PARSE_OPTIONS = {
  replace: (domNode) => {
    if (!domNode || domNode.type !== 'tag') return;

    const attribs = { ...(domNode.attribs || {}) };
    delete attribs.onclick;
    delete attribs.onClick;
    if (typeof attribs.style === 'string') {
      const styleObject = cssStringToObject(attribs.style);
      if (Object.keys(styleObject).length > 0) {
        attribs.style = styleObject;
      } else {
        delete attribs.style;
      }
    }

    const children =
      domNode.children && domNode.children.length
        ? domToReact(domNode.children, PARSE_OPTIONS)
        : null;

    if (domNode.name === 'a') {
      return (
        <a {...attribs} onClick={(e) => e.preventDefault()}>
          {children}
        </a>
      );
    }

    return React.createElement(domNode.name, attribs, children);
  }
};

const parseHtmlText = (html) => {
  if (!html) return null;
  try {
    return parse(html, PARSE_OPTIONS);
  } catch (err) {
    return html;
  }
};

const renderElementNode = (element) => {
  const content = element.content || {};
  const styles = element.styles || {};

  switch (element.type) {
    case 'text':
      return (
        <p
          className="builder-preview-text"
          style={{
            margin: 0,
            fontSize: `${styles.fontSize ?? 14}px`,
            color: styles.color || '#000000',
            textAlign: styles.textAlign || 'left',
            fontWeight: styles.fontWeight || 'normal',
            fontStyle: styles.fontStyle,
            fontFamily: styles.fontFamily,
            letterSpacing: styles.letterSpacing != null ? `${styles.letterSpacing}px` : undefined,
            textTransform: styles.textTransform,
            lineHeight: styles.lineHeight ? `${styles.lineHeight}%` : undefined,
            backgroundColor: styles.backgroundColor || undefined,
            paddingTop: `${styles.paddingTop ?? 0}px`,
            paddingBottom: `${styles.paddingBottom ?? 0}px`,
            paddingLeft: `${styles.paddingLeft ?? 0}px`,
            paddingRight: `${styles.paddingRight ?? 0}px`
          }}
        >
          {parseHtmlText(content.text) || 'Text block'}
        </p>
      );
    case 'image':
      return (
        <div
          style={{
            textAlign: styles.alignment || 'center',
            paddingTop: `${styles.paddingTop ?? 0}px`,
            paddingBottom: `${styles.paddingBottom ?? 0}px`,
            paddingLeft: `${styles.paddingLeft ?? 0}px`,
            paddingRight: `${styles.paddingRight ?? 0}px`
          }}
        >
          {content.href ? (
            <a href={content.href} onClick={(e) => e.preventDefault()}>
              <img
                src={content.src}
                alt={content.alt || ''}
                style={{
                  width: `${styles.width ?? 600}px`,
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: `${styles.borderRadius ?? 0}px`,
                  display: 'inline-block'
                }}
              />
            </a>
          ) : (
            <img
              src={content.src}
              alt={content.alt || ''}
              style={{
                width: `${styles.width ?? 600}px`,
                maxWidth: '100%',
                height: 'auto',
                borderRadius: `${styles.borderRadius ?? 0}px`,
                display: 'inline-block'
              }}
            />
          )}
        </div>
      );
    case 'button':
      return (
        <div
          style={{
            textAlign: styles.alignment || 'center'
          }}
        >
          <button
            className="builder-preview-button"
            onClick={(e) => e.preventDefault()}
            style={{
              fontSize: `${styles.fontSize ?? 16}px`,
              color: styles.color || '#ffffff',
              backgroundColor: styles.backgroundColor || '#6366f1',
              borderRadius: `${styles.borderRadius ?? 4}px`,
              fontWeight: styles.fontWeight || 'bold',
              fontFamily: styles.fontFamily,
              borderWidth: styles.borderWidth ?? 0,
              borderStyle: styles.borderStyle || 'solid',
              borderColor: styles.borderColor || 'transparent',
              paddingTop: `${styles.paddingTop ?? 12}px`,
              paddingBottom: `${styles.paddingBottom ?? 12}px`,
              paddingLeft: `${styles.paddingLeft ?? 24}px`,
              paddingRight: `${styles.paddingRight ?? 24}px`,
              cursor: 'pointer'
            }}
          >
            {content.text || 'Button'}
          </button>
        </div>
      );
    case 'divider':
      return (
        <div
          style={{
            paddingTop: `${styles.paddingTop ?? 0}px`,
            paddingBottom: `${styles.paddingBottom ?? 0}px`
          }}
        >
          <div
            style={{
              borderTopWidth: `${styles.borderWidth ?? 1}px`,
              borderTopStyle: styles.borderStyle || 'solid',
              borderTopColor: styles.borderColor || '#cccccc'
            }}
          />
        </div>
      );
    case 'spacer':
      return <div style={{ height: `${styles.height ?? 20}px` }} />;
    case 'social': {
      const socialIcons = [
        { key: 'facebook', label: 'f', color: '#1877f2' },
        { key: 'instagram', label: 'in', color: '#e1306c' },
        { key: 'twitter', label: 'x', color: '#000000' }
      ];
      const justify =
        styles.alignment === 'left' ? 'flex-start' : styles.alignment === 'right' ? 'flex-end' : 'center';
      const size = styles.iconSize ?? 32;
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: justify,
            alignItems: 'center',
            gap: '8px',
            paddingTop: `${styles.paddingTop ?? 0}px`,
            paddingBottom: `${styles.paddingBottom ?? 0}px`
          }}
        >
          {socialIcons.map((icon) =>
            content[icon.key] ? (
              <span
                key={icon.key}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  backgroundColor: icon.color,
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${Math.max(10, Math.round(size * 0.45))}px`,
                  fontWeight: 'bold'
                }}
              >
                {icon.label}
              </span>
            ) : null
          )}
        </div>
      );
    }
    case 'membership':
      return (
        <p
          className="builder-preview-text"
          style={{
            margin: 0,
            fontSize: `${styles.fontSize ?? 10}px`,
            color: styles.color || '#000000',
            textAlign: styles.textAlign || 'left',
            fontWeight: styles.fontWeight || 'normal',
            fontFamily: styles.fontFamily,
            lineHeight: styles.lineHeight ? `${styles.lineHeight}%` : undefined,
            paddingTop: `${styles.paddingTop ?? 0}px`,
            paddingBottom: `${styles.paddingBottom ?? 0}px`
          }}
        >
          <span>{parseHtmlText(content.label) || 'Membership Number:'} </span>
          <span style={{ fontWeight: 'bold' }}>{parseHtmlText(content.tag) || '{{AlfursanMembershipID}}'}</span>
        </p>
      );
    case 'pdf':
      return (
        <div
          style={{
            textAlign: styles.alignment || 'center',
            paddingTop: `${styles.paddingTop ?? 0}px`,
            paddingBottom: `${styles.paddingBottom ?? 0}px`,
            paddingLeft: `${styles.paddingLeft ?? 0}px`,
            paddingRight: `${styles.paddingRight ?? 0}px`
          }}
        >
          <object
            data={content.src}
            type="application/pdf"
            aria-label={content.fileName || 'PDF document'}
            style={{
              width: `${styles.width ?? 600}px`,
              maxWidth: '100%',
              height: `${styles.height ?? 800}px`,
              border: '1px solid #cccccc',
              borderRadius: `${styles.borderRadius ?? 0}px`,
              display: 'inline-block',
              backgroundColor: '#f9fafb'
            }}
          >
            <p className="builder-preview-text" style={{ margin: 0, fontSize: 13, color: '#666666' }}>
              PDF preview is not supported in this browser — {content.fileName || 'Imported PDF'}
            </p>
          </object>
        </div>
      );
    default:
      return <p className="builder-preview-text">{element.type}</p>;
  }
};

export default renderElementNode;
