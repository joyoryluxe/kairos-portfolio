import React from 'react';
import './PricingPage.css';
import { getAssetPath } from '../utils/assetPath';
import { useSection } from '../hooks/useSection';

// Fallback data
import pricingData from '../data/pricingData.json';

interface PricingPageProps {
  onPricingSelect: (id: string) => void;
  onBookNow: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onPricingSelect }) => {
  const { data: apiData } = useSection('pricing', 'pricing-list');

  // Use backend pricingCards if available, else build from local JSON
  const categories = (apiData?.pricingCards && apiData.pricingCards.length > 0)
    ? apiData.pricingCards
    : Object.values(pricingData).map((c: any) => ({
        id: c.id,
        title: c.title,
        cardImage: c.cardImage,
      }));

  return (
    <div className="pricing-page">
      <div className="container">
        <div className="pricing-header">
          <h1 className="pricing-title">Pricing</h1>
          <div className="title-underline"></div>
        </div>

        <div className="pricing-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="pricing-card"
              onClick={() => onPricingSelect(category.id)}
            >
              <div className="card-image-wrapper">
                <img
                  src={getAssetPath(category.cardImage)}
                  alt={category.title}
                  className="card-image"
                />
              </div>
              <h2 className="card-title">{category.title}</h2>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <button
            className="book-session-btn"
            onClick={() => {
              const phoneNumber = "918780983966";
              const message = "Hello Kairos Studio, I am interested in getting a Package details. Could you please provide more details?";
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
            }}
          >
            <span>Request a Quote</span>
            <div className="arrow-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
