import React from 'react'
import CanvasSection from "./CanvasSection";
import rawHtmlCanvas from "./CanvasContainer";
import {PlusCircle } from 'lucide-react';

const Canvas = ({
    state,
    selectedElement,
    deviceMode = 'desktop',
    onSelectNode,
    onDuplicateSection,
    onDeleteSection,
    onUpdateRawHTML,,
    onSelectedElement,
    onDragStart,
    renderElementNode,
    updateHealthBadge,
    updateDragAndDropZones,

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

    const backgroundStyle = {
        backgroundColor: showRawHTML || !isEmpty ? state.settings.bodyBackgroundColor || '#ffffff' : ''
    }

    return (
        <>
            <div
                id="canvas-container"
                className="canvas-container desktop-view"
                style={containerStyle}
            >
                <div
                    id="canvas-root"
                    className="canvas-root"
                    dir={state.settings.direction || 'ltr'}
                    style={backgroundStyle}
                >

                    {showRawHTML ? (
                        <RawHtmlCanvas
                            importedRawHTML={state.importedRawHTML}
                            onUpdateHTML={onUpdateRawHTML}
                            onSelectElement={onSelectEdmElement}
                            selectedEdmId = {selectedEdmId}
                        />
                    ) : isEmpty ? (
                        <div className="canvas-empty-state">
                            <PlusCircle className="empty-icon" />
                            <h3>Your Email Canvas is Empty</h3>
                            <p>Drag a layout section here to get started</p>
                        </div>
                    ) : (
                        state.sections.map((sec, secIndex) => (
                            <CanvasSection
                                key={sec.id || secIndex}
                                section={sec}
                                secIndex={secIndex}
                                selectedElement={selectedElement}
                                onSelectNode={onSelectNode}
                                onDuplicateSection={onDuplicateSection}
                                onDeleteSection={onDeleteSection}
                                onDuplicateElement={onDuplicateElement}
                                onDeleteElement={onDeleteElement}
                                onDragStart={onDragStart}
                                renderElementNode={renderElementNode}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default Canvas;










c