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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const title = apiData?.title || landingData.bestShots.title;
  const items = (apiData?.bestShotItems && apiData.bestShotItems.length > 0)
    ? apiData.bestShotItems
    : landingData.bestShots.items;

  const visibleItems = showAll ? items : items.slice(0, 6);

  const openViewer = (index: number) => {
    setSelectedIndex(index);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setSelectedIndex(null);
    setZoomLevel(1);
    document.body.style.overflow = 'auto';
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));

  const nextImage = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % items.length);
      setZoomLevel(1);
    }
  }, [selectedIndex, items.length]);

  const prevImage = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
      setZoomLevel(1);
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
        <div className={`gallery-viewer ${isFullscreen ? 'is-fullscreen' : ''}`}>
          <div className="viewer-overlay" onClick={closeViewer}></div>

          <div className="viewer-header">
            <div className="viewer-counter">
              {selectedIndex + 1} / {items.length}
            </div>
            <div className="viewer-toolbar">
              <button className="toolbar-btn" onClick={zoomIn} title="Zoom In">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <button className="toolbar-btn" onClick={zoomOut} title="Zoom Out">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <button className="toolbar-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
              <button className="toolbar-btn close" onClick={closeViewer} title="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="viewer-main">
            <button className="viewer-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="viewer-image-container" onClick={(e) => e.stopPropagation()}>
              <img
                src={getAssetPath(items[selectedIndex].image)}
                alt={`Best shot ${items[selectedIndex].id} full view`}
                className="viewer-image"
                style={{
                  maxWidth: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`,
                  maxHeight: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`,
                  cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in'
                }}
                onClick={() => zoomLevel > 1 ? setZoomLevel(1) : setZoomLevel(2)}
              />
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
                  onClick={() => { setSelectedIndex(i); setZoomLevel(1); }}
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
