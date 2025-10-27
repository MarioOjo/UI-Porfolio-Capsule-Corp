import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ImageCover({ src, alt, className = '', overlayText = '' }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoaded(false);
      return;
    }
    setLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(false);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className={`${className} bg-center bg-cover rounded-2xl overflow-hidden relative`} aria-label={alt}>
      {/* Real <img> tag ensures reliable rendering and gives the browser a direct element to layout. */}
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
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
};
