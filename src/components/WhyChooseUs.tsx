import React, { useState } from 'react';
import './WhyChooseUs.css';
import { getAssetPath } from '../utils/assetPath';
import ScrollReveal from './ScrollReveal';
import Counter from './Counter';
import LazyImage from './LazyImage';
import ImageLightbox from './ImageLightbox';
import { useSection } from '../hooks/useSection';

// Fallback data
import landingData from '../data/landingData.json';

interface WhyChooseUsProps {
  onAboutUs: () => void;
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onAboutUs }) => {
  const { data: apiData } = useSection('home', 'why-choose-us');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fallback = landingData.whyChooseUs;

  const title = apiData?.title || fallback.title;
  const stats = (apiData?.stats && apiData.stats.length > 0) ? apiData.stats : fallback.stats;
  const about = apiData?.about || fallback.about;

  const aboutImageSrc = getAssetPath(about.image);

  return (
    <section className="why-choose-us-section">
      <ScrollReveal delay={0.1}>
        <h2 className="why-choose-us-title">{title}</h2>
      </ScrollReveal>

      <div className="why-choose-us-banner">
        <div className="hero-overlay"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.id} delay={0.2 + index * 0.15}>
                <div className="stat-box">
                  <h6 className="stat-number">
                    <Counter target={stat.number} />
                  </h6>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <div className="about-us-content">
        <div className="container about-grid">
          <div className="about-text-column">
            <ScrollReveal direction="right" delay={0.1}>
              <h4 className="about-subtitle">{about.title1}</h4>
              <p className="about-description">{about.text1}</p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <h4 className="about-heading-caps">{about.title2}</h4>
              <p className="about-description">{about.text2}</p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.5}>
              <div className="about-actions">
                <button className="know-more-btn" onClick={onAboutUs}>Know More About Us</button>
              </div>
            </ScrollReveal>
          </div>

          <div className="about-image-column">
            <ScrollReveal direction="left" delay={0.4}>
              <div
                className="about-image-clickable"
                onClick={() => setLightboxOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
                aria-label="Click to view full photo"
              >
                <LazyImage
                  src={aboutImageSrc}
                  alt="About Us"
                  className="about-image"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          src={aboutImageSrc}
          alt="Founder Photo"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
};

export default WhyChooseUs;
