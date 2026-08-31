import React, { useMemo, useState } from 'react';
import { Layers, ChevronDown, ChevronRight, Layout, Columns, Type, Image, Box, Square, Minus, Share2, FileCode2, PanelRightClose, Table, Rows3 } from 'lucide-react';
import '../../App.css';

const ELEMENT_ICONS = {
    text: Type,
    image: Image,
    button: Square,
    divider: Minus,
    spacer: Minus,
    social: Share2,
    membership: Box,
    pdf: Box
};

const stripHtml = (html) =>
    String(html || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const importedElementLabel = (element) => {
    const content = element.content || {};
    switch (element.type) {
        case 'text': {
            const plain = stripHtml(content.text);
            if (!plain) return 'Text';
            return plain.length > 32 ? `${plain.slice(0, 32)}…` : plain;
        }
        case 'button':
            return stripHtml(content.text) || 'Button';
        case 'image':
            return content.alt || 'Image';
        case 'membership':
            return content.label ? stripHtml(content.label) : 'Membership';
        default:
            return String(element.type || 'Element').toUpperCase();
    }
};

const SKIP_TAGS = new Set(['style', 'script', 'link', 'meta', 'title', 'head', 'noscript', 'br', 'hr', 'comment']);
const PROMOTE_TAGS = new Set(['tbody', 'thead', 'tfoot', 'center', 'main', 'html', 'body', 'font']);

const STRUCTURE_META = {
    table: { label: 'Table', icon: Table },
    tr: { label: 'Row', icon: Rows3 },
    td: { label: 'Cell', icon: Box },
    th: { label: 'Cell', icon: Box },
    img: { label: 'Image', icon: Image }
};

const buildImportedTree = (html, elementsMap) => {
    if (!html) return [];
    let doc;
    try {
        doc = new DOMParser().parseFromString(html, 'text/html');
    } catch (err) {
        return [];
    }

    let autoKey = 0;
    const nextKey = () => `imported-node-${autoKey++}`;

    const walk = (el) => {
        const tag = el.tagName ? el.tagName.toLowerCase() : '';
        if (!tag || SKIP_TAGS.has(tag)) return [];

        const stampedId = el.getAttribute && el.getAttribute('data-edm-id');
        if (stampedId) {
            const mapped = elementsMap ? elementsMap[stampedId] : null;
            return [{
                key: `imported-${stampedId}`,
                stampedId,
                label: mapped ? importedElementLabel(mapped) : tag.toUpperCase(),
                icon: mapped ? (ELEMENT_ICONS[mapped.type] || Box) : Box,
                children: []
            }];
        }

        if (tag === 'img') {
            return [{ key: nextKey(), label: el.getAttribute('alt') || 'Image', icon: Image, children: [] }];
        }

        let childNodes = [];
        Array.from(el.children || []).forEach((child) => {
            childNodes = childNodes.concat(walk(child));
        });

        if (PROMOTE_TAGS.has(tag)) return childNodes;

        const meta = STRUCTURE_META[tag];
        if (meta) {
            if (childNodes.length === 0) return [];
            if ((tag === 'td' || tag === 'th') && childNodes.length === 1) return childNodes;
            return [{ key: nextKey(), label: meta.label, icon: meta.icon, children: childNodes }];
        }

        if (childNodes.length === 1) return childNodes;
        if (childNodes.length > 1) {
            return [{ key: nextKey(), label: tag.toUpperCase(), icon: Box, children: childNodes }];
        }
        return [];
    };

    return walk(doc.body);
};

const countNodes = (nodes) =>
    nodes.reduce((acc, node) => acc + 1 + countNodes(node.children || []), 0);

const TreeNode = ({ depth, label, icon: Icon, isSelected, isExpanded, hasChildren, onToggleExpand, onSelect }) => {
    return (
        <div
            className={`nav-node ${isSelected ? 'selected' : ''}`}
            style={{ paddingLeft: `${10 + depth * 14}px` }}
            title={label}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            <span
                className={`nav-chevron ${hasChildren ? '' : 'placeholder'}`}
                onClick={(e) => {
                    if (!hasChildren) return;
                    e.stopPropagation();
                    onToggleExpand();
                }}
            >
                {hasChildren && (isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />)}
            </span>
            <Icon size={14} className="nav-node-icon" />
            <span className="nav-node-label">{label}</span>
        </div>
    );
};

const NavigatorPanel = ({
    sections = [],
    elementsMap,
    hasImportedTemplate = false,
    importedHtml = '',
    selectedElement,
    onSelectSection,
    onSelectColumn,
    onSelectElement,
    onSelectImportedElement
}) => {
    const [collapsedIds, setCollapsedIds] = useState({});
    const [isRail, setIsRail] = useState(false);

    const toggleExpand = (id) => {
        setCollapsedIds((prev) => {
            const next = { ...prev };
            if (next[id]) delete next[id];
            else next[id] = true;
            return next;
        });
    };

    const isExpanded = (id) => !collapsedIds[id];

    const importedTree = useMemo(() => {
        if (!hasImportedTemplate || !importedHtml) return [];
        return buildImportedTree(importedHtml, elementsMap);
    }, [hasImportedTemplate, importedHtml, elementsMap]);

    const importedElements = elementsMap ? Object.values(elementsMap) : [];

    if (isRail) {
        return (
            <aside className="navigator-rail" title="Open Navigator">
                <button className="nav-rail-btn" onClick={() => setIsRail(false)}>
                    <Layers size={18} />
                </button>
            </aside>
        );
    }

    const sectionCount = sections.length;
    const importedCount = importedTree.length > 0 ? countNodes(importedTree) : importedElements.length;
    const totalCount = importedCount + sections.reduce(
        (acc, section) => acc + 1 + section.columns.reduce((colAcc, col) => colAcc + 1 + (col.elements ? col.elements.length : 0), 0),
        0
    );
    const isEmpty = sectionCount === 0 && importedCount === 0;

    const renderImportedNodes = (nodes, depth) =>
        nodes.map((node) => (
            <React.Fragment key={node.key}>
                <TreeNode
                    depth={depth}
                    label={node.label}
                    icon={node.icon || Box}
                    isSelected={Boolean(node.stampedId) && selectedElement?.type === 'element' && selectedElement.id === node.stampedId}
                    hasChildren={node.children.length > 0}
                    isExpanded={isExpanded(node.key)}
                    onToggleExpand={() => toggleExpand(node.key)}
                    onSelect={() => {
                        if (node.stampedId && onSelectImportedElement) {
                            onSelectImportedElement(node.stampedId);
                        } else {
                            toggleExpand(node.key);
                        }
                    }}
                />
                {isExpanded(node.key) && node.children.length > 0 && renderImportedNodes(node.children, depth + 1)}
            </React.Fragment>
        ));

    return (
        <aside className="navigator-panel">
            <div className="panel-header nav-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layers size={16} style={{ color: 'var(--accent-light)' }} />
                    <h2>Navigator</h2>
                </div>
                <button
                    className="nav-rail-btn"
                    title="Collapse Navigator"
                    onClick={() => setIsRail(true)}
                >
                    <PanelRightClose size={16} />
                </button>
            </div>

            <div className="navigator-tree">
                {isEmpty ? (
                    <div className="nav-empty">
                        <p>Canvas is empty.</p>
                        <p>Drag a section from the left panel, pick a preset, or import a template to see the structure here.</p>
                    </div>
                ) : (
                    <>
                        {hasImportedTemplate && importedCount > 0 && (
                            <React.Fragment>
                                <TreeNode
                                    depth={0}
                                    label="Imported Template"
                                    icon={FileCode2}
                                    isSelected={false}
                                    hasChildren={true}
                                    isExpanded={isExpanded('imported-template')}
                                    onToggleExpand={() => toggleExpand('imported-template')}
                                    onSelect={() => toggleExpand('imported-template')}
                                />
                                {isExpanded('imported-template') &&
                                    (importedTree.length > 0
                                        ? renderImportedNodes(importedTree, 1)
                                        : importedElements.map((element, index) => {
                                            const Icon = ELEMENT_ICONS[element.type] || Box;
                                            const elementSelected =
                                                selectedElement?.type === 'element' && selectedElement.id === element.id;
                                            return (
                                                <TreeNode
                                                    key={element.id || `imported-el-${index}`}
                                                    depth={1}
                                                    label={importedElementLabel(element)}
                                                    icon={Icon}
                                                    isSelected={elementSelected}
                                                    hasChildren={false}
                                                    isExpanded={false}
                                                    onToggleExpand={() => { }}
                                                    onSelect={() => onSelectImportedElement && onSelectImportedElement(element.id)}
                                                />
                                            );
                                        }))}
                            </React.Fragment>
                        )}
                        {sections.map((section, secIndex) => {
                            const sectionKey = section.id || `section-${secIndex}`;
                            const sectionSelected = selectedElement?.type === 'section' && selectedElement.id === section.id;
                            return (
                                <React.Fragment key={sectionKey}>
                                    <TreeNode
                                        depth={0}
                                        label="Section"
                                        icon={Layout}
                                        isSelected={sectionSelected}
                                        hasChildren={section.columns.length > 0}
                                        isExpanded={isExpanded(sectionKey)}
                                        onToggleExpand={() => toggleExpand(sectionKey)}
                                        onSelect={() => onSelectSection && onSelectSection(section)}
                                    />
                                    {isExpanded(sectionKey) &&
                                        section.columns.map((column, colIndex) => {
                                            const colKey = `${sectionKey}-col-${colIndex}`;
                                            const columnSelected =
                                                selectedElement?.type === 'column' &&
                                                selectedElement.sectionId === section.id &&
                                                selectedElement.colIndex === colIndex;
                                            const elements = column.elements || [];
                                            return (
                                                <React.Fragment key={colKey}>
                                                    <TreeNode
                                                        depth={1}
                                                        label={`Column ${colIndex + 1}`}
                                                        icon={Columns}
                                                        isSelected={columnSelected}
                                                        hasChildren={elements.length > 0}
                                                        isExpanded={isExpanded(colKey)}
                                                        onToggleExpand={() => toggleExpand(colKey)}
                                                        onSelect={() => onSelectColumn && onSelectColumn(section.id, colIndex)}
                                                    />
                                                    {isExpanded(colKey) &&
                                                        elements.map((element, elIndex) => {
                                                            const Icon = ELEMENT_ICONS[element.type] || Box;
                                                            const elementSelected =
                                                                selectedElement?.type === 'element' && selectedElement.id === element.id;
                                                            return (
                                                                <TreeNode
                                                                    key={element.id || `${colKey}-el-${elIndex}`}
                                                                    depth={2}
                                                                    label={element.type.toUpperCase()}
                                                                    icon={Icon}
                                                                    isSelected={elementSelected}
                                                                    hasChildren={false}
                                                                    isExpanded={false}
                                                                    onToggleExpand={() => { }}
                                                                    onSelect={() => onSelectElement && onSelectElement(element)}
                                                                />
                                                            );
                                                        })}
                                                </React.Fragment>
                                            );
                                        })}
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </div>

            <div className="nav-footer">
                <span>{totalCount} layer{totalCount === 1 ? '' : 's'}</span>
            </div>
        </aside>
    );
};

export default NavigatorPanel;
