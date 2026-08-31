import React ,{useState} from 'react';
import { X, SendHorizontal, CheckCircle2 } from 'lucide-react';
import "../../App.css";


const SendTemplateModal = ({ isOpen, onClose, htmlCode, templateName = 'Email Template' }) => {

    const [sending, setSending] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [fromEmail, setFromEmail] = useState('');
    const [subject, setSubject] = useState('');

    if (!isOpen) return null;

    const handleSendTemplate = async () => {
        if (!recipient) {
            alert('Please enter recipient email');
            return;
        }

        if (!subject) {
            alert('Please enter email subject');
            return;
        }

        try {
            setSending(true);
            const response = await fetch('http://localhost:3001/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: fromEmail,
                    to: recipient,
                    subject: subject,
                    htmlContent: htmlCode,
                })

            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to send email");
            }
            alert("Email sent successfully");
            onClose();
        }
        catch (error) {
            console.error(`Failed to send message`, error);
            alert('Failed to send email. Please check the console for more details.');
        }
        finally {
            setSending(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card send-template-card">

                {/* Header */}
                <div className="modal-header">
                    <h2>Send Template</h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close Modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">

                    {/* From */}
                    <div className="form-group">
                        <label htmlFor="send-from">
                            From
                        </label>
                        <input
                            id="send-from"
                            type="email"
                            className="form-control"
                            placeholder="your-email@company.com"
                            value={fromEmail}
                            onChange={(e) => setFromEmail(e.target.value)}
                        />
                    </div>

                    {/* To */}
                    <div className="form-group">
                        <label htmlFor="send-to">
                            To
                        </label>
                        <input
                            id="send-to"
                            type="email"
                            className="form-control"
                            placeholder="recipient@gmail.com"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>


                    {/* Subject */}
                    <div className="form-group">
                        <label htmlFor="send-subject">
                            Subject
                        </label>
                        <input
                            id="send-subject"
                            type="text"
                            className="form-control"
                            placeholder="Welcome Email"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>


                    <div className="send-divider" />


                    {/* Template information */}
                    <div className="template-info">

                        <div className="template-info-row">
                            <span>Template:</span>
                            <strong>{templateName}</strong>
                        </div>

                        <div className="template-info-row">
                            <span>Status:</span>
                            <strong className="ready-status">
                                <CheckCircle2 size={16} />
                                Ready to send
                            </strong>
                        </div>

                    </div>

                </div>


                {/* Footer */}
                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSendTemplate}
                        disabled={sending}
                    >
                        <SendHorizontal size={18} />
                        {sending ? 'Sending...' : 'Send Template'}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default SendTemplateModal