import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/emailConfig';
import './BookingModal.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    message: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const templateParams = {
      email: form.email,
      from_name: `${form.firstName} ${form.lastName}`,
      from_email: form.email,
      phone: form.phone,
      address: form.address,
      message: form.message,
      title: 'Booking Request',
    };

    try {
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      // send notification to yourself (new)
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.NOTIFY_TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );


      setStatus('success');
      setForm({ firstName: '', lastName: '', email: '', phone: '', address: '', message: '' });
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>

        <div className="form-header">
          <h2 className="form-title">Book us now</h2>
          <p className="form-address">Jai Maadi Bunglows, 7, Aarohi Club Rd, opp. Aarohi viviana, <br />South Bopal, Ahmedabad, Gujarat 380058</p>
        </div>

        {status === 'success' && (
          <div className="form-status success">
            ✅ Booking request sent! We'll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="form-status error">
            ❌ Something went wrong. Please try again or contact us directly.
          </div>
        )}

        <form ref={formRef} className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter Your First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter Your Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter Your Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter Your Address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Tell us about your shoot..."
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
