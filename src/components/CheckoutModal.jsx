import { useState } from 'react';
import { formatPrice } from '../utils/compatibilityEngine';

export default function CheckoutModal({ selectedComponents, totalPrice, onClose }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const buildSummary = Object.entries(selectedComponents)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k.toUpperCase()}: ${v.name} - ${formatPrice(v.price)}`)
            .join('\n');

        formData.append('build_details', buildSummary);
        formData.append('total_price', formatPrice(totalPrice));

        const currentOrderNumber = Math.floor(100 + Math.random() * 900); // Random order number
        fetch('https://formsubmit.co/ajax/nguyenphuc032k5@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                _subject: `New PC Order #${currentOrderNumber}! Total: ${formatPrice(totalPrice)}`,
                "Order Number": `#${currentOrderNumber}`,
                "Customer Name": formData.get('name'),
                "Phone Number": formData.get('phone'),
                "Address": formData.get('address'),
                "Notes": formData.get('note'),
                "Ordered Items": buildSummary,
                "Estimated Total": formatPrice(totalPrice),
                _autoresponse: "Thank you for your order. We have received it and will contact you shortly.",
                _template: "table"
            })
        })
            .then(res => res.json())
            .then((data) => {
                if (data.success) {
                    setSuccess(true);
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .catch((error) => {
                console.error(error);
                alert('An error occurred while sending your request. Please try again later.');
                setLoading(false);
            });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Confirm PC Order</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {success ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h4>Order submitted successfully!</h4>
                            <p>We have received your configuration details. Semcomputer staff will contact you shortly via phone to advise and proceed with payment.</p>
                            <p className="note" style={{ fontSize: '0.85rem', color: '#888', marginTop: '10px' }}>
                                Note: If you do not receive an email confirmation, please check your spam folder (for the administrator).
                            </p>
                            <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={onClose}>Close</button>
                        </div>
                    ) : (
                        <>
                            <p className="checkout-subtitle">Please fill in your information for us to contact and confirm your bill.</p>
                            <form className="checkout-form" onSubmit={handleSubmit} data-netlify="true" name="order-form">
                                <input type="hidden" name="form-name" value="order-form" />
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" name="name" required placeholder="Enter your name" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" name="phone" required placeholder="Enter phone number for contact" />
                                </div>
                                <div className="form-group">
                                    <label>Shipping Address</label>
                                    <textarea name="address" rows="2" placeholder="Enter your address (Optional)"></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Additional Notes</label>
                                    <textarea name="note" rows="2" placeholder="Example: Want advice on LED, RAM upgrade (Optional)..."></textarea>
                                </div>

                                <div className="checkout-summary">
                                    <div className="checkout-total">
                                        <span>Estimated Total:</span>
                                        <span className="amount">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                    <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading}>
                                        {loading ? 'Sending...' : 'Submit PC Order Request'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
