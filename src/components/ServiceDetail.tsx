import React from 'react';
import './ServiceDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useSection } from '../hooks/useSection';
import { getAssetPath } from '../utils/assetPath';
import LazyImage from './LazyImage';
import Loader from './Loader';

// Fallback data
import servicesData from '../data/servicesData.json';

interface ServiceDetailProps {
  onGetQuote: (id: string) => void;
  onBookNow: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ onGetQuote }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const { data: apiData, loading } = useSection('service', serviceId || '');

  // Merge: prefer backend, fallback to local JSON
  const normalizedId = serviceId?.replace(/\s+/g, '-');
  const fallback = serviceId ? ((servicesData as any)[serviceId] || (servicesData as any)[normalizedId || '']) : null;
  const service = apiData || (fallback ? { ...fallback, heroImage: fallback.heroImage } : null);

  if (loading) {
    return <Loader text="Loading Service Details" />;
  }

  if (!service) {
    return <div className="container" style={{ padding: '150px 20px' }}>Service not found</div>;
  }

  const heroImage   = service.heroImage   || fallback?.heroImage   || '';
  const title       = service.title       || fallback?.title       || '';
  const breadcrumb  = service.breadcrumb  || fallback?.breadcrumb  || '';
  const description = service.description || fallback?.description || '';
  const sections    = service.sections    || fallback?.sections    || [];

  return (
    <div className="service-detail">
      {/* Hero Section */}
      <section className="service-hero">
        <LazyImage
          src={getAssetPath(heroImage)}
          alt={title}
          className="service-hero-bg"
        />
        <div className="service-hero-overlay"></div>
        <div className="service-hero-content">
          <h1>{title}</h1>
          <p className="breadcrumb">{breadcrumb}</p>
        </div>
      </section>

      {/* Description Section */}
      <section className="service-info container">
        <h2 className="section-title">{title}</h2>
        <p className="service-description">{description}</p>
      </section>

      {/* Photo Sections */}
      {sections.map((section: { title: string; images: string[] }, index: number) => {
        const [mainTitle, subTitle] = section.title.split('(');
        return (
          <section key={index} className="photo-section container">
            <div className="section-header">
              <h3 className="shoot-title">
                {mainTitle.trim()}
                {subTitle && <span className="shoot-subtitle">({subTitle.replace(')', '')})</span>}
              </h3>
              {section.images.length > 3 && (
                <button
                  className="view-more-photos-btn"
                  onClick={() => navigate(`/services/${serviceId}/gallery/${index}`)}
                >
                  <span>View More Photos</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              )}
            </div>
            <div className="photo-grid">
              {section.images.slice(0, 3).map((img: string, i: number) => (
                <div key={i} className="photo-item">
                  <LazyImage src={getAssetPath(img)} alt={`${section.title} ${i + 1}`} />
                </div>
              ))}
            </div>
            {section.images.length > 3 && (
              <div className="mobile-view-more">
                <button
                  className="view-more-photos-btn"
                  onClick={() => navigate(`/services/${serviceId}/gallery/${index}`)}
                >
                  <span>View More Photos</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </section>
        );
      })}

      {/* CTA Button */}
      <div className="cta-container container">
        <button className="get-quote-btn" onClick={() => serviceId && onGetQuote(serviceId)}>Get a Quote</button>
      </div>
    </div>
  );
};

export default ServiceDetail;
