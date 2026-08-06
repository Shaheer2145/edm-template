import React,{useState} from 'react';
import { Monitor, Tablet, Smartphone, UploadCloud, ShieldCheck, Layout, Trash2, Code } from 'lucide-react';
import ExportFileModal from "../ExportFile/Index.jsx";




const Header = ({ deviceMode, setDeviceMode }) => {

  const [isExportModalOpen,setIsExportModalOpen] = useState(false);
  const deviceOptions = [
    { key: 'desktop', label: 'Desktop', icon: Monitor },
    { key: 'tablet', label: 'Tablet', icon: Tablet },
    { key: 'mobile', label: 'Mobile', icon: Smartphone }
  ];

  return (
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

      <div className="header-actions">
        <button className="btn btn-secondary" title="Upload HTML Template, PDF or Design Image">
          <UploadCloud size={16} />
          <span>Import Design</span>
        </button>
        <button className="btn btn-secondary" title="QA & Outlook Testing Wizard">
          <ShieldCheck size={16} />
          <span>QA Studio</span>
          <span className="health-badge status-good">100%</span>
        </button>
        <button className="btn btn-secondary">
          <Layout size={16} />
          <span>Presets</span>
        </button>
        <button className="btn btn-danger-text">
          <Trash2 size={16} />
          <span>Clear</span>
        </button>
        <button 
          className="btn btn-primary"
          onClick{()=>setIsExportModalOpen(true)}
        >
          <Code size={16} />
          <span>Export HTML</span>
        </button>
        <ExportFileModal
          isOpen={isExportModalOpen}
          onClose={()=>setIsExportModalOpen(false)}
          state
        />
      </div>
    </header>
  );
};

export default Header;  
