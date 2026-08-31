import React, { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import "../../App.css";

const FieldGroup = ({ label, children }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
  </div>
);

const TextField = ({ label, value, onChange, placeholder }) => (
  <FieldGroup label={label}>
    <input
      className="form-control"
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </FieldGroup>
);

const TextareaField = ({ label, value, onChange, rows = 5 }) => (
  <FieldGroup label={label}>
    <textarea
      className="form-control"
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </FieldGroup>
);

const NumberField = ({ label, value, onChange, min = 0, max = 1000 }) => (
  <FieldGroup label={label}>
    <input
      className="form-control"
      type="number"
      min={min}
      max={max}
      value={value ?? 0}
      onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
    />
  </FieldGroup>
);

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGBA_RE = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/i;

const toSixDigitHex = (hex) => {
  if (!hex) return '#000000';
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex.length === 9 ? hex.slice(0, 7) : hex;
};

const ColorField = ({ label, value, onChange }) => {
  const pickerRef = useRef(null);
  const [text, setText] = useState(value ?? '');

  useEffect(() => {
    setText(value ?? '');
  }, [value]);

  const isColorValue = HEX_RE.test(text) || RGBA_RE.test(text);
  const swatchColor = isColorValue ? text : 'transparent';
  const pickerValue = HEX_RE.test(text) ? toSixDigitHex(text) : '#000000';

  const handleTextChange = (e) => {
    const next = e.target.value.trim();
    setText(next);
    if (next === '') {
      onChange('');
      return;
    }
    if (HEX_RE.test(next) || RGBA_RE.test(next)) {
      onChange(next);
    }
  };

  const handlePickerChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <FieldGroup label={label}>
      <div className="color-field">
        <button
          type="button"
          className="color-swatch"
          style={{ backgroundColor: swatchColor }}
          title="Open color picker"
          onClick={() => pickerRef.current && pickerRef.current.click()}
        />
        <input
          ref={pickerRef}
          className="color-picker-native"
          type="color"
          tabIndex={-1}
          value={pickerValue}
          onChange={handlePickerChange}
        />
        <input
          className="form-control color-value-input"
          type="text"
          value={text}
          placeholder="#000000 or rgba()"
          spellCheck={false}
          onChange={handleTextChange}
        />
      </div>
    </FieldGroup>
  );
};

const SelectField = ({ label, value, onChange, options }) => (
  <FieldGroup label={label}>
    <select className="form-control" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </FieldGroup>
);

const PaddingFields = ({ styles, onChange, horizontal = true }) => (
  <div className="form-row">
    <NumberField label="Padding top (px)" value={styles.paddingTop ?? 0} onChange={(v) => onChange({ paddingTop: v })} />
    <NumberField label="Padding bottom (px)" value={styles.paddingBottom ?? 0} onChange={(v) => onChange({ paddingBottom: v })} />
    {horizontal && (
      <>
        <NumberField label="Padding left (px)" value={styles.paddingLeft ?? 0} onChange={(v) => onChange({ paddingLeft: v })} />
        <NumberField label="Padding right (px)" value={styles.paddingRight ?? 0} onChange={(v) => onChange({ paddingRight: v })} />
      </>
    )}
  </div>
);

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

const BORDER_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'none', label: 'None' }
];

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: 'Thin 100' },
  { value: '300', label: 'Light 300' },
  { value: '500', label: 'Medium 500' },
  { value: '700', label: 'Bold 700' },
  { value: '900', label: 'Black 900' }
];

const EmptyHint = ({ message }) => (
  <div className="inspector-empty" style={{ paddingTop: 20 }}>
    <p>{message}</p>
  </div>
);

const SectionSettings = ({ settings, onChange }) => (
  <div className="form-group">
    <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Section settings</h3>
    <ColorField label="Background color" value={settings.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
    <div className="form-row">
      <NumberField label="Padding top (px)" value={settings.paddingTop ?? 0} onChange={(v) => onChange({ paddingTop: v })} />
      <NumberField label="Padding bottom (px)" value={settings.paddingBottom ?? 0} onChange={(v) => onChange({ paddingBottom: v })} />
      <NumberField label="Padding left (px)" value={settings.paddingLeft ?? 0} onChange={(v) => onChange({ paddingLeft: v })} />
      <NumberField label="Padding right (px)" value={settings.paddingRight ?? 0} onChange={(v) => onChange({ paddingRight: v })} />
    </div>
    <div className="form-row">
      <NumberField label="Margin top (px)" value={settings.marginTop ?? 0} max={200} onChange={(v) => onChange({ marginTop: v })} />
      <NumberField label="Margin bottom (px)" value={settings.marginBottom ?? 0} max={200} onChange={(v) => onChange({ marginBottom: v })} />
      <NumberField label="Margin left (px)" value={settings.marginLeft ?? 0} max={200} onChange={(v) => onChange({ marginLeft: v })} />
      <NumberField label="Margin right (px)" value={settings.marginRight ?? 0} max={200} onChange={(v) => onChange({ marginRight: v })} />
    </div>
  </div>
);

const ElementContentForm = ({ element, onChange }) => {
  const content = element.content || {};

  switch (element.type) {
    case 'text':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Text settings</h3>
          <TextareaField label="Text content" value={content.text} onChange={(v) => onChange({ text: v })} rows={6} />
        </div>
      );
    case 'image':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Image settings</h3>
          <TextField label="Image URL (src)" value={content.src} onChange={(v) => onChange({ src: v })} placeholder="https://..." />
          <TextField label="Alt text" value={content.alt} onChange={(v) => onChange({ alt: v })} />
          <TextField label="Link URL (href)" value={content.href} onChange={(v) => onChange({ href: v })} placeholder="Optional click-through link" />
        </div>
      );
    case 'button':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Button settings</h3>
          <TextField label="Button label" value={content.text} onChange={(v) => onChange({ text: v })} />
          <TextField label="Link URL (href)" value={content.href} onChange={(v) => onChange({ href: v })} placeholder="https://..." />
        </div>
      );
    case 'divider':
      return <EmptyHint message="Divider has no content. Use the Style tab to change its line and spacing." />;
    case 'spacer':
      return <EmptyHint message="Spacer has no content. Use the Style tab to change its height." />;
    case 'social':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Social links</h3>
          <TextField label="Facebook URL" value={content.facebook} onChange={(v) => onChange({ facebook: v })} placeholder="https://facebook.com/..." />
          <TextField label="Instagram URL" value={content.instagram} onChange={(v) => onChange({ instagram: v })} placeholder="https://instagram.com/..." />
          <TextField label="Twitter / X URL" value={content.twitter} onChange={(v) => onChange({ twitter: v })} placeholder="https://twitter.com/..." />
        </div>
      );
    case 'membership':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Membership settings</h3>
          <TextField label="Label" value={content.label} onChange={(v) => onChange({ label: v })} />
          <TextField label="Merge tag" value={content.tag} onChange={(v) => onChange({ tag: v })} placeholder="{{MergeTag}}" />
        </div>
      );
    case 'pdf':
      return <EmptyHint message={`Imported PDF reference (${content.fileName || 'document'}). Use the Style tab to resize the preview.`} />;
    default:
      return <EmptyHint message="No content settings available for this element." />;
  }
};

const ElementStyleForm = ({ element, onChange }) => {
  const styles = element.styles || {};

  switch (element.type) {
    case 'text':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Text style</h3>
          <div className="form-row">
            <NumberField label="Font size (px)" value={styles.fontSize ?? 14} onChange={(v) => onChange({ fontSize: v })} />
            <SelectField
              label="Font weight"
              value={String(styles.fontWeight ?? 'normal')}
              onChange={(v) => onChange({ fontWeight: v })}
              options={FONT_WEIGHT_OPTIONS}
            />
          </div>
          <div className="form-row">
            <ColorField label="Text color" value={styles.color} onChange={(v) => onChange({ color: v })} />
            <ColorField label="Background color" value={styles.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
          </div>
          <div className="form-row" style={{ marginBottom: 4 }}>
            <SelectField
              label="Text align"
              value={styles.textAlign ?? 'left'}
              onChange={(v) => onChange({ textAlign: v })}
              options={ALIGNMENT_OPTIONS}
            />
          </div>
          <NumberField label="Line height (%)" value={styles.lineHeight ?? 130} onChange={(v) => onChange({ lineHeight: v })} />
          <PaddingFields styles={styles} onChange={onChange} />
        </div>
      );
    case 'image':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Image style</h3>
          <div className="form-row">
            <NumberField label="Width (px)" value={styles.width ?? 600} max={1200} onChange={(v) => onChange({ width: v })} />
            <NumberField label="Border radius (px)" value={styles.borderRadius ?? 0} onChange={(v) => onChange({ borderRadius: v })} />
          </div>
          <SelectField
            label="Alignment"
            value={styles.alignment ?? 'center'}
            onChange={(v) => onChange({ alignment: v })}
            options={ALIGNMENT_OPTIONS}
          />
          <PaddingFields styles={styles} onChange={onChange} />
        </div>
      );
    case 'button':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Button style</h3>
          <div className="form-row">
            <NumberField label="Font size (px)" value={styles.fontSize ?? 16} onChange={(v) => onChange({ fontSize: v })} />
            <SelectField
              label="Font weight"
              value={String(styles.fontWeight ?? 'bold')}
              onChange={(v) => onChange({ fontWeight: v })}
              options={FONT_WEIGHT_OPTIONS}
            />
          </div>
          <div className="form-row">
            <ColorField label="Text color" value={styles.color} onChange={(v) => onChange({ color: v })} />
            <ColorField label="Background color" value={styles.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
          </div>
          <div className="form-row">
            <NumberField label="Border radius (px)" value={styles.borderRadius ?? 4} onChange={(v) => onChange({ borderRadius: v })} />
            <SelectField
              label="Alignment"
              value={styles.alignment ?? 'center'}
              onChange={(v) => onChange({ alignment: v })}
              options={ALIGNMENT_OPTIONS}
            />
          </div>
          <PaddingFields styles={styles} onChange={onChange} />
        </div>
      );
    case 'divider':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Divider style</h3>
          <div className="form-row">
            <NumberField label="Border width (px)" value={styles.borderWidth ?? 1} onChange={(v) => onChange({ borderWidth: v })} />
            <SelectField
              label="Border style"
              value={styles.borderStyle ?? 'solid'}
              onChange={(v) => onChange({ borderStyle: v })}
              options={BORDER_STYLE_OPTIONS}
            />
          </div>
          <ColorField label="Border color" value={styles.borderColor} onChange={(v) => onChange({ borderColor: v })} />
          <PaddingFields styles={styles} onChange={onChange} horizontal={false} />
        </div>
      );
    case 'spacer':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Spacer style</h3>
          <NumberField label="Height (px)" value={styles.height ?? 20} onChange={(v) => onChange({ height: v })} />
        </div>
      );
    case 'social':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Social style</h3>
          <div className="form-row">
            <NumberField label="Icon size (px)" value={styles.iconSize ?? 32} onChange={(v) => onChange({ iconSize: v })} />
            <SelectField
              label="Alignment"
              value={styles.alignment ?? 'center'}
              onChange={(v) => onChange({ alignment: v })}
              options={ALIGNMENT_OPTIONS}
            />
          </div>
          <PaddingFields styles={styles} onChange={onChange} horizontal={false} />
        </div>
      );
    case 'membership':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Membership style</h3>
          <div className="form-row">
            <NumberField label="Font size (px)" value={styles.fontSize ?? 10} onChange={(v) => onChange({ fontSize: v })} />
            <ColorField label="Text color" value={styles.color} onChange={(v) => onChange({ color: v })} />
          </div>
          <SelectField
            label="Text align"
            value={styles.textAlign ?? 'left'}
            onChange={(v) => onChange({ textAlign: v })}
            options={ALIGNMENT_OPTIONS}
          />
          <NumberField label="Line height (%)" value={styles.lineHeight ?? 110} onChange={(v) => onChange({ lineHeight: v })} />
          <PaddingFields styles={styles} onChange={onChange} />
        </div>
      );
    case 'pdf':
      return (
        <div className="form-group">
          <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>PDF preview style</h3>
          <div className="form-row">
            <NumberField label="Width (px)" value={styles.width ?? 600} max={1200} onChange={(v) => onChange({ width: v })} />
            <NumberField label="Height (px)" value={styles.height ?? 800} max={4000} onChange={(v) => onChange({ height: v })} />
          </div>
          <SelectField
            label="Alignment"
            value={styles.alignment ?? 'center'}
            onChange={(v) => onChange({ alignment: v })}
            options={ALIGNMENT_OPTIONS}
          />
          <PaddingFields styles={styles} onChange={onChange} />
        </div>
      );
    default:
      return <EmptyHint message="No style settings available for this element." />;
  }
};

const ColumnSettings = ({ column, colIndex, onChange }) => {
  const settings = column.settings || {};
  return (
    <div className="form-group">
      <h3 style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>Column {colIndex + 1} settings</h3>
      <div className="form-row">
        <NumberField label="Width (px)" value={column.width ?? 100} min={1} max={100} onChange={(v) => onChange({ width: v })} />
        <NumberField label="Height (px)" value={settings.height ?? 0} onChange={(v) => onChange({ height: v })} />
      </div>
      <ColorField label="Background color" value={settings.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
      <PaddingFields styles={settings} onChange={onChange} />
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Width is relative to the row — set each column in the section so widths add up to 100%. Height 0 means automatic.
      </p>
    </div>
  );
};

const Properties = ({ selectedElement, onElementUpdate, onSectionUpdate, onColumnUpdate, onDeleteImportedElement }) => {
  const [activeTab, setActiveTab] = useState('content');

  const node = selectedElement?.node;
  const isSection = selectedElement?.type === 'section' && Boolean(node);
  const isElement = selectedElement?.type === 'element' && Boolean(node);
  const isColumn = selectedElement?.type === 'column' && Boolean(node);
  const isImported = Boolean(isElement && selectedElement.imported);

  const updateContent = (patch) => onElementUpdate(node.id, { content: patch });
  const updateStyles = (patch) => onElementUpdate(node.id, { styles: patch });
  const updateSettings = (patch) => {
    if (onSectionUpdate) onSectionUpdate(node.id, patch);
  };
  const updateColumn = (patch) => {
    if (onColumnUpdate) onColumnUpdate(selectedElement.sectionId, selectedElement.colIndex, patch);
  };
  const handleDeleteClick = () => {
    if (isImported && onDeleteImportedElement) onDeleteImportedElement(node.id);
  };

  const subtitle = isColumn
    ? `COLUMN ${selectedElement.colIndex + 1}: ${selectedElement.sectionId}`
    : isSection || isElement
      ? `${node.type.toUpperCase()}: ${node.id}`
      : 'Select an element to customize';

  return (
    <aside className="sidebar-right">
      <div className="panel-header">
        <h2>Properties</h2>
        <p id="inspector-subtitle">{subtitle}</p>
      </div>

      {isElement && (
        <div className="inspector-tabs">
          <button
            className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
        </div>
      )}

      <div className="inspector-scroll">
        {!isSection && !isElement && !isColumn ? (
          <div className="inspector-empty">
            <p>Click on any layout section or content block in the canvas to edit its properties.</p>
          </div>
        ) : (
          <div className="inspector-form">
            {isSection && <SectionSettings settings={node.settings || {}} onChange={updateSettings} />}
            {isColumn && (
              <ColumnSettings
                column={node}
                colIndex={selectedElement.colIndex}
                onChange={updateColumn}
              />
            )}
            {isElement && activeTab === 'content' && <ElementContentForm element={node} onChange={updateContent} />}
            {isElement && activeTab === 'style' && <ElementStyleForm element={node} onChange={updateStyles} />}
            {isImported && (
              <button
                className="btn btn-danger-text"
                style={{ marginTop: 8, justifyContent: 'center' }}
                onClick={handleDeleteClick}
              >
                <Trash2 size={16} />
                <span>Delete element from template</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Properties;
