import React, { createContext, useState, useContext } from "react";
import { INITIAL_SETTINGS } from "./BuilderDefault";



const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const [sections, setSections] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedTab, setSelectedTab] = useState('content');
    const [draggedItem, setDraggedItem] = useState(null);

    const updateElementContent = (elementId, newContent) => {
        setSections((prevSections) =>
            prevSections.map((section) => ({
                ...section,
                columns: section.columns.map((col) => ({
                    ...col,
                    elements: col.elements.map((el) =>
                        el.id === elementId ? { ...el, content: { ...el.content, ...newContent } } : el
                    )
                }))
            }))
        );
    };

    const value = {
        settings,
        setSettings,
        sections,
        setSections,
        selectedElement,
        setSelectedElement,
        selectedTab,
        setSelectedTab,
        draggedItem,
        setDraggedItem,
        updateElementContent
    };

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );

}

export const useBuilder = () => {
    const context = useContext(BuilderContext);
    if (!context) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
}