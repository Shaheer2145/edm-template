import React, { useState } from 'react';
import { X } from "lucide-react";
import "../../App.css";
import QAReference from "./QAReference";
import QAHealth from "./QAHealth";
import QAComparison from "./QAComparison"
import { qa_checkList } from '../../services/qachecklist';


const QAStudio = ({ isOpen, onClose, state }) => {
    const [currentStep, setCurrentStep] = useState('step-ref');
    const [referenceImage, setReferenceImage] = useState(null);
    const [opacity, setOpacity] = useState(0.5);
    const [isDiffMode, setIsDiffMode] = useState(false);
    const [checklist, setChecklist] = useState(qa_checkList);

    if (!isOpen) return null;


    const goToStep = (step) => {
        setCurrentStep(step);
    }

    const handleReferenceImage = (ref) => {
        if (!ref) return;

        if (ref.type === "image" || ref.type === "pdf") {
            setReferenceImage(ref.dataUrl);
        }
    }

    const handleOpacityChange = (val) => {
        setOpacity(val);
    }
    const handleDiffModeChange = (val) => {
        setIsDiffMode(val);
    }

    const handleChecklistChange = (id) => {
        setChecklist(prevCheckList =>
            prevCheckList.map(item =>
                item.id === id ?
                    { ...item, checked: !item.checked } : item
            )
        );
    }
    const handleAutoFixAll = () => {
        setChecklist(prevCheckList =>
            prevCheckList.map(item => ({ ...item, checked: true }))
        );
    }
    const handleClose = () => {
        onClose();
    }

    return (
        <div id="modal-qa-studio" className="modal-overlay">
            <div className="modal-card qa-card">
                <div className="modal-header">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                    >
                        <h2>QA & Outlook Testing Studio</h2>
                        <span id="validator-score-badge" className="health-score-pill">
                            Outlook Health: 100%
                        </span>
                    </div>
                    <button className="modal-close" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="qa-wizard-steps">
                    <button
                        className={`qa-step-btn 
                            ${currentStep === 'step-ref' ? 'active' : ''
                        }`}
                        data-step="step-ref"
                        onClick={() => goToStep('step-ref')}
                    >
                        <span className="step-num">1</span>
                        <span className="step-label">Reference Mockup</span>
                    </button>
                    <button
                        className={`qa-step-btn 
                            ${currentStep === 'step-compare' ? 'active' : ''
                        }`}
                        data-step="step-compare"
                        onClick={() => goToStep('step-compare')}
                    >
                        <span className="step-num">2</span>
                        <span className="step-label">Visual Comparison</span>
                    </button>
                    <button
                        className={`qa-step-btn 
                            ${currentStep === 'step-health' ? 'active' : ''
                        }`}
                        data-step="step-health"
                        onClick={() => goToStep('step-health')}
                    >
                        <span className="step-num">3</span>
                        <span className="step-label">Outlook Health Check</span>
                    </button>
                </div>

                <div className="modal-body qa-body">
                    {currentStep === 'step-ref' ? (
                        <QAReference
                            referenceImage={referenceImage}
                            onReferenceImageChange = {handleReferenceImage}
                            onNext={()=>goToStep('step-compare')}

                        />
                    ) : currentStep === 'step-compare' ? (
                        <QAComparison
                            state={state}
                            referenceImage={referenceImage}
                            opacity={opacity}
                            isDiffMode={isDiffMode}
                            onOpacityChange={handleOpacityChange}
                            onDiffModeChange={handleDiffModeChange}
                            onBack={() => goToStep('step-ref')}
                            onNext={() => goToStep('step-health')}

                        />
                    ) : (
                        <QAHealth
                            checklist={checklist}
                            onCheckListChange={handleChecklistChange}
                            onAutoFixAll={handleAutoFixAll}
                            onBack={()=>goToStep('step-compare')}
                         />
                    )}
                </div>
            </div>
        </div>
    )
}

export default QAStudio