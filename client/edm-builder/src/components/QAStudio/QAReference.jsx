import React, { useRef } from 'react';
import { ArrowRight , Upload ,Image } from "lucide-react";
import { EmailImporter } from '../../services/import';
import "../../App.css";


const QAReference = ({referenceImage, onReferenceImageChange, onNext}) => {

    const fileInput = useRef(null);

    const selectFile = () => {
        fileInput.current.click();
    }

    const handleFileInput = (file) => {
        if(!file) return null;
        EmailImporter.readReferenceFile(file, (result) => {
            if(!result) return null;
            onReferenceImageChange(result);
        })
    }
    const handleFileSelect = (e) => {
        handleFileInput(e.target.files[0]);
    }

    const handleNextBtn = () => {
        onNext();
    }

    return (
        <div id="panel-step-ref" className="qa-step-panel">
            <div className="ref-step-wrapper">
                <div className="ref-upload-card">
                    <Image className="ref-card-icon"/>
                    <h3>Select Target Reference Design</h3>

                    <p>Upload your client design mockup (PNG, JPG, PDF) to compare against your builder template.</p>
                    <input 
                        ref={fileInput}
                        type="file" 
                        id="qa-ref-file-input" 
                        accept=".png,.jpg,.jpeg,.webp,.pdf,.html" 
                        className="hidden" 
                        onChange={handleFileSelect}
                    />
                    <button 
                        id="btn-qa-upload-ref" 
                        className="btn btn-primary" 
                        style={{marginTop:12}}
                        onClick={selectFile}
                    >
                        <Upload size={20}/> Upload Reference Image / PDF
                    </button>
                </div>

                <div className="ref-preview-card">
                    <h4>Active Reference Preview:</h4>
                    <div className="ref-img-frame">
                        {referenceImage ? (
                            <img 
                                id="qa-reference-img" 
                                src={referenceImage} 
                                alt="Reference Design" 
                            />
                        ) : (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: 'var(--text-muted)',
                                fontSize: '13px',
                                textAlign: 'center',
                                padding: '20px'
                            }}>
                                Click "Upload Reference Image / PDF" to select a design file
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="wizard-footer">
                <button 
                    className="btn btn-primary" 
                    onClick={handleNextBtn}
                >
                    <span>Next: Visual Comparison</span> <ArrowRight size={20}/>
                </button>
            </div>
        </div>
    )
}

export default QAReference