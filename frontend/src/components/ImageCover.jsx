import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getDefaultImage } from '../utils/images';

export default function ImageCover({ src, alt, className = '', overlayText = '', fallbackSrc }) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || '');
  const safeFallback = fallbackSrc || getDefaultImage(300);

  useEffect(() => {
    const nextSrc = src || safeFallback;
    if (!nextSrc) {
      setLoaded(false);
      setCurrentSrc('');
      return;
    }

    setCurrentSrc(nextSrc);
    setLoaded(false);
    const img = new Image();
    img.src = nextSrc;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(false);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, safeFallback]);

  const handleError = () => {
    if (currentSrc !== safeFallback) {
      setCurrentSrc(safeFallback);
      setLoaded(false);
      return;
    }
    setLoaded(false);
  };

  return (
    <div className={`${className} bg-center bg-cover rounded-2xl overflow-hidden relative`} aria-label={alt}>
      {/* Real <img> tag ensures reliable rendering and gives the browser a direct element to layout. */}
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          className="w-full h-full object-contain"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          style={{ display: loaded ? 'block' : 'none' }}
        />
      ) : null}

      {/* Fallback / loading overlay while image loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B4CCA] to-blue-600 items-center justify-center z-40 flex">
          <span className="text-white font-bold font-saiyan text-center text-2xl px-4">
            {overlayText}
          </span>
        </div>
      )}
    </div>
  );
}

ImageCover.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  overlayText: PropTypes.string,
  fallbackSrc: PropTypes.string,
};
