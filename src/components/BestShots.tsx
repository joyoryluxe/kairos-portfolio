import React, { useState, useEffect, useCallback } from 'react';
import './BestShots.css';
import { getAssetPath } from '../utils/assetPath';
import ScrollReveal from './ScrollReveal';
import LazyImage from './LazyImage';
import { useSection } from '../hooks/useSection';

// Fallback data
import landingData from '../data/landingData.json';

const BestShots: React.FC = () => {
  const { data: apiData } = useSection('home', 'best-shots');

  const [showAll, setShowAll] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const title = apiData?.title || landingData.bestShots.title;
  const items = (apiData?.bestShotItems && apiData.bestShotItems.length > 0)
    ? apiData.bestShotItems
    : landingData.bestShots.items;

  const visibleItems = showAll ? items : items.slice(0, 6);

  const openViewer = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % items.length);
    }
  }, [selectedIndex, items.length]);

  const prevImage = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
    }
  }, [selectedIndex, items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeViewer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, nextImage, prevImage]);

  return (
    <section className="best-shots-section">
      <div className="container">
        <ScrollReveal delay={0.1}>
          <h2 className="best-shots-title">{title}</h2>
        </ScrollReveal>

        <div className="best-shots-grid">
          {visibleItems.map((item, index) => {
            const resolvedSrc = getAssetPath(item.image);
            return (
              <ScrollReveal key={item.id} delay={0.1 + (index % 6) * 0.15}>
                <div
                  className="best-shot-card"
                  onClick={() => openViewer(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openViewer(index)}
                  aria-label="Click to view full photo"
                >
                  <LazyImage src={resolvedSrc} alt={`Best shot ${item.id}`} />
                  <div className="shot-overlay">
                    <div className="overlay-content">
                      <span className="view-text">VIEW PHOTO</span>
                      <div className="view-line"></div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {items.length > 6 && (
          <ScrollReveal delay={0.2}>
            <div className="best-shots-actions">
              <button
                className="view-more-btn"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'View Less' : 'View More'}
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Full Screen Viewer */}
      {selectedIndex !== null && (
        <div className="gallery-viewer">
          <div className="viewer-overlay" onClick={closeViewer}></div>
          
          <button className="viewer-close" onClick={closeViewer}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="viewer-main">
            <button className="viewer-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="viewer-image-container">
              <img 
                src={getAssetPath(items[selectedIndex].image)} 
                alt={`Best shot ${items[selectedIndex].id} full view`} 
                className="viewer-image"
              />
              <div className="viewer-counter">
                {selectedIndex + 1} / {items.length}
              </div>
            </div>

            <button className="viewer-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="viewer-thumbnails-wrapper">
            <div className="viewer-thumbnails">
              {items.map((item, i) => (
                <div 
                  key={item.id} 
                  className={`thumbnail-item ${selectedIndex === i ? 'active' : ''}`}
                  onClick={() => setSelectedIndex(i)}
                >
                  <img src={getAssetPath(item.image)} alt={`Thumbnail ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BestShots;
