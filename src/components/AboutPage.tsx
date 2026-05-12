import React, { useEffect, useRef, useState } from 'react';
import './AboutPage.css';
import aboutData from '../data/aboutData.json';
import { getAssetPath } from '../utils/assetPath';

interface AboutPageProps {
  onBookNow: () => void;
}

const AboutPage: React.FC<AboutPageProps> = () => {
  const { about, founderStory, stats, services } = aboutData;
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersStarted) {
          setCountersStarted(true);
        }
      },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [countersStarted]);

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll('.about-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">

      {/* ── SECTION 1: HERO / INTRO ── */}
      <section className="about-hero-section">
        <div className="about-hero-watermark">KAIROS</div>
        <div className="container about-hero-container">
          <div className="about-hero-content about-reveal">
            <span className="about-label">{about.label}</span>
            <h1 className="about-tagline">{about.tagline}</h1>
            <p className="about-desc">{about.description}</p>
            <p className="about-desc about-studio-detail">{about.studioDetail}</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FOUNDER'S STORY ── */}
      <section className="founder-story-section">
        <div className="container">
          <div className="founder-header about-reveal">
            <h2 className="founder-title">{founderStory.sectionTitle}</h2>
            <div className="title-underline"></div>
          </div>
        </div>

        <div className="founder-row">
          <div className="founder-dark-backdrop"></div>
          <div className="container founder-grid">
            <div className="founder-text-side about-reveal">
              <blockquote className="founder-quote">
                {founderStory.quote.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < founderStory.quote.split('\n').length - 1 && <><br /><br /></>}
                  </React.Fragment>
                ))}
              </blockquote>
            </div>
            <div className="founder-image-side about-reveal">
              <img
                src={getAssetPath(founderStory.founderImage)}
                alt="Founder"
                className="founder-portrait"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: STATS ── */}
      <section className="about-stats-strip" ref={statsRef}>
        <div className="container stats-flex">
          {stats.map((stat, idx) => (
            <React.Fragment key={stat.id}>
              <div className="stat-item about-reveal">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              {idx < stats.length - 1 && <div className="stat-line-divider" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: SESSIONS YOU CAN BOOK ── */}
      <section className="about-sessions-section">
        <div className="container">
          <div className="sessions-header about-reveal">
            <h2 className="sessions-title">SESSIONS YOU CAN BOOK</h2>
            <div className="title-underline"></div>
          </div>

          <div className="sessions-grid">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="session-card about-reveal"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="session-card-inner">
                  <h3 className="session-card-title">{svc.title}</h3>
                  <p className="session-card-subtitle">{svc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

