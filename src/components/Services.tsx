import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  // Drag / Swipe State for pointer tracking
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const draggedRef = useRef(false);

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
    if (!isSlider || isHovered || isDragging) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isSlider, isHovered, isDragging, nextSlide]);

  const handleDragStart = (clientX: number) => {
    if (!isSlider) return;
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
    draggedRef.current = false;
    setIsHovered(true); // pause auto-play while sliding
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diffX = clientX - startX;

    // Apply rubber-band resistance at boundaries (first and last slides)
    if ((currentIndex === 0 && diffX > 0) || (currentIndex === maxIndex && diffX < 0)) {
      setDragOffset(diffX * 0.3);
    } else {
      setDragOffset(diffX);
    }

    if (Math.abs(diffX) > 10) {
      draggedRef.current = true;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Apply index change if dragged beyond a 60px threshold
    if (dragOffset < -60) {
      setCurrentIndex((prev) => (prev >= maxIndex ? prev : prev + 1));
    } else if (dragOffset > 60) {
      setCurrentIndex((prev) => (prev <= 0 ? prev : prev - 1));
    }

    setDragOffset(0);
    setIsHovered(false);

    // Use a small timeout so the click handler can intercept draggedRef.current
    setTimeout(() => {
      draggedRef.current = false;
    }, 50);
  };

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
          <div
            className="services-slider-container"
            style={{
              cursor: isSlider ? (isDragging ? 'grabbing' : 'grab') : 'default',
              userSelect: isDragging ? 'none' : 'auto'
            }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => {
              if (isDragging) {
                e.preventDefault();
                handleDragMove(e.clientX);
              }
            }}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            <div
              className="services-slider-track"
              style={{
                transform: isSlider
                  ? `translateX(calc(-${currentIndex * (100 / cardsToShow)}% + ${dragOffset}px))`
                  : 'none',
                flexWrap: isSlider ? 'nowrap' : 'wrap',
                transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {items.map((item, index) => (
                <div key={item.id} className="service-card-wrapper">
                  <ScrollReveal delay={0.2 + Math.min(index, 3) * 0.15}>
                    <div
                      className="service-card"
                      onClick={(e) => {
                        if (draggedRef.current) {
                          e.preventDefault();
                          return;
                        }
                        onServiceClick && onServiceClick(formatServiceId(item.title));
                      }}
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
