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
    <div
      className={`${className} bg-center bg-cover rounded-2xl overflow-hidden relative`}
      style={{ backgroundImage: `url(${src})` }}
      aria-label={alt}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-[#3B4CCA] to-blue-600 items-center justify-center z-40 ${loaded ? 'hidden' : 'flex'}`}>
        <span className="text-white font-bold font-saiyan text-center text-2xl px-4">
          {overlayText}
        </span>
      </div>
    </div>
  );
}

ImageCover.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  overlayText: PropTypes.string,
};
