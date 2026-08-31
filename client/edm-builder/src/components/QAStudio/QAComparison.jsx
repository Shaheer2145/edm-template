import React, { useMemo } from 'react';
import { FileImage, Code, ArrowRight, ArrowLeft } from "lucide-react";
import { EmailCompiler } from '../../services/compile';
import "../../App.css";


const QAComparison = ({ state, referenceImage, opacity, isDiffMode, onOpacityChange, onDiffModeChange, onBack, onNext }) => {

    const handleBackBtn = () => {
        onBack();
    }
    const handleNextBtn = () => {
        onNext();
    }

    const hasCanvasContent = Boolean(
        state && (state.importedRawHTML || (state.sections && state.sections.length > 0))
    );

    const compiledHtml = useMemo(() => {
        if (!state || !hasCanvasContent) return '';
        try {
            return EmailCompiler.compile(state);
        } catch (err) {
            console.error('QA comparison compile failed:', err);
            return '';
        }
    }, [state, hasCanvasContent]);

    return (
        <div id="panel-step-compare" className="qa-step-panel">
            <div className="qa-split-container">
                <div className="qa-pane" id="qa-left-pane">
                    <div className="pane-title"><FileImage size={20} /> Original Reference Design</div>
                    <div className="pane-content">
                        {referenceImage ? (
                            <img
                                id="qa-reference-img-split"
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
                                fontSize: '13px'
                            }}>
                                No reference image uploaded
                            </div>
                        )}
                    </div>
                </div>
                <div className="qa-pane" id="qa-right-pane">
                    <div className="pane-title">
                        <Code size={20} />
                        Live Builder Template
                    </div>
                    <div className="pane-content">
                        {compiledHtml ? (
                            <div className="qa-live-wrapper">
                                <iframe
                                    id="qa-preview-frame"
                                    className="qa-iframe"
                                    title="QA Preview"
                                    srcDoc={compiledHtml}
                                    sandbox="allow-same-origin"
                                ></iframe>
                                {referenceImage && (
                                    <img
                                        id="qa-reference-overlay"
                                        className="qa-reference-overlay"
                                        src={referenceImage}
                                        alt="Reference overlay"
                                        style={{
                                            opacity: opacity,
                                            mixBlendMode: isDiffMode ? 'difference' : 'normal'
                                        }}
                                    />
                                )}
                            </div>
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
                                The canvas is empty — add sections or import a template to compare.
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <div
                className="overlay-toolbar"
                style={{ borderTop: '1px solid var(--border-color)' }}
            >
                <div
                    className="slider-group"
                    style={{ width: 280 }}
                >
                    <label
                        style={{ fontSize: 12, color: 'var(--text-muted)' }}
                    >
                        Overlay Opacity:
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={opacity}
                        id="qa-opacity-slider"
                        disabled={!referenceImage || !compiledHtml}
                        onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                    />
                    <span id="qa-opacity-val" className="slider-value">{Math.round(opacity * 100)}%</span>
                </div>
                <label
                    className="checkbox-label"
                    style={{ fontSize: 12, marginLeft: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <input
                        type="checkbox"
                        id="qa-diff-mode"
                        checked={isDiffMode}
                        disabled={!referenceImage || !compiledHtml}
                        onChange={(e) => onDiffModeChange(e.target.checked)}
                    />
                    <span>Color Difference Mode</span>
                </label>
            </div>

            <div className="wizard-footer">
                <button
                    className="btn btn-secondary"
                    onClick={handleBackBtn}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleNextBtn}
                >
                    <span>Next: Outlook Health Check</span>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>

    )
}

export default QAComparison
