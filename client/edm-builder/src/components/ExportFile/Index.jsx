import React from 'react';
import { EmailCompiler } from "../../services/compile.js";
import { useState ,useMemo } from "react";
import { Copy, Check, Download, X, Info, SendHorizontal } from 'lucide-react';
import SendTemplateModal from "./SendTemplateModal";
import "../../App.css";


const ExportFileModal = ({ isOpen, onClose, state }) => {

    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);

    const htmlCode = useMemo(() => {
        if (!state) return "";
        return EmailCompiler.compile(state);

    },[state])

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
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'edm-email-template.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }



    if (!isOpen) return null;
    return (
        <>
            <div
                id="modal-export"
                className="modal-overlay"
            >
                <div className="modal-card export-card">
                    <div className="modal-header">
                        <h2>Generated HTML Code</h2>
                        <button
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close Modal"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="modal-body export-body">
                        <p className="export-note">
                            <Info size={18} />
                            This code contains inline CSS style tags and table-based column structures, ensuring cross-client email compatibility (Outlook, Gmail, Yahoo, Apple Mail).
                        </p>
                        <div className="code-container">
                            <textarea
                                id="code-output"
                                readOnly
                                value={htmlCode}
                            ></textarea>
                        </div>
                        <div className="export-actions">
                            <button
                                id="btn-copy-code"
                                className="btn btn-secondary"
                                onClick={btnCopyCode}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                <span>{copied ? 'Copied!' : 'Copy Code'} </span>
                            </button>
                            <button
                                id="btn-download-html"
                                className="btn btn-primary"
                                onClick={btnDownloadHtml}
                            >
                                <Download size={18} />
                                <span>Download HTML File</span>
                            </button>
                            <button
                                id="btn-send-email"
                                className="btn btn-primary"
                                onClick={() => setShowSendModal(true)}
                                disabled={sending}
                            >
                                <SendHorizontal size={18} />

                                Send Template via Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <SendTemplateModal
                isOpen={showSendModal}
                onClose={() => setShowSendModal(false)}
                htmlCode={htmlCode}
                templateName="Email Template"
            />
        </>
    )
}

export default ExportFileModal;