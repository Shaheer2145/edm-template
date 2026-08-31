import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import CanvasSection from "./CanvasSection";
import { PlusCircle } from 'lucide-react';
import "../../App.css";
import './Canvas.css';

const RESPONSIVE_OVERRIDE_CSS = `
    html, body {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        -webkit-text-size-adjust: 100%;
    }
    * { box-sizing: border-box; }
    table { max-width: 100% !important; }
    td, th, tr { word-break: break-word; }
    img, video, object, embed, svg { max-width: 100% !important; }
    img { height: auto !important; }
`;

const buildSrcDoc = (rawHTML) => {
    const overrideStyle = `<style id="edm-responsive-overrides">${RESPONSIVE_OVERRIDE_CSS}</style>`;
    if (/<head[^>]*>/i.test(rawHTML)) {
        return rawHTML.replace(/<head[^>]*>/i, (match) => `${match}${overrideStyle}`);
    }
    if (/<html[^>]*>/i.test(rawHTML)) {
        return rawHTML.replace(/<html[^>]*>/i, (match) => `${match}<head>${overrideStyle}</head>`);
    }
    return `<!DOCTYPE html><html><head><meta charset="utf-8">${overrideStyle}</head><body>${rawHTML}</body></html>`;
};

const INTERACTION_CSS = `
    [data-edm-id] { cursor: pointer; }
    [data-edm-id]:hover { outline: 1px dashed #8b5cf6; outline-offset: 2px; }
    [data-edm-id].edm-selected { outline: 2px solid #6366f1 !important; outline-offset: 2px; }
`;

const applySelectionClass = (doc, selectedId) => {
    if (!doc || !doc.querySelectorAll) return;
    doc.querySelectorAll('[data-edm-id].edm-selected').forEach((node) => node.classList.remove('edm-selected'));
    if (selectedId) {
        const node = doc.querySelector(`[data-edm-id="${selectedId}"]`);
        if (node) node.classList.add('edm-selected');
    }
};

const RawHtmlCanvas = ({ rawHTML, deviceMode, revision = 0, selectedId = null, onSelectElement, onDocumentReady }) => {
    const iframeRef = useRef(null);
    const observerRef = useRef(null);
    const [frameHeight, setFrameHeight] = useState(800);
    const rawHTMLRef = useRef(rawHTML);
    const selectedIdRef = useRef(selectedId);
    rawHTMLRef.current = rawHTML;
    selectedIdRef.current = selectedId;

    // srcDoc is rebuilt only when a template is (re)imported (revision change).
    // Property edits are applied imperatively to the live iframe document, so no reload/flicker per keystroke.
    const srcDoc = useMemo(() => buildSrcDoc(rawHTMLRef.current), [revision]);

    const syncHeight = useCallback(() => {
        const iframe = iframeRef.current;
        const doc = iframe && iframe.contentDocument;
        if (!doc || !doc.documentElement) return;
        const height = Math.max(
            doc.documentElement.scrollHeight || 0,
            doc.body ? doc.body.scrollHeight : 0
        );
        if (height > 0) {
            setFrameHeight((prev) => (Math.abs(prev - height) > 1 ? height : prev));
        }
    }, []);

    const attachResizeObserver = useCallback(() => {
        const iframe = iframeRef.current;
        const win = iframe && iframe.contentWindow;
        const doc = iframe && iframe.contentDocument;
        if (!win || !doc || !doc.body) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
        if (typeof win.ResizeObserver === 'function') {
            const observer = new win.ResizeObserver(syncHeight);
            observer.observe(doc.body);
            observer.observe(doc.documentElement);
            observerRef.current = observer;
        }
    }, [syncHeight]);

    const attachInteraction = useCallback((doc) => {
        if (!doc) return;
        if (!doc.getElementById('edm-interaction-style')) {
            const style = doc.createElement('style');
            style.id = 'edm-interaction-style';
            style.textContent = INTERACTION_CSS;
            (doc.head || doc.documentElement).appendChild(style);
        }
        if (!doc.__edmInteractionBound) {
            doc.__edmInteractionBound = true;
            doc.addEventListener('click', (event) => {
                const target = event.target && event.target.closest ? event.target.closest('[data-edm-id]') : null;
                if (!target) return;
                event.preventDefault();
                event.stopPropagation();
                const elementId = target.getAttribute('data-edm-id');
                if (onSelectElement) onSelectElement(elementId);
            }, true);
        }
    }, [onSelectElement]);

    const handleIframeLoad = useCallback(() => {
        syncHeight();
        attachResizeObserver();

        const iframe = iframeRef.current;
        const doc = iframe && iframe.contentDocument;
        if (doc) {
            attachInteraction(doc);
            applySelectionClass(doc, selectedIdRef.current);
            if (onDocumentReady) onDocumentReady(doc);
        }

        if (doc && doc.images && doc.images.length) {
            Array.prototype.forEach.call(doc.images, (img) => {
                if (!img.complete) {
                    img.addEventListener('load', syncHeight, { once: true });
                    img.addEventListener('error', syncHeight, { once: true });
                }
            });
            window.setTimeout(syncHeight, 400);
            window.setTimeout(syncHeight, 1200);
        }
    }, [syncHeight, attachResizeObserver, attachInteraction, onDocumentReady]);

    useEffect(() => {
        const doc = iframeRef.current && iframeRef.current.contentDocument;
        if (doc) applySelectionClass(doc, selectedId);
    }, [selectedId, srcDoc]);

    useEffect(() => {
        const t1 = window.setTimeout(syncHeight, 300);
        const t2 = window.setTimeout(syncHeight, 700);
        return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
        };
    }, [deviceMode, syncHeight]);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, []);

    return (
        <div className="raw-html-canvas" data-device-mode={deviceMode}>
            <iframe
                ref={iframeRef}
                title="Imported HTML preview"
                className="raw-html-iframe"
                sandbox="allow-same-origin"
                scrolling="no"
                srcDoc={srcDoc}
                onLoad={handleIframeLoad}
                style={{ height: `${frameHeight}px` }}
            />
        </div>
    );
};

const SectionDropZone = ({ insertIndex, visible, onDropSection }) => {
    const [over, setOver] = useState(false);
    const className = ['section-drop-zone'];
    if (visible) className.push('visible');
    if (visible && over) className.push('over');

    return (
        <div
            className={className.join(' ')}
            onDragOver={(e) => {
                if (!visible) return;
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOver(false);
                if (visible) onDropSection(insertIndex);
            }}
        />
    );
};

const Canvas = ({
    state,
    selectedElement,
    deviceMode = 'desktop',
    dragItem = null,
    onSelectNode,
    onDuplicateSection,
    onDuplicateColumn,
    onDeleteColumn,
    onDuplicateElement,
    onDeleteSection,
    onDeleteElement,
    onDropSection,
    onDropElement,
    onDropElementOnEmptyCanvas,
    onDragEndItem,
    onUpdateRawHTML,
    onDragStart,
    renderElementNode,
    updateHealthBridge,
    updateDragAndDropZones,
    importRevision = 0,
    onSelectImportedElement,
    onImportedDocumentReady,
    onSelectColumn,
}) => {
    useEffect(() => {
        if (typeof updateHealthBridge === 'function') {
            updateHealthBridge();
        }
    }, [state.sections, state.importedRawHTML, updateHealthBridge]);

    useEffect(() => {
        if (typeof updateDragAndDropZones === 'function') {
            updateDragAndDropZones();
        }
    }, [state.sections, state.importedRawHTML, updateDragAndDropZones]);

    const isEmpty = state.sections.length === 0;
    const showRawHTML = Boolean(state.importedRawHTML);
    const previewHTML = state.importedFullHTML || state.importedRawHTML;

    const backgroundStyle = {
        backgroundColor: showRawHTML || !isEmpty ? state.settings.bodyBackgroundColor || '#ffffff' : ''
    };

    return (
        <div
            className='canvas-wrapper'
            onDragOver={(e) => {
                if (dragItem?.kind !== 'section') return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={(e) => {
                if (dragItem?.kind !== 'section') return;
                e.preventDefault();
                onDropSection(state.sections.length);
            }}
        >
            <div
                id="canvas-container"
                className={`canvas-container ${deviceMode}-view`}
            >
                <div
                    id="canvas-root"
                    className="canvas-root"
                    dir={state.settings.direction || 'ltr'}
                    style={backgroundStyle}
                >
                    {showRawHTML ? (
                        <RawHtmlCanvas
                            rawHTML={previewHTML}
                            deviceMode={deviceMode}
                            revision={importRevision}
                            selectedId={selectedElement && selectedElement.type === 'element' ? selectedElement.id : null}
                            onSelectElement={onSelectImportedElement}
                            onDocumentReady={onImportedDocumentReady}
                        />
                    ) : isEmpty ? (
                        <div
                            className={`canvas-empty-state ${dragItem ? 'drop-target' : ''}`}
                            onDragOver={(e) => {
                                if (!dragItem) return;
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'copy';
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!dragItem) return;
                                if (dragItem.kind === 'section') onDropSection(0);
                                else if (dragItem.kind === 'element') onDropElementOnEmptyCanvas();
                                if (onDragEndItem) onDragEndItem();
                            }}
                        >
                            <PlusCircle className="empty-icon" />
                            <h3>Your Email Canvas is Empty</h3>
                            <p>Drag a layout section here to get started</p>
                        </div>
                    ) : (
                        <>
                            <SectionDropZone
                                insertIndex={0}
                                visible={dragItem?.kind === 'section'}
                                onDropSection={onDropSection}
                            />
                            {state.sections.map((sec, secIndex) => (
                                <React.Fragment key={sec.id || secIndex}>
                                    <CanvasSection
                                        section={sec}
                                        secIndex={secIndex}
                                        selectedElement={selectedElement}
                                        dragItem={dragItem}
                                        onSelectNode={onSelectNode}
                                        onSelectColumn={onSelectColumn}
                                        onDuplicateSection={onDuplicateSection}
                                        onDeleteSection={onDeleteSection}
                                        onDuplicateColumn={onDuplicateColumn}
                                        onDeleteColumn={onDeleteColumn}
                                        onDuplicateElement={onDuplicateElement}
                                        onDeleteElement={onDeleteElement}
                                        onDropElement={onDropElement}
                                        onDropSection={onDropSection}
                                        onDragStart={onDragStart}
                                        renderElementNode={renderElementNode}
                                    />
                                    <SectionDropZone
                                        insertIndex={secIndex + 1}
                                        visible={dragItem?.kind === 'section'}
                                        onDropSection={onDropSection}
                                    />
                                </React.Fragment>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Canvas;
