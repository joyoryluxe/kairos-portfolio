import React from 'react';
import './Connect.css';
import landingData from '../data/landingData.json';

interface ConnectProps {
  onBookNow?: () => void;
}

const Connect: React.FC<ConnectProps> = ({ onBookNow }) => {
  const { connect } = landingData;

  return (
    <section className="connect-section">
      <div className="container connect-container">
        <div className="connect-left">
          <h2 className="connect-title">Let's<br />Connect</h2>
        </div>
        
        <div className="connect-right">
          <div className="contact-details-wrapper">
            <div className="contact-info">
              <p className="contact-phone">{connect.phone}</p>
              <a href={`mailto:${connect.email}`} className="contact-email">{connect.email}</a>
            </div>
            
            <div className="contact-address">
              <p>{connect.address}</p>
            </div>

            <div className="booking-cta-wrapper">
              <button className="booking-cta-button" onClick={onBookNow}>
                <span>Book Your Session</span>
                <div className="arrow-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connect;
