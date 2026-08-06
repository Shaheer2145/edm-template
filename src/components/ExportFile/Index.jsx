import React from 'react';
import { EmailCompiler } from '../../utils/compile';
import { UseState } from "react";
import { Copy, Check, Download,X,nfo } from 'lucide-react';

const ExportFileModal = ({ isOpen, onClose, state }) => {
    
    const [copied, setCopied] = useState(false);

    const htmlCode = useMemo(() => {
        if (!state) return "";
        return EmailCompiler.compile(state);

        if (!isOpen) return null;
    })

    const btnCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(htmlCode);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
        catch (error) {
            console.error(`Failed to copy the selected code ${error}`);
        }
    }
    const btnDownloadHtml = () => {
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const Url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = Url;
        link.download = 'edm-email-template.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    return (
        <>
            <div 
                id="modal-export" 
                className="modal-overlay hidden"
            >
                <div className="modal-card export-card">
                    <div className="modal-header">
                        <h2>Generated HTML Code</h2>
                        <button 
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close Modal"
                        >
                            <X size={18}/>
                        </button>
                    </div>
                    <div className="modal-body export-body">
                        <p className="export-note">
                            <Info size={18}/>
                            This code contains inline CSS style tags and table-based column structures, ensuring cross-client email compatibility (Outlook, Gmail, Yahoo, Apple Mail).
                        </p>
                        <div className="code-container">
                            <textarea 
                                id="code-output" 
                                readonly
                                value={htmlCode}
                            ></textarea>
                        </div>
                        <div className="export-actions">
                            <button
                                id="btn-copy-code"
                                className="btn btn-secondary"
                                onClick={btnCopyCode}       
                            >
                                {copied ? <Check size={18}/>:<Copy size={18}/>}
                                <span>{copied ? 'Copied!' : 'Copy Code'} </span>
                            </button>
                            <button
                                id="btn-download-html"
                                className="btn btn-primary"
                                onClick={btnDownloadHtml}
                            >
                                <Download size={18}/>
                                <span>Download HTML File</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExportFileModal;