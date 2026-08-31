import React from 'react'
import { ArrowLeft, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import "../../App.css";

const QAHealth = ({ checklist = [], onCheckListChange, onAutoFixAll, onBack }) => {
    const total = checklist.length;
    const passed = checklist.filter((item) => item.checked).length;
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;
    const allPassed = total > 0 && passed === total;

    const scoreTone = allPassed ? 'var(--health-good, #10b981)' : score >= 50 ? 'var(--health-warn, #f59e0b)' : 'var(--health-bad, #ef4444)';

    return (
        <div id="panel-step-health" className="qa-step-panel">
            <div className="health-step-wrapper">
                <div className="health-summary-banner">
                    <div
                        className="health-score-big"
                        id="health-big-score"
                        style={{ color: scoreTone, borderColor: scoreTone, backgroundColor: 'transparent' }}
                    >
                        {score}%
                    </div>
                    <div className="health-summary-text">
                        <h3 id="health-summary-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {allPassed ? <CheckCircle2 size={20} style={{ color: scoreTone }} /> : <AlertTriangle size={20} style={{ color: scoreTone }} />}
                            {allPassed ? 'Outlook Compatibility Verified' : `${total - passed} Check${total - passed === 1 ? '' : 's'} Pending`}
                        </h3>
                        <p id="health-summary-desc">
                            {allPassed
                                ? 'Your code is 100% table-based and safe for Outlook desktop copying and sending.'
                                : `${passed} of ${total} checks passed. Review the pending items below or run Auto-Fix to mark them as verified.`}
                        </p>
                        <button
                            id="btn-autofix-all"
                            className="btn btn-primary"
                            style={{ marginTop: 10 }}
                            onClick={onAutoFixAll}
                            disabled={allPassed}
                        >
                            <Zap size={16} /> {allPassed ? 'All Issues Fixed' : 'Auto-Fix All Issues Now'}
                        </button>
                    </div>
                </div>

                <div className="auditor-results-list" id="auditor-results-list">
                    {checklist.map((item) => (
                        <div
                            key={item.id}
                            className={`audit-card ${item.checked ? 'audit-pass' : 'audit-warning'}`}
                            onClick={() => onCheckListChange && onCheckListChange(item.id)}
                            style={{ cursor: 'pointer' }}
                            title="Click to toggle this check"
                        >
                            <div className="audit-card-head">
                                <span className="audit-card-title">{item.label}</span>
                                <span className="audit-badge">
                                    {item.checked ? 'PASS' : 'PENDING'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="wizard-footer">
                <button
                    className="btn btn-secondary"
                    onClick={onBack}
                >
                    <ArrowLeft size={20} /> Back
                </button>
            </div>
        </div>
    )
}

export default QAHealth
