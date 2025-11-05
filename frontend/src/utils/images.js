// Centralized Cloudinary base so the host can be changed in one place.
export const CLOUDINARY_BASE = 'https://res.cloudinary.com/dx8wt3el4/image/upload';

// Helper to get default/fallback image with proper sizing
export const getDefaultImage = (size = 300) => {
  // Use a default Capsule Corp image with proper sizing
  return `${CLOUDINARY_BASE}/c_fill,w_${size},h_${size},f_auto,q_auto/v1759096629/d3_xdolmn.jpg`;
};

// Helper to resize Cloudinary images
export const resizeCloudinaryImage = (url, size) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Check if it already has transformations (parameters after /upload/)
  if (url.match(/\/upload\/[^/]+\//)) {
    // Already has transformations, return as-is to avoid duplicates
    return url;
  }
  
  // Insert resize parameters into Cloudinary URL with auto format and quality
  return url.replace(/\/upload\//, `/upload/c_fill,w_${size},h_${size},f_auto,q_auto,g_center/`);
};

// Helper to resolve a usable image src from various shapes the backend may return.
// Mirrors logic used in ProductCarousel to keep image resolution consistent.
// Accept either a product-like object or a raw image value (string/array).
export function resolveImageSrc(input, size = 300) {
  let img = null;
  
  // If caller passed a string or array directly, use it as the image source value
  if (typeof input === 'string' || Array.isArray(input)) {
    img = input;
  } else if (input && typeof input === 'object') {
    // Try multiple properties: image, images, gallery
    img = input.image || input.images || input.gallery || null;
  }
  
  try {
    if (!img) return getDefaultImage(size);
    
    // If stored as JSON array string, parse it
    if (typeof img === 'string' && img.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(img);
        if (Array.isArray(parsed) && parsed.length) img = parsed[0];
      } catch (e) {
        console.warn('Failed to parse image array:', e);
      }
    }
    
    // If it's an array, pick first
    if (Array.isArray(img)) {
      img = img[0];
    }
    
    // If not a string after parsing, fallback
    if (!img || typeof img !== 'string') return getDefaultImage(size);
    
    img = img.trim();
    
    // If already absolute URL
    if (img.startsWith('http://') || img.startsWith('https://')) {
      // Check if it's a Cloudinary URL
      if (img.includes('cloudinary.com')) {
        return resizeCloudinaryImage(img, size);
      }
      // External non-Cloudinary URL, return as-is
      return img;
    }
    
    // If it's a relative filename (e.g. 'foo.jpg') assume Cloudinary hosted
    if (/^[\w-]+\.[a-z]{2,4}$/i.test(img) || img.indexOf('/') === -1) {
      return `${CLOUDINARY_BASE}/c_fill,w_${size},h_${size},f_auto,q_auto,g_center/${img}`;
    }
    
    // Otherwise, assume it's a relative URL served from the static assets
    return img.startsWith('/') ? img : `/${img}`;
  } catch (e) {
    console.error('Error resolving image:', e);
    return getDefaultImage(size);
  }
}

export default resolveImageSrc;
