import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, UploadCloud, ShieldCheck, Layout, Trash2, Code, Section } from 'lucide-react';
import ExportFileModal from "../ExportFile/Index.jsx";
import QAStudio from '../QAStudio/QAStudio.jsx';
import ImportFile from "../ImportFile/importFile.jsx";
import PresetsModal from "../Presets/PresetsModal.jsx";
import HistoryControls from "./HistoryControls.jsx";

import "../../App.css";


const Header = ({
  deviceMode,
  setDeviceMode,
  state,
  setState,
  setSelectedElement,
  onImport,
  onSelectPreset,
  selectedElement,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {


  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isQAModel, setIsQAModel] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [isPresetsModal, setIsPresetsModal] = useState(false);


  const deviceOptions = [
    { key: 'desktop', label: 'Desktop', icon: Monitor },
    { key: 'tablet', label: 'Tablet', icon: Tablet },
    { key: 'mobile', label: 'Mobile', icon: Smartphone }
  ];
  const clearScreen = () => {
    const screenWarning = window.confirm("Are you sure you want to clear the entire canvas?");
    if (!screenWarning) return null;

    setState(() => ({
      settings: { bodyBackgroundColor: '#ffffff', direction: 'ltr' },
      sections: []
    }));
    setSelectedElement(null);
  }

  return (
    <>
      <header className="app-header">
        <div className="header-logo">
          <div className="logo-icon">📧</div>
          <div className="logo-text">
            <h1>EDM Builder Studio</h1>
            <span>Pixel-Perfect Email Designer & QA Suite</span>
          </div>
        </div>

        <div className="device-toggles">
          {deviceOptions.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`device-btn ${deviceMode === key ? 'active' : ''}`}
              title={`${label} Preview`}
              onClick={() => setDeviceMode(key)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <HistoryControls
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        <div className="header-actions">
          <button
            className="btn btn-secondary"
            title="Upload HTML Template, PDF or Design Image"
            onClick={() => setIsImportModal(true)}

          >
            <UploadCloud size={16} />
            <span>Import Design</span>
          </button>
          <button
            className="btn btn-secondary"
            title="QA & Outlook Testing Wizard"
            onClick={() => setIsQAModel(true)}
          >
            <ShieldCheck size={16} />
            <span>QA Studio</span>
            <span className="health-badge status-good">100%</span>
          </button>


          <button
            className="btn btn-secondary"
            onClick={() => setIsPresetsModal(true)}
          >
            <Layout size={16} />
            <span>Presets</span>
          </button>



          <button
            className="btn btn-danger-text"
            onClick={clearScreen}
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>


          <button
            className="btn btn-primary"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Code size={16} />
            <span>Export HTML</span>
          </button>
          <ExportFileModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            state={state}
          />
          {isQAModel && (
            <QAStudio
              isOpen={isQAModel}
              onClose={() => setIsQAModel(false)}
              state={state}
            />
          )}
          {isImportModal && (
            <ImportFile
              isOpen={isImportModal}
              onClose={() => setIsImportModal(false)}
              state={state}
              onImport={onImport}
            />
          )}
          {isPresetsModal && (
            <PresetsModal
              isOpen={isPresetsModal}
              onClose={() => setIsPresetsModal(false)}
              onSelectPreset={onSelectPreset}
            />
          )}

        </div>
      </header>
    </>

  );
};

export default Header;  
