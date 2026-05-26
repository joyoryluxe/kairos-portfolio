import React from 'react';
import './Loader.css';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-container">
        {/* Animated Shutter / Lens Rings */}
        <div className="shutter-ring">
          <div className="shutter-ring-inner"></div>
          <div className="shutter-blade blade-1"></div>
          <div className="shutter-blade blade-2"></div>
          <div className="shutter-blade blade-3"></div>
          <div className="shutter-blade blade-4"></div>
          {/* Central glowing aperture */}
          <div className="aperture-glow"></div>
        </div>
        
        {/* Animated Premium Typography */}
        <div className="loader-text-wrapper">
          <span className="loader-text">{text}</span>
          <span className="loader-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
