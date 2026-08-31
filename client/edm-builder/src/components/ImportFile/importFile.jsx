import React, { useState } from 'react';
import { X, UploadCloud } from "lucide-react";
import { EmailImporter } from "../../services/import";
import "../../App.css";


const ImportFile = ({ isOpen, onClose, onImport }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = React.useRef(null);

    if (!isOpen) return null;

    const chooseFile = () => {
        fileInputRef.current.click();
    };


    const handleImportClick = (file) => {
        if (!file) {
            setError("Please select a file to import");
            return;
        }
        setError(null);
        setSelectedFile(file);

        EmailImporter.readReferenceFile(file, (result) => {

            console.log("IMPORT RESULT:", result);
            if (!result) {
                setError('Unable to import this file.');
                return;
            }
            if (onImport) {
                onImport(result);
            }
            onClose();
        })
    }
    const fileInput = (e) => {
        const file = e.target?.files[0];
        if (!file) {
            setError("No file selected");
            return;
        }
        handleImportClick(file);
        e.target.value = "";
    }



    const dragFileOption = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);
        const dragFile = e.dataTransfer.files[0];
        handleImportClick(dragFile);

    }


    const closeImportModal = () => {
        setSelectedFile(null);
        setError(null);
        setDragActive(false);
        onClose();
    }

    return (
        <div id="modal-import" className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <h2>Import Design or HTML Template</h2>
                    <button className="modal-close" onClick={closeImportModal}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <div
                        className={`upload-dropzone ${dragActive ? 'dragover' : ''}`}
                        id="upload-dropzone"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(false);
                        }}
                        onDrop={dragFileOption}
                    >
                        <UploadCloud size={48} style={{ color: 'var(--accent-light)', marginBottom: 12 }} />

                        <h3>Drag & Drop your design file here</h3>

                        <p>Supports HTML templates (.html), PDF designs (.pdf), and Mockup Images (.png, .jpg, .webp)</p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            id="file-input"
                            accept=".html,.htm,.pdf,.png,.jpg,.jpeg,.webp,text/html,application/pdf,image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={fileInput}
                        />
                        <button
                            id="btn-browse-file"
                            className="btn btn-primary"
                            style={{ marginTop: 12 }}
                            onClick={chooseFile}
                        >
                            Browse File
                        </button>

                        {selectedFile && (
                            <p style={{ marginTop: 8, color: 'var(--accent-light)', fontSize: 13 }}>
                                Selected: {selectedFile.name}
                            </p>
                        )}
                        {error && (
                            <p style={{ marginTop: 8, color: 'var(--danger)', fontSize: 13 }}>
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="import-options" style={{ marginTop: 20 }}>
                        <h4>Import Options:</h4>
                        <ul
                            style={{
                                fontSize: 12,
                                color: 'var(--text-muted)',
                                lineHeight: 1.6,
                                paddingLeft: 18
                            }}
                        >
                            <li>
                                <strong>HTML Files:</strong>
                                Auto-parses table sections, images, text, buttons, and styles directly into editable builder blocks.
                            </li>
                            <li>
                                <strong>PDF / Image Files:</strong>
                                Loads high-resolution mockup image into the QA Studio for side-by-side tracing & pixel comparison.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportFile