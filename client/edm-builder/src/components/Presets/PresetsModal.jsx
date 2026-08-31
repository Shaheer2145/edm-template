import React from 'react';
import { X, Plus } from 'lucide-react';
import "../../App.css";

const PresetsModal = ({ isOpen, onClose, onSelectPreset }) => {

    if (!isOpen) return null;

    const handlePresetSelect = (presetId) => {
        if (onSelectPreset) {
            onSelectPreset(presetId);
        }
        onClose();
    };

    return (
        <div id="modal-presets" className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <h2>Select a Preset Template</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="presets-grid">
                        <div
                            className="preset-card" data-preset="empty-scratch"
                            onClick={() => handlePresetSelect('empty-scratch')}
                        >
                            <div
                                className="preset-preview empty-preview"
                                style={{
                                    backgroundColor: 'var(--bg-primary)',
                                    border: '2px dashed var(--border-color)'
                                }}
                            >
                                <Plus size={36} style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <div className="preset-info">
                                <h3>Start From Scratch</h3>
                                <p>An empty template canvas. Design your direct email template from scratch by dragging in sections and items.</p>
                            </div>
                        </div>
                        <div
                            className="preset-card"
                            data-preset="alfursan-gold-en"
                            onClick={() => handlePresetSelect('alfursan-gold-en')}
                        >
                            <div className="preset-preview gold-preview">
                                <div className="preview-banner"></div>
                                <div className="preview-heading"></div>
                                <div className="preview-text"></div>
                            </div>
                            <div className="preset-info">
                                <h3>Al Fursan Gold (English)</h3>
                                <p>Standard transactional / marketing email with top membership number bar, dynamic name, terms & conditions block, and golden theme footer links in LTR format.</p>
                            </div>
                        </div>
                        <div
                            className="preset-card"
                            data-preset="alfursan-gold-ar"
                            onClick={() => handlePresetSelect('alfursan-gold-ar')}
                        >
                            <div
                                className="preset-preview gold-preview"
                                style={{ direction: 'rtl' }}
                            >
                                <div className="preview-banner" style={{ backgroundColor: 'var(--gold)' }}></div>
                                <div className="preview-heading"></div>
                                <div className="preview-text"></div>
                            </div>
                            <div className="preset-info">
                                <h3>Al Fursan Gold (Arabic)</h3>
                                <p>Arabic translated campaign template with membership block, banner, body texts, and legal footer links formatted in RTL (Right-to-Left).</p>
                            </div>
                        </div>
                        <div
                            className="preset-card" data-preset="alfursan-gold-ur"
                            onClick={() => handlePresetSelect('alfursan-gold-ur')}
                        >
                            <div
                                className="preset-preview gold-preview"
                                style={{ direction: 'rtl' }}
                            >
                                <div className="preview-banner" style={{ backgroundColor: 'var(--gold)' }}></div>
                                <div className="preview-heading"></div>
                                <div className="preview-text"></div>
                            </div>
                            <div className="preset-info">
                                <h3>Al Fursan Gold (Urdu)</h3>
                                <p>Urdu translated email template featuring membership details, banner, main messages, and footer links formatted in RTL (Right-to-Left).</p>
                            </div>
                        </div>
                        <div
                            className="preset-card"
                            data-preset="basic-newsletter"
                            onClick={() => handlePresetSelect('basic-newsletter')}
                        >
                            <div className="preset-preview newsletter-preview">
                                <div className="preview-header-bar"></div>
                                <div className="preview-image"></div>
                                <div className="preview-heading"></div>
                                <div className="preview-text"></div>
                            </div>
                            <div className="preset-info">
                                <h3>Standard Newsletter</h3>
                                <p>A clean 1-column layout with header logo, hero image, body text block, CTA button, and social media footer links.</p>
                            </div>
                        </div>
                        <div
                            className="preset-card"
                            data-preset="product-promo"
                            onClick={() => handlePresetSelect('product-promo')}
                        >
                            <div className="preset-preview grid-preview">
                                <div className="preview-header-bar"></div>
                                <div className="preview-image-large"></div>
                                <div className="preview-grid-cols">
                                    <div className="col-pre"></div>
                                    <div className="col-pre"></div>
                                </div>
                            </div>
                            <div className="preset-info">
                                <h3>2-Column Product Showcase</h3>
                                <p>Ideal for highlighting features or products side-by-side. Includes hero area, 2-column feature blocks with images, description, buttons, and detailed footer.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PresetsModal
