import React from 'react';
import './Hero.css';
import { getAssetPath } from '../utils/assetPath';
import ScrollReveal from './ScrollReveal';
import { useSection } from '../hooks/useSection';

// Fallback data (used while loading or if backend is unreachable)
import landingData from '../data/landingData.json';

interface HeroProps {
  onBookNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
  const { data, loading } = useSection('home', 'hero');

  // Use backend data when available, fallback to local JSON
  const hero = {
    title:           data?.title           || landingData.hero.title,
    subtitle:        data?.subtitle        || landingData.hero.subtitle,
    hashtag:         data?.hashtag         || landingData.hero.hashtag,
    backgroundImage: data?.banner          || landingData.hero.backgroundImage,
    mobileBackgroundImage: data?.mobileBanner || landingData.hero.mobileBackgroundImage,
  };

  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-image-wrapper">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={getAssetPath(hero.mobileBackgroundImage || hero.backgroundImage)}
            />
            <img
              src={getAssetPath(hero.backgroundImage)}
              alt="Hero Background"
              className="hero-background-image"
              fetchPriority="high"
            />
          </picture>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <ScrollReveal delay={0.2}>
              <h1 className="hero-title">
                {loading ? landingData.hero.title : hero.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="hero-bottom-text">
                <p className="hero-subtitle">{hero.subtitle}</p>
                <p className="hero-hashtag">{hero.hashtag}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.6}>
              <button className="hero-book-btn" onClick={onBookNow}>
                <span>Book Your Session</span>
                <div className="arrow-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
