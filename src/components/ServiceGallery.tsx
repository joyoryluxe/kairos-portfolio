import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import servicesData from '../data/servicesData.json';
import { getAssetPath } from '../utils/assetPath';
import LazyImage from './LazyImage';
import { useSection } from '../hooks/useSection';
import Loader from './Loader';
import './ServiceGallery.css';

const ServiceGallery: React.FC = () => {
  const { serviceId, sectionIndex } = useParams<{ serviceId: string, sectionIndex: string }>();
  const navigate = useNavigate();

  const { data: apiData, loading } = useSection('service', serviceId || '');

  const normalizedId = serviceId?.replace(/\s+/g, '-');
  const fallback = serviceId ? ((servicesData as any)[serviceId] || (servicesData as any)[normalizedId || '']) : null;
  const service = apiData || fallback;
  const section = service && sectionIndex && service.sections ? service.sections[parseInt(sectionIndex)] : null;
  const images = section?.images || [];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Swipe logic for the fullscreen viewer
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSwipeStart = (clientX: number) => {
    if (zoomLevel > 1) return;
    setTouchStartX(clientX);
    setTouchDeltaX(0);
    setIsSwiping(true);
  };

  const handleSwipeMove = (clientX: number) => {
    if (!isSwiping || touchStartX === null) return;
    const diff = clientX - touchStartX;
    setTouchDeltaX(diff);
  };

  const handleSwipeEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    if (touchDeltaX < -80) {
      nextImage();
    } else if (touchDeltaX > 80) {
      prevImage();
    }

    setTouchStartX(null);
    setTouchDeltaX(0);
  };

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
      setSelectedIndex((selectedIndex + 1) % images.length);
      setZoomLevel(1);
    }
  }, [selectedIndex, images.length]);

  const prevImage = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
      setZoomLevel(1);
    }
  }, [selectedIndex, images.length]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <Loader text="Loading Gallery Photos" />;
  }

  if (!service || !section) {
    return <div className="container" style={{ padding: '150px 20px', textAlign: 'center' }}>Gallery not found</div>;
  }

  const [mainTitle, subTitle] = section.title.split('(');

  return (
    <div className="service-gallery-page">
      <div className="gallery-header container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Service</span>
        </button>
        <div className="gallery-title-wrapper">
          <h1>
            {mainTitle.trim()}
            {subTitle && <span className="gallery-subtitle">({subTitle.replace(')', '')})</span>}
          </h1>
          <p className="gallery-breadcrumb">{service.title} &gt; {mainTitle.trim()}</p>
        </div>
      </div>

      <div className="gallery-container container">
        <div className="masonry-grid">
          {images.map((img: string, i: number) => (
            <div key={i} className="masonry-item" onClick={() => openViewer(i)}>
              <LazyImage src={getAssetPath(img)} alt={`${section.title} ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Viewer */}
      {selectedIndex !== null && (
        <div className={`gallery-viewer ${isFullscreen ? 'is-fullscreen' : ''}`}>
          <div className="viewer-overlay" onClick={closeViewer}></div>

          <div className="viewer-header">
            <div className="viewer-counter">
              {selectedIndex + 1} / {images.length}
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

            <div
              className="viewer-image-container"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => handleSwipeStart(e.clientX)}
              onMouseMove={(e) => {
                if (isSwiping) {
                  e.preventDefault();
                  handleSwipeMove(e.clientX);
                }
              }}
              onMouseUp={handleSwipeEnd}
              onMouseLeave={handleSwipeEnd}
              onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleSwipeMove(e.touches[0].clientX)}
              onTouchEnd={handleSwipeEnd}
              style={{
                touchAction: zoomLevel === 1 ? 'pan-y' : 'auto',
                overflow: zoomLevel === 1 ? 'hidden' : 'auto'
              }}
            >
              <img
                src={getAssetPath(images[selectedIndex])}
                alt={`${section.title} full view`}
                className="viewer-image"
                style={{
                  maxWidth: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`,
                  maxHeight: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`,
                  cursor: 'default',
                  transform: isSwiping && zoomLevel === 1 ? `translateX(${touchDeltaX}px)` : 'none',
                  transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
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
              {images.map((img: string, i: number) => (
                <div
                  key={i}
                  className={`thumbnail-item ${selectedIndex === i ? 'active' : ''}`}
                  onClick={() => { setSelectedIndex(i); setZoomLevel(1); }}
                >
                  <img src={getAssetPath(img)} alt={`Thumbnail ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceGallery;
