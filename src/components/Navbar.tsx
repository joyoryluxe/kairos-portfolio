import React, { useState } from 'react';
import './Navbar.css';
import landingData from '../data/landingData.json';

interface NavbarProps {
  onBookNow: () => void;
  onHome?: () => void;
  onAbout?: () => void;
  onPricing?: () => void;
  onPricingDetailClick?: (id: string) => void;
  onServiceClick?: (serviceId: string) => void;
}

  const Navbar: React.FC<NavbarProps> = ({ onBookNow, onHome, onAbout, onPricing, onPricingDetailClick, onServiceClick }) => {
  const { navLinks } = landingData;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const formatServiceId = (label: string) => {
    return label.toLowerCase().replace(/\s+/g, '-');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (label === 'About Us' && onAbout) {
      onAbout();
    } else if (label === 'Home' && onHome) {
      onHome();
    } else if (label === 'Pricing' && onPricing) {
      onPricing();
    } else if (label === 'Contact' && onBookNow) {
      onBookNow();
    } else if (label === 'Gallery') {
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = 'https://crm.kairosstudio.in/gallary/client/login/';
      }, 3500);
    }
  };

  const handleDropdownItemClick = (e: React.MouseEvent, item: string, parentLabel: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const id = formatServiceId(item);
    if (parentLabel === 'Pricing' && onPricingDetailClick) {
      onPricingDetailClick(id);
    } else if (onServiceClick) {
      onServiceClick(id);
    }
  };

  const half = Math.ceil(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, half);
  const rightLinks = navLinks.slice(half);

  return (
    <>
      {isRedirecting && (
        <div className="redirect-overlay">
          <div className="redirect-content">
            <div className="redirect-loader">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
            <p className="redirect-text">Redirecting to your gallery photos</p>
          </div>
        </div>
      )}
      <nav className="navbar">
        <div className="container navbar-container">
          
          {/* Desktop Left Links */}
          <div className="nav-links nav-links-desktop left-links">
            {leftLinks.map((link: any) => (
              <div key={link.label} className="nav-item-container">
                <a
                  href={link.href}
                  className="nav-item"
                  onClick={(e) => handleNavClick(e, link.label)}
                >
                  {link.label}
                </a>
                {link.dropdownItems && (
                  <div className="dropdown-menu">
                    {link.dropdownItems.map((item: string) => (
                      <a 
                        key={item} 
                        href="#" 
                        className="dropdown-item"
                        onClick={(e) => handleDropdownItemClick(e, item, link.label)}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Logo (Center on Desktop, Left on Mobile) */}
          <div className="nav-logo" onClick={onHome} style={{ cursor: 'pointer' }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Kairos Studio" className="logo-img" />
          </div>

          {/* Desktop Right Links */}
          <div className="nav-links nav-links-desktop right-links">
            {rightLinks.map((link: any) => (
              <div key={link.label} className="nav-item-container">
                <a
                  href={link.href}
                  className="nav-item"
                  onClick={(e) => handleNavClick(e, link.label)}
                >
                  {link.label}
                </a>
                {link.dropdownItems && (
                  <div className="dropdown-menu">
                    {link.dropdownItems.map((item: string) => (
                      <a 
                        key={item} 
                        href="#" 
                        className="dropdown-item"
                        onClick={(e) => handleDropdownItemClick(e, item, link.label)}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* <button className="book-now-btn" onClick={onBookNow}>
              <span>Book Now</span>
              <div className="arrow-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button> */}
          </div>

          {/* Hamburger icon for mobile */}
          <div 
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            {navLinks.map((link: any) => (
              <React.Fragment key={link.label}>
                <a 
                  href={link.href} 
                  className="nav-item mobile-item"
                  onClick={(e) => handleNavClick(e, link.label)}
                >
                  {link.label}
                </a>
                {link.dropdownItems && (
                  <div className="mobile-dropdown">
                    {link.dropdownItems.map((item: string) => (
                      <a 
                        key={item} 
                        href="#" 
                        className="mobile-dropdown-item" 
                        onClick={(e) => handleDropdownItemClick(e, item, link.label)}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            <button 
              className="book-now-btn mobile-book-btn" 
              onClick={() => {
                onBookNow();
                setIsMobileMenuOpen(false);
              }}
            >
              <span>Book Now</span>
              <div className="arrow-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
          
        </div>
      </nav>
    </>
  );
};

export default Navbar;
