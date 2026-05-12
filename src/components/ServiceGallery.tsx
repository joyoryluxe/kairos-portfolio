import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import servicesData from '../data/servicesData.json';
import { getAssetPath } from '../utils/assetPath';
import LazyImage from './LazyImage';
import './ServiceGallery.css';

const ServiceGallery: React.FC = () => {
  const { serviceId, sectionIndex } = useParams<{ serviceId: string, sectionIndex: string }>();
  const navigate = useNavigate();

  const service = serviceId ? (servicesData as any)[serviceId] : null;
  const section = service && sectionIndex ? service.sections[parseInt(sectionIndex)] : null;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const images = section?.images || [];

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
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  }, [selectedIndex, images.length]);

  const prevImage = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
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

  if (!service || !section) {
    return <div className="container" style={{ padding: '150px 20px' }}>Gallery not found</div>;
  }

  const [mainTitle, subTitle] = section.title.split('(');

  return (
    <div className="service-gallery-page">
      <div className="gallery-header container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Service
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
                src={getAssetPath(images[selectedIndex])} 
                alt={`${section.title} full view`} 
                className="viewer-image"
              />
              <div className="viewer-counter">
                {selectedIndex + 1} / {images.length}
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
              {images.map((img: string, i: number) => (
                <div 
                  key={i} 
                  className={`thumbnail-item ${selectedIndex === i ? 'active' : ''}`}
                  onClick={() => setSelectedIndex(i)}
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
