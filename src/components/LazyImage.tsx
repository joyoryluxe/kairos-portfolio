import React, { useRef, useState, useEffect } from 'react';
import './LazyImage.css';
import imageManifest from '../data/imageManifest.json';
import { getAssetPath } from '../utils/assetPath';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Extract filename from src (e.g., "/portfolio/product.png" -> "product.png")
  const fileName = src.split('/').pop() || '';
  const manifestData = (imageManifest as any)[fileName];

  const placeholder = manifestData?.placeholder;
  const webpSrc = manifestData?.webp ? getAssetPath(manifestData.webp) : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '400px 0px', // Load earlier for smoother experience
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`lazy-image-wrapper ${className}`} style={style}>
      {/* Blurred Placeholder */}
      {placeholder && !isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className="lazy-image-placeholder"
          aria-hidden="true"
        />
      )}

      {/* Shimmer fallback if no placeholder */}
      {!placeholder && !isLoaded && !hasError && (
        <div className="lazy-image-skeleton">
          <div className="lazy-image-shimmer" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="lazy-image-error">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Image unavailable</span>
        </div>
      )}

      {/* Actual image — only mounted when in view */}
      {isInView && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            className={`lazy-image-img ${isLoaded ? 'loaded' : ''}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => { setHasError(true); setIsLoaded(true); }}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

export default LazyImage;
