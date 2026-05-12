import React, { useState, useEffect, useCallback } from 'react';
import './Services.css';
import { getAssetPath } from '../utils/assetPath';
import ScrollReveal from './ScrollReveal';
import LazyImage from './LazyImage';
import { useSection } from '../hooks/useSection';

// Fallback data
import data from '../data/landingData.json';

interface ServicesProps {
  onServiceClick?: (serviceId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onServiceClick }) => {
  const { data: apiData } = useSection('home', 'services');

  // Use backend data when available, fallback to local JSON
  const title = apiData?.title || data.services.title;
  const items = (apiData?.serviceItems && apiData.serviceItems.length > 0)
    ? apiData.serviceItems
    : data.services.items;

  const isSlider = items.length > 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) setCardsToShow(1);
      else if (window.innerWidth <= 1024) setCardsToShow(2);
      else setCardsToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - cardsToShow);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isSlider || isHovered) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isSlider, isHovered, nextSlide]);

  const formatServiceId = (label: string) => {
    return label.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <section className="services-section">
      <div className="container">
        <ScrollReveal delay={0.1}>
          <h2 className="services-title">{title}</h2>
        </ScrollReveal>

        <div
          className="services-slider-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="services-slider-container">
            <div
              className="services-slider-track"
              style={{
                transform: isSlider ? `translateX(-${currentIndex * (100 / cardsToShow)}%)` : 'none',
                flexWrap: isSlider ? 'nowrap' : 'wrap'
              }}
            >
              {items.map((item, index) => (
                <div key={item.id} className="service-card-wrapper">
                  <ScrollReveal delay={0.2 + Math.min(index, 3) * 0.15}>
                    <div
                      className="service-card"
                      onClick={() => onServiceClick && onServiceClick(formatServiceId(item.title))}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="service-image-container">
                        <LazyImage src={getAssetPath(item.image)} alt={item.title} />
                        <div className="service-overlay">
                          <h3 className="service-card-title">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>

          {isSlider && (
            <div className="services-slider-dots">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  className={`services-slider-dot ${currentIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
