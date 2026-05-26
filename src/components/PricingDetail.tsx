import React from 'react';
import './PricingDetail.css';
import { useParams } from 'react-router-dom';
import { useSection } from '../hooks/useSection';
import { getAssetPath } from '../utils/assetPath';
import Loader from './Loader';

// Fallback data
import pricingData from '../data/pricingData.json';

interface Package {
  name: string;
  features: string[];
  price: string;
}

interface AddOn {
  name: string;
  price: string;
}

const PricingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: apiData, loading } = useSection('pricing', id || '');

  // Merge: prefer backend, fall back to local JSON
  const normalizedId = id?.replace(/\s+/g, '-');
  const fallback = id ? ((pricingData as any)[id] || (pricingData as any)[normalizedId || '']) : null;
  const data = apiData || fallback;

  const handlePackageSelect = (pkgName: string, price: string) => {
    const phoneNumber = "918780983966";
    const title = data?.title || '';
    const message = `Hello Kairos Studio, I am interested in booking the "${pkgName}" package (${price}) for ${title}. Could you please provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return <Loader text="Loading Pricing Packages" />;
  }

  if (!data) {
    return (
      <div className="pricing-detail-page">
        <div className="container">
          <div className="custom-quote-container">
            <div className="custom-quote-content">
              <h2 className="custom-quote-title">Tailored just for you</h2>
              <p className="custom-quote-description">
                Every story is unique, and some moments require a more personalized touch.
                Whether it's a specific theme, multiple locations, or a large-scale event,
                we're here to create a package that perfectly fits your vision.
              </p>

              <div className="contact-options">
                <div className="contact-option-card">
                  <div className="option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <h3>Give us a Call</h3>
                  <p>Speak directly with our team to discuss your requirements.</p>
                  <a href="tel:87809 83966" className="contact-link">+91 87809 83966</a>
                </div>

                <div className="contact-option-card highlighted">
                  <div className="option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <h3>Direct Inquiry</h3>
                  <p>Send us a message and we'll get back to you with a custom quote.</p>
                  <button
                    className="contact-btn"
                    onClick={() => {
                      const phoneNumber = "918780983966";
                      const message = "Hello Kairos Studio, I am interested in getting a custom quote for a photoshoot. Could you please provide more details?";
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
                    }}
                  >
                    Request Quote
                  </button>
                </div>

                <div className="contact-option-card">
                  <div className="option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <h3>Email Us</h3>
                  <p>Drop us an email with your project details and moodboard.</p>
                  <a href="mailto:hello@kairosstudio.in" className="contact-link">hello@kairosstudio.in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const heroImage   = data.heroImage   || (fallback?.heroImage)   || '';
  const title       = data.title       || (fallback?.title)       || '';
  const subtitle    = data.subtitle    || (fallback?.subtitle)    || '';
  const description = data.description || (fallback?.description) || '';
  const packages: Package[]  = data.packages  || fallback?.packages  || [];
  const addOns: AddOn[]      = data.addOns    || fallback?.addOns    || [];
  const notes: string[]      = data.notes     || fallback?.notes     || [];

  return (
    <div className="pricing-detail-page">
      {/* Hero Section */}
      <section className="pricing-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${getAssetPath(heroImage)})` }}>
        <div className="pricing-hero-content">
          <h1>{title}</h1>
        </div>
      </section>

      <div className="container">
        {/* Intro Section */}
        <div className="pricing-intro">
          <h2 className="pricing-section-title">Pricing</h2>
          <div className="intro-text">
            <p className="subtitle">{subtitle}</p>
            <h3 className="shoot-title">{title}</h3>
            <p className="description">"{description}"</p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="packages-grid">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="package-card"
              onClick={() => handlePackageSelect(pkg.name, pkg.price)}
            >
              <div className="package-card-content">
                <h4 className="package-name">{pkg.name}</h4>
                <ul className="package-features">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button className="package-price-btn">
                <span className="price-text">{pkg.price}</span>
                <span className="book-text">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Book via WhatsApp
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="add-ons-section">
          <div className="section-label">
            <h3>Add-Ons &amp; Upgrades</h3>
          </div>
          <div className="add-ons-list">
            {addOns.map((addon, index) => (
              <p key={index} className="add-on-item">
                <span className="add-on-name">{addon.name}</span> — <span className="add-on-price">{addon.price}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="notes-section">
          <div className="section-label dark">
            <h3>Important Notes</h3>
          </div>
          <ul className="notes-list">
            {notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingDetail;
